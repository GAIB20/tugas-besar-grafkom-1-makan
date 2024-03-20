var vertices = [
    -0.5, -0.5,
    0.5, 0.5
]

function render() {
    // Create a vertex buffer
    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    // Vertex Shader
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vs.text)
    // Fragment Shader
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs.text)

    // Create and Use Program
    var program = createProgram(gl, vertexShader, fragmentShader)
    gl.useProgram(program)

    // Get Position and Draw
    var scaleLocation = gl.getUniformLocation(program, "scaleFactor")
    var rotationLocation = gl.getUniformLocation(program, "rotationAngle")
    var translationLocation = gl.getUniformLocation(program, "translation")

    // Bind scaling factor to variable scale
    gl.uniform1f(scaleLocation, scale)

    // Bind rotation factor to variable scale
    gl.uniform1f(rotationLocation, rotation)

    // Bind Translation
    gl.uniform2fv(translationLocation, translation)

    var positionAttributeLocation = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.LINE_STRIP, 0, 2)
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
        vertices[0] = initPoint.x
        vertices[1] = initPoint.y
        vertices[2] = currPoint.x
        vertices[3] = currPoint.y
        render()
    }
}, false)

document.addEventListener('mouseup', (event) => {
    if(!isDone){
        isDone = true
        endPoint = getMousePosition(canvas, event)
        console.log("END", endPoint)
        vertices[0] = initPoint.x
        vertices[1] = initPoint.y
        vertices[2] = endPoint.x
        vertices[3] = endPoint.y
        render()
    }
}, false)