var shapes = []
var shapeIdx = 0
var isDrawingPolygon = false
var selectedShapes = []
var selectedPoints = []
var animate = false

// Shape Checkbox Listener
document.querySelector(".shape-setting").addEventListener("change", (event) => {
  if (event.target.type === "checkbox") {
    let shapeId = event.target.id
    let isChecked = event.target.checked

    if (shapeId.includes("-")) {
      // Point checkbox
      if (isChecked && !selectedPoints.includes(shapeId)) {
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
        selectedShapes.push(shapeId)
        pointCheckboxes.forEach((checkbox) => {
          if (!selectedPoints.includes(checkbox.id)) {
            selectedPoints.push(checkbox.id)
          }
        })
      } else {
        let index = selectedShapes.indexOf(shapeId)
        if (index !== -1) {
          selectedShapes.splice(index, 1)
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
})

// Delete Button Listener
document.querySelector("#delete").addEventListener("click", () => {
  // remove selected shape from list of shapes
  shapes = shapes.filter(
    (shape) => !selectedShapes.includes(shape.shapeID.toString())
  )

  // remove selected points from shapes
  shapes.forEach((shape) => {
    let newVertices = []
    for (let i = 0; i < shape.vertices.length; i += 5) {
      let vertex = shape.vertices.slice(i, i + 5)
      let pointId = `${shape.shapeID}-${i / 5}`
      if (!selectedPoints.includes(pointId)) {
        newVertices.push(...vertex)
      } else {
        // remove the point from the DOM
        let input = document.getElementById(pointId)
        let label = document.querySelector(`label[for='${pointId}']`)
        input.remove()
        label.remove()

        // remove the point from the selectedPoints
        let index = selectedPoints.indexOf(pointId)
        if (index !== -1) {
          selectedPoints.splice(index, 1)
        }
      }
    }

    // Update DOM ID
    let newIdx = 0
    for (let i = 0; i < shape.vertices.length / 5; i++) {
      let pointId = `${shape.shapeID}-${i}`
      let input = document.getElementById(pointId)
      let label = document.querySelector(`label[for='${pointId}']`)
      if (input) {
        input.setAttribute("id", `${shape.shapeID}-${newIdx}`)
        label.setAttribute("for", `${shape.shapeID}-${newIdx}`)
        newIdx++
      }
    }

    shape.vertices = newVertices

    // if the shape vertices is only 2 left, change the type to Line
    if (shape.vertices.length == 10) {
      shape.type = gl.LINES
    } else if (shape.vertices.length == 0) {
      // remove the shape from the DOM
      let input = document.getElementById(shape.shapeID)
      let label = document.querySelector(`label[for='${shape.shapeID}']`)
      input.remove()
      label.remove()

      // remove the shape from the selectedShapes
      let index = selectedShapes.indexOf(shape.shapeID.toString())
      if (index !== -1) {
        selectedShapes.splice(index, 1)
      }

      // remove the shape from the shapes
      let shapeIndex = shapes.indexOf(shape)

      if (shapeIndex !== -1) {
        shapes.splice(shapeIndex, 1)
      }
    }
  })

  // remove the input and label if it is selected
  selectedShapes.forEach((shapeId) => {
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

  // reset selected shapeects and points
  selectedPoints = []
  selectedShapes = []
})

// Shape Button Listener
var navLinks = document.querySelectorAll(".nav-link")
navLinks.forEach(function (navLink) {
  navLink.addEventListener("click", function (event) {
    event.preventDefault()
    isDrawingPolygon = false
    shapes.forEach((shape) => {
      shape.isDone = true
    })
    navLinks.forEach(function (navLink) {
      navLink.classList.remove("active")
    })
    this.classList.add("active")
  })
})

// Canvas Listener to Initialize Polygon Drawing
canvas.addEventListener("click", (event) => {
  let activeNav = document.querySelector(".nav-link.active").id
  if (activeNav == "Polygon" && !isDrawingPolygon) {
    let shape
    shape = new Polygon(shapeIdx, gl)
    isDrawingPolygon = true
    if (shape) {
      shape.initDraw(canvas, event)
      shapes.push(shape)
    }
    shapeIdx++
  }
})

// Canvas Listener to Initialize Shape Drawing
canvas.addEventListener("mousedown", (event) => {
  let activeNav = document.querySelector(".nav-link.active").id
  if (activeNav == "Polygon") return
  let shape
  switch (activeNav) {
    case "Line":
      shape = new Line(shapeIdx, gl)
      break
    case "Square":
      shape = new Square(shapeIdx, gl)
      break
    case "Rectangle":
      shape = new Rectangle(shapeIdx, gl)
      break
    case "Polygon":
      break
    default:
      console.log("Unknown shape selected")
      break
  }
  if (shape) {
    shape.initDraw(canvas, event)
    shapes.push(shape)
    shapeIdx++
  }
})

// Transform Shape Listener
// Scale Listener
document.querySelector("#scaling").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    shapes[selectedShapes[i]].params.scale = value
  }
})

// Transform-X Slider Listener
document.querySelector("#x-transform").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    shapes[selectedShapes[i]].params.xTransform = value
  }
})

