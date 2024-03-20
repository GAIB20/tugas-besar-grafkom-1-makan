const vs = document.getElementById("vertex-shader")
const fs = document.getElementById("fragment-shader")
const canvas = document.getElementById("glCanvas")
const gl = canvas.getContext("webgl")

canvas.height = 500
canvas.width = 500

// Global Vars
var scale = 1
var rotation = 0
var animationSpeed = 1
var translation=[0,0]
var animate = false
var isDown = false
var isMove = false
var isDone = false
var initPoint = [0,0]
var endPoint = [0,0]

// Initialize viewport and background color
gl.viewport(0,0, canvas.width, canvas.height)
gl.clearColor(0.39,0.39,0.39,0)
gl.clear(gl.COLOR_BUFFER_BIT)

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