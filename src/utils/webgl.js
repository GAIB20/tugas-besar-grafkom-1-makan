const canvas = document.getElementById("glCanvas")
const gl = canvas.getContext("webgl")

canvas.width = window.innerWidth - 610
canvas.height = window.innerHeight - 70

gl.viewport(0, 0, canvas.width, canvas.height)
gl.clearColor(0.39, 0.39, 0.39, 0)
gl.clear(gl.COLOR_BUFFER_BIT)

// Vertex Shader
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vs)
// Fragment Shader
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs)

// Create and Use Program
var program = createProgram(gl, vertexShader, fragmentShader)
gl.useProgram(program)

var vertexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)

function createShader(gl, type, source) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  return shader
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  return program
}

function clear() {
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.39, 0.39, 0.39, 0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

window.requestAnimFrame = (() => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()

function renderShapes(shapes) {
  clear()

  shapes.forEach((shape) => {
    shape.render()
  })

  window.requestAnimFrame(() => {
    renderShapes(shapes)
  })
}
