import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Share, Platform, BackHandler } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ShareableCard } from './ShareableCard';
import { colors } from '../../theme/colors';
import type { MPProfile } from '../../data/types';

interface ShareImageModalProps { visible: boolean; onClose: () => void; mp: MPProfile | null; }

export function ShareImageModal({ visible, onClose, mp }: ShareImageModalProps) {
  const shotRef = useRef<ViewShot>(null);
  const [capturing, setCapturing] = useState(false);
  const [show, setShow] = useState(false);

  const sc = useSharedValue(0.95);
  const op = useSharedValue(0);
  const bgOp = useSharedValue(0);

  useEffect(() => {
    if (visible && mp) {
      setShow(true);
      sc.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) });
      op.value = withTiming(1, { duration: 180 });
      bgOp.value = withTiming(1, { duration: 150 });
    } else {
      sc.value = withTiming(0.95, { duration: 150, easing: Easing.in(Easing.cubic) });
      op.value = withTiming(0, { duration: 120 });
      bgOp.value = withTiming(0, { duration: 100 }, () => runOnJS(setShow)(false));
    }
  }, [visible, mp]);

  const contentAnim = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }], opacity: op.value }));
  const bgAnim = useAnimatedStyle(() => ({ opacity: bgOp.value }));

  useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => { onClose(); return true; });
      return () => sub.remove();
    }
  }, [visible, onClose]);

  if (!show || !mp) return null;

  const shareImg = async () => {
    if (!shotRef.current?.capture) return;
    setCapturing(true);
    try {
      const uri = await shotRef.current.capture();
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: `Share ${mp.basic.fullName}'s Profile` });
      } else {
        await Share.share({ url: uri, message: `Check out ${mp.basic.fullName}'s profile on KYN - Know Your Neta` });
      }
    } catch (e) {
      console.error('share error:', e);
    } finally {
      setCapturing(false);
    }
  };

  const saveImg = async () => {
    if (!shotRef.current?.capture) return;
    setCapturing(true);
    try {
      const uri = await shotRef.current.capture();
      const fname = `KYN_${mp.basic.fullName.replace(/\s+/g, '_')}_${Date.now()}.png`;
      const dest = `${FileSystem.documentDirectory}${fname}`;
      await FileSystem.copyAsync({ from: uri, to: dest });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) await Sharing.shareAsync(dest, { mimeType: 'image/png', dialogTitle: 'Save Image' });
    } catch (e) {
      console.error('save error:', e);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <View style={st.overlay}>
      <Animated.View style={[st.backdrop, bgAnim]}>
        <Pressable style={st.backdropPressable} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[st.content, contentAnim]}>
        <View style={st.header}>
          <Text style={st.title}>Share as Image</Text>
          <Pressable onPress={onClose} style={st.closeBtn}><Ionicons name="close" size={24} color={colors.text.secondary} /></Pressable>
        </View>

        <View style={st.previewContainer}>
          <ViewShot ref={shotRef} options={{ format: 'png', quality: 1, result: 'tmpfile' }}>
            <ShareableCard mp={mp} />
          </ViewShot>
        </View>

        <View style={st.actions}>
          <Pressable onPress={shareImg} disabled={capturing} style={[st.actionBtn, st.primaryBtn]}>
            {capturing ? <ActivityIndicator color="white" size="small" /> : (
              <>
                <Ionicons name="share-outline" size={20} color="white" />
                <Text style={st.primaryBtnText}>Share Image</Text>
              </>
            )}
          </Pressable>
          <Pressable onPress={saveImg} disabled={capturing} style={[st.actionBtn, st.secondaryBtn]}>
            <Ionicons name="download-outline" size={20} color={colors.text.secondary} />
            <Text style={st.secondaryBtnText}>Save</Text>
          </Pressable>
        </View>

        <Text style={st.tip}>Share this card on social media to spread awareness</Text>
      </Animated.View>
    </View>
  );
}

const st = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  backdropPressable: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    width: '100%',
    maxWidth: 400,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  primaryBtn: {
    flex: 2,
    backgroundColor: colors.primary[500],
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryBtnText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  tip: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 16,
    textAlign: 'center',
  },
});
