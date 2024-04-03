var objs = []
var objIdx = 0
var isDrawingPolygon = false
var selectedObjs = []
var selectedPoints = []

// Shape Checkbox Listener
document.querySelector(".shape-setting").addEventListener("change", (event) => {
  if (event.target.type === "checkbox") {
    let shapeId = event.target.id
    let isChecked = event.target.checked

    if (shapeId.includes("-")) {
      // Point checkbox
      if (isChecked) {
        selectedPoints.push(shapeId)
      } else {
        let index = selectedPoints.indexOf(shapeId)
        if (index !== -1) {
          selectedPoints.splice(index, 1)
        }
      }
    } else {
      // Shape checkbox
      let pointCheckboxes = document.querySelectorAll(
        `.shape-point-setting input[id^='${shapeId}-']`
      )
      pointCheckboxes.forEach((checkbox) => {
        checkbox.checked = isChecked
      })

      if (isChecked) {
        selectedObjs.push(shapeId)
        pointCheckboxes.forEach((checkbox) => {
          selectedPoints.push(checkbox.id)
        })
      } else {
        let index = selectedObjs.indexOf(shapeId)
        if (index !== -1) {
          selectedObjs.splice(index, 1)
        }
        pointCheckboxes.forEach((checkbox) => {
          let pointIndex = selectedPoints.indexOf(checkbox.id)
          if (pointIndex !== -1) {
            selectedPoints.splice(pointIndex, 1)
          }
        })
      }
    }
  }
  console.log(selectedObjs)
  console.log(selectedPoints)
})

// Shape Button Listener
var navLinks = document.querySelectorAll(".nav-link")
navLinks.forEach(function (navLink) {
  navLink.addEventListener("click", function (event) {
    event.preventDefault()
    isDrawingPolygon = false
    objs.forEach((obj) => {
      obj.isDone = true
    })
    navLinks.forEach(function (navLink) {
      navLink.classList.remove("active")
    })
    this.classList.add("active")
  })
})

// Clear Button Listener
document.querySelector("#clear").addEventListener("click", () => {
  // remove selected objects from objs
  objs = objs.filter((obj) => !selectedObjs.includes(obj.shapeID.toString()))

  // remove selected points from objs
  objs.forEach((obj) => {
    let newVertices = []
    for (let i = 0; i < obj.vertices.length; i += 5) {
      let vertex = obj.vertices.slice(i, i + 5)
      let pointId = `${obj.shapeID}-${i / 5}`
      if (!selectedPoints.includes(pointId)) {
        newVertices.push(...vertex)
      }
    }
    obj.vertices = newVertices

    // if the obj vertices is only 2 left, change the type to Line
    if (obj.vertices.length == 10) {
      obj.type = gl.LINES
    }
  })

  // remove the input and label if it is selected
  selectedObjs.forEach((shapeId) => {
    let input = document.getElementById(shapeId)
    let label = document.querySelector(`label[for='${shapeId}']`)
    input.remove()
    label.remove()
  })

  // remove the input and label if it is selected
  selectedPoints.forEach((pointId) => {
    let input = document.getElementById(pointId)
    let label = document.querySelector(`label[for='${pointId}']`)
    input.remove()
    label.remove()
  })

  // reset selected objects and points
  selectedPoints = []
  selectedObjs = []

  // print each vertices of each object
  objs.forEach((obj) => {
    console.log(obj.vertices)
  })

  renderObject(objs)
})

// Canvas Listener to Initialize Object
canvas.addEventListener("click", (event) => {
  let activeNav = document.querySelector(".nav-link.active").id
  if (activeNav == "Polygon" && !isDrawingPolygon) {
    let obj
    obj = new Polygon(objIdx, gl)
    isDrawingPolygon = true
    if (obj) {
      obj.initDraw(canvas, event)
      objs.push(obj)
    }
    objIdx++
  }
})

canvas.addEventListener("mousedown", (event) => {
  let activeNav = document.querySelector(".nav-link.active").id
  if (activeNav == "Polygon") return
  let obj
  switch (activeNav) {
    case "Line":
      obj = new Line(objIdx, gl)
      break
    case "Square":
      obj = new Square(objIdx, gl)
      break
    case "Rectangle":
      obj = new Rectangle(objIdx, gl)
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
    objIdx++
  }
})

const main = () => {
  document.querySelector(".nav-link.active").click()
  renderObject(objs)
}
