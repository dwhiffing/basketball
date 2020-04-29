export default class {
  constructor(scene) {
    this.scene = scene
    this.backboard = this.scene.add
      .image(this.scene.width / 2, this.scene.height / 2 - 560, 'hoop')
      .setScale(3)
      .setDepth(-1)

    this.rim = this.scene.add
      .image(this.scene.width / 2, this.scene.height / 2 - 410, 'rim')
      .setScale(3)

    this.scene.matter.world.on('collisionstart', function (event) {
      const pair = event.pairs[0]
      const ball = pair.bodyA.label === 'Circle Body' ? pair.bodyA : pair.bodyB
      const sensor =
        pair.bodyA.label === 'Rectangle Body' ? pair.bodyA : pair.bodyB
      if (!ball.isSensor && sensor.isSensor) {
        this.scene.setScore(this.scene.score + 1)
        this.scene.missed = false
      }
    })

    this.sensor = this.scene.matter.add.rectangle(
      this.scene.width / 2,
      this.scene.height / 2 - 350,
      50,
      50,
      {
        isStatic: true,
        isSensor: true,
      },
    )

    for (let i of [-140, 140]) {
      this.scene.matter.add
        .image(this.scene.width / 2 + i, this.scene.height / 2 - 412, 'dot')
        .setStatic(true)
        .setVisible(false)
        .setFriction(0.005)
    }
  }
}
