class Shape {
  constructor(
    shapeID,
    shapeName,
    gl,
    type,
    vertices,
    _scale = 1,
    _xTransform = 1,
    _yTransform = 1,
    _rotation = 0,
    _translation = [0, 0],
    _shear = [0, 0],
    _initPoint = [0, 0],
    _endPoint = [0, 0],
    _midPoint = [0, 0],
    _r = parseInt(
      document.querySelector("#objectcolor").value.substring(1, 3),
      16
    ) / 255,
    _g = parseInt(
      document.querySelector("#objectcolor").value.substring(3, 5),
      16
    ) / 255,
    _b = parseInt(
      document.querySelector("#objectcolor").value.substring(5, 7),
      16
    ) / 255
  ) {
    this.shapeID = shapeID
    this.shapeName = shapeName
    this.gl = gl
    this.type = type
    this.vertices = vertices
    this.animate = false
    this.isDown = false
    this.isMove = false
    this.isDone = false
    this.params = {
      scale: _scale,
      xTransform: _xTransform,
      yTransform: _yTransform,
      rotation: _rotation,
      translation: _translation,
      shear: _shear,
      animationSpeed: 1,
      initPoint: _initPoint,
      endPoint: _endPoint,
      midPoint: _midPoint,
      r: _r,
      g: _g,
      b: _b
    }
    this.canvasListener()
  }

  save() {
    return {
      shapeName: this.shapeName,
      type: this.type,
      vertices: this.vertices,
      animate: this.animate,
      isDown: this.isDown,
      isMove: this.isMove,
      isDone: this.isDone,
      scale: this.params.scale,
      xTransform: this.params.xTransform,
      yTransform: this.params.yTransform,
      rotation: this.params.rotation,
      translation: this.params.translation,
      shear: this.params.shear,
      initPoint: this.params.initPoint,
      endPoint: this.params.endPoint,
      midPoint: this.params.midPoint,
      r: this.params.r,
      g: this.params.g,
      b: this.params.b
    }
  }

  load(data) {
    this.shapeName = data.shapeName
    this.type = data.type
    this.vertices = data.vertices
    this.animate = data.animate
    this.isDown = data.isDown
    this.isMove = data.isMove
    this.isDone = data.isDone
    this.params.scale = data.scale
    this.params.xTransform = data.xTransform
    this.params.yTransform = data.yTransform
    this.params.rotation = data.rotation
    this.params.translation = data.translation
    this.params.shear = data.shear
    this.params.initPoint = data.initPoint
    this.params.endPoint = data.endPoint
    this.params.midPoint = data.midPoint
    this.params.r = data.r
    this.params.g = data.g
    this.params.b = data.b
    this.createShapeEditor()
    this.createPointEditor()
  }

  initDraw(canvas, event) {
    throw new Error("initDraw method must be implemented")
  }

  draw(canvas, event) {
    throw new Error("draw method must be implemented")
  }

  endDraw(canvas, event) {
    throw new Error("endDraw method must be implemented")
  }

  canvasListener() {
    const canvas = document.getElementById("glCanvas")

    canvas.addEventListener(
      "mousedown",
      (event) => {
        this.initDraw(canvas, event)
      },
      false
    )

    canvas.addEventListener(
      "mousemove",
      (event) => {
        this.draw(canvas, event)
      },
      false
    )

    canvas.addEventListener(
      "mouseup",
      (event) => {
        this.endDraw(canvas, event)
      },
      false
    )
  }

  animateShape() {
    this.params.rotation += 0.3
    if (this.animate) {
      setTimeout(() => this.animateShape(), 1000 / 60)
    }
  }

