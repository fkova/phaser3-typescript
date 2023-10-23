export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.load.image("tiles_sewers", "assets/environment/tiles_sewers.png");
    this.load.tilemapTiledJSON("dungeon_lvl1", "assets/tilemaps/dungeon_lvl1.json");

    this.load.atlas("warrior", "assets/sprites/warrior.png", "assets/sprites/warrior.json");
    this.load.atlas("rat", "assets/sprites/rat.png", "assets/sprites/rat.json");
    this.load.atlas("treasure", "assets/treasure.png", "assets/treasure.json");

    this.load.image("ui-heart-empty", "assets/ui/ui_heart_empty.png");
    this.load.image("ui-heart-full", "assets/ui/ui_heart_full.png");

    this.load.image("knife", "assets/weapon_knife.png");
  }

  create() {
    this.scene.start("MainScene");

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
