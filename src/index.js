import Phaser from 'phaser'

const width = 1080
const height = 1920
let ball, rim, hoop

function preload() {
  this.load.image('ball', 'assets/images/ball.png')
  this.load.image('dot', 'assets/images/dot.png')
  this.load.image('rim', 'assets/images/rim.png')
  this.load.image('hoop', 'assets/images/hoop.png')
}

function create() {
  hoop = this.add.image(width / 2, height / 2 - 560, 'hoop')
  hoop.setScale(3)

  ball = this.matter.add
    .image(-200, 1800, 'ball')
    .setCircle()
    .setFriction(0.005)
    .setBounce(0.75)

  rim = this.add.image(width / 2, height / 2 - 410, 'rim').setScale(3)

  this.matter.add
    .image(width / 2 - 140, height / 2 - 415, 'dot')
    .setStatic(true)
    .setVisible(false)
    .setFriction(0.005)

  this.matter.add
    .image(width / 2 + 140, height / 2 - 415, 'dot')
    .setStatic(true)
    .setVisible(false)
    .setFriction(0.005)

  this.input.on('pointerdown', () => {
    ball
      .setVelocity(0, -50)
      .setIgnoreGravity(false)
      .setSensor(true)
      .setAngularVelocity(0.15)

    this.tweens.add({
      targets: ball,
      scale: 2,
      duration: 1500,
      ease: 'Sine.easeInOut',
    })
  })
}

function reset(ball) {
  ball.setScale(2)
  ball.setAngularVelocity(0)
  this.tweens.add({
    targets: ball,
    scale: 3,
    duration: 200,
  })
  rim.setVisible(false)
  ball.setPosition(width / 2 + 50, height / 2 + 600)
  ball.setVelocity(0, 0)
  ball.setIgnoreGravity(true)
}

function update() {
  if (ball.y > height) {
    reset.call(this, ball)
  }
  if (ball.body.isSensor && ball.body.velocity.y > 0) {
    rim.setVisible(true)
    ball.setSensor(false)
  }
}
var config = {
  type: Phaser.AUTO,
  width,
  height,
  backgroundColor: '#fff',
  parent: 'phaser-example',
  physics: {
    default: 'matter',
    matter: {
      // debug: true,
      gravity: { y: 2 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
}

window.game = new Phaser.Game(config)
