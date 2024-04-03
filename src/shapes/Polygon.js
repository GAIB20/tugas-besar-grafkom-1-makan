class Polygon extends Shape {
  constructor(shapeID, gl) {
    super(shapeID, gl, gl.TRIANGLE_FAN, [])
    this.isDone = false
  }

  initDraw(canvas, event) {
    if (!this.isDone) {
      let pos = getMousePosition(canvas, event)
      this.vertices.push(pos.x)
      this.vertices.push(pos.y)
      this.vertices.push(this.params.r)
      this.vertices.push(this.params.g)
      this.vertices.push(this.params.b)
      this.params.midPoint = findPolygonMidPoint(this.vertices)
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
    this.vertices = convexHull(this.vertices)
    super.render()
  }
}
