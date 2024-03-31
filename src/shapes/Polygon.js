class Polygon extends Shape {
  constructor(gl) {
    super(gl, gl.TRIANGLE_FAN, [])
  }

  canvasListener() {
    const canvas = document.getElementById("glCanvas")
    canvas.addEventListener("click", (event) => {
      let pos = getMousePosition(canvas, event)
      this.vertices.push(pos.x)
      this.vertices.push(pos.y)
      this.render()
    })
  }

  render() {
    this.vertices = convexHull(this.vertices)
    this.verticesListener()
    super.render()
  }
}
