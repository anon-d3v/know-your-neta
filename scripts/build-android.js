const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ANDROID_DIR = path.join(ROOT, 'android');
const KEYSTORE_PROPS = path.join(ROOT, 'keystore.properties');
const BUILD_GRADLE = path.join(ANDROID_DIR, 'app', 'build.gradle');

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
}

function checkKeystore() {
  if (!fs.existsSync(KEYSTORE_PROPS)) {
    console.error('\n❌ keystore.properties not found!');
    console.error('Create it from keystore.properties.example with your credentials.\n');
    process.exit(1);
  }
  console.log('✓ keystore.properties found');
}

function prebuild() {
  console.log('\n📦 Running expo prebuild...');
  run('npx expo prebuild --platform android --clean');
}

function injectSigningConfig() {
  console.log('\n🔐 Injecting signing config...');

  let gradle = fs.readFileSync(BUILD_GRADLE, 'utf8');

  if (gradle.includes('signingConfigs.release')) {
    console.log('✓ Signing config already present');
    return;
  }

  const keystorePropsLoader = `
def keystorePropertiesFile = rootProject.file("../keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
`;

  const signingConfig = `
    signingConfigs {
        release {
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
`;

  gradle = keystorePropsLoader + gradle;

  gradle = gradle.replace(
    /buildTypes\s*\{/,
    `signingConfigs {
        release {
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
    buildTypes {`
  );

  gradle = gradle.replace(
    /release\s*\{([^}]*)\}/,
    (match, inner) => {
      if (inner.includes('signingConfig')) return match;
      return `release {${inner}
            signingConfig signingConfigs.release
        }`;
    }
  );

  fs.writeFileSync(BUILD_GRADLE, gradle);
  console.log('✓ Signing config injected');
}

function buildApk() {
  console.log('\n🔨 Building release APK...');
  run('./gradlew assembleRelease', { cwd: ANDROID_DIR, shell: true });
}

function copyOutput() {
  const apkPath = path.join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
  const outputDir = path.join(ROOT, 'build');
  const outputPath = path.join(outputDir, 'kyn-release.apk');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  if (fs.existsSync(apkPath)) {
    fs.copyFileSync(apkPath, outputPath);
    console.log(`\n✅ APK copied to: build/kyn-release.apk`);
  } else {
    console.log('\n⚠️  APK not found at expected path');
  }
}

async function main() {
  console.log('=================================');
  console.log('  KYN Android Release Build');
  console.log('=================================');

  checkKeystore();
  prebuild();
  injectSigningConfig();
  buildApk();
  copyOutput();

  console.log('\n=================================');
  console.log('  Build Complete!');
  console.log('=================================\n');
}

main().catch(err => {
  console.error('\n❌ Build failed:', err.message);
  process.exit(1);
});
