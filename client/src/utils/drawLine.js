export const drawLine = ({ prevPoint, currentPoint, context, color }) => {
  const { x: currX, y: currY } = currentPoint
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
