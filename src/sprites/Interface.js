import { TIMER_START, COUNT_IN_TIME } from '../constants'

const getTextConfig = (fontSize = 80) => ({
  fontSize,
  fontFamily: 'Sailec',
  color: '#fff',
  align: 'center',
})
export default class {
  constructor(scene) {
    this.scene = scene
    const { width, height } = scene
    this.score = 0
    this.time = TIMER_START
    this.swishSound = scene.sound.add('swish', { volume: 0.5 })
    this.buzzerSound = scene.sound.add('buzzer', { volume: 0.5 })
    this.setScore = this.setScore.bind(this)
    this.start = this.start.bind(this)

    let countInTime = COUNT_IN_TIME
    this.countDownText = this.scene.add
      .text(width / 2, height / 2, countInTime.toString(), getTextConfig(150))
      .setOrigin(0.5)

    this.scene.time.addEvent({
      repeat: countInTime,
      delay: countInTime === 0 ? 0 : 1000,
      callback: () => {
        if (this.started) {
          return
        }
        if (countInTime <= 1) {
          this.countDownText.text = ''
          this.start()
        } else {
          this.countDownText.text = --countInTime
        }
      },
    })
  }

  start() {
    const { width, height } = this.scene
    this.started = true

    this.timeText = this.scene.add
      .text(width / 2, 130, `00:${this.time}`, getTextConfig(80))
      .setOrigin(0.5)

    this.scoreText = this.scene.add
      .text(width / 2, height / 2 + 50, `${this.score}`, getTextConfig(200))
      .setOrigin(0.5)

    this.scoreUpText = this.scene.add
      .text(width / 2, height / 2, ``, getTextConfig(80))
      .setOrigin(0.5)

    this.timeUpText = this.scene.add
      .text(width / 2, height / 2, ``, getTextConfig(50))
      .setOrigin(0.5)

    this.particles = this.scene.add.particles('ball')

    this.particles.createEmitter({
      angle: { min: 200, max: 340 },
      speedY: { min: -500, max: -1000 },
      speedX: { min: -300, max: 300 },
      quantity: { min: 10, max: 15 },
      lifespan: { min: 800, max: 1500 },
      alpha: { start: 0.7, end: 0 },
      scale: 0.3,
      rotate: { start: 200, end: 360 },
      gravityY: 1200,
      on: false,
    })

    this.event = this.scene.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (this.time > 0) {
          this.time--
          this.timeText.text = `00:${this.time.toString().padStart(2, '0')}`
          if (this.time === 0 && !this.ended) {
            this.ended = true
            this.buzzerSound.play()
            this.scene.time.addEvent({
              delay: 1000,
              callback: () => {
                if (!this.scene.hasShot) {
                  this.scene.ball.destroy()
                  this.scene.hoop.destroy()
                  this.ended = true
                  this.scene.scene.start('Score', { score: this.score })
                }
              },
            })
          }
        }
      },
    })

    this.scene.start()
  }

  setScore(score = 0) {
    const { width, height } = this.scene
    this.swishSound.play()
    this.score += score
    const timeup = Math.min(3, score)
    if (score > 0 && !this.ended) {
      this.time += timeup
      this.timeText.text = `00:${this.time.toString().padStart(2, '0')}`
    }

    this.particles.emitParticleAt(this.scene.hoop.sensor.x, height / 2 - 200)
    this.timeUpText.text = `+${timeup}`
    this.timeUpText.x = width / 2
    this.timeUpText.y = 50
    this.timeUpText.alpha = 1
    this.tween = this.scene.sys.tweens.add({
      duration: 2000,
      targets: [this.timeUpText],
      y: 0,
      alpha: 0,
    })
    this.scoreText.setText(this.score)
    this.scoreUpText.text = `+${score}`
    this.scoreUpText.x = this.scene.hoop.sensor.x
    this.scoreUpText.y = height / 2 - 50
    this.scoreUpText.alpha = 1
    this.tween = this.scene.sys.tweens.add({
      duration: 2000,
      targets: [this.scoreUpText],
      y: height / 2 - 150,
      alpha: 0,
    })
  }
}
