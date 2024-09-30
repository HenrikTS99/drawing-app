import React, { useRef, useEffect, useState } from "react"
import Form from "../components/UsernameForm"
import RoomPanel from "../components/RoomPanel"
import Sidebar from "../components/Sidebar"

import { io } from "socket.io-client"
import { produce } from "immer"

let unusedVar = null
const initialMessagesState = {
  general: [],
  room1: [],
  room2: [],
  room3: [],
  room4: [],
}

function RoomDashboard() {
  const [username, setUsername] = useState("")
  const [connected, setConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState("general")
  const [previousRoom, setpreviousRoom] = useState("")
  const [allUsers, setAllUsers] = useState([])
  const [messages, setMessages] = useState(initialMessagesState)
  const [message, setMessage] = useState("")
  const socketRef = useRef()

  function handleMessageChange(e) {
    setMessage(e.target.value)
  }

  // Clear message box when message is sent
  useEffect(() => {
    setMessage("")
  }, [messages])

  function sendMessage() {
    const payload = {
      content: message,
      sender: username,
      roomName: currentRoom,
    }
    socketRef.current.emit("send-message", payload)
    setMessages((prevMessages) =>
      produce(prevMessages, (draft) => {
        draft[currentRoom].push({
          sender: username,
          content: message,
        })
      }),
    )
  }

  function updateRoomMessages(incomingMessages, room) {
    // Make sure messages is up to date before setting.
    // If not done trough function other room messages gets deleted.
    setMessages((prevMessages) => {
      const newMessages = produce(prevMessages, (draft) => {
        draft[room] = incomingMessages
      })
      return newMessages
    })
  }

  function joinRoom(room) {
    if (room === currentRoom) {
      console.log("Already in room:", room)
      return
    }
    toggleRoom(room)
    console.log("joining room:", room, "previous room:", currentRoom)
    socketRef.current.emit("join-room", room, currentRoom)
  }

  function toggleRoom(currentRoom) {
    if (!messages[currentRoom]) {
      console.error("Room dosen't exist:", currentRoom)
    }
    setCurrentRoom(currentRoom)
  }

  function handleChange(e) {
    setUsername(e.target.value)
  }

  function connect() {
    setConnected(true)
    socketRef.current = io.connect("http://localhost:3001")
    socketRef.current.emit("join-server", username)
    socketRef.current.emit("join-room", "general")
    socketRef.current.on("new-user", (allUsers) => {
      setAllUsers(allUsers)
    })

    socketRef.current.on("joined-room", ({ messages, room, previousRoom }) => {
      updateRoomMessages(messages, room)
      if (previousRoom) setpreviousRoom(previousRoom)
    })

    socketRef.current.on("new-message", ({ content, sender, roomName }) => {
      setMessages((messages) =>
        produce(messages, (draft) => {
          if (draft[roomName]) {
            draft[roomName].push({ content, sender })
          } else {
            console.error("Room dosen't exist:", roomName)
          }
        }),
      )
    })
  }

  let body
  if (connected) {
    body = (
      <div className="h-screen w-full flex">
        {/* sidebar */}
        <Sidebar
          allUsers={allUsers}
          joinRoom={joinRoom}
          yourId={socketRef.current ? socketRef.current.id : ""}
        />
        <RoomPanel
          message={message}
          handleMessageChange={handleMessageChange}
          sendMessage={sendMessage}
          allUsers={allUsers}
          currentRoom={currentRoom}
          previousRoom={previousRoom}
          messages={messages[currentRoom]}
          socketRef={socketRef}
        />
      </div>
    )
  } else {
    body = (
      <Form username={username} onChange={handleChange} connect={connect} />
    )
  }
  return <div className="Chatrooms">{body}</div>
}

export default RoomDashboard
