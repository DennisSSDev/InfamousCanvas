/*
====================================================================================
SIDEBAR.js
-> used to create bars on each end
-> uses vertex shapes instead of simple rectangles
-> responds to the audio data provided through update
====================================================================================
*/
import { makeColor } from "../util.js";
export default class SideBar {
  constructor(x, y, barNumber, drawRef) {
    this.originX = x;
    this.originY = y;
    this.barCount = barNumber;
    this.drawRef = drawRef;
    this.offsetX = 0;
    this.offsetY = 0;
  }
  ///Update the stretch of the sidebars according to multimedia
  ///If no data was given, just stay put
  update(
    widthMultiplier = 1,//width of the bar
    barNumber = 1,//count of total bas to be drawn
    invert = false,//in case you want to draw on the other side of the screen
    audioData,
    canvasX = 0,//used when the screen resizes to keep relative position 
    canvasY = 0//same as above
  ) {
    this.offsetY = 0;//increase to go to the next line
    for (let i = 0; i < barNumber; i++) {
      this.drawRef.newL(this.originX, this.originY + this.offsetY);
      if (invert) {
        this.drawRef.toVertex(
          canvasX - (5 + widthMultiplier) - audioData[i],
          this.originY + this.offsetY
        );
        this.drawRef.toVertex(
          canvasX - (12 + widthMultiplier) - audioData[i],
          this.originY + 5 + this.offsetY
        );
        this.drawRef.toVertex(
          canvasX - (5 + widthMultiplier) - audioData[i],
          this.originY + 10 + this.offsetY
        );
        this.drawRef.toVertex(canvasX, this.originY + 10 + this.offsetY);
      } else {
        this.drawRef.toVertex(
          this.originX + 5 + widthMultiplier + audioData[i],
          this.originY + this.offsetY
        );
        this.drawRef.toVertex(
          this.originX + 12 + widthMultiplier + audioData[i],
          this.originY + 5 + this.offsetY
        );
        this.drawRef.toVertex(
          this.originX + 5 + widthMultiplier + audioData[i],
          this.originY + 10 + this.offsetY
        );
        this.drawRef.toVertex(this.originX, this.originY + 10 + this.offsetY);
      }
      this.drawRef.save();
      //each side has it's own color (left is red, right is blue)
      if (!invert) this.drawRef.fillColor(makeColor(255, 0, 0, 1));
      else this.drawRef.fillColor(makeColor(0, 0, 255, 1));
      this.drawRef.close();
      this.offsetY += 25;
    }
  }
}
