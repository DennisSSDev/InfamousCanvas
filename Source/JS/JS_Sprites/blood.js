"use strict";

import { makeColor } from "../util.js";

export default class BloodSprite {
  constructor(x, y, drawRef) {
    this.x = x;
    this.y = y;
    this.radX = Math.random() * 5 + 15;
    this.radY = Math.random() * 7 + 15;
    this.drawObj = drawRef;
    this.dead = false;
    this.blueTint = 0;
    this.alpha = Math.random();
    this.alpha < 0.5 ? this.queueDeath() : this.queueLife();
    this.delay = Math.floor(Math.random() * 100 + 50);
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
      this.Xpos = Math.random() * 1100 + 250;
      this.Ypos = Math.random() * 600 + 50;
      this.blueTint = Math.random() * 80;
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
  update(scaleXUpdate = 1, scaleYUpdate = 1) {
    this.drawObj.save();
    this.drawObj.translate(this.x, this.y);
    this.setScale(scaleXUpdate, scaleYUpdate);
    this.drawObj.open();
    this.drawObj.ellipse(0, 0, this.radX, this.radY, 0, 0, 2 * Math.PI);
    this.drawObj.close();
    this.drawObj.fillColor(makeColor(30, 0, this.blueTint, this.alpha));
    this.drawObj.restore();
  }
}
