export default class {
  constructor(scene) {
    this.scene = scene
    this.score = 0
    this.time = 30
    this.swishSound = scene.sound.add('swish', { volume: 0.5 })
    this.buzzerSound = scene.sound.add('buzzer', { volume: 0.5 })
    this.timeText = this.scene.add
      .text(scene.width / 2, 130, `00:${this.time}`, {
        fontSize: 80,
        fontFamily: 'Sailec',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5)

    this.scoreText = this.scene.add
      .text(scene.width / 2, scene.height / 2 + 50, `${this.score}`, {
        fontSize: 200,
        fontFamily: 'Sailec',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5)

    this.scoreUpText = this.scene.add
      .text(scene.width / 2, scene.height / 2, ``, {
        fontSize: 80,
        fontFamily: 'Sailec',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5)

    this.timeUpText = this.scene.add
      .text(scene.width / 2, scene.height / 2, ``, {
        fontSize: 50,
        fontFamily: 'Sailec',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5)

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
            if (!this.scene.hasShot) {
              this.scene.time.addEvent({
                delay: 1000,
                callback: () => this.scene.scene.start('Game'),
              })
            }
          }
        }
      },
    })

    this.particles = this.scene.add.particles('ball')

    this.setScore = (score = 0) => {
      this.swishSound.play()
      this.score += score
      const timeup = Math.min(3, score)
      if (score > 0) {
        this.time += timeup
        this.timeText.text = `00:${this.time.toString().padStart(2, '0')}`
      }
      this.particles.emitParticleAt(
        this.scene.hoop.sensor.x,
        this.scene.height / 2 - 300,
      )
      this.timeUpText.text = `+${timeup}`
      this.timeUpText.x = this.scene.width / 2
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
      this.scoreUpText.y = this.scene.height / 2 - 50
      this.scoreUpText.alpha = 1
      this.tween = this.scene.sys.tweens.add({
        duration: 2000,
        targets: [this.scoreUpText],
        y: this.scene.height / 2 - 150,
        alpha: 0,
      })
    }

    this.resetScore = (score) => {
      this.score = 0
      this.setScore()
    }

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
  }
}
