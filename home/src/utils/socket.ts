import { io, Socket } from 'socket.io-client';

// MAKE SURE SOCKET IS A SINGLETON
let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.SOCKET_URL || 'http://localhost:5000');
  }
  return socket;
};
