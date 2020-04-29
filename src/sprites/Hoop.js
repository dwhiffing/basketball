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

    for (let i of [-140, 140]) {
      this.scene.matter.add
        .image(this.scene.width / 2 + i, this.scene.height / 2 - 412, 'dot')
        .setStatic(true)
        .setVisible(false)
        .setFriction(0.005)
    }
  }
}
