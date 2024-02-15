import { io } from 'socket.io-client';

let socket;
const serverPort = 3001
let URL
if(process.env.NODE_ENV === 'production'){
  URL = 'https://poker-server-2d3e5c5dcd63.herokuapp.com'
}else{
  URL = `http://localhost:${serverPort}`
}

export const initializeSocket = () => {
  if (!socket) {
    console.log('initalizing socket...')

    socket = io(URL) 
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