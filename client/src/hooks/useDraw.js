import { useState, useEffect, useRef } from "react"

export const useDraw = (onDraw) => {
    
    const [mouseDown, setMouseDown] = useState(false)

    const canvasRef = useRef(null)
    const prevPoint = useRef(null);

    const onMouseDown = () => setMouseDown(true)

    const clear = () => {
        const canvas = canvasRef.current
        if(!canvas) return
        const context = canvas.getContext('2d')
        if (!context) return
        context.clearRect(0,0, canvas.width, canvas.height)
    }
    useEffect(() => {
        const handler = (e) => {
            if(!mouseDown) return
            const currentPoint = computePointInCanvas(e)
            const context = canvasRef.current?.getContext('2d')
            if(!context || !currentPoint) return

            onDraw({context, currentPoint, prevPoint: prevPoint.current})
            prevPoint.current = currentPoint
        }

        const computePointInCanvas = (e) => {
            const canvas = canvasRef.current
            if (!canvas) return

            const rect= canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            return {x, y }
        }

        const mouseUpHandler = () => {
            setMouseDown(false)
            prevPoint.current = null
        }

        // Add event listeners
        canvasRef.current?.addEventListener('mousemove', handler)
        window.addEventListener('mouseup', mouseUpHandler)
        // Remove event listeners
        return () => {
            canvasRef.current?.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', mouseUpHandler)
        }
    }, [onDraw])

    return { canvasRef, onMouseDown, clear }
}

