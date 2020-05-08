export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    this.add
      .image(this.width / 2, this.height / 1.2, 'playButton')
      .setScale(1)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Game')
      })
    this.add.image(this.width / 2, this.height / 2.8, 'ball').setScale(1.5)
    this.add
      .text(this.width / 2, this.height / 1.5, 'Basketball', {
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
        'Score Drop points for sinking hoops.\nOne free play per day.',
        {
          fontSize: 32,
          fontFamily: 'SF Pro Text, sans-serif',
          letterSpacing: 1,
          color: '#fff',
          align: 'center',
        },
      )
      .setOrigin(0.5)
  }
}
