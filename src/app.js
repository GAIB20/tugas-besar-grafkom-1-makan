var objs = []
var isDrawingPolygon = false

// Shape Button Listener
var navLinks = document.querySelectorAll(".nav-link")
navLinks.forEach(function (navLink) {
  navLink.addEventListener("click", function (event) {
    event.preventDefault()
    navLinks.forEach(function (navLink) {
      navLink.classList.remove("active")
    })
    this.classList.add("active")
  })
})

// Canvas Listener to Initialize Object
canvas.addEventListener("click", (event) => {
  let activeNav = document.querySelector(".nav-link.active").id
  if (activeNav == "Polygon" && !isDrawingPolygon) {
    objs.forEach((obj) => {
      obj.isDone = true
    })
    let obj
    obj = new Polygon(objs.length, gl)
    isDrawingPolygon = true
    if (obj) {
      obj.initDraw(canvas, event)
      objs.push(obj)
    }
  }
})

canvas.addEventListener("mousedown", (event) => {
  let activeNav = document.querySelector(".nav-link.active").id
  if (activeNav == "Polygon") return
  isDrawingPolygon = false
  objs.forEach((obj) => {
    obj.isDone = true
  })
  let obj
  switch (activeNav) {
    case "Line":
      obj = new Line(objs.length, gl)
      break
    case "Square":
      obj = new Square(objs.length, gl)
      break
    case "Rectangle":
      obj = new Rectangle(objs.length, gl)
      break
    case "Polygon":
      break
    default:
      console.log("Unknown Object selected")
      break
  }
  if (obj) {
    console.log("Init Draw")
    obj.initDraw(canvas, event)
    objs.push(obj)
  }
})

const main = () => {
  document.querySelector(".nav-link.active").click()
  renderObject(objs)
}