// Transform-Y Slider Listener
document.querySelector("#y-transform").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    shapes[selectedShapes[i]].params.yTransform = value
  }
})

// Rotation Slider Listener
document.querySelector("#rotation").addEventListener("input", (event) => {
  let value = parseFloat(event.target.value)
  for (let i = 0; i < selectedShapes.length; i++) {
    shapes[selectedShapes[i]].params.rotation = value
  }
})

// Translation X Listener
document.querySelector("#x-translate").addEventListener("input", (event) => {
  let value = event.target.value
  // for selected shapes
  for (let i = 0; i < selectedShapes.length; i++) {
    shapes[selectedShapes[i]].params.translation[0] = value
  }
  // for selected point
  for (let i = 0; i < selectedPoints.length; i++) {
    let shapeId = selectedPoints[i].split("-")[0]
    let pointIdx = parseInt(selectedPoints[i].split("-")[1])
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == shapeId && !selectedShapes.includes(shapeId)) {
        shapes[j].vertices[pointIdx * 5] = parseFloat(value)
      }
    }
  }
})

// Translation Y Listener
document.querySelector("#y-translate").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    shapes[selectedShapes[i]].params.translation[1] = value
  }
  // for selected point
  for (let i = 0; i < selectedPoints.length; i++) {
    let shapeId = selectedPoints[i].split("-")[0]
    let pointIdx = parseInt(selectedPoints[i].split("-")[1])
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == shapeId && !selectedShapes.includes(shapeId)) {
        shapes[j].vertices[pointIdx * 5 + 1] = parseFloat(value)
      }
    }
  }
})

// Shearing X Slider Listener
document.querySelector("#x-shear").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    shapes[selectedShapes[i]].params.shear[0] = value
  }
})

// Shearing Y Slider Listener
document.querySelector("#y-shear").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    shapes[selectedShapes[i]].params.shear[1] = value
  }
})

// Color Listener
document.querySelector("#objectcolor").addEventListener("input", (event) => {
  let color = event.target.value
  let r = parseInt(color.substring(1, 3), 16) / 255
  let g = parseInt(color.substring(3, 5), 16) / 255
  let b = parseInt(color.substring(5, 7), 16) / 255
  for (let i = 0; i < shapes.length; i++) {
    for (let j = 0; j < selectedPoints.length; j++) {
      let shapeId = selectedPoints[j].split("-")[0]
      let pointIdx = parseInt(selectedPoints[j].split("-")[1])
      if (shapes[i].shapeID == shapeId) {
        shapes[i].vertices[pointIdx * 5 + 2] = r
        shapes[i].vertices[pointIdx * 5 + 3] = g
        shapes[i].vertices[pointIdx * 5 + 4] = b
      }
    }
  }
})

// Animation Listener
document.getElementById("animate").onclick = () => {
  animate = !animate
  for (let i = 0; i < selectedShapes.length; i++) {
    shapes[selectedShapes[i]].animate = animate
    if (animate) {
      shapes[selectedShapes[i]].animateShape()
    }
  }
}
