function getMousePosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = (event.clientX - rect.left - canvas.width / 2) / (canvas.width / 2)
  const y =
    -(event.clientY - rect.top - canvas.height / 2) / (canvas.height / 2)
  return { x, y }
}

function getRealPosition(canvas, x, y) {
  const rect = canvas.getBoundingClientRect()
  const realX = x * (canvas.width / 2) + canvas.width / 2 + rect.left
  const realY = -y * (canvas.height / 2) + canvas.height / 2 + rect.top
  return { realX, realY }
}

function findMidpoint(point1, point2) {
  const midpoint_x = (point1.x + point2.x) / 2
  const midpoint_y = (point1.y + point2.y) / 2
  return [midpoint_x, midpoint_y]
}

function spin(ver, p, q, r) {
  let val =
    (ver[q + 1] - ver[p + 1]) * (ver[r] - ver[q]) -
    (ver[q] - ver[p]) * (ver[r + 1] - ver[q + 1])
  return val === 0 ? 0 : (val > 0 ? 1 : 2);
}

function convexHull(vertices) {
  n = vertices.length / 5
  if (n < 3) {
    console.log("Convex hull requires at least 3 vertices")
    return vertices
  }

  let res = []

  let leftmostidx = 0
  for (let i = 5; i < vertices.length; i += 5) {
    if (vertices[i] < vertices[leftmostidx]) {
      leftmostidx = i
    }
  }

  let p = leftmostidx

  do {
    for (let i = 0; i < 5; i++) {
      res.push(vertices[p + i])
    }
    let q = ((p / 5 + 1) % n) * 5
    for (let i = 0; i < vertices.length; i += 5) {
      if (spin(vertices, p, i, q) == 2) {
        q = i
      }
    }
    p = q
  } while (p != leftmostidx)

  return res
}
