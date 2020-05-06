import { RIM_SIZE, Y_OFFSET } from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    this.backboard = this.scene.add
      .image(this.scene.width / 2, this.scene.height / 2 - Y_OFFSET, 'hoop')
      .setScale(3)
      .setDepth(-1)

    this.rim = this.scene.add
      .image(
        this.scene.width / 2,
        this.scene.height / 2 - (Y_OFFSET - 150),
        'rim',
      )
      .setScale(3 * (RIM_SIZE / 150), 3)

    this.sensor = this.scene.matter.add.rectangle(
      this.scene.width / 2,
      this.scene.height / 2 - (Y_OFFSET - 240),
      RIM_SIZE * 1.5,
      50,
      {
        isStatic: true,
        isSensor: true,
      },
    )
    this.sensor.label = 'hoop'

    this.scene.matter.world.on('collisionactive', function (event) {
      const pair = event.pairs[0]
      let ball, hoop
      if (pair.bodyA.label === 'ball') {
        ball = pair.bodyA
      }
      if (pair.bodyB.label === 'ball') {
        ball = pair.bodyB
      }
      if (pair.bodyA.label === 'hoop') {
        hoop = pair.bodyA
      }
      if (pair.bodyB.label === 'hoop') {
        hoop = pair.bodyB
      }
      if (!ball || !hoop) {
        return
      }
      if (ball.velocity.y > 0 && hoop.isSensor && !this.scene.hasScored) {
        this.scene.ui.setScore(1)
        this.scene.hasScored = true
      }
    })

    this.rimL = this.scene.matter.add
      .image(
        this.scene.width / 2 - RIM_SIZE,
        this.scene.height / 2 - (Y_OFFSET - 148),
        'dot',
      )
      .setCircle()
      .setStatic(true)
      .setVisible(false)
      .setFriction(0.005)

    this.rimR = this.scene.matter.add
      .image(
        this.scene.width / 2 + RIM_SIZE,
        this.scene.height / 2 - (Y_OFFSET - 148),
        'dot',
      )
      .setCircle()
      .setStatic(true)
      .setVisible(false)
      .setFriction(0.005)

    this.rimR.setCollisionCategory(this.scene.cat)
    this.rimL.setCollisionCategory(this.scene.cat)
    this.sensor.collisionFilter = this.rimL.body.collisionFilter
  }
}