  createShapeEditor() {
    let shapeSettingDiv = document.querySelector(".shape-setting")
    let shapeInput = document.createElement("input")
    shapeInput.setAttribute("type", "checkbox")
    shapeInput.setAttribute("id", this.shapeID)
    let shapeLabel = document.createElement("label")
    shapeLabel.setAttribute("for", this.shapeID)
    shapeLabel.textContent = this.shapeName + ", ID: " + this.shapeID
    shapeInput.addEventListener("change", () => {
      let pointCheckboxes = document.querySelectorAll(
        `.shape-point-setting input[id^='${this.shapeID}-']`
      )
      pointCheckboxes.forEach((checkbox) => {
        checkbox.checked = shapeInput.checked
      })
    })
    shapeSettingDiv.appendChild(shapeInput)
    shapeSettingDiv.appendChild(shapeLabel)
  }

  createPointEditor() {
    let shapeSettingDiv = document.querySelector(".shape-setting")
    for (let i = 0; i < this.vertices.length; i += 5) {
      let vertexDiv = document.createElement("div")
      vertexDiv.setAttribute("class", "shape-point-setting")

      let vertexInput = document.createElement("input")
      vertexInput.setAttribute("type", "checkbox")
      vertexInput.setAttribute("id", this.shapeID + "-" + i / 5)
      let vertexLabel = document.createElement("label")
      vertexLabel.setAttribute("for", this.shapeID + "-" + i / 5)
      vertexLabel.textContent = `Point ${i / 5 + 1}`

      vertexDiv.appendChild(vertexInput)
      vertexDiv.appendChild(vertexLabel)
      shapeSettingDiv.appendChild(vertexDiv)
    }
  }

  render() {
    // Transformation
    var relativePosition = []
    for (let i = 0; i < this.vertices.length; i += 5) {
      // Get Relative Position
      relativePosition[i] = this.vertices[i] - this.params.midPoint[0]
      relativePosition[i + 1] = this.vertices[i + 1] - this.params.midPoint[1]

      // Rotate
      var degree = this.params.rotation * (Math.PI / 180)
      var rotatedX =
        relativePosition[i] * Math.cos(degree) -
        relativePosition[i + 1] * Math.sin(degree)
      var rotatedY =
        relativePosition[i] * Math.sin(degree) +
        relativePosition[i + 1] * Math.cos(degree)
      relativePosition[i] = rotatedX
      relativePosition[i + 1] = rotatedY
      // Scale
      relativePosition[i] *= this.params.scale
      relativePosition[i + 1] *= this.params.scale

      // Transform on X and Y
      relativePosition[i] *= this.params.xTransform
      relativePosition[i + 1] *= this.params.yTransform

      // Shearing
      relativePosition[i] =
        relativePosition[i] + relativePosition[i + 1] * this.params.shear[0]
      relativePosition[i + 1] =
        relativePosition[i + 1] + relativePosition[i] * this.params.shear[1]

      relativePosition[i] +=
        this.params.midPoint[0] + parseFloat(this.params.translation[0])
      relativePosition[i + 1] +=
        this.params.midPoint[1] + parseFloat(this.params.translation[1])

      relativePosition[i + 2] = this.vertices[i + 2]
      relativePosition[i + 3] = this.vertices[i + 3]
      relativePosition[i + 4] = this.vertices[i + 4]
    }

    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    var positionAttributeLocation = gl.getAttribLocation(program, "position")
    var colorAttributeLocation = gl.getAttribLocation(program, "color")

    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(
      positionAttributeLocation,
      2,
      gl.FLOAT,
      false,
      5 * Float32Array.BYTES_PER_ELEMENT,
      0
    )

    gl.enableVertexAttribArray(colorAttributeLocation)
    gl.vertexAttribPointer(
      colorAttributeLocation,
      3,
      gl.FLOAT,
      false,
      5 * Float32Array.BYTES_PER_ELEMENT,
      2 * Float32Array.BYTES_PER_ELEMENT
    )

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(relativePosition),
      gl.STATIC_DRAW
    )
    gl.drawArrays(this.type, 0, this.vertices.length / 5)
  }
}
