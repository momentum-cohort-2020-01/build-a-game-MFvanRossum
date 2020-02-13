class Game {
    constructor() {
        let canvas = document.getElementById('pixel-war')
        let screen = canvas.getContext('2d')
        let gameSize = { x: canvas.width, y: canvas.height }
        this.bodies = []
        this.bodies = this.bodies.concat(createEnemies(this))
        this.bodies = this.bodies.concat(new Player(this, gameSize))
        let tick = () => {
            this.update()
            this.draw(screen, gameSize)
            requestAnimationFrame(tick)
        }
        tick()
    }
    update() {
        let notColliding = (b1) => {
            return this.bodies.filter(function (b2) { return colliding(b1, b2) }).length === 0
        }
        let canvas = document.getElementById('pixel-war')
        this.bodies = this.bodies.filter(notColliding)
        this.bodies = this.bodies.filter(body => body.center.y >= 0 - 50)
        this.bodies = this.bodies.filter(body => body.center.y <= canvas.height + 50)
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update()
        }
        // let intervalInMilliseconds = 5000
        // setInterval(createEnemies, intervalInMilliseconds)
    }

    draw(screen, gameSize) {
        screen.clearRect(0, 0, gameSize.x, gameSize.y)
        for (let i = 0; i < this.bodies.length; i++) {
            drawRect(screen, this.bodies[i])
        }
    }

    addBody(body) {
        let isColliding = this.bodies.some(otherBody => colliding(body, otherBody) && body.prototype === otherBody.prototype)
        if (!isColliding) {
            this.bodies.push(body)
        }
    }
}

class Enemy {
    constructor(game, center) {
        this.game = game
        this.center = center
        this.size = { x: 15, y: 20 }
        this.moveY = 0
        this.speedY = 1
    }
    update() {
        this.center.y += this.speedY
        this.moveY += this.speedY
    }
}

function createEnemies(game) {
    let enemies = []
    for (let i = 0; i < 10; i++) {
        let x = Math.random() * 300
        let y = -30
        let intervalInMilliseconds = 500
        setInterval(enemies.push(new Enemy(game, { x: x, y: y })), intervalInMilliseconds)
    }
    return enemies
}

class Player {
    constructor(game, gameSize) {
        this.game = game
        this.size = { x: 15, y: 15 }
        this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.y * 2 }

        this.keyboarder = Keyboarder
    }

    update() {
        if (this.center.x > 0) {
            if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                this.center.x -= 2
            }
        }
        if (this.center.x < 300) {
            if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                this.center.x += 2
            }
        }

        if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
            let bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.y - 10 },
                { x: 0, y: -7 })
            this.game.addBody(bullet)

        }
    }
}


class Bullet {
    constructor(center, velocity) {
        this.center = center
        this.size = { x: 5, y: 8 }
        this.velocity = velocity
        this.ticks = 0

    }
    update() {
        this.ticks += 1
        if (this.ticks % 4 === 0) {
            this.center.x += this.velocity.x
            this.center.y += this.velocity.y - 15
        }
    }
}

function drawRect(screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
        body.size.x, body.size.y)
}

function colliding(b1, b2) {
    return !(
        b1 === b2 ||
        b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
        b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
        b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
        b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
    )
}

window.addEventListener('load', function () {
    new Game()
})