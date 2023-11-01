export const debugWalls = (wallLayer: Phaser.Tilemaps.TilemapLayer, scene: Phaser.Scene) => {
  const debugGraphics = scene.add.graphics().setAlpha(0.75).setDepth(wallLayer.depth);

  wallLayer.renderDebug(debugGraphics, {
    tileColor: null,
    collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    faceColor: new Phaser.Display.Color(40, 39, 37, 255),
  });
};
