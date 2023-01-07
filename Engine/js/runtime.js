var lastUpdate = Date.now();
// screen shake factors
var shaking = false
var shakeFactor = 10

var frame = 0
function animate() {
    requestAnimationFrame(animate)
    var now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;

    updateStat("framerate", Math.round((1000/dt)/2)*2)

    ctx.save()
    // screen shake
    if (shaking) {
        ctx.translate(Math.random() < 0.5 ? -Math.random()*shakeFactor : Math.random()*shakeFactor, Math.random() < 0.5 ? -Math.random()*shakeFactor : Math.random()*shakeFactor)
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    runtime()

    ctx.restore()
    frame++
}
animate()