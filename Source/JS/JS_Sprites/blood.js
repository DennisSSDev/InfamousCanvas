import { makeColor } from "../util.js";

export default class BloodSprite {
  constructor(x, y, drawRef) {
    this.x = x;
    this.y = y;
    this.canvasX = x;
    this.canvasY = y;
    this.radX = Math.random() * 5 + 15;
    this.radY = Math.random() * 7 + 15;
    this.drawObj = drawRef;
    this.dead = false;
    this.blueTint = 0;
    this.alpha = Math.random();
    this.alpha < 0.5 ? this.queueDeath() : this.queueLife();
    this.delay = Math.floor(Math.random() * 100 + 50);
    this.greenTint = 0;
  }
  set Xpos(x) {
    this.x = x;
  }
  set Ypos(y) {
    this.y = y;
  }
  setScale(x = 1, y = 1) {
    this.drawObj.scale(x, y);
  }
  queueDeath() {
    if (this.alpha > 0) {
      setTimeout(() => {
        this.alpha -= 0.1;
        this.queueDeath();
      }, this.delay);
    } else {
      this.dead = true;
      let inversion = Math.random() <= 0.5 ? -1 : 1;
      let inversion2 = Math.random() <= 0.5 ? -1 : 1;
      this.Xpos =
        this.canvasX + Math.random() * (this.canvasX - 200) * inversion;
      this.Ypos =
        this.canvasY + Math.random() * (this.canvasY - 100) * inversion2;
      this.blueTint = Math.random() * 100;
      this.greenTint = Math.random() * 50;
      this.queueLife();
    }
  }
  queueLife() {
    if (this.alpha < 1) {
      setTimeout(() => {
        this.alpha += 0.1;
        this.queueLife();
      }, this.delay);
    } else {
      this.dead = false;
      this.queueDeath();
    }
  }
  update(scaleXUpdate = 1, scaleYUpdate = 1, canvasX, canvasY) {
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.drawObj.save();
    this.drawObj.translate(this.x, this.y);
    this.setScale(scaleXUpdate, scaleYUpdate);
    this.drawObj.open();
    this.drawObj.ellipse(0, 0, this.radX, this.radY, 0, 0, 2 * Math.PI);
    this.drawObj.close();
    this.drawObj.fillColor(
      makeColor(30, this.greenTint, this.blueTint + 75, this.alpha + 0.25)
    );
    this.drawObj.restore();
  }
}
