class Polygon extends Shape {
  constructor(shapeID, gl) {
    super(shapeID, "Polygon", gl, gl.TRIANGLE_FAN, [])
    this.isDone = false
    this.isShapePointEditorCreated = false
  }

  initDraw(canvas, event) {
    if (!this.isDone) {
      let pos = getMousePosition(canvas, event)
      this.vertices.push(pos.x)
      this.vertices.push(pos.y)
      this.vertices.push(this.params.r)
      this.vertices.push(this.params.g)
      this.vertices.push(this.params.b)
      this.params.midPoint = findMidPoint(this.vertices)
      this.render()
    }
  }

  canvasListener() {
    const canvas = document.getElementById("glCanvas")
    canvas.addEventListener("click", (event) => {
      this.initDraw(canvas, event)
    })
  }

  render() {
    if (!this.isDone) {
      this.vertices = convexHull(this.vertices)
    }
    if (this.isDone && !this.isShapePointEditorCreated) {
      this.createShapeEditor()
      this.createPointEditor()
      this.isShapePointEditorCreated = true
    }
    super.render()
  }
}
