import { createAnimation } from "./animsHelper";

export const createWarriorAnims = (anims: Phaser.Animations.AnimationManager, armorLvl: number) => {
  createAnimation(anims, "warrior", "idle", [0, 0, 0, 1, 0, 0, 1, 1], 1, undefined, armorLvl);
  createAnimation(anims, "warrior", "run", [2, 3, 4, 5, 6, 7], 20, undefined, armorLvl);
  createAnimation(anims, "warrior", "die", [8, 9, 10, 11, 12, 11], 20, 0, armorLvl);
  createAnimation(anims, "warrior", "attack", [13, 14, 15, 0], 15, 0, armorLvl);
  createAnimation(anims, "warrior", "operate", [16, 17, 16, 17], 8, armorLvl, 0);
  createAnimation(anims, "warrior", "fly", [18], 1, armorLvl, 0);
  createAnimation(anims, "warrior", "read", [19, 20, 20, 20, 20, 20, 20, 20, 20, 19], 20, 0, armorLvl);
};
