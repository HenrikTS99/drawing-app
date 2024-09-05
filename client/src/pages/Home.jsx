import React, { useEffect, useState } from "react";
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'


const Home = () => {
  const [color, setColor] = useState('#000')
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine)

  function drawLine({prevPoint, currentPoint, context}) {
    const { x: currX, y:currY } = currentPoint
    const lineColor = color
    const lineWidth = 5

    let startPoint = prevPoint ?? currentPoint
    context.beginPath()
    context.lineWidth = lineWidth
    context.strokeStyle = lineColor
    context.moveTo(startPoint.x, startPoint.y)
    context.lineTo(currX, currY)
    context.stroke()

    context.fillStyle = lineColor
    context.beginPath()
    context.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    context.fill()

  }

  return (
    <div className='w-screen h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col gap-10 pr-10'>
      <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
      <button type='button' className='p-2 rounded-md border border-black' onClick={clear}>
        Clear canvas
      </button>
      </div>
      <canvas onMouseDown={onMouseDown}
      ref={canvasRef}
      width={750}
      height={750}
      className='border border-black rounded-md' />
    </div>
  );
};

export default Home;
