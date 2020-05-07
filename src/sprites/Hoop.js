import { RIM_SIZE, Y_OFFSET } from '../constants'

const X_OFFSET = 200
const RIM_Y_OFFSET = 150
const SENSOR_Y_OFFSET = 240
const RIM_SCALE = 3
const MOVE_DURATION = 2000
const RIM_FRICTION = 0.005

export default class {
  constructor(scene) {
    this.scene = scene
    this.getTweenValue = this.getTweenValue.bind(this)
    this.startTween = this.startTween.bind(this)

    this.backboard = this.scene.add
      .image(this.scene.width / 2, this.scene.height / 2 - Y_OFFSET, 'hoop')
      .setScale(RIM_SCALE)
      .setDepth(-1)

    this.rim = this.scene.add
      .image(
        this.scene.width / 2,
        this.scene.height / 2 - (Y_OFFSET - RIM_Y_OFFSET),
        'rim',
      )
      .setScale(RIM_SCALE * (RIM_SIZE / RIM_Y_OFFSET), RIM_SCALE)

    this.rimL = this.scene.matter.add
      .image(
        this.scene.width / 2 - RIM_SIZE,
        this.scene.height / 2 - (Y_OFFSET - (RIM_Y_OFFSET - 2)),
        'dot',
      )
      .setCircle()
      .setStatic(true)
      .setVisible(false)
      .setFriction(RIM_FRICTION)

    this.rimL.setCollisionCategory(this.scene.cat)
    this.rimL.label = 'rimL'

    this.rimR = this.scene.matter.add
      .image(
        this.scene.width / 2 + RIM_SIZE,
        this.scene.height / 2 - (Y_OFFSET - (RIM_Y_OFFSET - 2)),
        'dot',
      )
      .setCircle()
      .setStatic(true)
      .setVisible(false)
      .setFriction(RIM_FRICTION)

    this.rimR.setCollisionCategory(this.scene.cat)
    this.rimR.label = 'rimR'

    this.sensor = this.scene.matter.add
      .image(
        this.scene.width / 2,
        this.scene.height / 2 - (Y_OFFSET - SENSOR_Y_OFFSET),
        'dot',
      )
      .setStatic(true)
      .setSensor(true)
      .setScale(10, 5)
      .setVisible(false)
    this.sensor.body.label = 'hoop'
    this.sensor.setCollisionCategory(this.scene.cat)

    this.scene.matter.world.on('collisionactive', this.handleCollision)
    // this.scene.time.addEvent({
    //   delay: 1000,
    //   callback: this.startTween,
    // })
  }

  startTween() {
    this.scene.sys.tweens.add({
      targets: [this.backboard, this.rim, this.sensor],
      x: {
        duration: MOVE_DURATION / 2,
        delay: 1000,
        ease: 'Sine.easeInOut',
        value: 201,
      },
      onComplete: () => {
        this.scene.sys.tweens.add({
          targets: [
            this.backboard,
            this.rim,
            this.rimL,
            this.rimR,
            this.sensor,
          ],
          x: {
            duration: MOVE_DURATION,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            value: {
              getEnd: this.getTweenValue,
              getStart: this.getTweenValue,
            },
          },
        })
      },
    })
  }

  handleCollision(event) {
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
  }

  getTweenValue(target, key, value) {
    let diff = 0
    if (target.label === 'rimR') {
      diff = RIM_SIZE
    }
    if (target.label === 'rimL') {
      diff = -RIM_SIZE
    }
    const newValue =
      value === X_OFFSET + diff
        ? this.scene.cameras.main.width - X_OFFSET
        : X_OFFSET
    return newValue + diff
  }
}
