function keydown(key) {
    printTo(`"${key}" pressed`)

    if (key == "a") {
        velocity[0] = -1
    } else if (key == "d") {
        velocity [0] = 1
    }

    if (key == "w") {
        velocity[1] = 1
    } else if (key == "s") {
        velocity [1] = -1
    }
}
function keyup(key) {
    printTo(`"${key}" released`)

    if ((key == "a" && velocity[0] == -1)) {
        velocity[0] = 0
    }
    if ((key == "d" && velocity[0] == 1)) {
        velocity[0] = 0
    }
    if ((key == "w" && velocity[1] == 1)) {
        velocity[1] = 0
    }
    if ((key == "s" && velocity[1] == -1)) {
        velocity[1] = 0
    }
}
function click(position) {
    printTo("Click detected at: [" + Math.round(position[0]) + "," + Math.round(position[1]) + "]")
}

// speed for debug console printing
setPrintTime(30)

function project(point, focalLength) {
    distanceX = point.position.x
    distanceZ = point.position.z

    distanceX *= focalLength/(point.position.y + focalLength)
    distanceZ *= focalLength/(point.position.y + focalLength)

    return focalLength/(point.position.y + focalLength) <= 0 ? false : new Cartesian2D(distanceX*10 + canvas.width/2, canvas.height/2 - distanceZ*10)
}

function renderBuffer(point, camera) {
    return new Cartesian3D(point.position.x - camera.position.position.x, point.position.y - camera.position.position.y, point.position.z - camera.position.position.z)
}

class Cartesian3D {
    constructor(x, y, z) {
        this.position = {x:x, y:y, z:z}
    }

    move(x, y, z) {
        this.position.x += x
        this.position.y += y
        this.position.z += z
    }
}

class Cartesian2D {
    constructor(x, z) {
        this.position = {x:x, z:z}
    }

    move(x, z) {
        this.position.x += x
        this.position.z += z
    }
}

class Face {
    constructor(vertices) {
        this.vertices = vertices
        this.mid = {x:0,y:0,z:0}
        this.vertices.forEach((vertex) => {
            this.mid.x += vertex.position.x
            this.mid.y += vertex.position.y
            this.mid.z += vertex.position.z
        })
        this.mid.x /= this.vertices.length
        this.mid.y /= this.vertices.length
        this.mid.z /= this.vertices.length
    }

    render(camera) {
        ctx.beginPath()
        for (i=0;i<=this.vertices.length;i++) {
            let vertex = this.vertices[i%this.vertices.length]
            let renderVertex = project(renderBuffer(vertex, camera), camera.focalLength)
            if (renderVertex) {
                ctx.lineTo(renderVertex.position.x, renderVertex.position.z)
            }
        }
        ctx.closePath()
        ctx.strokeStyle = "black"
        ctx.lineWidth = 1
        ctx.stroke()
    }

    move(x, y, z) {
        this.vertices.forEach((vertex) => {
            vertex.move(x, y, z)
        })
    }
}

class Prop {
    constructor(faces) {
        this.faces = faces
    }

    render(camera) {
        this.faces.forEach((face) => {
            face.render(camera)
        })
    }

    move(x, y, z) {
        this.faces.forEach((face) => {
            face.move(x, y, z)
        })
    }
}

class Scene {
    constructor(props, camera) {
        this.props = props
        this.camera = camera
    }

    render() {
        this.props.forEach((prop) => {
            prop.render(this.camera)
        })
    }
}

class Camera {
    constructor(x, y, z, focalLength) {
        this.position = new Cartesian3D(x, y, z)
        this.focalLength = focalLength
    }
}

function C3D(x, y, z) {
    return new Cartesian3D(x, y, z)
}
function C2D(x, z) {
    return new Cartesian2D(x, z)
}
function F(vertices) {
    return new Face(vertices)
}

function generateSphere(radius, horizResolution, vertResolution) {
    var sphere = []
    var r = radius
    for (theta=0;theta<360;theta+=360/horizResolution) {
        face = []
        for (phi=0;phi<360;phi+=1) {
            thetaRad = theta * Math.PI/180
            phiRad = phi * Math.PI/180
            face.push(C3D(r*Math.sin(phiRad)*Math.cos(thetaRad), r*Math.sin(phiRad)*Math.sin(thetaRad), r*Math.cos(phiRad)))
        }
        sphere.push(F(face))
    }
    
    
    for (phi=0;phi<360;phi+=360/vertResolution) {
        face = []
        for (theta=0;theta<360;theta+=1) {
            thetaRad = theta * Math.PI/180
            phiRad = phi * Math.PI/180
            face.push(C3D(r*Math.sin(phiRad)*Math.cos(thetaRad), r*Math.sin(phiRad)*Math.sin(thetaRad), r*Math.cos(phiRad)))
        }
        sphere.push(F(face))
    }

    return new Prop(sphere)
}

var sphereCamera = new Camera(0, 0, 0, 15)
var sphereScene = new Scene([generateSphere(10, 120, 120)], sphereCamera)
var velocity = [0, 0, 0]
var speed = 0.1
function runtime() {
    // clear screen
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    sphereScene.render()

    sphereCamera.position.position.x += velocity[0]*speed
    sphereCamera.position.position.y += velocity[1]*speed
    sphereCamera.position.position.z += velocity[2]*speed

    // sphere.forEach((face) => {
    //     face.render()
    // })
}