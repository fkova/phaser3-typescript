enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const newDirection = () => Phaser.Math.Between(0, 3);

export default class Rat extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;
  private moveEvent: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.anims.play("rat_idle");

    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = newDirection();
      },
      loop: true,
    });
  }

  destroy(fromScene?: boolean | undefined): void {
    this.moveEvent.destroy();
    super.destroy(fromScene);
  }

  private handleTileCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
    if (go !== this) {
      return;
    }

    this.direction = newDirection();
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    const speed = 50;

    switch (this.direction) {
      case Direction.UP: this.setVelocity(0, -speed); break;
      case Direction.DOWN: this.setVelocity(0, speed); break;
      case Direction.LEFT: this.setVelocity(-speed, 0); break;
      case Direction.RIGHT: this.setVelocity(speed, 0); break;
    }
  }
}
