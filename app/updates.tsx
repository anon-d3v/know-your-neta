import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { changelog } from '../src/data/changelog';

const darkBg = '#171717';
const surfaceBg = '#1f1f1f';
const brandColor = '#818CF8';
const textPrimary = '#FFFFFF';
const textSecondary = 'rgba(255, 255, 255, 0.7)';
const textTertiary = 'rgba(255, 255, 255, 0.5)';
const borderColor = 'rgba(255, 255, 255, 0.1)';

export default function UpdatesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>What's New</Text>
        <Text style={styles.headerSubtitle}>
          Latest updates and improvements to Know Your Neta
        </Text>
      </View>

      {changelog.map((entry, index) => (
        <View key={entry.version} style={styles.versionCard}>
          <View style={styles.versionHeader}>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v{entry.version}</Text>
            </View>
            <Text style={styles.dateText}>{entry.date}</Text>
          </View>

          <Text style={styles.versionTitle}>{entry.title}</Text>
          <Text style={styles.versionDescription}>{entry.description}</Text>

          <View style={styles.changesContainer}>
            {entry.changes.map((change, changeIndex) => (
              <View key={changeIndex} style={styles.changeItem}>
                <Text style={styles.changeText}>{change}</Text>
              </View>
            ))}
          </View>

          {index === 0 && (
            <View style={styles.latestBadge}>
              <Ionicons name="sparkles" size={14} color={brandColor} />
              <Text style={styles.latestText}>Latest Release</Text>
            </View>
          )}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Stay tuned for more updates! 🚀
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBg,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: textSecondary,
    lineHeight: 20,
  },
  versionCard: {
    backgroundColor: surfaceBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: borderColor,
  },
  versionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  versionBadge: {
    backgroundColor: brandColor,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  versionText: {
    color: textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 13,
    color: textTertiary,
    fontWeight: '500',
  },
  versionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: textPrimary,
    marginBottom: 8,
  },
  versionDescription: {
    fontSize: 15,
    color: textSecondary,
    lineHeight: 21,
    marginBottom: 16,
  },
  changesContainer: {
    gap: 12,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  changeText: {
    fontSize: 15,
    color: textSecondary,
    lineHeight: 21,
    flex: 1,
  },
  latestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: borderColor,
  },
  latestText: {
    fontSize: 13,
    color: brandColor,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: textTertiary,
    fontWeight: '500',
  },
});
