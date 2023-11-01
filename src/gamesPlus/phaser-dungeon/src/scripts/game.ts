import "phaser";
import MainScene from "./scenes/mainScene";
import PreloadScene from "./scenes/preloadScene";
import GameUI from "./ui/gameUI";

const DEFAULT_WIDTH = 180;
const DEFAULT_HEIGHT = 320;

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  pixelArt: true,
  scene: [PreloadScene, MainScene, GameUI],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

window.addEventListener("load", () => {
  const game = new Phaser.Game(config);
});
