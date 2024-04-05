var shapes = []
var shapeIdx = 0
var isDrawingPolygon = false
var selectedShapes = []
var selectedPoints = []
var animate = false
var lockpolygonpoint = false

// Shape Checkbox Listener
document.querySelector(".shape-setting").addEventListener("change", (event) => {
  if (event.target.type === "checkbox") {
    let targetId = event.target.id
    let isChecked = event.target.checked

    if (targetId.includes("-")) {
      // Point checkbox
      if (isChecked) {
        // remove the point from the selectedPoints if it is from another shape
        selectedPoints = selectedPoints.filter(
          (pointId) => !pointId.startsWith(targetId.split("-")[0])
        )
        // uncheck all other point from the same shape that is not targetId
        let pointCheckboxes = document.querySelectorAll(
          `.shape-point-setting input[id^='${targetId.split("-")[0]}-']`
        )
        pointCheckboxes.forEach((checkbox) => {
          if (checkbox.id !== targetId) {
            checkbox.checked = false
          }
        })
        selectedPoints.push(targetId)
      } else {
        let index = selectedPoints.indexOf(targetId)
        if (index !== -1) {
          selectedPoints.splice(index, 1)
        }
      }
    } else {
      // Shape checkbox
      let pointCheckboxes = document.querySelectorAll(
        `.shape-point-setting input[id^='${targetId}-']`
      )
      pointCheckboxes.forEach((checkbox) => {
        checkbox.checked = isChecked
      })

      if (isChecked) {
        selectedShapes.push(targetId)
        pointCheckboxes.forEach((checkbox) => {
          if (!selectedPoints.includes(checkbox.id)) {
            selectedPoints.push(checkbox.id)
          }
        })
      } else {
        let index = selectedShapes.indexOf(targetId)
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

document.getElementById("union").onclick = () => {
  if (selectedShapes.length < 2) {
    alert("You need to select atleast 2 shapes")
    return
  }

  // Create the union shape
  let unionVertices = []
  let unionShape = new Polygon(shapeIdx, gl)
  selectedShapes.forEach((shapeId) => {
    let shape = shapes.find((shape) => shape.shapeID == shapeId)
    unionVertices.push(...shape.vertices)
  })
  unionShape.vertices = unionVertices
  unionShape.vertices = convexHull(unionShape.vertices)
  unionShape.isShapePointEditorCreated = true
  unionShape.isDone = true
  unionShape.createShapeEditor()
  unionShape.createPointEditor()
  shapes.push(unionShape)
  shapeIdx++

  // Remove the selected shapes
  shapes = shapes.filter(
    (shape) => !selectedShapes.includes(shape.shapeID.toString())
  )

  // Remove the input and label if it is selected
  selectedShapes.forEach((shapeId) => {
    let input = document.getElementById(shapeId)
    let label = document.querySelector(`label[for='${shapeId}']`)
    input.remove()
    label.remove()
  })

  // Remove the input and label if it is selected
  selectedPoints.forEach((pointId) => {
    let input = document.getElementById(pointId)
    let label = document.querySelector(`label[for='${pointId}']`)
    input.remove()
    label.remove()
  })

  // Reset selected shapeects and points
  selectedPoints = []
  selectedShapes = []
}

// Delete Button Listener
document.querySelector("#delete").addEventListener("click", () => {
  if (selectedShapes.length == 0 && selectedPoints.length == 0) {
    alert("You need to select atleast 1 shape or point")
    return
  }
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
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == selectedShapes[i]) {
        shapes[j].params.midPoint = findMidPoint(shapes[j].vertices)
        shapes[j].params.scale = value
      }
    }
  }
})

// Transform-X Slider Listener
document.querySelector("#x-transform").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == selectedShapes[i]) {
        shapes[j].params.midPoint = findMidPoint(shapes[j].vertices)
        shapes[j].params.xTransform = value
      }
    }
  }
})

// Transform-Y Slider Listener
document.querySelector("#y-transform").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == selectedShapes[i]) {
        shapes[j].params.midPoint = findMidPoint(shapes[j].vertices)
        shapes[j].params.yTransform = value
      }
    }
  }
})

// Rotation Slider Listener
document.querySelector("#rotation").addEventListener("input", (event) => {
  let value = parseFloat(event.target.value)
  for (let i = 0; i < selectedShapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == selectedShapes[i]) {
        shapes[j].params.midPoint = findMidPoint(shapes[j].vertices)
        shapes[j].params.rotation = value
      }
    }
  }
})

// Translation X Listener
document.querySelector("#x-translate").addEventListener("input", (event) => {
  let value = event.target.value
  // for selected shapes
  for (let i = 0; i < selectedShapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == selectedShapes[i]) {
        shapes[j].params.midPoint = findMidPoint(shapes[j].vertices)
        shapes[j].params.translation[0] = value
      }
    }
  }
  // for selected point
  for (let i = 0; i < selectedPoints.length; i++) {
    let shapeId = selectedPoints[i].split("-")[0]
    let pointIdx = parseInt(selectedPoints[i].split("-")[1])
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == shapeId && !selectedShapes.includes(shapeId)) {
        if (
          (shapes[j].shapeName == "Polygon" && !lockpolygonpoint) ||
          shapes[j].shapeName == "Line"
        ) {
          shapes[j].vertices[pointIdx * 5] = parseFloat(value)
        } else if (shapes[j].shapeName == "Rectangle") {
          shapes[j].vertices[pointIdx * 5] = parseFloat(value)
          shapes[j].vertices[(3 - pointIdx) * 5] = parseFloat(value)
        } else {
          let PointX = shapes[j].vertices[pointIdx * 5]
          let PointY = shapes[j].vertices[pointIdx * 5 + 1]
          shapes[j].params.midPoint = [PointX, PointY]
          shapes[j].params.scale = value
        }
      }
    }
  }
})

