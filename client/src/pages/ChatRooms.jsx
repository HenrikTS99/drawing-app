import React, { useRef, useEffect, useState } from 'react'
import Form from '../components/UsernameForm'
import Chat from '../components/Chat'
import DrawBoard from '../components/DrawBoard'
import { io } from 'socket.io-client'
import { produce } from 'immer'

const initialMessagesState = {
  general: [],
  room1: [],
  room2: [],
  room3: [],
  room4: [],
}

function ChatRooms() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState("general")
  const [connectedRooms, setConnectedRooms ] = useState(['general']);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState)
  const [message, setMessage] = useState("")
  const socketRef = useRef()

  function handleMessageChange(e) {
    setMessage(e.target.value);
  };

  // Clear message box when message is sent
  useEffect(() => {
    setMessage("");
  }, [messages]);

  function sendMessage() {
    const payload = {
      content: message,
      sender: username,
      chatName: currentChat,
    };
    socketRef.current.emit('send-message', payload);
    const newMessages = produce(messages, draft => {
      draft[currentChat].push({
        sender: username,
        content: message
      });
    });
    setMessages(newMessages);
  }

  function updateRoomMessages(incomingMessages, room) {
    // Make sure messages is up to date before setting. 
    // If not done trough function other room messages gets deleted.
    setMessages(prevMessages => {
      const newMessages = produce(prevMessages, draft => {
        draft[room] = incomingMessages;
      });
      return newMessages
    })
  }

  function joinRoom(room) {
    const newConnectedRooms = produce(connectedRooms, draft => {
      draft.push(room);
    });
    socketRef.current.emit('join-room', room);
    setConnectedRooms(newConnectedRooms)
  }

  function toggleChat(currentChat) {
    if (!messages[currentChat]) {
      console.error("Chat dosen't exist:", currentChat);
    }
    setCurrentChat(currentChat)
  }

  function handleChange(e) {
    setUsername(e.target.value);
  }

  function connect() {
    setConnected(true);
    socketRef.current = io.connect("http://localhost:3001")
    socketRef.current.emit("join-server", username)
    socketRef.current.emit('join-room', 'general')
    socketRef.current.on('new-user', allUsers => {
      setAllUsers(allUsers)
    });

    socketRef.current.on('joined-room', ({ messages, room }) => {
      updateRoomMessages(messages, room)
    });

    socketRef.current.on('new-message', ({ content, sender, chatName }) => {
      setMessages(messages => {
        const newMessages = produce(messages, draft => {
          if (draft[chatName]) {
            draft[chatName].push({ content, sender })
          } else {
            console.error("Chat dosen't exist:", chatName);
          }
        });
        return newMessages
      })
    });
  }

  let body;
  if (connected) {
    body = (
      <Chat
      message={message}
      handleMessageChange={handleMessageChange}
      sendMessage={sendMessage}
      yourId={socketRef.current ? socketRef.current.id : ""}
      allUsers={allUsers}
      joinRoom={joinRoom}
      connectedRooms={connectedRooms}
      currentChat={currentChat}
      toggleChat={toggleChat}
      messages={messages[currentChat]}
      socketRef={socketRef}
    />
    )
  } else {
    body= (
      <Form username={username} onChange={handleChange} connect={connect} />
    )
  }
    return (
      <div className="Chatrooms">
        {body}
      </div>
    );
  }

export default ChatRooms;
