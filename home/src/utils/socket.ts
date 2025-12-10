import { io, Socket } from 'socket.io-client';

// MAKE SURE SOCKET IS A SINGLETON
let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    // Authenticate with token when socket connects
    const token = localStorage.getItem('token');
    if (token) {
      socket.emit('access', token);
    }
  }
  return socket;
};
