import { Y_OFFSET } from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    this.score = 0
    this.time = 30
    this.timeText = this.scene.add
      .text(scene.width / 2, 30, `${this.time}`, {
        fontSize: 80,
        color: '#efefef',
        align: 'center',
      })
      .setOrigin(0.5)
    this.scoreText = this.scene.add
      .text(scene.width / 2, 140, `${this.score}`, {
        fontSize: 120,
        color: '#efefef',
        align: 'center',
      })
      .setOrigin(0.5)
    this.timeText.setShadow(2, 2, '#555', 2, true, true)

    this.event = this.scene.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        this.timeText.text = --this.time
        if (this.time === 0) {
          this.scene.scene.start('Game')
        }
      },
    })

    this.scoreText.setShadow(2, 2, '#555', 2, true, true)
    this.particles = this.scene.add.particles('ball')

    this.setScore = (score = 0) => {
      this.score += score
      if (score > 0) {
        this.time += 2
        this.timeText.text = this.time
      }
      this.scoreText.setText(this.score)
      this.particles.emitParticleAt(scene.ball.x, scene.ball.y)
    }

    this.resetScore = (score) => {
      this.score = 0
      this.setScore()
    }

    this.particles.createEmitter({
      angle: { min: 240, max: 300 },
      speed: { min: 400, max: 1200 },
      quantity: { min: 8, max: 12 },
      lifespan: 4000,
      alpha: { start: 1, end: 0 },
      scale: { min: 0.05, max: 0.4 },
      rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
      gravityY: 1800,
      on: false,
    })
  }
}
