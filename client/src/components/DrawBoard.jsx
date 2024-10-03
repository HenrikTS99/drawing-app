import React, { useEffect, useState } from "react"
import { useDraw } from "../hooks/useDraw"
import { ChromePicker } from "react-color"
import { drawLine } from "../utils/drawLine"
import DownloadImageButton from "./buttons/DownloadImageButton"
import CopyImageButton from "./buttons/CopyImageButton"
import ButtonBase from "./buttons/ButtonBase"
import PropTypes from "prop-types"

const DrawBoard = ({ room, socketRef }) => {
  const socket = socketRef.current
  const [color, setColor] = useState("#000")
  const { canvasRef, onMouseDown, clear } = useDraw(createLine)

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d")
    clear()
    socket.emit("client-ready", room)

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return
      socket.emit("canvas-state", {
        room,
        state: canvasRef.current.toDataURL(),
      })
    })

    socket.on("canvas-state-from-server", (state) => {
      console.log("canvas state received.", state.slice(0, 20))
      const img = new Image()
      img.src = state
      img.onload = () => {
        context?.drawImage(img, 0, 0)
      }
    })

    socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
      console.log("drawing line...")
      if (!context) return
      drawLine({ prevPoint, currentPoint, context, color })
    })

    socket.on("clear", (receivedRoom) => {
      if (receivedRoom === room) {
        console.log("correct room, clearing")
        clear()
      } else {
        console.log("wrong room to clear", receivedRoom, room)
      }
    })

    window.addEventListener("beforeunload", saveCanvas)
    return () => {
      saveCanvas()
      window.removeEventListener("beforeunload", saveCanvas)
      socket.off("get-canvas-state")
      socket.off("canvas-state-from-server")
      socket.off("draw-line")
      socket.off("clear")
    }
  }, [canvasRef, room])

  function saveCanvas() {
    console.log("saving canvas for room:", room)
    if (canvasRef.current) {
      if (!canvasRef.current?.toDataURL()) return
      socket.emit("save-canvas", {
        room,
        state: canvasRef.current.toDataURL(),
      })
    }
  }

  function createLine({ prevPoint, currentPoint, context }) {
    socket.emit("draw-line", { room, prevPoint, currentPoint, color })
    drawLine({ prevPoint, currentPoint, context, color })
  }

  return (
    <div className="bg-white flex justify-center items-center">
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <ButtonBase
          label="Clear canvas"
          onClickFunc={() => socket.emit("clear", room)}
        ></ButtonBase>
        <DownloadImageButton canvas={canvasRef.current} />
        <CopyImageButton canvas={canvasRef.current} />
      </div>
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
    </div>
  )
}

DrawBoard.propTypes = {
  socketRef: PropTypes.shape({
    current: PropTypes.object,
  }),
  room: PropTypes.string,
}
export default DrawBoard
