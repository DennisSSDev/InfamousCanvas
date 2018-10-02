//lighting strips that appear at random
"use strict";
export default class Lightning {
  //request a sprite sheet
  //have a death and alive state to mitigate instantiation
  constructor(spriteSheet, waitTime, lightningSpeed, x, y, drawRef) {
    this.spriteSheet = spriteSheet;
    this.wait = waitTime;
    this.x = x;
    this.y = y;
    this.alpha = 0;
    this.allowedUpdate = false;
    this.queueDeath = false;
    this.interpAlpha = lightningSpeed / 60;
    this.drawRef = drawRef;
    this.xOff = 0;
    this.yOff = 0;
    setTimeout(() => {
      this.activate();
    }, this.wait);
  }
  activate() {
    this.allowedUpdate = true;
  }

  update() {
    if (this.allowedUpdate) {
      this.spriteSheet.update();
      if (this.alpha < 1 && !this.queueDeath) this.alpha += this.interpAlpha;
      else if (this.alpha >= 1 && !this.queueDeath) this.queueDeath = true;
      else if (this.queueDeath && this.alpha > 0)
        this.alpha -= this.interpAlpha;
      else if (this.queueDeath && this.alpha <= 0) {
        this.queueDeath = false;
        this.x = 400 + Math.random() * 500 + this.xOff;
        this.y = 300 + this.yOff;
        this.activate();
      }
    }
  }
  render() {
    this.drawRef.save();
    this.drawRef.translate(this.x, this.y);
    this.drawRef.ctx.globalAlpha = this.alpha;
    this.spriteSheet.render();
    this.drawRef.restore();
  }
}
