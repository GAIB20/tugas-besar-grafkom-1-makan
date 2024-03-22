/* Vertices to define square vertices */
var vertices = [
    -0.5, -0.5,
    0.5, -0.5,
    0.5, 0.5,
    -0.5, 0.5
]

function render() {
    /* Create a vertex buffer to store all the vertices */
    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    /* Vertex Shader */
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vs.text)

    /* Fragment Shader */
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs.text)

    /* Create Program */
    var program = createProgram(gl, vertexShader, fragmentShader)
    gl.useProgram(program)

    // Get Position and Draw
    var scaleLocation = gl.getUniformLocation(program, "scaleFactor")
    var rotationLocation = gl.getUniformLocation(program, "rotationAngle")
    var translationLocation = gl.getUniformLocation(program, "translation")
    var midPointLocation = gl.getUniformLocation(program, "midpointLoc")

    // Bind scaling factor to variable scale
    gl.uniform1f(scaleLocation, scale)

    // Bind rotation factor to variable scale
    gl.uniform1f(rotationLocation, rotation)

    // Bind Translation
    gl.uniform2fv(translationLocation, translation)
    gl.uniform2fv(midPointLocation, midPoint)

    var positionAttributeLocation = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
}

// For new scaling
document.getElementById("scaling").oninput = () => {
    const scaleFactor = parseFloat(document.getElementById("scaling").value)
    scale = scaleFactor
    render()
}

document.getElementById("rotation").oninput = () => {
    const scaleFactor = parseFloat(document.getElementById("rotation").value)
    rotation = scaleFactor
    render()
}

document.getElementById("y-translate").oninput = () => {
    const scaleFactor = parseFloat(document.getElementById("y-translate").value)
    translation[1] = scaleFactor
    render()
}

document.getElementById("x-translate").oninput = () => {
    const scaleFactor = parseFloat(document.getElementById("x-translate").value)
    translation[0] = scaleFactor
    render()
}

document.getElementById("animate").onclick = () => {
    animate = !animate
    animateCanvas()
}

function animateCanvas() {
    rotation += 0.3
    render()
    if(animate) {
        requestAnimationFrame(animateCanvas)
    }
}

document.addEventListener('mousedown', (event) => {
    isDown = true
    console.log("ISMOVE", isMove)
    if(!isDone){
        initPoint = getMousePosition(canvas, event)
        console.log("INIT", initPoint)
    }
}, false)

document.addEventListener('mousemove', (event) => {
    if(!isDone && isDown) {
        currPoint = getMousePosition(canvas, event)
        const width = Math.abs(currPoint.x - initPoint.x)
        const height = Math.abs(currPoint.y - initPoint.y)
        const minDim = Math.min(width, height)
        const signX = currPoint.x > initPoint.x ? 1 : -1
        const signY = currPoint.y > initPoint.y ? 1 : -1
        
        vertices[0] = initPoint.x
        vertices[1] = initPoint.y
        vertices[2] = initPoint.x + minDim * signX
        vertices[3] = initPoint.y
        vertices[4] = initPoint.x + minDim * signX
        vertices[5] = initPoint.y + minDim * signY
        vertices[6] = initPoint.x
        vertices[7] = initPoint.y + minDim * signY

        render()
    }
}, false)

document.addEventListener('mouseup', (event) => {
    if(!isDone){
        isDone = true
        endPoint = getMousePosition(canvas, event)
        const width = Math.abs(endPoint.x - initPoint.x)
        const height = Math.abs(endPoint.y - initPoint.y)
        const minDim = Math.min(width, height)
        const signX = endPoint.x > initPoint.x ? 1 : -1
        const signY = endPoint.y > initPoint.y ? 1 : -1
        
        vertices[0] = initPoint.x
        vertices[1] = initPoint.y
        vertices[2] = initPoint.x + minDim * signX
        vertices[3] = initPoint.y
        vertices[4] = initPoint.x + minDim * signX
        vertices[5] = initPoint.y + minDim * signY
        vertices[6] = initPoint.x
        vertices[7] = initPoint.y + minDim * signY

        midPoint = findMidpoint({x: vertices[0], y: vertices[1]}, {x:vertices[4],y:vertices[5]})        
        render()
    }
}, false)