import { io } from 'socket.io-client';

let socket;
const serverPort = 3001

export const initializeSocket = () => {
  if (!socket) {
    console.log('initalizing socket...')
    socket = io(process.env.port || `http://localhost:${serverPort}`) 
    socket.on('connect', () => {
        console.log(`Socket connected with ID: ${socket.id}`);
      });
  
      // Listen for the 'disconnect' event
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
  }
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};