export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()

    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(
        0,
        this.sys.game.config.height / 2,
        this.sys.game.config.width * value,
        60,
      )
    })

    // this.load.script(
    //   'webfont',
    //   'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    // )

    this.load.audio('swish', 'assets/audio/swish.wav')
    this.load.audio('rimSound', 'assets/audio/rim.mp3')
    this.load.audio('bounce', 'assets/audio/bounce.mp3')
    this.load.image('ball', 'assets/images/ball.png')
    this.load.image('dot', 'assets/images/dot.png')
    this.load.image('rim', 'assets/images/rim.png')
    this.load.image('hoop', 'assets/images/hoop.png')

    this.load.on('complete', () => {
      // WebFont.load({
      //   google: {
      //     families: ['Space Mono'],
      //   },
      //   active: () => {
      progress.destroy()
      this.scene.start('Game')
      // },
      // })
    })
  }
}
