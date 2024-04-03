class Shape {
  constructor(shapeID, shapeName, gl, type, vertices) {
    this.shapeID = shapeID
    this.shapeName = shapeName
    this.gl = gl
    this.type = type
    this.vertices = vertices
    this.init()
  }

  init() {
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
    this.canvasListener()
    this.paramsListener()
    this.animateListener()
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

  handleInput(id, callback) {
    document.getElementById(id).oninput = () => {
      var value = NaN
      if (typeof document.getElementById(id).value != "string") {
        value = parseFloat(document.getElementById(id).value)
      } else {
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
    this.handleInput(
      "rotation",
      (value) => (this.params.rotation = parseFloat(value))
    )
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
      var r = parseInt(value.substr(1, 2), 16) / 255
      var g = parseInt(value.substr(3, 2), 16) / 255
      var b = parseInt(value.substr(5, 2), 16) / 255

      for (let i = 0; i < this.vertices.length; i += 5) {
        this.vertices[i + 2] = r
        this.vertices[i + 3] = g
        this.vertices[i + 4] = b
      }
    })
  }

  verticesListener(verticePos) {
    this.resetVerticesListener()
    const container = document.querySelector(".canvas-container")
    const canvas = document.getElementById("glCanvas")
    for (let i = 0; i < verticePos.length; i += 5) {
      let element = document.createElement("div")

      // === POINT FOR EACH VERTICES ===
      element.classList.add("point")
      element.setAttribute("id", this.shapeID)
      element.style.position = "absolute"
      let pos = getRealPosition(canvas, verticePos[i], verticePos[i + 1])
      element.style.left = pos.realX + "px"
      element.style.top = pos.realY + "px"

      // Add OnClick Listener
      element.addEventListener("click", () => {
        let colorPicker = document.createElement("input")
        colorPicker.setAttribute("type", "color")
        colorPicker.setAttribute("id", `colorpicker-${i / 5}`)
        colorPicker.style.cssText = `
            position: absolute;
            left: ${pos.realX + 5}px;
            top: ${pos.realX - 5}px;
        `

        colorPicker.addEventListener(
          "input",
          (ev) => {
            var r = parseInt(ev.target.value.substr(1, 2), 16) / 255
            var g = parseInt(ev.target.value.substr(3, 2), 16) / 255
            var b = parseInt(ev.target.value.substr(5, 2), 16) / 255

            this.vertices[i + 2] = r
            this.vertices[i + 3] = g
            this.vertices[i + 4] = b

            console.log("CHANGE VERT", this.vertices)

            this.render()
          },
          false
        )

        colorPicker.addEventListener(
          "blur",
          (ev) => {
            colorPicker.remove()
          },
          false
        )

        container.appendChild(colorPicker)
        colorPicker.focus()
      })

      container.appendChild(element)
    }
  }

  resetVerticesListener() {
    const points = document.querySelectorAll(".point")
    points.forEach((point) => {
      if (point.id === this.shapeID) {
        point.remove()
      }
    })
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

  createShapeEditor() {
    let shapeSettingDiv = document.querySelector(".shape-setting")
    let shapeInput = document.createElement("input")
    shapeInput.setAttribute("type", "checkbox")
    shapeInput.setAttribute("id", this.shapeID)
    let shapeLabel = document.createElement("label")
    shapeLabel.setAttribute("for", this.shapeID)
    // shapeLabel.textContent = this.shapeID + 1 + ". " + this.shapeName
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
      let vertex = this.vertices[i]
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
        relativePosition[i] + relativePosition[i + 1] * this.params.shear[1]
      relativePosition[i + 1] =
        relativePosition[i + 1] + relativePosition[i] * this.params.shear[0]

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
    // if(this.isDone){
    //   this.verticesListener(relativePosition.slice())
    // }
  }
}
