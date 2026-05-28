import { io } from 'socket.io-client';
import { BASE_URL } from './api';

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(BASE_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
