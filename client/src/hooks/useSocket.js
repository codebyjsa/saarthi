import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (roomId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [queueUpdate, setQueueUpdate] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      if (roomId) {
        socketRef.current.emit('join-room', roomId);
      }
    });

    socketRef.current.on('queue-update', (data) => {
      setQueueUpdate(data);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const emitEvent = (event, data) => {
    socketRef.current?.emit(event, data);
  };

  return { socket: socketRef.current, emitEvent, queueUpdate, isConnected };
};
