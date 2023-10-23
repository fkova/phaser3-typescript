import { createRatAnims } from "../anims/enemyAnims";
import { createWarriorAnims } from "../anims/heroAnims";
import Rat from "../objects/enemies/rat";
import "../objects/hero";
import Hero from "../objects/hero";
import { sceneEvents } from "../events/eventCenter";
import { createChestAnims } from "../anims/treasureAnims";
import Chest from "../objects/chest";

export default class MainScene extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private hero: Hero;
  private heroRatCollider: Phaser.Physics.Arcade.Collider;
  private knivesRatCollider: Phaser.Physics.Arcade.Collider;
  private knives!: Phaser.Physics.Arcade.Group;
  private rats!: Phaser.Physics.Arcade.Group;
  private armorLvl = 1; //0-6

  constructor() {
    super({ key: "MainScene" });
  }

  preload() {
    this.cursors = this.input.keyboard?.createCursorKeys()!;
  }

  create() {
    this.scene.run("game-ui");

    this.initMap();

    //debugWalls(wallLayer, this);
  }

  update(t: number, dt: number) {
    this.hero.update(this.cursors);
  }

  private handleHeroRatCollision(obj1, obj2) {
    const rat = obj2 as Rat;
    const dx = this.hero.x - rat.x;
    const dy = this.hero.y - rat.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    this.hero.handleDamage(dir);
    sceneEvents.emit("player-health-changed", this.hero.health);

    if (this.hero.health <= 0) {
      this.heroRatCollider?.destroy();
    }
  }

  private handleKnifeWallCollision(obj1, obj2) {
    this.knives.killAndHide(obj1);
  }

  private handleKnifeLizardCollision(obj1, obj2) {
    this.knives.killAndHide(obj1);
    this.rats.killAndHide(obj2);
  }

  private handleHeroChestCollision(obj1, obj2) {
    const chest = obj2 as Chest;
    this.hero.setChest(chest);
  }

  private initMap() {
    createRatAnims(this.anims);
    createWarriorAnims(this.anims, this.armorLvl);
    createChestAnims(this.anims);

    const map = this.make.tilemap({ key: "dungeon_lvl1" });
    const tilesSet = map.addTilesetImage("tiles_sewers", "tiles_sewers", 16, 16)!;
    map.createLayer("ground", tilesSet);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 2,
    });

    this.hero = this.add.hero(128, 128, "warrior", `sprite${this.armorLvl * 21 + 1}`);
    this.hero.setKnives(this.knives);

    const wallLayer = map.createLayer("walls", tilesSet) as Phaser.Tilemaps.TilemapLayer;
    wallLayer.setCollisionByProperty({ collides: true }).setDepth(1);

    const chestsLayer = map.getObjectLayer("chests")!;
    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });
    chestsLayer.objects.forEach((chest) => {
      chests.get(chest.x! + chest.width! * 0.5, chest.y! - chest.height! * 0.5, "treasure");
    });

    this.cameras.main.startFollow(this.hero, true, 0.1, 0.1);

    this.rats = this.physics.add.group({
      classType: Rat,
      createCallback: (go) => {
        const ratGo = go as Rat;
        if (ratGo.body) {
          ratGo.body.onCollide = true;
        }
      },
    });
    const ratsLayer = map.getObjectLayer("rats");
    ratsLayer?.objects.forEach((rat) => {
      this.rats.get(rat.x! + rat.width! * 0.5, rat.y! - rat.height! * 0.5, "rat");
    });

    this.physics.add.collider(this.hero, chests, this.handleHeroChestCollision, undefined, this);
    this.physics.add.collider(this.hero, wallLayer);
    this.physics.add.collider(this.knives, wallLayer, this.handleKnifeWallCollision, undefined, this);
    this.physics.add.collider(this.rats, wallLayer);
    this.knivesRatCollider = this.physics.add.collider(this.knives, this.rats, this.handleKnifeLizardCollision, undefined, this);
    this.heroRatCollider = this.physics.add.collider(this.rats, this.hero, this.handleHeroRatCollision, undefined, this);
  }
}
