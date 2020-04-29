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
    this.ball = new Ball(this)
    this.hoop = new Hoop(this)
    this.input.on('pointerdown', this.ball.shoot)
  }

  update() {
    if (this.ball.y > this.height + 400) {
      this.hoop.rim.setVisible(false)
      this.ball.reset()
    }
    if (this.ball.body.isSensor && this.ball.body.velocity.y > 0) {
      this.hoop.rim.setVisible(true)
      this.ball.setSensor(false)
    }
  }
}
