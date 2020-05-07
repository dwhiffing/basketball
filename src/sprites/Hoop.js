import { Y_OFFSET, RIM_SIZES, HOOP_DURATIONS } from '../constants'

const X_OFFSET = 200
const RIM_Y_OFFSET = 150
const SENSOR_Y_OFFSET = 270
const RIM_SCALE = 3
const RIM_FRICTION = 0.005

// TODO: during first tween, rim points aren't position correctly

export default class {
  constructor(scene) {
    this.scene = scene
    this.getTweenValue = this.getTweenValue.bind(this)
    this.moveBasket = this.moveBasket.bind(this)
    this.stopBasket = this.stopBasket.bind(this)
    this.handleCollision = this.handleCollision.bind(this)
    this.rimSize = RIM_SIZES[0]
    this.rimSound = scene.sound.add('rimSound', { volume: 0.15 })

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
      .setScale(RIM_SCALE * (this.rimSize / RIM_Y_OFFSET), RIM_SCALE)

    this.rimL = this.scene.matter.add
      .image(
        this.scene.width / 2 - this.rimSize,
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
        this.scene.width / 2 + this.rimSize,
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
      .setScale(this.rimSize / 20, 2)
      .setVisible(false)
    this.sensor.body.label = 'hoop'
    this.sensor.setCollisionCategory(this.scene.cat)

    this.scene.matter.world.on('collisionstart', this.handleCollision)
    this.scene.matter.world.on('collisionactive', this.handleCollision)
  }

  reset() {
    this.rimSize = RIM_SIZES[this.scene.getDifficulty()]
    this.rim.setScale(RIM_SCALE * (this.rimSize / RIM_Y_OFFSET), RIM_SCALE)
    this.rimR.x = this.scene.width / 2 + this.rimSize
    this.rimL.x = this.scene.width / 2 - this.rimSize
    this.sensor.setScale(this.rimSize / 20, 2)
    const hoopDuration = HOOP_DURATIONS[this.scene.getDifficulty()]
    if (hoopDuration > 0 && this.currentDuration !== hoopDuration) {
      this.moveBasket(hoopDuration)
    } else {
      this.stopBasket()
    }
  }

  stopBasket() {
    if (this.tween) this.tween.stop
  }

  moveBasket(duration) {
    this.currentDuration = duration
    this.stopBasket()
    this.tween = this.scene.sys.tweens.add({
      targets: [this.backboard, this.rim, this.sensor],
      x: {
        duration: duration / 2,
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
            duration: duration,
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
    if (ball && !hoop) {
      this.rimSound.play()
    }
    if (!ball || !hoop) {
      return
    }
    if (ball.velocity.y > 0 && hoop.isSensor && !this.scene.hasScored) {
      this.scene.ui.setScore(this.scene.getDifficulty() + 1)
      this.scene.hasScored = true
    }
  }

  getTweenValue(target, key, value) {
    let diff = 0
    if (target.label === 'rimR') {
      diff = this.rimSize
    }
    if (target.label === 'rimL') {
      diff = -this.rimSize
    }
    const newValue =
      value === X_OFFSET + diff
        ? this.scene.cameras.main.width - X_OFFSET
        : X_OFFSET
    return newValue + diff
  }
}
