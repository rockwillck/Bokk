var viewport = {width:1536, height:1024}
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
canvas.width = viewport.width
canvas.height = viewport.height
function resized() {
    scaleFactor = window.innerWidth/viewport.width > window.innerHeight/viewport.height ? window.innerHeight/viewport.height : window.innerWidth/viewport.width

    canvas.style.width = parseInt(viewport.width * scaleFactor) + "px"
    canvas.style.height = parseInt(viewport.height * scaleFactor) + "px"
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

function distance(point1, point2) {
    point1 = point1.position
    point2 = point2.position
    return typeof point1.y != "undefined" ? Math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2 + (point1.z - point2.z)**2) : Math.sqrt((point1.x - point2.x)**2 + (point1.z - point2.z)**2)
}

function normalize(xy) {
    xy = xy.position
    x = xy.x
    y = xy.y
    return x == 0 && y == 0 ? {x:0,y:0} : {x:x/Math.sqrt(x**2 + y**2), y:y/Math.sqrt(x**2 + y**2)}
}

function playSound(src) {
    if (applet) {
        pywebview.api.playSound(src)
    } else {
        audio = new Audio()
        audio.src = `audio/${src}`
        audio.play()
    }
}