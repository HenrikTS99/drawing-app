// Import and configure env variables
import dotenv from "dotenv";
dotenv.config();

import { getConfig } from "./config.js";
const { port, mongoDBURL } = getConfig();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", //TODO: Change for prod
  },
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

const canvasStates = {
  general: null,
  room1: null,
  room2: null,
  room3: null,
  room4: null,
};

let users = [];
const messages = {
  general: [],
  room1: [],
  room2: [],
  room3: [],
  room4: [],
};

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("join-server", (username) => {
    const user = {
      username,
      id: socket.id,
    };
    users.push(user);
    io.emit("new-user", users);
  });

  // Remove user from users when disconnecting
  socket.on("disconnect", () => {
    users = users.filter((u) => u.id !== socket.id);
    io.emit("new-user", users);
  });

  socket.on("join-room", (roomName, previousRoom) => {
    if (previousRoom) {
      socket.leave(previousRoom);
    }
    socket.join(roomName);
    socket.emit("joined-room", {
      messages: messages[roomName],
      room: roomName,
      previousRoom: previousRoom,
    });
  });

  socket.on("send-message", ({ content, sender, roomName }) => {
    const payload = {
      content,
      sender,
      roomName,
    };
    socket.to(roomName).emit("new-message", payload);

    if (messages[roomName]) {
      messages[roomName].push({
        sender,
        content,
      });
    }
  });

  // Get canvas state from a client, for a new client
  socket.on("client-ready", async (room) => {
    const users_in_room = (await io.in(room).fetchSockets()).length;
    if (users_in_room > 1) {
      console.log("fetching canvasState from clients");
      socket.to(room).emit("get-canvas-state");
    }
    if (canvasStates[room]) {
      console.log("canvasState exists, updating from server storage:", room);
      socket.emit("canvas-state-from-server", canvasStates[room]);
    } else {
      console.log("no canvas");
    }
  });

  socket.on("save-canvas", ({ room, state }) => {
    canvasStates[room] = state;
    console.log("saved canvas to room", room);
  });
  socket.on("canvas-state", ({ room, state }) => {
    canvasStates[room] = state;
    console.log("saved canvas to room", room);
    socket.to(room).emit("canvas-state-from-server", state);
  });

  socket.on("draw-line", ({ room, prevPoint, currentPoint, color }) => {
    socket.to(room).emit("draw-line", { prevPoint, currentPoint, color });
  });

  socket.on("clear", (room) => {
    canvasStates[room] = null;
    console.log("Emitting clear for room:", { receivedRoom: room });
    io.to(room).emit("clear", room);
  });
});

// Routes
app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.get("/", (req, res) => {
  return res.status(234).send("Welcome!");
});

// Start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
