var lastUpdate = Date.now();
function animate() {
    requestAnimationFrame(animate)
    var now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    runtime()
}
animate()