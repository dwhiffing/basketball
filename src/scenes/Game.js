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
    this.scoreText = this.add.text(
      this.width / 2 - 40,
      this.height / 2 - 570,
      '0',
      { fontSize: 120, color: '#efefef' },
    )
    this.scoreText.setShadow(2, 2, '#555', 2, true, true)

    this.ball = new Ball(this)
    this.hoop = new Hoop(this)
    this.score = 0
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
    }
  }

  update() {
    if (this.hoop.rim.visible && this.ball.y > this.height + 400) {
      this.hoop.rim.setVisible(false)
      this.ball.reset()
    }
    if (this.ball.body.isSensor && this.ball.body.velocity.y > 0) {
      this.hoop.rim.setVisible(true)
      this.ball.setSensor(false)
    }
  }
}
