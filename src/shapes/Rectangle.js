class Rectangle extends Shape {
  constructor(gl) {
    super(gl, gl.TRIANGLE_FAN, [0, 0, 0, 0, 0, 0, 0, 0])
  }

  canvasListener() {
    const canvas = document.getElementById("glCanvas")
    canvas.addEventListener(
      "mousedown",
      (event) => {
        this.isDown = true
        if (!this.isDone) {
          this.params.initPoint = getMousePosition(canvas, event)
          console.log("INIT", this.params.initPoint)
        }
      },
      false
    )

    canvas.addEventListener(
      "mousemove",
      (event) => {
        if (this.isDown && !this.isDone) {
          let currPoint = getMousePosition(canvas, event)
          this.vertices[0] = this.params.initPoint.x
          this.vertices[1] = this.params.initPoint.y
          this.vertices[2] = currPoint.x
          this.vertices[3] = this.params.initPoint.y
          this.vertices[4] = currPoint.x
          this.vertices[5] = currPoint.y
          this.vertices[6] = this.params.initPoint.x
          this.vertices[7] = currPoint.y

          this.render()
        }
      },
      false
    )

    canvas.addEventListener(
      "mouseup",
      (event) => {
        if (!this.isDone) {
          this.isDone = true
          this.params.endPoint = getMousePosition(canvas, event)
          console.log("END", this.params.endPoint)
          this.vertices[0] = this.params.initPoint.x
          this.vertices[1] = this.params.initPoint.y
          this.vertices[2] = this.params.endPoint.x
          this.vertices[3] = this.params.initPoint.y
          this.vertices[4] = this.params.endPoint.x
          this.vertices[5] = this.params.endPoint.y
          this.vertices[6] = this.params.initPoint.x
          this.vertices[7] = this.params.endPoint.y

          this.params.midPoint = findMidpoint(
            this.params.initPoint,
            this.params.endPoint
          )
          // this.verticesListener()
          this.render()
        }
      },
      false
    )
  }
}
