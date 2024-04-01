class Square extends Shape {
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
          const width = Math.abs(currPoint.x - this.params.initPoint.x)
          const height = Math.abs(currPoint.y - this.params.initPoint.y)
          const minDim = Math.min(width, height)
          const signX = currPoint.x > this.params.initPoint.x ? 1 : -1
          const signY = currPoint.y > this.params.initPoint.y ? 1 : -1

          this.vertices[0] = this.params.initPoint.x
          this.vertices[1] = this.params.initPoint.y
          this.vertices[2] = this.params.initPoint.x + signX * minDim
          this.vertices[3] = this.params.initPoint.y
          this.vertices[4] = this.params.initPoint.x + signX * minDim
          this.vertices[5] = this.params.initPoint.y + signY * minDim
          this.vertices[6] = this.params.initPoint.x
          this.vertices[7] = this.params.initPoint.y + signY * minDim

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

          const width = Math.abs(
            this.params.endPoint.x - this.params.initPoint.x
          )
          const height = Math.abs(
            this.params.endPoint.y - this.params.initPoint.y
          )
          const minDim = Math.min(width, height)
          const signX =
            this.params.endPoint.x > this.params.initPoint.x ? 1 : -1
          const signY =
            this.params.endPoint.y > this.params.initPoint.y ? 1 : -1

          this.vertices[0] = this.params.initPoint.x
          this.vertices[1] = this.params.initPoint.y
          this.vertices[2] = this.params.initPoint.x + signX * minDim
          this.vertices[3] = this.params.initPoint.y
          this.vertices[4] = this.params.initPoint.x + signX * minDim
          this.vertices[5] = this.params.initPoint.y + signY * minDim
          this.vertices[6] = this.params.initPoint.x
          this.vertices[7] = this.params.initPoint.y + signY * minDim

          this.params.midPoint = findMidpoint(
            { x: this.vertices[0], y: this.vertices[1] },
            { x: this.vertices[4], y: this.vertices[5] }
          )
          // this.verticesListener()
          this.render()
        }
      },
      false
    )
  }
}
