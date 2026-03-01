import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'civic_pledge_ack';
const COUNTDOWN = 10;

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function hasAckedToday(roomId: string): Promise<boolean> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  const map: Record<string, string> = JSON.parse(raw);
  return map[roomId] === getTodayKey();
}

async function markAcked(roomId: string): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const map: Record<string, string> = raw ? JSON.parse(raw) : {};
  // Clean up stale entries from previous days
  const today = getTodayKey();
  for (const key of Object.keys(map)) {
    if (map[key] !== today) delete map[key];
  }
  map[roomId] = today;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

interface Props {
  roomId: string;
  onAccepted: () => void;
}

export function CivicPledgeModal({ roomId, onAccepted }: Props) {
  const [visible, setVisible] = useState(false);
  const [seconds, setSeconds] = useState(COUNTDOWN);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    hasAckedToday(roomId).then((acked) => {
      if (!cancelled && !acked) setVisible(true);
      if (!cancelled && acked) onAccepted();
    });
    return () => { cancelled = true; };
  }, [roomId]);

  useEffect(() => {
    if (!visible || seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [visible, seconds]);

  const handleAccept = useCallback(async () => {
    await markAcked(roomId);
    setVisible(false);
    onAccepted();
  }, [roomId, onAccepted]);

  if (!visible) return null;

  const canAccept = seconds <= 0;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <View style={{ backgroundColor: '#1f1f1f', borderRadius: 20, padding: 24, maxWidth: 360, width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          {/* Icon */}
          <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 16 }}>🤝</Text>

          {/* Title */}
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700', textAlign: 'center', marginBottom: 12, fontFamily: 'monospace' }}>
            A Small Request
          </Text>

          {/* Message */}
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, lineHeight: 21, textAlign: 'center', marginBottom: 20 }}>
            This app exists to bring transparency to Indian democracy and these chatrooms are a space for citizens to discuss freely.{'\n\n'}
            We sincerely request you to keep conversations <Text style={{ color: '#818CF8', fontWeight: '600' }}>respectful and civic</Text>. Any form of racism, casteism, religious hate, personal abuse, or targeted harassment can get this platform taken down entirely.{'\n\n'}
            Please help us protect this space. Disagree passionately, but never attack a person's identity.
          </Text>

          {/* Accept button */}
          <Pressable
            onPress={handleAccept}
            disabled={!canAccept}
            style={{
              backgroundColor: canAccept ? '#818CF8' : 'rgba(129,140,248,0.15)',
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: canAccept ? '#fff' : 'rgba(255,255,255,0.3)',
              fontWeight: '600',
              fontSize: 14,
              fontFamily: 'monospace',
            }}>
              {canAccept ? 'I Understand & Agree' : `Please read (${seconds}s)`}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
