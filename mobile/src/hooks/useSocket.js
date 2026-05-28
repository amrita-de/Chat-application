import { useState, useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../services/socket';

export const useSocket = (token) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    const s = connectSocket(token);
    setSocket(s);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onError = () => setIsConnected(false);
    const onReconnecting = () => setIsConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('connect_error', onError);
    s.io.on('reconnect_attempt', onReconnecting);

    if (s.connected) setIsConnected(true);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('connect_error', onError);
      s.io.off('reconnect_attempt', onReconnecting);
      disconnectSocket();
    };
  }, [token]);

  return { socket, isConnected };
};
