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
  }

  create() {
    this.cat = this.matter.world.nextCategory()
    this.ui = new Interface(this)
    this.ball = new Ball(this)
    this.hoop = new Hoop(this)

    this.input.on('pointerup', ({ downX, downY, upX, upY }) => {
      const diffX = upX - downX
      const diffY = downY - upY
      if (diffY > 250) {
        this.ball.shoot(diffX / 40)
      }
    })
  }

  update() {
    if (this.hoop.rim.visible && this.ball.y > this.height + 400) {
      this.hoop.rim.setDepth(-10)
      this.ball.reset()
    }
    if (this.ball.y < this.cameras.main.height / 4) {
      this.hoop.rim.setDepth(10)
      this.ball.setCollidesWith([this.cat])
    }
  }
}
