function keydown(key) {
    printTo(`"${key}" pressed`)

    if (key == "a") {
        velocity[0] = -1
    } else if (key == "d") {
        velocity[0] = 1
    }

    if (key == "w") {
        velocity[1] = 1
    } else if (key == "s") {
        velocity [1] = -1
    }

    if (key == "ArrowUp") {
        velocity[2] = 1
    } else if (key == "ArrowDown") {
        velocity[2] = -1
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

    if ((key == "ArrowUp" && velocity[2] == 1) || (key == "ArrowDown" && velocity[2] == -1)) {
        velocity[2] = 0
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
    constructor(x=0, y=0, z=0) {
        this.position = {x:x, y:y, z:z}
    }

    move(x, y, z) {
        this.position.x += x
        this.position.y += y
        this.position.z += z
    }
}

class Cartesian2D {
    constructor(x=0, z=0) {
        this.position = {x:x, z:z}
    }

    move(x, z) {
        this.position.x += x
        this.position.z += z
    }
}

class Face {
    constructor(vertices, color="gray") {
        this.vertices = vertices
        this.mid = {position:{x:0,y:0,z:0}}
        this.color = color
    }

    generateMid() {
        this.mid = {position:{x:0,y:0,z:0}}
        this.vertices.forEach((vertex) => {
            this.mid.position.x += vertex.position.x
            this.mid.position.y += vertex.position.y
            this.mid.position.z += vertex.position.z
        })
        this.mid.position.x /= this.vertices.length
        this.mid.position.y /= this.vertices.length
        this.mid.position.z /= this.vertices.length
    }

    render(camera, lights) {
        this.generateMid()
        ctx.beginPath()
        for (i=0;i<=this.vertices.length;i++) {
            let vertex = this.vertices[i%this.vertices.length]
            let renderVertex = project(renderBuffer(vertex, camera), camera.focalLength)
            if (renderVertex) {
                ctx.lineTo(renderVertex.position.x, renderVertex.position.z)
            }
        }
        ctx.closePath()
        // ctx.strokeStyle = "black"
        // ctx.lineWidth = 1
        // ctx.stroke()
        ctx.fillStyle = this.color
        ctx.fill()
        let alpha = 1
        lights.forEach((light) => {
            alpha -= light.modifier(this).mod
        })
        ctx.save()
        ctx.globalAlpha = alpha < 0 ? 0 : alpha
        ctx.fillStyle = "black"
        ctx.fill()
        ctx.globalAlpha = alpha < 0 ? 1 : alpha > 1 ? 0 : (1-alpha)
        lights.forEach((light) => {
            ctx.fillStyle = light.modifier(this).tint
            ctx.fill()
        })
        ctx.restore()
    }

    move(x, y, z) {
        this.vertices.forEach((vertex) => {
            vertex.move(x, y, z)
        })
    }
}

class Light {
    constructor(type="omni", brightness, position, tint="white") {
        this.type = type
        this.brightness = brightness
        this.position = position
        this.tint = tint
    }

    modifier(face) {
        if (this.type == "omni") {
            return {mod:(1-distance(this.position, face.mid)/100)*this.brightness, tint:this.tint}
        }
    }
}

class Prop {
    constructor(faces) {
        this.faces = faces
    }

    move(x, y, z) {
        this.faces.forEach((face) => {
            face.move(x, y, z)
        })
    }
}

class Scene {
    constructor(props, camera, lights=[new Light("omni", 0.6, new Cartesian3D(0, 0, 5))]) {
        this.props = props
        this.camera = camera
        this.lights = lights
    }

    render() {
        let faces = []
        this.props.forEach((prop) => {
            // prop.render(this.camera, this.lights)
            faces = faces.concat(prop.faces)
        })
        faces.sort((a, b) => {
            return distance(new Cartesian3D(0, -this.camera.focalLength, 0), b.mid) - distance(new Cartesian3D(0, -this.camera.focalLength, 0), a.mid)
        })
        faces.forEach((face) => {
            face.render(this.camera, this.lights)
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
function F(vertices, color) {
    return new Face(vertices, color)
}

function generateSphere(center, radius, horizResolution, vertResolution, color="white") {
    var sphere = new Prop([])
    var r = radius

    horizResolution = Math.floor(horizResolution/2)*2
    vertResolution = Math.floor(horizResolution/2)*2
    // for (theta=0;theta<360;theta+=360/horizResolution) {
    //     face = []
    //     for (phi=0;phi<360;phi+=1) {
    //         thetaRad = theta * Math.PI/180
    //         phiRad = phi * Math.PI/180
    //         face.push(C3D(r*Math.sin(phiRad)*Math.cos(thetaRad), r*Math.sin(phiRad)*Math.sin(thetaRad), r*Math.cos(phiRad)))
    //     }
    //     sphere.push(F(face))
    // }
    

    for (phi=0;phi<360;phi+=360/vertResolution) {
        for (theta=0;theta<360;theta+=360/horizResolution) {
            theta2 = theta + 360/horizResolution
            phi2 = phi + 360/vertResolution
            thetaRad = theta * Math.PI/180
            phiRad = phi * Math.PI/180
            thetaRad2 = theta2 * Math.PI/180
            phiRad2 = phi2 * Math.PI/180
            sphere.faces.push(new Face([new Cartesian3D(r*Math.sin(phiRad)*Math.cos(thetaRad) + center.position.x, r*Math.sin(phiRad)*Math.sin(thetaRad) + center.position.y, r*Math.cos(phiRad) + center.position.z), C3D(r*Math.sin(phiRad2)*Math.cos(thetaRad) + center.position.x, r*Math.sin(phiRad2)*Math.sin(thetaRad) + center.position.y, r*Math.cos(phiRad2) + center.position.z), C3D(r*Math.sin(phiRad2)*Math.cos(thetaRad2) + center.position.x, r*Math.sin(phiRad2)*Math.sin(thetaRad2) + center.position.y, r*Math.cos(phiRad2) + center.position.z), C3D(r*Math.sin(phiRad)*Math.cos(thetaRad2) + center.position.x, r*Math.sin(phiRad)*Math.sin(thetaRad2) + center.position.y, r*Math.cos(phiRad) + center.position.z)], color))
        }
    }

    return sphere
}

function findIntersection(point1, point2, infinitive, planeX, planeY, planeZ, planeRotationTheta, planeRotationPhi, planeWidth, planeHeight) {
    buffers = [Object.assign(Object.create(Object.getPrototypeOf(point1)), point1), Object.assign(Object.create(Object.getPrototypeOf(point2)), point2)]
    buffers.forEach((p) => {
        p.position.x -= planeX
        p.position.y -= planeY
        p.position.z -= planeZ
    
        rotTheta = atan2(p.position.y, p.position.x)
        rotTheta -= planeRotationTheta
        rotPhi = atan2(p.position.z, distance(new Cartesian3D(), p))
        rotPhi -= planeRotationPhi

        r = distance(new Cartesian3D(), p)

        p.position.x = Math.cos(rotTheta)*r
        p.position.y = Math.sin(rotTheta)*r
        p.position.z = Math.sin(rotPhi)*r
    })

    t = -buffers[0].position.y/(buffers[1].position.y - buffers[0].position.y)
    m = buffers[1].position.x - buffers[0].position.x
    n = buffers[1].position.z - buffers[0].position.z

    x = m*t + buffers[0].position.x
    z = n*t + buffers[0].position.z

    // return new Cartesian3D(x*Math.cos(planeRotationTheta) + planeX, x*Math.sin(planeRotationTheta) + planeY, )
}

var sphereCamera = new Camera(0, 0, 0, 50)
var sphereLight = new Light("omni", 5, new Cartesian3D(0, 0, 0), "white")
var sphereScene = new Scene([generateSphere(C3D(0, 0, 0), 10, 25, 25, "blue"), generateSphere(C3D(15, 0, 0), 0.5, 15, 15, "blue")], sphereCamera, [sphereLight])
var velocity = [0, 0, 0]
var speed = 0.01
var lightOrbit = 0
function runtime() {
    // clear screen
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    sphereScene.render()

    sphereCamera.position.position.x += velocity[0]*speed*dt
    sphereCamera.position.position.y += velocity[1]*speed*dt
    sphereCamera.position.position.z += velocity[2]*speed*dt

    updateStat("faces", sphereScene.props[0].faces.length)

    sphereLight.position.position.x = Math.cos(lightOrbit) * 100
    sphereLight.position.position.y = Math.sin(lightOrbit) * 100

    sphereScene.props[1].move(Math.cos(lightOrbit) * 15 - Math.cos(lightOrbit - 0.02) * 15, Math.sin(lightOrbit) * 15 - Math.sin(lightOrbit - 0.02) * 15, 0)
    lightOrbit += 0.02

    // sphere.forEach((face) => {
    //     face.render()
    // })
}