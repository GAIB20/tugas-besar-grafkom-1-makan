function getMousePosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = (event.clientX - rect.left - canvas.width / 2) / (canvas.width / 2)
  const y =
    -(event.clientY - rect.top - canvas.height / 2) / (canvas.height / 2)
    return { x, y }
}

function findMidpoint(point1, point2) {
  const midpoint_x = (point1.x + point2.x) / 2
  const midpoint_y = (point1.y + point2.y) / 2
  return [midpoint_x, midpoint_y]
}