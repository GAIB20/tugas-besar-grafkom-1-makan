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
      var value = NaN
      if(typeof document.getElementById(id).value != 'string'){
        value = parseFloat(document.getElementById(id).value)
      }else{
        value = document.getElementById(id).value
      }
      callback(value)
      this.render()
    }
  }

  paramsListener() {
    this.handleInput("scaling", (value) => (this.params.scale = value))
    this.handleInput("x-transform", (value) => (this.params.xTransform = value))
    this.handleInput("y-transform", (value) => (this.params.yTransform = value))
    this.handleInput("rotation", (value) => (this.params.rotation = parseFloat(value)))
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
    this.handleInput("objectcolor", (value) => {
      this.params.r = parseInt(value.substr(1,2), 16)/255
      this.params.g = parseInt(value.substr(3,2), 16)/255
      this.params.b = parseInt(value.substr(5,2), 16)/255
    })
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
    console.log(this.params.rotation)
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
      midPoint: [0, 0],
      r: 0,
      g: 0,
      b: 1  
    }
  }

  render() {
    // Transformation
    var relativePosition = []
    for(let i = 0; i < this.vertices.length; i += 2){
      // Get Relative Position
      relativePosition[i] = this.vertices[i] - this.params.midPoint[0]
      relativePosition[i+1] = this.vertices[i+1] - this.params.midPoint[1]

      // Rotate
      var degree = this.params.rotation * (Math.PI/180)
      var rotatedX= relativePosition[i] * Math.cos(degree) - relativePosition[i+1] * Math.sin(degree)
      var rotatedY = relativePosition[i] * Math.sin(degree) + relativePosition[i+1] * Math.cos(degree)
      relativePosition[i] = rotatedX
      relativePosition[i+1] = rotatedY
      // Scale
      relativePosition[i] *= this.params.scale
      relativePosition[i+1] *= this.params.scale
      
      // Transform on X and Y
      relativePosition[i]*=this.params.xTransform
      relativePosition[i+1]*=this.params.yTransform

      // Shearing
      relativePosition[i] = relativePosition[i] + relativePosition[i+1] * this.params.shear[1]
      relativePosition[i+1] = relativePosition[i+1] + relativePosition[i] * this.params.shear[0]

      relativePosition[i] += this.params.midPoint[0] + parseFloat(this.params.translation[0])
      relativePosition[i+1] += this.params.midPoint[1] + parseFloat(this.params.translation[1])
    }

    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    var colorLocation = gl.getUniformLocation(program, 'fColor')
    gl.uniform3f(colorLocation, this.params.r, this.params.g, this.params.b)
    
    var positionAttributeLocation = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(relativePosition),
      gl.STATIC_DRAW
    )
    gl.drawArrays(this.type, 0, this.vertices.length / 2)
    this.verticesListener()
  }
}
