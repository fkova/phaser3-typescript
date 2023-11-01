import "phaser";
import { createAnimation } from "./animsHelper";

export const createRatAnims = (anims: Phaser.Animations.AnimationManager) => {
  createAnimation(anims, "rat", "idle", [0, 0, 0, 1], 2);
  createAnimation(anims, "rat", "run", [6, 7, 8, 9, 10], 10);
  createAnimation(anims, "rat", "attack", [2, 3, 4, 5, 0], 15, 0);
  createAnimation(anims, "rat", "die", [11, 12, 13, 14], 10, 0);
};
