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

    // Bind scaling factor to variable scale
    gl.uniform1f(scaleLocation, scale)

    // Bind rotation factor to variable scale
    gl.uniform1f(rotationLocation, rotation)

    // Bind Translation
    gl.uniform2fv(translationLocation, translation)

    var positionAttributeLocation = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
}

window.onload = () => {
    render()
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