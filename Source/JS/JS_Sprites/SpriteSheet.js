/*
====================================================================================
SPRITESHEET.js
-> Base class that would handle all of the sprite rendering 
-> No libraries used, completely from scratch
-> Can only read sprites in a row, will not read columns
-> Updates the selected images within the sprite and can wait until the neccesarry update should be called
-> Handles the sprite rendering
-> Credit for the base code goes to @William Malone, as I followed his tutorial how to make this
====================================================================================
*/

export default class SpriteSheet {
  constructor(
    options = {
      context: null,
      width: 0,
      height: 0,
      image: null,
      ticksPerFrame: 0,
      numberOfFrames: 1
    }
  ) {
    this.options = options;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = this.options.ticksPerFrame;
    this.numberOfFrames = this.options.numberOfFrames;
    this.context = options.context;
    this.width = options.width;
    this.height = options.height;
    this.image = options.image;
    this.image = this.options.image;
  }
  ///Update to the next image 
  ///If reached the end restart from the beginning
  ///wait for some frames to pass by if any 
  update() {
    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;
      // If the current frame index is in range
      if (this.frameIndex < this.numberOfFrames - 1) {
        // Go to the next frame
        this.frameIndex += 1;
      } else {
        this.frameIndex = 0;
      }
    }
  }
  ///Render the necessary section of the sprite sheet, according to the update calculations
  ///Remember to only use spritesheets in one line, currently does not support columns 
  render() {
    this.context.drawImage(
      this.image,
      (this.frameIndex * this.width) / this.numberOfFrames,
      0,
      this.width / this.numberOfFrames,
      this.height,
      0,
      0,
      this.width / this.numberOfFrames,
      this.height
    );
  }
}
