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
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update()
        }
    }

    draw(screen, gameSize) {
        screen.clearRect(0, 0, gameSize.x, gameSize.y)
        for (let i = 0; i < this.bodies.length; i++) {
            drawRect(screen, this.bodies[i])
        }
    }

    addBody (body) {
        this.bodies.push(body)
    }
}

class Enemy {
    constructor (game, center) {
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
    for (let i = 0; i < 5; i++) {
        let x = Math.random() * 300
        let y = -30
        enemies.push(new Enemy(game, { x: x, y: y}))
    }
    return enemies
}

class Player {
    constructor (game, gameSize) {
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
        if (this.center.x < 0 || this.center.x > 300) {
            
        }
    }
}

class Bullet {
    constructor (center, velocity) {
        this.center = center
        this.size = { x: 5, y: 8 }
        this.velocity = velocity
        this.ticks = 0

    }
    update() {
        this.ticks += 1
        if (this.ticks % 4 === 0) {
            this.center.x += this.velocity.x
            this.center.y += this.velocity.y - 20
        }
    }
}

function drawRect (screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
        body.size.x, body.size.y)
}

window.addEventListener('load', function () {
    new Game()
})