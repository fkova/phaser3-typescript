import { sceneEvents } from "../events/eventCenter";
import Chest from "./chest";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      hero(x: number, y: number, texture: string, frame?: string | number): Hero;
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
}

export default class Hero extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE;
  private damageTime = 0;
  private _health = 3;
  private knives?: Phaser.Physics.Arcade.Group;
  private lastShoot = 0;
  private activeChest?: Chest;
  private _coins = 0;

  get health() {
    return this._health;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
  }

  private thrownKnife() {
    const cursor = this.scene.input.activePointer;
    const { scrollX, scrollY } = this.scene.cameras.main;
    const knife = this.knives?.get(this.x, this.y, "knife") as Phaser.Physics.Arcade.Image;
    if (!knife) {
      return;
    }
    knife.setActive(true);
    knife.setVisible(true);

    const angle = Phaser.Math.Angle.Between(this.x, this.y, cursor.x + scrollX, cursor.y + scrollY);

    knife?.setRotation(angle);
    this.scene.physics.velocityFromRotation(angle, 150, knife.body?.velocity);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += delta;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursors || this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) {
      return;
    }

    if (this.scene.input.activePointer.isDown) {
      if (this.activeChest) {
        const coins = this.activeChest.open();
        this._coins += coins;
        sceneEvents.emit("player-coins-changed", this._coins);
      } else {
        //this.scene.time.now > this.lastShoot
        this.thrownKnife();
        this.lastShoot = this.scene.time.now + 500;
      }
    }

    const speed = 100;

    if (cursors?.left?.isDown) {
      this.anims.play("warrior_run", true);
      this?.body?.setOffset(12, 0);
      this.scaleX = -1;
      this.setVelocity(-speed, 0);
      this.activeChest = undefined;
    } else if (cursors?.right?.isDown) {
      this.anims.play("warrior_run", true);
      this.scaleX = 1;
      this?.body?.setOffset(0, 0);
      this.setVelocity(speed, 0);
      this.activeChest = undefined;
    } else if (cursors?.up?.isDown) {
      this.anims.play("warrior_run", true);
      this.setVelocity(0, -speed);
      this.activeChest = undefined;
    } else if (cursors?.down?.isDown) {
      this.anims.play("warrior_run", true);
      this.setVelocity(0, speed);
      this.activeChest = undefined;
    } else {
      this.anims.play("warrior_idle", true);
      this.setVelocity(0, 0);
    }
  }

  setKnives(knives: Phaser.Physics.Arcade.Group) {
    this.knives = knives;
  }

  setChest(chest: Chest) {
    this.activeChest = chest;
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    --this._health;
    if (this._health <= 0) {
      this.healthState = HealthState.DEAD;
      this.anims.play("warrior_die");
      this.setVelocity(0, 0);
    } else {
      this.setVelocity(dir.x, dir.y);
      this.setTint(0xff0000);
      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register("hero", function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, frame?: string | number) {
  var sprite = new Hero(this.scene, x, y, texture, frame);
  this.displayList.add(sprite);
  this.updateList.add(sprite);
  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
  return sprite;
});
