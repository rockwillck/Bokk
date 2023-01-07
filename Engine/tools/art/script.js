var keys = ["e", "b", "c"]
cCount = 0
var keysDown = []
// event handlers, actual handlers are in systems file
function keydown(key) {
    if (keys.includes(key.toLowerCase())) {
        mode = key.toLowerCase()
    }
    keysDown.push(key)
}
function keyup(key) {
    keysDown.splice(keysDown.findIndex((k) => {k == key}), 1)
}
function click(position) {
}

var metaMouse = {x:0,y:0}
window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    mode = "meta"
    metaMouse = mousePosition
})

dimensions = 50
var grid = []
for (x=0;x<dimensions;x++){
    row = []
    for (y=0;y<dimensions;y++) {
        row.push("transparent")
    }
    grid.push(row)
}
currentMouse = [0, 0]
var mode = "b"
var angle = 0
var dragging = false
var color = "black"
function runtime() {
    dragging = mouseDown ? dragging : false
    for (x=0;x<dimensions;x++) {
        // ctx.beginPath()
        // ctx.moveTo(x*canvas.width/dimensions, 0)
        // ctx.lineTo(x*canvas.width/dimensions, canvas.height)
        // ctx.closePath()
        // ctx.stroke()
        for (y=0;y<dimensions;y++) {
            // ctx.beginPath()
            // ctx.moveTo(0, y*canvas.height/dimensions)
            // ctx.lineTo(canvas.width, y*canvas.height/dimensions)
            // ctx.closePath()
            // ctx.stroke()
            ctx.fillStyle = grid[x][y]
            ctx.fillRect(x*canvas.width/dimensions, y*canvas.height/dimensions, canvas.width/dimensions, canvas.height/dimensions)
            if (mousePosition.x >= x*canvas.width/dimensions && mousePosition.x < (x+1) * canvas.width/dimensions && mousePosition.y >= y*canvas.height/dimensions && mousePosition.y < (y+1) * canvas.height/dimensions) {
                if (mode == "b") {
                    ctx.fillStyle = "black"
                } else if (mode == "e") {
                    ctx.globalAlpha = 0.2
                    ctx.fillStyle = grid[x][y]
                }
                ctx.fillRect(x*canvas.width/dimensions, y*canvas.height/dimensions, canvas.width/dimensions, canvas.height/dimensions)
                if (mode == "e") {
                    ctx.globalAlpha = 1
                }
                currentMouse = [x, y]
                if (mouseDown) {
                    if (mode == "b" || mode == "e") {
                        grid[x][y] = mode == "b" ? color : "transparent"
                    }
                }
            }
        }  
    }

    if (mode == "c") {
        cCount += 1
        if (cCount >= 2) {
            grid = []
            for (x=0;x<dimensions;x++){
                row = []
                for (y=0;y<dimensions;y++) {
                    row.push("transparent")
                }
                grid.push(row)
            }
            cCount = 0
        } else {
            alert("press C again to confirm")
        }
        mode = "b"
    } else if (mode == "meta") {
        ctx.fillStyle = "rgb(50, 50, 50)"
        ctx.fillRect(metaMouse.x, metaMouse.y, 350, 500)
        for (deg=0;deg<(360);deg+=0.1) {
            i = deg % 360
            if (0 <= i && i <= 120) {
                ctx.strokeStyle = `rgb(${255*i/120}, ${255*(1-i/120)}, 0)`
            } else if (120 < i && i <= 240) {
                ctx.strokeStyle = `rgb(${255*(1-(i - 120)/120)}, 0, ${255*(i-120)/120})`
            } else if (240 < i && i <= 360) {
                ctx.strokeStyle = `rgb(0, ${255*(i-240)/120}, ${255*(1-(i-240)/120)})`
            }
            ctx.beginPath()
            ctx.moveTo(metaMouse.x + 175 + Math.cos(i*Math.PI/180)*50, metaMouse.y + 325 + Math.sin(i*Math.PI/180)*50)
            ctx.lineTo(metaMouse.x + 175 + Math.cos(i*Math.PI/180)*100, metaMouse.y + 325 + Math.sin(i*Math.PI/180)*100)
            ctx.closePath()
            ctx.stroke()
        }

        if (dragging || (distance({x:metaMouse.x + 175 + Math.cos(angle)*135, y:metaMouse.y + 325 + Math.sin(angle)*135}, mousePosition) <= 20 && mouseDown)) {
            dragging = true
            angle = Math.atan2(mousePosition.y - (metaMouse.y + 325), mousePosition.x - (metaMouse.x + 175))
        }
        
        i = ((Math.PI*2 + angle) % (Math.PI*2)) * 180/Math.PI
        if (0 <= i && i <= 120) {
            ctx.fillStyle = `rgb(${255*i/120}, ${255*(1-i/120)}, 0)`
        } else if (120 < i && i <= 240) {
            ctx.fillStyle = `rgb(${255*(1-(i - 120)/120)}, 0, ${255*(i-120)/120})`
        } else if (240 < i && i <= 360) {
            ctx.fillStyle = `rgb(0, ${255*(i-240)/120}, ${255*(1-(i-240)/120)})`
        }
        color = ctx.fillStyle
        ctx.beginPath()
        ctx.arc(metaMouse.x + 175 + Math.cos(angle)*135, metaMouse.y + 325 + Math.sin(angle)*135, 20, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}