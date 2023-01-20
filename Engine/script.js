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

    if (key == "ArrowLeft") {
        velocity[5] = 1
    } else if (key == "ArrowRight") {
        velocity[5] = -1
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
    if ((key == "ArrowLeft" && velocity[5] == 1) || (key == "ArrowRight" && velocity[5] == -1)) {
        velocity[5] = 0
    }
}
function click(position) {
    // console.log(planeLineIntersect(C3D(sphereCamera.position.position.x, -sphereCamera.focalLength + sphereCamera.position.position.y, sphereCamera.position.position.z), C3D(sphereCamera.position.position.x + mousePosition.x, sphereCamera.position.position.y, sphereCamera.position.position.z + mousePosition.y), 0, 10, 0, 0, 0, 0))
    // sphereScene.props.push(generateSphere(planeLineIntersect(C3D(sphereCamera.position.position.x, -sphereCamera.focalLength + sphereCamera.position.position.y, sphereCamera.position.position.z), C3D(sphereCamera.position.position.x + mousePosition.x - canvas.width/2, sphereCamera.position.position.y, sphereCamera.position.position.z + canvas.height/2 - mousePosition.y), 0, 10, 0, 0, 0, 0), 10, 15, 15, "blue"))
    // newPos = [planeLineIntersect(C3D(sphereCamera.position.position.x, -sphereCamera.focalLength + sphereCamera.position.position.y, sphereCamera.position.position.z), C3D(sphereCamera.position.position.x + mousePosition.x - canvas.width/2, sphereCamera.position.position.y, sphereCamera.position.position.z + canvas.height/2 - mousePosition.y), 0, 10, 0, 0, 0, 0).position.x, planeLineIntersect(C3D(sphereCamera.position.position.x, -sphereCamera.focalLength + sphereCamera.position.position.y, sphereCamera.position.position.z), C3D(sphereCamera.position.position.x + mousePosition.x - canvas.width/2, sphereCamera.position.position.y, sphereCamera.position.position.z + canvas.height/2 - mousePosition.y), 0, 10, 0, 0, 0, 0).position.z]
    // sphereScene.props[1].move((spherePosition[0] - newPos[0]), 0, spherePosition[1] - newPos[1])
    // spherePosition = newPos
    // console.log(spherePosition)
    // printTo("Click detected at: [" + Math.round(position[0]) + "," + Math.round(position[1]) + "]")
}

// speed for debug console printing
setPrintTime(30)

function project(point, camera) {
    p = new Cartesian3D(point.position.x, point.position.y, point.position.z)
    
    p.move(-camera.position.position.x, -camera.position.position.y + camera.focalLength, -camera.position.position.z)
    p = rotatePoint(p, -camera.xRot, -camera.yRot, -camera.zRot)
    distanceX = p.position.x
    distanceZ = p.position.z

    distanceX *= camera.focalLength/(p.position.y + camera.focalLength)
    distanceZ *= camera.focalLength/(p.position.y + camera.focalLength)

    return camera.focalLength/(p.position.y + camera.focalLength) <= 0 ? false : new Cartesian2D(distanceX*10 + canvas.width/2, canvas.height/2 - distanceZ*10)
}

