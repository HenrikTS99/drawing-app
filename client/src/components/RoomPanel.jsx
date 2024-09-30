import React from "react"
import DrawBoard from "./DrawBoard"
import ChatPanel from "./ChatPanel"
import PropTypes from "prop-types"

function RoomPanel(props) {
  return (
    /* Main Content: Chat Panel with Drawing Board */
    <div className="chatPanel h-[100%] w-[85%] flex flex-col">
      <div className="font-bold channelInfo h-[10%] w-full border-b border-black border-[1px] flex items-center justify-center">
        {props.currentRoom}
      </div>

      {/* Flex container for Drawing Board and Chat */}
      <div className="flex flex-1">
        {/* DrawBoard */}
        <div className="w-[75%] p-4 border-r border-black">
          <DrawBoard room={props.currentRoom} socketRef={props.socketRef} />
        </div>
        {/* Chat Area */}
        <ChatPanel
          messages={props.messages}
          message={props.message}
          handleMessageChange={props.handleMessageChange}
          sendMessage={props.sendMessage}
        />
      </div>
    </div>
  )
}

RoomPanel.propTypes = {
  socketRef: PropTypes.shape({
    current: PropTypes.object,
  }),
  currentRoom: PropTypes.string,
  message: PropTypes.string,
  messages: PropTypes.array,
  sendMessage: PropTypes.func,
  handleMessageChange: PropTypes.func,
}
export default RoomPanel
