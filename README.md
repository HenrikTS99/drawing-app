# drawing-app

Real-time collaborative drawing board with multiple rooms. Users can join different rooms, draw on a shared canvas, and chat.
Every stroke, message and canvas clear will be displayed live for everyone else in that room, using Websockets.

## Features

- **Shared canvas:** strokes broadcast in real time
- **Canvas state handoff:** a client joining a room requests the current canvas, so they get to see the full drawing rather than a blank board
- **Five channels:** Each channel with isolated canvas state and message history
- **User visibility** connected users are broadcast to the whole server, and displayed under "all users"
- **Color picker, clear, copy and download:** pick a stroke colour, reset the board, and download or copy the drawing as an image

## Status

The project is unfinished. What is mentioned above works, but the UI is very incomplete.
A database is also not connected, nothing is persisted over server restarts.

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, socket.io
- **Tools:** ESLint, Prettier, GitHub Actions, Docker

## How to Run

Requires Docker and Docker Compose.

```bash
docker compose up -d
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3001>

Open the frontend, enter a username, and pick a channel. To see collaboration, open a second browser window and join the same channel with a different username.

## Project structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # RoomPanel, DrawBoard, ChatPanel, Sidebar
│   │   ├── hooks/
│   │   │   └── useDraw.js  # Pointer capture, canvas coords, mouseup reset
│   │   ├── pages/
│   │   │   └── RoomDashboard.jsx  # Socket lifecycle, room + message state
│   │   └── utils/
│   └── Dockerfile
├── server/                 # Express + socket.io backend
│   ├── server.js           # Socket event handlers, room state
│   ├── config.js           # Env config via dotenv
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/      # Lint, format, and image build
```
