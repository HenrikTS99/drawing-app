import React from "react";

function Sidebar({ allUsers, joinRoom, yourId}) {

    const rooms = [
        "general",
        "room1",
        "room2",
        "room3",
        "room4"
    ];

    function renderRooms(room) {
        return (
            <div className="cursor-pointer" key={room} onClick={() => 
                joinRoom(room)}>
                {room}
            </div>
        )
    }

    function renderUser(user) {
        if (user.id === yourId) {
            return (
                <div className="cursor-pointer" key={user.id}>
                    You: {user.username}
                </div>
            );
        }

        return (
            <div className="cursor-pointer" key={user.id}>
                {user.username}
            </div>
        )
    }

    return (
        <div className="sidebar h-full w-[15%] p-4 border-r border-black">
            <h3 className="font-bold">Channels</h3>
            {rooms.map(renderRooms)}
            <h3 className="font-bold pt-6">All Users</h3>
            {allUsers.map(renderUser)}
        </div>
    )
}

export default Sidebar;