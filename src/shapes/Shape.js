class Shape {
  constructor(gl, type, vertices) {
    this.gl = gl
    this.type = type
    this.vertices = vertices
    this.restart()
  }

  init() {
    this.paramsListener()
    this.canvasListener()
    this.animateListener()
  }

  canvasListener() {
    throw new Error("Method 'canvasListener()' must be implemented.")
  }

  handleInput(id, callback) {
    document.getElementById(id).oninput = () => {
      const value = parseFloat(document.getElementById(id).value)
      callback(value)
      this.render()
    }
  }

  paramsListener() {
    this.handleInput("scaling", (value) => (this.params.scale = value))
    this.handleInput("x-transform", (value) => (this.params.xTransform = value))
    this.handleInput("y-transform", (value) => (this.params.yTransform = value))
    this.handleInput("rotation", (value) => (this.params.rotation = value))
    this.handleInput(
      "y-translate",
      (value) => (this.params.translation[1] = value)
    )
    this.handleInput(
      "x-translate",
      (value) => (this.params.translation[0] = value)
    )
    this.handleInput("x-shear", (value) => (this.params.shear[0] = value))
    this.handleInput("y-shear", (value) => (this.params.shear[1] = value))
  }

  verticesListener() {
    console.log(this.vertices)
    this.resetVerticesListener()
    const container = document.querySelector(".canvas-container")
    const canvas = document.getElementById("glCanvas")
    for (let i = 0; i < this.vertices.length; i += 2) {
      let element = document.createElement("div")
      element.classList.add("point")
      element.setAttribute("id", `point-${i / 2}`);
      element.style.position = "absolute"
      let pos = getRealPosition(canvas, this.vertices[i], this.vertices[i + 1])
      element.style.left = pos.realX + "px"
      element.style.top = pos.realY + "px"
      container.appendChild(element)
    }
  }

  resetVerticesListener() {
    const points = document.querySelectorAll(".point")
    points.forEach((point) => point.remove())
  }

  animateListener() {
    document.getElementById("animate").onclick = () => {
      this.animate = !this.animate
      if (this.animate) {
        this.animateCanvas()
      }
    }
  }

  animateCanvas() {
    this.params.rotation += 0.3
    this.render()
    if (this.animate) {
      setTimeout(() => this.animateCanvas(), 1000 / 60)
    }
  }

  restart() {
    this.animate = false
    this.isDown = false
    this.isMove = false
    this.isDone = false
    this.params = {
      scale: 1,
      xTransform: 1,
      yTransform: 1,
      rotation: 0,
      translation: [0, 0],
      shear: [0, 0],
      animationSpeed: 1,
      initPoint: [0, 0],
      endPoint: [0, 0],
      midPoint: [0, 0]
    }
  }

  render() {
    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertices),
      gl.STATIC_DRAW
    )

    // Get Position and Draw
    var scaleLocation = gl.getUniformLocation(program, "scaleFactor")
    var xTransformLocation = gl.getUniformLocation(program, "transformX")
    var yTransformLocation = gl.getUniformLocation(program, "transformY")
    var rotationLocation = gl.getUniformLocation(program, "rotationAngle")
    var translationLocation = gl.getUniformLocation(program, "translation")
    var shearLocation = gl.getUniformLocation(program, "shearFactor")
    var midPointLocation = gl.getUniformLocation(program, "midpointLoc")

    // Bind scaling factor to variable scale
    gl.uniform1f(scaleLocation, this.params.scale)
    gl.uniform1f(xTransformLocation, this.params.xTransform)
    gl.uniform1f(yTransformLocation, this.params.yTransform)

    // Bind rotation factor to variable scale
    gl.uniform1f(rotationLocation, this.params.rotation)

    // Bind shear
    gl.uniform2fv(shearLocation, this.params.shear)

    // Bind Translation
    gl.uniform2fv(translationLocation, this.params.translation)
    gl.uniform2fv(midPointLocation, this.params.midPoint)

    var positionAttributeLocation = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(this.type, 0, this.vertices.length / 2)
    this.verticesListener()
  }
}
