import { Y_OFFSET } from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    this.score = 0
    this.scoreText = this.scene.add
      .text(
        scene.width / 2,
        scene.height / 2 - Y_OFFSET + 40,
        `${this.score}`,
        {
          fontSize: 120,
          color: '#efefef',
          align: 'center',
        },
      )
      .setOrigin(0.5)
    this.scoreText.setShadow(2, 2, '#555', 2, true, true)
    this.particles = this.scene.add.particles('ball')

    this.setScore = (score = 0) => {
      this.score += score
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
