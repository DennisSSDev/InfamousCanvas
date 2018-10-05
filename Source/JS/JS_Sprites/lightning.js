/*
====================================================================================
LIGHTNING.JS
-> An abstract class allows the creation of lightning strip particle effects and adjust the position according to audio data
-> Contains a brand new Update() Render() system that allows the separation of update and render logic
-> Randomizes the rotations once died
-> Randomize the position if no audio data was given
====================================================================================
*/

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
    this.spriteSheet = spriteSheet;//sprite ref
    this.wait = waitTime;//how much to wait until appearance
    this.x = -1000;
    this.y = -1000;
    this.alpha = 0;
    this.allowedUpdate = false;//can I update myself?
    this.queueDeath = false;//death status
    this.interpAlpha = lightningSpeed / 60;
    this.drawRef = drawRef;
    this.xOff = 0;
    this.yOff = 0;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.id = id; // id of a particular particle
    this.randNum = Math.floor(Math.random() * 90); // this will get a number between 1 and 99;
    this.randNum *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    //wait for a bit to cook the sprites and then activate self
    setTimeout(() => {
      this.activate();
    }, this.wait + Math.random() * 1500);
  }
  //Lighting.js requires actiavtion in order to run the update loop due to the expenses of rendering the sprite sheets on the same canvas
  activate() {
    this.allowedUpdate = true;
  }
  ///udpate each of the lighting strips. has a death and life states that determine the opacity of the lightning
  //  Note: if no audio data is given (aka updX and updY are 0) then simply assigna  random position instead
  update(updX = 0, updY = 0) {
    if (this.allowedUpdate) {
      this.spriteSheet.update();//update the spritesheet separately (data oriented style)
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
        this.randNum = Math.floor(Math.random() * 90); // this will get a number between 0 and 99;
        this.randNum *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        this.activate();
      }
    }
  }
  //Call the draw on each of the lighting strips and affect the sprites according to the data calculated in Update()
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