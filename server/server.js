// Import and configure env variables
import dotenv from 'dotenv';
dotenv.config();

import { getConfig } from './config.js';
const { port, mongoDBURL } = getConfig();

import express, { request, response } from "express";
import mongoose, { mongo } from 'mongoose';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

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
  res.json({"users": ["userOne", "userTwo", "userThree"] })
});

app.get('/', (req, res) => {
  return res.status(234).send('Welcome!')
});

// Middleware for book requests
app.use('/books', booksRoute);

// Start the server
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });