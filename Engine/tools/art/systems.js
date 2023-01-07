const width = 1024
const height = 1024
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
canvas.width = width
canvas.height = height
function resized() {
    scaleFactor = window.innerWidth/width > window.innerHeight/height ? window.innerHeight/height : window.innerWidth/width

    canvas.style.width = parseInt(width * scaleFactor) + "px"
    canvas.style.height = parseInt(height * scaleFactor) + "px"
}

resized()
ctx.imageSmoothingEnabled = false;
var dt

class StateMachine {
    constructor(initialState) {
        this.state = initialState
    }

    stateManager(state, ...others) {
        if (this.state == state) {
            others[0]()
        }
        
        for (let i=0; i<others.length/2; i++){
            if (this.state == others[(i)*2 + 1]) {
                others[(i+1)*2]()
            }
        }
    } 
}

var font = "regular"
var sizeMultiplier = 1
function fillPixelText(text, x, y) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillText(text, 0, 0)
    ctx.restore()
}

window.addEventListener("keydown", (event) => {
    keydown(event.key)
})

window.addEventListener("keyup", (event) => {
    keyup(event.key)
})

var mouseDown = false
window.addEventListener("mousedown", (event) => {
    var rect = canvas.getBoundingClientRect();

    mouseX = ((event.clientX - rect.left)/(window.innerWidth - rect.left*2))*canvas.width
    mouseY = ((event.clientY - rect.top)/(window.innerHeight - rect.top*2))*canvas.height

    click([mouseX, mouseY])
    mouseDown = true
})

window.addEventListener("mouseup", (event) => {
    mouseDown = false
})

let lastId
var mousePosition = {x:0, y:0}
window.addEventListener("mousemove", (event) => {
    var rect = canvas.getBoundingClientRect();

    clearInterval(lastId)
    lastId = setInterval(() => {
        mouseX = ((event.clientX - rect.left)/(window.innerWidth - rect.left*2))*canvas.width
        mouseY = ((event.clientY - rect.top)/(window.innerHeight - rect.top*2))*canvas.height
    
        mousePosition = {x:mouseX, y:mouseY}
    }, 1)
})

function distance(point1, point2) {
    return Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2)
}

function normalize(xy) {
    x = xy.x
    y = xy.y
    return x == 0 && y == 0 ? {x:0,y:0} : {x:x/Math.sqrt(x**2 + y**2), y:y/Math.sqrt(x**2 + y**2)}
}
