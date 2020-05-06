import Ball from '../sprites/Ball'
import Hoop from '../sprites/Hoop'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.score = 0
    this.scoreText = this.add
      .text(this.width / 2, this.height / 2 - 510, `${this.score}`, {
        fontSize: 120,
        color: '#efefef',
        align: 'center',
      })
      .setOrigin(0.5)
    this.scoreText.setShadow(2, 2, '#555', 2, true, true)
    this.particles = this.add.particles('ball')

    this.particles.createEmitter({
      angle: { min: 240, max: 300 },
      speed: { min: 400, max: 1200 },
      quantity: { min: 8, max: 12 },
      lifespan: 4000,
      alpha: { start: 1, end: 0 },
      scale: { min: 0.05, max: 0.4 },
      rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
      gravityY: 1200,
      on: false,
    })

    this.ball = new Ball(this)
    this.hoop = new Hoop(this)
    this.input.on('pointerup', ({ downX, downY, upX, upY }) => {
      const diffX = upX - downX
      const diffY = downY - upY
      if (diffY > 250) {
        this.ball.shoot(diffX / 40)
      }
    })

    this.setScore = (score) => {
      this.score = score
      this.scoreText.setText(score)
      this.particles.emitParticleAt(this.ball.x, this.ball.y)
    }
  }

  update() {
    if (this.hoop.rim.visible && this.ball.y > this.height + 400) {
      this.hoop.rim.setDepth(-10)
      this.ball.reset()
    }
    if (this.ball.body.isSensor && this.ball.body.velocity.y > 0) {
      this.hoop.rim.setDepth(10)
      this.ball.setSensor(false)
    }
  }
}
