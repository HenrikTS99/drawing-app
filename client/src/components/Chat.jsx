import React from "react";
import DrawBoard from '../components/DrawBoard'

const rooms = [
    "general",
    "room1",
    "room2",
    "room3",
    "room4"
];

function Chat(props) {
    function renderRooms(room) {
        const currentChat = {
            chatName: room,
            isChannel: true,
            recieverId: "",
        }
        return (
            <div className="cursor-pointer" onClick={() => props.toggleChat(currentChat)} key={room}>
                {room}
            </div>
        )
    }

    function renderUser(user) {
        if (user.id === props.yourId) {
            return (
                <div className="cursor-pointer" key={user.id}>
                    You: {user.username}
                </div>
            );
        }
        const currentChat = {
            chatName: user.username,
            isChannel: false,
            recieverId: user.id,
        }
        return (
            <div className="cursor-pointer" onClick={() => {
                props.toggleChat(currentChat);
            }} key={user.id}>
                {user.username}
            </div>
        )
    }

    function renderMessages(message, index) {
        return (
            <div key={index} className="flex items-center gap-2 border-b border-gray-300 p-2">
                <h3 className="font-bold">{message.sender}:</h3>
                <p>{message.content}</p>
            </div>
        );
    }

    let body;
    if (!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)) {
        body = (
            <div className="flex flex-col items-start">
                {props.messages.map(renderMessages)}
            </div>
        );
    } else {
        body = (
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => 
                props.joinRoom(props.currentChat.chatName)}>Join {props.currentChat.chatName}
                
            </button> 
        )
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            props.sendMessage();
        }
    }

    return (
        <div className="h-screen w-full flex">
            {/* sidebar */}
            <div className="sidebar h-full w-[15%] p-4 border-r border-black">
                <h3 className="font-bold">Channels</h3>
                {rooms.map(renderRooms)}
                <h3 className="font-bold pt-6">All Users</h3>
                {props.allUsers.map(renderUser)}
            </div>

            {/* Main Content: Chat Panel with Drawing Board */}
            <div className="chatPanel h-[100%] w-[85%] flex flex-col">
                <div className="font-bold channelInfo h-[10%] w-full border-b border-black border-[1px] flex items-center justify-center">
                    {props.currentChat.chatName}
                </div>

                {/* Flex container for Drawing Board and Chat */}
                <div className="flex flex-1">
                    {/* DrawBoard */}
                    <div className="w-[75%] p-4 border-r border-black">
                        <DrawBoard 
                            room={props.currentChat.chatName}
                            socketRef={props.socketRef}
                        />
                    </div>

                    {/* Chat Area */}
                    <div className="w-[25%] flex flex-col border-l border-black">
                        <div className="bodycontainer p-4 flex-1 overflow-scroll border-b border-black">
                            {body}
                        </div>
                        <textarea className="textbox h-[15%] w-full"
                            value={props.message}
                            onChange={props.handleMessageChange}
                            onKeyUp={handleKeyPress}
                            placeholder="say something"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;