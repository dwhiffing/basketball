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
    this.sensor.label = 'hoop'

    this.scene.matter.world.on('collisionactive', function (event) {
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
      if (!ball || !hoop) {
        return
      }
      if (ball.velocity.y > 0 && hoop.isSensor && !this.scene.hasScored) {
        this.scene.setScore(this.scene.score + 1)
        this.scene.hasScored = true
        this.scene.missed = false
      }
    })

    for (let i of [-140, 140]) {
      this.scene.matter.add
        .image(this.scene.width / 2 + i, this.scene.height / 2 - 412, 'dot')
        .setStatic(true)
        .setVisible(false)
        .setFriction(0.005)
    }
  }
}
