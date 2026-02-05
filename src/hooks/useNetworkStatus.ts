import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkStatus {
  isOnline: boolean;
  isConnected: boolean | null;
  connectionType: string | null;
  isInternetReachable: boolean | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    isConnected: null,
    connectionType: null,
    isInternetReachable: null,
  });

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setStatus({
        isOnline: !!state.isConnected && state.isInternetReachable !== false,
        isConnected: state.isConnected,
        connectionType: state.type,
        isInternetReachable: state.isInternetReachable,
      });
    });

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus({
        isOnline: !!state.isConnected && state.isInternetReachable !== false,
        isConnected: state.isConnected,
        connectionType: state.type,
        isInternetReachable: state.isInternetReachable,
      });
    });

    return () => unsubscribe();
  }, []);

  return status;
}

export default useNetworkStatus;
