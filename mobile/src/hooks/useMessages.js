import { useState, useEffect, useCallback } from 'react';
import { fetchMessages } from '../services/api';

export const useMessages = (socket) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await fetchMessages();
        setMessages(data);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onReceive = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('receive_message', onReceive);
    return () => socket.off('receive_message', onReceive);
  }, [socket]);

  const sendMessage = useCallback(
    (content) => {
      if (!socket || !content.trim()) return;
      socket.emit('send_message', { content: content.trim() });
    },
    [socket]
  );

  return { messages, loading, sendMessage };
};
