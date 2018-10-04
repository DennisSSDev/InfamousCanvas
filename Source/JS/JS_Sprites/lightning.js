//lighting strips that appear at random
export default class Lightning {
  //request a sprite sheet
  //have a death and alive state to mitigate instantiation
  constructor(
    spriteSheet,
    waitTime,
    lightningSpeed,
    drawRef,
    scaleX,
    scaleY,
    id
  ) {
    this.spriteSheet = spriteSheet;
    this.wait = waitTime;
    this.x = -1000;
    this.y = -1000;
    this.alpha = 0;
    this.allowedUpdate = false;
    this.queueDeath = false;
    this.interpAlpha = lightningSpeed / 60;
    this.drawRef = drawRef;
    this.xOff = 0;
    this.yOff = 0;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.id = id;
    this.randNum = Math.floor(Math.random() * 90); // this will get a number between 1 and 99;
    this.randNum *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    setTimeout(() => {
      this.activate();
    }, this.wait + Math.random() * 1500);
  }
  activate() {
    this.allowedUpdate = true;
  }

  update(updX = 0, updY = 0) {
    if (this.allowedUpdate) {
      this.spriteSheet.update();
      if (this.alpha < 1 && !this.queueDeath) this.alpha += this.interpAlpha;
      else if (this.alpha >= 1 && !this.queueDeath) this.queueDeath = true;
      else if (this.queueDeath && this.alpha > 0)
        this.alpha -= this.interpAlpha;
      else if (this.queueDeath && this.alpha <= 0) {
        this.queueDeath = false;
        if (this.id <= 3) {
          this.x = this.xOff + updX + Math.random() * 300;
          this.y = this.yOff + updY - Math.random() * 250;
        } else {
          this.x = this.xOff + updY - Math.random() * 300;
          this.y = this.yOff + updY - Math.random() * 250;
        }

        this.randNum = Math.floor(Math.random() * 90); // this will get a number between 1 and 99;
        this.randNum *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

        this.activate();
      }
    }
  }
  render() {
    this.drawRef.save();
    this.drawRef.translate(this.x, this.y);
    this.drawRef.scale(this.scaleX, this.scaleY);
    this.drawRef.rotate(this.randNum);
    this.drawRef.ctx.globalAlpha = this.alpha;
    this.spriteSheet.render();
    this.drawRef.restore();
  }
}
