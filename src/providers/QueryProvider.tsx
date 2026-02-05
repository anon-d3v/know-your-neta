import React, { useEffect } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { queryClient, persister } from '../lib/queryClient';

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => setOnline(!!state.isConnected));
});

interface Props {
  children: React.ReactNode;
}

export function QueryProvider({ children }: Props) {
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      console.log('Network:', state.isConnected ? 'online' : 'offline');
    });
    return () => unsub();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24, buster: 'v1' }}
      onSuccess={() => {
        console.log('Query cache restored');
        queryClient.resumePausedMutations();
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

export default QueryProvider;
