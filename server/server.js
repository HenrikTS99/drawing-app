// Import and configure env variables
import dotenv from 'dotenv';
dotenv.config();

import { getConfig } from './config.js';
const { port, mongoDBURL } = getConfig();

import express, { request, response } from 'express';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', //TODO: Change for prod
  },
});

let canvasState = null;
let users = [];
const messages = {
  general: [],
  room1: [],
  room2: [],
  room3: [],
  room4: []
};

io.on('connection', (socket) => {
  console.log('connection');
  
  socket.on('join-server', (username) => {
    console.log("join server recieved")
    const user = {
      username, 
      id: socket.id,
    };
    users.push(user);
    io.emit('new-user', users);
  });

  socket.on('join-room', (roomName, cb) => { //TODO: not safe to use callback from client
    socket.join(roomName);
    cb(messages[roomName]);
  });

  socket.on('send-message', ({content, to, sender, chatName, isChannel }) => {
    if (isChannel) {
      const payload = {
        content, 
        chatName,
        sender,
      };
      socket.to(to).emit('new-message', payload)
    } else {
      const payload = {
        content, 
        chatName: sender,
        sender
      };
      socket.to(to).emit('new-message', payload)
    }
    if (messages[chatName]) {
      messages[chatName].push({
        sender,
        content
      });
    }
  })

  socket.on('disconnect', () => {
    users = users.filter(u => u.id !== socket.id);
    io.emit('new-user', users)
  })
  
  // Get canvas state from a client, for a new client
  socket.on('client-ready', () => {
    if (canvasState) {
      console.log('canvasState exists, udating from server storage')
      socket.emit('canvas-state-from-server', canvasState);
    } else {
      console.log('no canvasState in server storage, fetching from clients')
      socket.broadcast.emit('get-canvas-state');
    }
    
  });

  socket.on('canvas-state', (state) => {
    canvasState = state;
    socket.broadcast.emit('canvas-state-from-server', state);
  });

  socket.on('draw-line', ({ prevPoint, currentPoint, color }) => {
    socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color });
  });

  socket.on('clear', () => {
    canvasState = null;
    io.emit('clear');
  });
});

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type']
//   })
// );

// Routes
app.get('/api', (req, res) => {
  res.json({ users: ['userOne', 'userTwo', 'userThree'] });
});

app.get('/', (req, res) => {
  return res.status(234).send('Welcome!');
});

// Start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
