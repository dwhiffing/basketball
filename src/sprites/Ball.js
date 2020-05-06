import {
  FRICTION,
  BOUNCE,
  BACKGROUND_SCALE,
  FOREGROUND_SCALE,
  IMPULSE_VELOCITY,
  SCALE_TWEEN_DURATION,
} from '../constants'

export default class extends Phaser.Physics.Matter.Sprite {
  constructor(scene) {
    super(scene.matter.world, 0, scene.height - 50, 'ball')
    scene.add.existing(this)
    this.scene = scene
    this.reset = this.reset.bind(this)
    this.shoot = this.shoot.bind(this)
    this.setCollidesWith([this.scene.cat])
    this.setVisible(false)
      .setCircle()
      .setFriction(FRICTION)
      .setBounce(BOUNCE)
      .setScale(BACKGROUND_SCALE)
  }

  reset() {
    this.setScale(BACKGROUND_SCALE)
      .setAngularVelocity(0)
      .setVelocity(0, 0)
      .setIgnoreGravity(true)
      .setVisible(true)

    this.body.label = 'ball'

    if (!this.scene.hasScored) {
      this.scene.ui.resetScore()
    }

    this.canShoot = false
    const positionRange = Math.min(
      this.scene.width / 2 - 100,
      this.scene.ui.score * 50,
    )
    this.scene.tweens.add({
      targets: this,
      x: Phaser.Math.RND.between(
        this.scene.width / 2 - positionRange,
        this.scene.width / 2 + positionRange,
      ),
      y: this.scene.height / 2 + 600,
      scale: FOREGROUND_SCALE,
      onComplete: () => {
        this.scene.hasScored = false
        this.canShoot = true
      },
      ease: 'Back.Out',
      duration: 300,
    })
  }

  shoot(x) {
    if (!this.canShoot) {
      return
    }
    this.canShoot = false
    this.scene.hasScored = false
    this.setVelocity(x, IMPULSE_VELOCITY)
      .setIgnoreGravity(false)
      .setAngularVelocity(0.2)

    this.setCollidesWith([])
    this.scene.tweens.add({
      targets: this,
      scale: BACKGROUND_SCALE,
      duration: SCALE_TWEEN_DURATION,
      ease: 'Sine.easeInOut',
    })
  }
}
