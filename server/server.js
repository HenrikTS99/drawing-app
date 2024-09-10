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

io.on('connection', (socket) => {
  console.log('connection');

  // Get canvas state from a client, for a new client
  socket.on('client-ready', () => {
    socket.broadcast.emit('get-canvas-state');
  });

  socket.on('canvas-state', (state) => {
    socket.broadcast.emit('canvas-state-from-server', state);
  });

  socket.on('draw-line', ({ prevPoint, currentPoint, color }) => {
    socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color });
  });

  socket.on('clear', () => io.emit('clear'));
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
