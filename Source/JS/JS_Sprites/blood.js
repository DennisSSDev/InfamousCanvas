import { makeColor } from "../util.js";
/*
====================================================================================
BLOODSPRITE.JS
-> An abstract class served to create "blood" particles in the background
-> has an alive/dead state for each particle and the class is repsonisble for updating them every frame
-> colors and sizes are randomized.
-> draws circles and ovals
-> can recieve audio data for scale manipulation
====================================================================================
*/
export default class BloodSprite {
  constructor(x, y, drawRef) {
    this.x = x;
    this.y = y;
    this.canvasX = x;//canvas reference positions
    this.canvasY = y;
    this.radX = Math.random() * 5 + 15;//randomizers
    this.radY = Math.random() * 7 + 15;
    this.drawObj = drawRef;
    this.dead = false;
    this.blueTint = 0;//blue tint multiplier
    this.alpha = Math.random();
    this.alpha < 0.5 ? this.queueDeath() : this.queueLife();//determine whether should start dying or emerging
    this.delay = Math.floor(Math.random() * 100 + 50);//delay amount
    this.greenTint = 0;
    this.inversion = 0;
    this.inversion2 = 0;
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
  ///Queue death when the particle reached full potential (decrease the opacity when reached full opacity)
  ///randomize location
  queueDeath() {
    if (this.alpha > 0) {
      setTimeout(() => {
        this.alpha -= 0.1;
        this.queueDeath();
      }, this.delay);
    } else {
      this.dead = true;
      this.inversion = Math.random() <= 0.5 ? -1 : 1;
      this.inversion2 = Math.random() <= 0.5 ? -1 : 1;
      this.Xpos =
        this.canvasX + Math.random() * (this.canvasX - 200) * this.inversion;
      this.Ypos =
        this.canvasY + Math.random() * (this.canvasY - 100) * this.inversion2;
      this.blueTint = Math.random() * 100;
      this.greenTint = Math.random() * 50;
      this.queueLife();
    }
  }
  ///Queue life when the particle died completely (increase the opacity once set to 0 or less)
  ///wait for as much as the delay was set
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
  ///Recieve the audio data and manipulate the scale of the blood
  ///render the particle
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