function planeLineIntersect(p1, p2, planeX, planeY, planeZ, planeXRot, planeYRot, planeZRot) {
    point1 = new Cartesian3D(p1.position.x, p1.position.y, p1.position.z)
    point2 = new Cartesian3D(p2.position.x, p2.position.y, p2.position.z)
    point1.move(-planeX, -planeY, -planeZ)
    point2.move(-planeX, -planeY, -planeZ)

    point1 = rotatePoint(point1, -planeXRot, -planeYRot, -planeZRot)
    point2 = rotatePoint(point2, -planeXRot, -planeYRot, -planeZRot)

    point2.move(-point1.position.x, -point1.position.y, -point1.position.z)

    result = rotatePoint(new Cartesian3D(point2.position.x, 0, point2.position.z), planeXRot, planeYRot, planeZRot)
    result.move(planeX, planeY, planeZ)
    
    return result
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
            let renderVertex = project(vertex, camera)
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

    move(x, y, z) {
        this.position.move(x, y, z)
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

function rotatePoint(point, xRot, yRot, zRot) {
    p = new Cartesian3D(point.position.x, point.position.y, point.position.z)
    yz = Math.atan2(p.position.z, p.position.y)
    yzr = distance(new Cartesian2D(), new Cartesian2D(p.position.y, p.position.z))
    yz += xRot
    p.position.y = Math.cos(yz) * yzr
    p.position.z = Math.sin(yz) * yzr
    // console.log(yz, yzr)

    xz = Math.atan2(p.position.z, p.position.x)
    xzr = distance(new Cartesian2D(), new Cartesian2D(p.position.x, p.position.z))
    xz += yRot
    p.position.x = Math.cos(xz) * xzr
    p.position.z = Math.sin(xz) * xzr
    // console.log(xz, xzr)

    xy = Math.atan2(p.position.y, p.position.x)
    xyr = distance(new Cartesian2D(), new Cartesian2D(p.position.x, p.position.y))
    xy += zRot
    p.position.x = Math.cos(xy) * xyr
    p.position.y = Math.sin(xy) * xyr
    // console.log(xy, xyr)

    return p
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
    constructor(x, y, z, xRot=0, yRot=0, zRot=0, focalLength) {
        this.position = new Cartesian3D(x, y, z)
        this.focalLength = focalLength
        this.xRot = xRot
        this.yRot = yRot
        this.zRot = zRot
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

function findIntersection(point1, point2, infinitive, planeX, planeY, planeZ, planeRotationX, planeRotationY, planeRotationZ, planeWidth, planeHeight) {
    buffers = [Object.assign(Object.create(Object.getPrototypeOf(point1)), point1), Object.assign(Object.create(Object.getPrototypeOf(point2)), point2)]
    buffers.forEach((p) => {
        p.position.x -= planeX
        p.position.y -= planeY
        p.position.z -= planeZ

        rotX = atan2(p.position.y, p.position.z)
        rotY = atan2(p.position.z, p.position.x)
        rotZ = atan2(p.position.y, p.position.x)

        rotX -= planeRotationX
        rotY -= planeRotationY
        rotZ -= planeRotationZ

        r = distance(p, new Cartesian3D())
        step1 = new Cartesian3D(r*Math.cos(rotZ), r*Math.sin(rotZ), 0)
        step2 = new Cartesian3D(r*Math.cos(rotZ)*Math.cos(rotY), r*Math.sin(rotZ), r*Math.cos(rotZ)*Math.sin(rotY))
        s3Rot = Math.atan2(r*Math.cos(rotZ)*Math.sin(rotY), r*Math.sin(rotZ))
        step3 = new Cartesian3D(r*Math.cos(rotZ)*Math.cos(rotY), Math.cos(s3Rot+rotX)*distance(new Cartesian2D(r*Math.sin(rotZ), r*Math.cos(rotZ)*Math.sin(rotY)), Math.sin(s3Rot+rotX)*distance(new Cartesian2D(r*Math.sin(rotZ), r*Math.cos(rotZ)*Math.sin(rotY)))))
    })
    // t = -buffers[0].position.y/(buffers[1].position.y - buffers[0].position.y)
    // m = buffers[1].position.x - buffers[0].position.x
    // n = buffers[1].position.z - buffers[0].position.z

    // x = m*t + buffers[0].position.x
    // z = n*t + buffers[0].position.z

    // return new Cartesian3D(x*Math.cos(planeRotationTheta) + planeX, x*Math.sin(planeRotationTheta) + planeY, )
}

var orbitRadius = 50
var sphereCamera = new Camera(0, 10, 0, 0, 0, 0, 100)
var sphereLight = new Light("omni", 1, new Cartesian3D(0, 0, 0))
pointerSphere = generateSphere(C3D(0, 17, 0), 15, 15, 15, "red")
plane = new Prop([])
for (x=-100;x<=100;x+=4) {
    for (y=-100;y<=100;y+=4) {
        plane.faces.push(F([C3D(x, 20, y), C3D(x+4, 20, y), C3D(x+4, 20, y+4), C3D(x, 20, y+4)], "white"))
    }
}
var sphereScene = new Scene([plane, pointerSphere], sphereCamera, [sphereLight])
var velocity = [0, 0, 0, 0, 0, 0]
var speed = 0.01
var lightOrbit = 0
var rotSpeed = 0.02
var spherePosition = [0, 0]
function runtime() {
    // clear screen
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    sphereCamera.xRot += velocity[3]*rotSpeed
    sphereCamera.yRot += velocity[4]*rotSpeed
    sphereCamera.zRot += velocity[5]*rotSpeed

    sphereScene.render()

    sphereCamera.position.position.x += velocity[0]*speed*dt
    sphereCamera.position.position.y += velocity[1]*speed*dt
    sphereCamera.position.position.z += velocity[2]*speed*dt

    updateStat("camera", `(${Math.round(sphereCamera.position.position.x)}, ${Math.round(sphereCamera.position.position.y)}, ${Math.round(sphereCamera.position.position.z)}) // (${Math.round(sphereCamera.xRot*180/Math.PI)}, ${Math.round(sphereCamera.yRot*180/Math.PI)}, ${Math.round(sphereCamera.zRot*180/Math.PI)})`)
    updateStat("faces", sphereScene.props[0].faces.length)

    // console.log(C3D(sphereCamera.position.position.x, -sphereCamera.focalLength + sphereCamera.position.position.y, sphereCamera.position.position.z), C3D(sphereCamera.position.position.x + mousePosition.x, sphereCamera.position.position.y, sphereCamera.position.position.z + mousePosition.y), 0, 10, 0, 0, 0, 0)

    // sphereLight.position.move((Math.cos(lightOrbit) * orbitRadius - Math.cos(lightOrbit - 0.02) * orbitRadius)*dt/30, (Math.sin(lightOrbit) * orbitRadius - Math.sin(lightOrbit - 0.02) * orbitRadius)*dt/30, 0)

    // sphereScene.props[1].move((Math.cos(lightOrbit) * orbitRadius - Math.cos(lightOrbit - 0.02) * orbitRadius)*dt/30, (Math.sin(lightOrbit) * orbitRadius - Math.sin(lightOrbit - 0.02) * orbitRadius)*dt/30, 0)
    
    newPos = [planeLineIntersect(C3D(sphereCamera.position.position.x, -sphereCamera.focalLength + sphereCamera.position.position.y, sphereCamera.position.position.z), C3D(sphereCamera.position.position.x + mousePosition.x - canvas.width/2, sphereCamera.position.position.y, sphereCamera.position.position.z + canvas.height/2 - mousePosition.y), 0, 10, 0, 0, 0, 0).position.x, planeLineIntersect(C3D(sphereCamera.position.position.x, -sphereCamera.focalLength + sphereCamera.position.position.y, sphereCamera.position.position.z), C3D(sphereCamera.position.position.x + mousePosition.x - canvas.width/2, sphereCamera.position.position.y, sphereCamera.position.position.z + canvas.height/2 - mousePosition.y), 0, 10, 0, 0, 0, 0).position.z]
    sphereLight.move(-(spherePosition[0] - newPos[0]), 0, -(spherePosition[1] - newPos[1]))
    spherePosition = newPos

    lightOrbit += 0.02
}