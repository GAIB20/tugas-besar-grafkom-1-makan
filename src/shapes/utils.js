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

function findMidPoint(vertices) {
  let sumX = 0
  let sumY = 0
  for (let i = 0; i < vertices.length; i += 5) {
    sumX += vertices[i]
    sumY += vertices[i + 1]
  }
  return [sumX / (vertices.length / 5), sumY / (vertices.length / 5)]
}

function spin(ver, p, q, r) {
  let val =
    (ver[q + 1] - ver[p + 1]) * (ver[r] - ver[q]) -
    (ver[q] - ver[p]) * (ver[r + 1] - ver[q + 1])
  return val === 0 ? 0 : val > 0 ? 1 : 2
}

function convexHull(vertices) {
  n = vertices.length / 5
  if (n < 3) {
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

  while (p != leftmostidx || res.length === 0) {
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
  }

  return res
}
