class Square extends Shape {
  constructor(shapeID, gl) {
    super(shapeID, "Square", gl, gl.TRIANGLE_FAN, [0, 0, 0, 0, 0, 0, 0, 0])
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
      const width = Math.abs(currPoint.x - this.params.initPoint.x)
      const height = Math.abs(currPoint.y - this.params.initPoint.y)
      const minDim = Math.min(width, height)
      const signX = currPoint.x > this.params.initPoint.x ? 1 : -1
      const signY = currPoint.y > this.params.initPoint.y ? 1 : -1

      this.vertices[0] = this.params.initPoint.x
      this.vertices[1] = this.params.initPoint.y
      this.vertices[2] = this.params.r
      this.vertices[3] = this.params.g
      this.vertices[4] = this.params.b

      this.vertices[5] = this.params.initPoint.x + signX * minDim
      this.vertices[6] = this.params.initPoint.y
      this.vertices[7] = this.params.r
      this.vertices[8] = this.params.g
      this.vertices[9] = this.params.b

      this.vertices[10] = this.params.initPoint.x + signX * minDim
      this.vertices[11] = this.params.initPoint.y + signY * minDim
      this.vertices[12] = this.params.r
      this.vertices[13] = this.params.g
      this.vertices[14] = this.params.b

      this.vertices[15] = this.params.initPoint.x
      this.vertices[16] = this.params.initPoint.y + signY * minDim
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

      const width = Math.abs(this.params.endPoint.x - this.params.initPoint.x)
      const height = Math.abs(this.params.endPoint.y - this.params.initPoint.y)
      const minDim = Math.min(width, height)
      const signX = this.params.endPoint.x > this.params.initPoint.x ? 1 : -1
      const signY = this.params.endPoint.y > this.params.initPoint.y ? 1 : -1

      this.vertices[0] = this.params.initPoint.x
      this.vertices[1] = this.params.initPoint.y
      this.vertices[2] = this.params.r
      this.vertices[3] = this.params.g
      this.vertices[4] = this.params.b

      this.vertices[5] = this.params.initPoint.x + signX * minDim
      this.vertices[6] = this.params.initPoint.y
      this.vertices[7] = this.params.r
      this.vertices[8] = this.params.g
      this.vertices[9] = this.params.b

      this.vertices[10] = this.params.initPoint.x + signX * minDim
      this.vertices[11] = this.params.initPoint.y + signY * minDim
      this.vertices[12] = this.params.r
      this.vertices[13] = this.params.g
      this.vertices[14] = this.params.b

      this.vertices[15] = this.params.initPoint.x
      this.vertices[16] = this.params.initPoint.y + signY * minDim
      this.vertices[17] = this.params.r
      this.vertices[18] = this.params.g
      this.vertices[19] = this.params.b

      this.params.midPoint = findMidpoint(
        { x: this.vertices[0], y: this.vertices[1] },
        { x: this.vertices[10], y: this.vertices[11] }
      )
      this.render()
      this.createShapeEditor()
      this.createPointEditor()
    }
  }
}
