//Needs two glowing eyes that would fade in and fade out

//Play bull sound on activation

//draw fire at two locations (nostrols)
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
  render() {
    // Draw the animation
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
