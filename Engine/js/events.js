var applet = false
// event handlers, actual handlers are in systems file
window.addEventListener('pywebviewready', function() {
    pywebview.api.ready()
    applet = true
})

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