// Translation Y Listener
document.querySelector("#y-translate").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == selectedShapes[i]) {
        shapes[j].params.midPoint = findMidPoint(shapes[j].vertices)
        shapes[j].params.translation[1] = value
      }
    }
  }
  // for selected point
  for (let i = 0; i < selectedPoints.length; i++) {
    let shapeId = selectedPoints[i].split("-")[0]
    let pointIdx = parseInt(selectedPoints[i].split("-")[1])
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == shapeId && !selectedShapes.includes(shapeId)) {
        if (
          (shapes[j].shapeName == "Polygon" && !lockpolygonpoint) ||
          shapes[j].shapeName == "Line"
        ) {
          shapes[j].vertices[pointIdx * 5 + 1] = parseFloat(value)
        } else if (shapes[j].shapeName == "Rectangle") {
          shapes[j].vertices[pointIdx * 5 + 1] = parseFloat(value)
          shapes[j].vertices[pointIdx * 5 + (pointIdx % 2 == 0 ? 6 : -4)] =
            parseFloat(value)
        } else {
          let PointX = shapes[j].vertices[pointIdx * 5]
          let PointY = shapes[j].vertices[pointIdx * 5 + 1]
          shapes[j].params.midPoint = [PointX, PointY]
          shapes[j].params.scale = value
        }
      }
    }
  }
})

// Shearing X Slider Listener
document.querySelector("#x-shear").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == selectedShapes[i]) {
        shapes[j].params.midPoint = findMidPoint(shapes[j].vertices)
        shapes[j].params.shear[0] = value
      }
    }
  }
})

// Shearing Y Slider Listener
document.querySelector("#y-shear").addEventListener("input", (event) => {
  let value = event.target.value
  for (let i = 0; i < selectedShapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == selectedShapes[i]) {
        shapes[j].params.midPoint = findMidPoint(shapes[j].vertices)
        shapes[j].params.shear[1] = value
      }
    }
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
  if (selectedShapes.length == 0) {
    alert("You need to select atleast 1 shape")
    return
  }
  animate = !animate
  if (animate) {
    document.getElementById("animate").innerText = "Stop Animation"
  } else {
    document.getElementById("animate").innerText = "Animate"
  }
  for (let i = 0; i < selectedShapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == selectedShapes[i]) {
        shapes[j].params.midPoint = findMidPoint(shapes[j].vertices)
        shapes[j].animate = animate
        if (animate) {
          shapes[j].animateShape()
        }
      }
    }
  }
}

// Lock Polygon Point Listener
document.getElementById("lockpolygonpoint").onclick = () => {
  // change the lock text
  lockpolygonpoint = !lockpolygonpoint
  if (lockpolygonpoint) {
    document.getElementById("lockpolygonpoint").innerText =
      "Unlock Point (Polygon)"
  } else {
    document.getElementById("lockpolygonpoint").innerText =
      "Lock Point (Polygon)"
  }
}

// Save Listener
document.getElementById("save").onclick = () => {
  if (selectedShapes.length == 0) {
    alert("You need to select atleast 1 shape")
    return
  }
  let data = []
  for (let i = 0; i < selectedShapes.length; i++) {
    let shapeId = selectedShapes[i]
    for (let j = 0; j < shapes.length; j++) {
      if (shapes[j].shapeID == shapeId) {
        data.push(shapes[j].save())
      }
    }
  }
  var blob = new Blob([JSON.stringify(data)], {
    type: "text/plain;charset=utf-8"
  })
  var datenow = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
  var fileName = `shapes-${datenow}.json`
  var url = window.URL.createObjectURL(blob)
  var a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
}

// Load Listener
document.getElementById("load").onclick = () => {
  var input = document.createElement("input")
  input.type = "file"
  input.accept = "application/json"
  input.onchange = (event) => {
    var file = event.target.files[0]
    var reader = new FileReader()
    reader.onload = (event) => {
      var data = JSON.parse(event.target.result)
      for (let i = 0; i < data.length; i++) {
        let shape
        switch (data[i].shapeName) {
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
            shape = new Polygon(shapeIdx, gl)
            shape.isShapePointEditorCreated = true
            break
          default:
            console.log("Unknown shape selected")
            break
        }
        shape.load(data[i])
        shapes.push(shape)
        shapeIdx++
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

// Help listener
var modal = document.getElementById("modal-help")
document.getElementById("help").onclick = () => {
  modal.style.display = "block"
}

var span = document.getElementsByClassName("modal-close")[0]
span.onclick = () => {
  modal.style.display = "none"
}

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none"
  }
}
