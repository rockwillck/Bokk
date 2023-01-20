dbConsole = document.getElementById("debug")

queue = []
function printTo(text) {
    textSplit = text.split("")
    queue.push(textSplit)
}

var printTime = 0
function setPrintTime(time) {
    printTime = time
    reloadDebug()
}

currentTix = 0
i = 0
function printing() {
    if (typeof currentText != "undefined") {
        currentText = queue[currentTix]
        if (i < currentText.length) {
            dbConsole.value += currentText[i]
            dbConsole.scrollTop = dbConsole.scrollHeight
            i++
        } else {
            if (currentTix < queue.length - 1) {
                i=0
                dbConsole.value += `
    `
                currentTix ++
            } else {
            }
        }
    }
}

statPrefix = {"framerate": "FPS: ", "faces":"# of Faces: ", "camera": "Camera: "}
function updateStat(stat, value) {
    document.getElementById("debug_" + stat).innerText = statPrefix[stat] + value
}

id = 0
function reloadDebug() {
    if (id != 0) {clearInterval(id)}
    id = setInterval(() => {printing()}, printTime)
}

function closeDebug(btn) {
    dbConsole.hidden = dbConsole.hidden ? false : true
    document.getElementById("debugInfo").hidden = dbConsole.hidden
    btn.innerText = dbConsole.hidden ? "O" : "X"
}

document.getElementById("close").addEventListener("mouseover", () => {
    document.getElementById("debugInfo").hidden = false
    document.getElementById("debugInfo").style.opacity = dbConsole.hidden ? 0 : 1
    setTimeout(() => {
        document.getElementById("debugInfo").style.opacity = 1
    }, 0)
})
document.getElementById("close").addEventListener("mouseleave", () => {
    document.getElementById("debugInfo").hidden = dbConsole.hidden
})