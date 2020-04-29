import { BALL } from '../constants'

export default class extends Phaser.Physics.Matter.Sprite {
  constructor(scene) {
    super(scene.matter.world, 0, scene.height - 50, 'ball')
    scene.add.existing(this)
    this.scene = scene
    this.reset = this.reset.bind(this)
    this.shoot = this.shoot.bind(this)
    this.isFirst = true
    this.setVisible(false)
      .setCircle()
      .setFriction(BALL.friction)
      .setBounce(BALL.bounce)
  }

  reset() {
    this.setScale(BALL.backgroundScale)
      .setAngularVelocity(0)
      .setVelocity(0, 0)
      .setIgnoreGravity(true)
      .setVisible(true)

    if (this.scene.missed) {
      this.scene.setScore(0)
    }

    this.scene.missed = true
    this.canShoot = true

    this.scene.tweens.add({
      targets: this,
      x: this.isFirst
        ? this.scene.width / 2
        : Phaser.Math.RND.between(100, this.scene.width - 100),
      y: this.scene.height / 2 + 600,
      scale: BALL.foregroundScale,
      ease: 'Back.Out',
      duration: 300,
    })
    this.isFirst = false
  }

  shoot(x) {
    if (!this.canShoot) {
      return
    }
    this.canShoot = false
    this.setVelocity(x, BALL.impulseVelocity)
      .setIgnoreGravity(false)
      .setSensor(true)
      .setAngularVelocity(0.15)

    this.scene.tweens.add({
      targets: this,
      scale: BALL.backgroundScale,
      duration: BALL.scaleTweenDuration,
      ease: 'Sine.easeInOut',
    })
  }
}
