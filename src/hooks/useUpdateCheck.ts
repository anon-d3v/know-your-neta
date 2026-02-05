import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GITHUB_REPO = 'anon-d3v/know-your-neta';
const CURRENT_VERSION = '1.0.2';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = 'kyn_update_check';

interface UpdateInfo {
  hasUpdate: boolean;
  latestVersion: string;
  releaseUrl: string;
  releaseNotes: string;
}

interface StoredCheck {
  lastCheck: number;
  dismissed: string | null;
}

export function useUpdateCheck() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  const checkForUpdate = useCallback(async (force = false) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const data: StoredCheck = stored ? JSON.parse(stored) : { lastCheck: 0, dismissed: null };

      const now = Date.now();
      const shouldCheck = force || (now - data.lastCheck > CHECK_INTERVAL);

      if (!shouldCheck) {
        setLoading(false);
        return;
      }

      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
      if (!res.ok) {
        setLoading(false);
        return;
      }

      const release = await res.json();
      const latestVersion = release.tag_name?.replace(/^v/, '') || '';

      const info: UpdateInfo = {
        hasUpdate: compareVersions(latestVersion, CURRENT_VERSION) > 0,
        latestVersion,
        releaseUrl: release.html_url || '',
        releaseNotes: release.body || '',
      };

      setUpdateInfo(info);

      if (info.hasUpdate && data.dismissed !== latestVersion) {
        setShowBanner(true);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastCheck: now,
        dismissed: data.dismissed,
      }));
    } catch (e) {
      console.log('Update check failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissUpdate = useCallback(async () => {
    setShowBanner(false);
    if (updateInfo?.latestVersion) {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const data: StoredCheck = stored ? JSON.parse(stored) : { lastCheck: Date.now(), dismissed: null };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...data,
        dismissed: updateInfo.latestVersion,
      }));
    }
  }, [updateInfo]);

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  return {
    updateInfo,
    loading,
    showBanner,
    dismissUpdate,
    checkForUpdate: () => checkForUpdate(true),
  };
}

function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

export default useUpdateCheck;
