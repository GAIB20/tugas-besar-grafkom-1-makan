function getMousePosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x =  ((event.clientX - rect.left) - (canvas.width/2))/(canvas.width/2)
    const y = -((event.clientY - rect.top)-(canvas.height/2))/(canvas.height/2)
    return {x, y}
}