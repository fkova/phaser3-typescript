import { ANIM } from "../types";

export const createAnimation = (anims: Phaser.Animations.AnimationManager, spriteSheet: string, key: ANIM, frameNumbers: number[], frameRate, repeat = -1, armorLvl = 0) => {
  anims.create({
    key: `${spriteSheet}_${key}`,
    repeat,
    frameRate,
    frames: anims.generateFrameNames(spriteSheet, {
      frames: frameNumbers.map((num) => armorLvl * 21 + num + 1),
      prefix: "sprite",
    }),
  });
};
