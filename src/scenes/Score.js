export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Score' })
  }

  init(opts = {}) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.score = opts.score || 0
  }

  create() {
    this.add
      .image(this.width / 2, this.height / 1.2, 'playButton')
      .setScale(1)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Game')
      })

    this.add
      .text(this.width / 2, this.height / 2.8, `+${this.score}`, {
        fontSize: 150,
        fontFamily: 'Sailec',
        fontWeight: '500',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5)

    this.add
      .text(this.width / 2, this.height / 1.5, 'Thanks for playing!', {
        fontSize: 60,
        fontFamily: 'Sailec',
        fontWeight: '500',
        color: '#fff',
        align: 'center',
      })
      .setOrigin(0.5)
    this.add
      .text(
        this.width / 2,
        this.height / 1.4,
        'Your bonus points are in your account.',
        {
          fontSize: 32,
          fontFamily: 'sans-serif',
          color: '#fff',
          align: 'center',
        },
      )
      .setOrigin(0.5)
  }
}
