import React, { useEffect, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { io } from 'socket.io-client'
import { drawLine } from '../utils/drawLine'

const DrawBoard = ({ room, socketRef }) => {
  const socket = socketRef.current
  const [color, setColor] = useState('#000')
  const { canvasRef, onMouseDown, clear } = useDraw(createLine)

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d')

    socket.emit('client-ready', room)

    socket.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return
      socket.emit('canvas-state', { room, state:canvasRef.current.toDataURL() })
    })

    socket.on('canvas-state-from-server', (state) => {
      console.log('canvas state recieved.')
      const img = new Image()
      img.src = state
      img.onload = () => {
        context?.drawImage(img, 0, 0)
      }
    })

    socket.on('draw-line', ({ prevPoint, currentPoint, color }) => {
      console.log('drawing line...')
      if (!context) return
      drawLine({ prevPoint, currentPoint, context, color })
    })

    socket.on('clear', (recievedRoom) => {
      if (recievedRoom === room) {
        console.log('correct room, clearing')
        clear()
      } else {
        console.log('wrong room to clear', recievedRoom, room)
      }
    })

    return () => {
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('draw-line')
      socket.off('clear')
    }
  }, [canvasRef, room])

  function createLine({ prevPoint, currentPoint, context }) {
    socket.emit('draw-line', { room, prevPoint, currentPoint, color })
    drawLine({ prevPoint, currentPoint, context, color })
  }

  return (
    <div className="bg-white flex justify-center items-center">
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          type="button"
          className="p-2 rounded-md border border-black"
          onClick={() => socket.emit('clear', room)}
        >
          Clear canvas
        </button>
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

export default DrawBoard
