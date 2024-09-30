import React from "react"
import PropTypes from "prop-types"

function ChatPanel(props) {
  function renderMessages(message, index) {
    return (
      <div
        key={index}
        className="flex items-center gap-2 border-b border-gray-300 p-2"
      >
        <h3 className="font-bold">{message.sender}:</h3>
        <p>{message.content}</p>
      </div>
    )
  }

  let body
  body = (
    <div className="flex flex-col items-start">
      {props.messages.map(renderMessages)}
    </div>
  )

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      props.sendMessage()
    }
  }

  return (
    <div className="w-[25%] flex flex-col border-l border-black">
      <div className="bodycontainer p-4 flex-1 overflow-scroll border-b border-black">
        {body}
      </div>
      <textarea
        className="textbox h-[15%] w-full"
        value={props.message}
        onChange={props.handleMessageChange}
        onKeyUp={handleKeyPress}
        placeholder="say something"
      />
    </div>
  )
}

ChatPanel.propTypes = {
  message: PropTypes.string,
  messages: PropTypes.array,
  sendMessage: PropTypes.func,
  handleMessageChange: PropTypes.func,
}

export default ChatPanel
