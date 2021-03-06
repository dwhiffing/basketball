import Ball from '../sprites/Ball'
import Hoop from '../sprites/Hoop'
import Interface from '../sprites/Interface'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.ended = false
  }

  create() {
    this.difficulty = 0
    this.cat = this.matter.world.nextCategory()
    this.ui = new Interface(this)
  }

  start() {
    this.ball = new Ball(this)
    this.hoop = new Hoop(this)

    this.input.on('pointerup', ({ downX, downY, upX, upY }) => {
      const diffX = upX - downX
      const diffY = downY - upY
      if (diffY > 250) {
        this.hasShot = true
        this.ball.shoot(diffX / 40)
      }
    })
  }

  update() {
    if (this.ended || !this.ball || !this.ball.body || !this.hoop) {
      return
    }

    if (this.hoop.rim.visible && this.ball.y > this.height + 400) {
      this.hoop.rim.setDepth(-1)
      if (this.ui.time > 0) {
        this.hasShot = false
        this.ball.reset()
        this.hoop.reset()
      } else {
        this.ball.destroy()
        this.hoop.destroy()
        this.ended = true
        this.scene.start('Score', { score: this.ui.score })
      }
    }
    if (this.ball.body && this.ball.y < this.cameras.main.height / 4) {
      this.hoop.rim.setDepth(10)
      this.ball.setCollidesWith([this.cat])
    }
  }

  getDifficulty() {
    if (this.ui.score < 3) {
      return 0
    }

    if (this.ui.score < 10) {
      return 1
    }

    if (this.ui.score < 25) {
      return 2
    }

    if (this.ui.score < 40) {
      return 3
    }

    return 4
  }
}
