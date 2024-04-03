class Rectangle extends Shape {
  constructor(shapeID, gl) {
    super(shapeID, gl, gl.TRIANGLE_FAN, [0, 0, 0, 0, 0, 0, 0, 0])
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
      this.vertices[6] = this.params.initPoint.y
      this.vertices[7] = this.params.r
      this.vertices[8] = this.params.g
      this.vertices[9] = this.params.b

      this.vertices[10] = currPoint.x
      this.vertices[11] = currPoint.y
      this.vertices[12] = this.params.r
      this.vertices[13] = this.params.g
      this.vertices[14] = this.params.b

      this.vertices[15] = this.params.initPoint.x
      this.vertices[16] = currPoint.y
      this.vertices[17] = this.params.r
      this.vertices[18] = this.params.g
      this.vertices[19] = this.params.b

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
      this.vertices[6] = this.params.initPoint.y
      this.vertices[7] = this.params.r
      this.vertices[8] = this.params.g
      this.vertices[9] = this.params.b

      this.vertices[10] = this.params.endPoint.x
      this.vertices[11] = this.params.endPoint.y
      this.vertices[12] = this.params.r
      this.vertices[13] = this.params.g
      this.vertices[14] = this.params.b

      this.vertices[15] = this.params.initPoint.x
      this.vertices[16] = this.params.endPoint.y
      this.vertices[17] = this.params.r
      this.vertices[18] = this.params.g
      this.vertices[19] = this.params.b

      this.params.midPoint = findMidpoint(
        this.params.initPoint,
        this.params.endPoint
      )
      this.render()
    }
  }
}
