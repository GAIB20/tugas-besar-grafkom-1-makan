class Line extends Shape {
  constructor(shapeID, gl) {
    super(shapeID, gl, gl.LINE_STRIP, [0, 0, 0, 0])
  }

  initDraw(canvas, event) {
    this.isDown = true
    if (!this.isDone) {
      this.params.initPoint = getMousePosition(canvas, event)
      console.log("INIT", this.params.initPoint)
    }
  }

  draw(canvas, event) {
    if (this.isDown && !this.isDone) {
      let currPoint = getMousePosition(canvas, event)
      this.vertices[0] = this.params.initPoint.x
      this.vertices[1] = this.params.initPoint.y
      this.vertices[2] = this.params.r
      this.vertices[3] = this.params.g
      this.vertices[4] = this.params.b

      this.vertices[5] = currPoint.x
      this.vertices[6] = currPoint.y
      this.vertices[7] = this.params.r
      this.vertices[8] = this.params.g
      this.vertices[9] = this.params.b
      this.render()
    }
  }

  endDraw(canvas, event) {
    if (!this.isDone) {
      this.isDone = true
      this.params.endPoint = getMousePosition(canvas, event)
      console.log("END", this.params.endPoint)
      this.vertices[0] = this.params.initPoint.x
      this.vertices[1] = this.params.initPoint.y
      this.vertices[2] = this.params.r
      this.vertices[3] = this.params.g
      this.vertices[4] = this.params.b

      this.vertices[5] = this.params.endPoint.x
      this.vertices[6] = this.params.endPoint.y
      this.vertices[7] = this.params.r
      this.vertices[8] = this.params.g
      this.vertices[9] = this.params.b

      this.params.midPoint = findMidpoint(
        this.params.initPoint,
        this.params.endPoint
      )
      this.render()
    }
  }
}
