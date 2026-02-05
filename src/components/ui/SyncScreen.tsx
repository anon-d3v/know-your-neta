import React from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import type { SyncStatus } from '../../hooks/useInitialSync';

interface SyncScreenProps {
  status: SyncStatus;
  progress: number;
  error?: Error | null;
  onRetry?: () => void;
}

export function SyncScreen({ status, progress, error, onRetry }: SyncScreenProps) {
  const getMessage = () => {
    switch (status) {
      case 'idle': return 'Initializing...';
      case 'syncing': return 'Syncing data for offline use...';
      case 'offline': return 'Using cached data (offline mode)';
      case 'error': return error?.message || 'Failed to load data';
      case 'synced': return 'Ready!';
      default: return 'Loading...';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'offline':
        return <Ionicons name="cloud-offline-outline" size={48} color={colors.accent.amber} />;
      case 'error':
        return <Ionicons name="alert-circle-outline" size={48} color={colors.semantic.danger} />;
      case 'synced':
        return <Ionicons name="checkmark-circle-outline" size={48} color={colors.semantic.success} />;
      default:
        return <ActivityIndicator size="large" color={colors.primary[500]} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>KYN</Text>
          <Text style={styles.logoSubtext}>Know Your Neta</Text>
        </View>

        <View style={styles.iconContainer}>{getIcon()}</View>

        <Text style={[styles.message, status === 'error' && styles.errorMessage]}>
          {getMessage()}
        </Text>

        {(status === 'syncing' || status === 'idle') && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${Math.max(progress, 5)}%` }]} />
          </View>
        )}

        {status === 'error' && onRetry && (
          <Pressable style={styles.retryButton} onPress={onRetry}>
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        )}

        {status === 'offline' && (
          <View style={styles.offlineNotice}>
            <Ionicons name="information-circle-outline" size={16} color={colors.text.muted} />
            <Text style={styles.offlineText}>Connect to the internet to get the latest data</Text>
          </View>
        )}
      </View>

      <Text style={styles.version}>2024 Lok Sabha MPs Data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: { alignItems: 'center', width: '100%', maxWidth: 300 },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.primary[500],
    letterSpacing: 4,
  },
  logoSubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  iconContainer: { marginBottom: 24, height: 56, justifyContent: 'center' },
  message: { fontSize: 16, color: colors.text.secondary, textAlign: 'center', marginBottom: 24 },
  errorMessage: { color: colors.semantic.danger },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: colors.dark.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: colors.primary[500], borderRadius: 2 },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  retryText: { color: 'white', fontSize: 16, fontWeight: '600' },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 8,
  },
  offlineText: { fontSize: 12, color: colors.text.muted, flex: 1 },
  version: { position: 'absolute', bottom: 24, fontSize: 12, color: colors.text.muted },
});

export default SyncScreen;
