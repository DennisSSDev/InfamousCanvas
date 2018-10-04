//Create secondary elements on the side
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
  update(widthMultiplier = 1, barNumber = 1, invert = false, audioData) {
    this.offsetY = 0;
    for (let i = 0; i < barNumber; i++) {
      this.drawRef.newL(this.originX, this.originY + this.offsetY);
      if (invert) {
        this.drawRef.toVertex(
          this.originX - (5 + widthMultiplier) - audioData[i],
          this.originY + this.offsetY
        );
        this.drawRef.toVertex(
          this.originX - (12 + widthMultiplier) - audioData[i],
          this.originY + 5 + this.offsetY
        );
        this.drawRef.toVertex(
          this.originX - (5 + widthMultiplier) - audioData[i],
          this.originY + 10 + this.offsetY
        );
        this.drawRef.toVertex(this.originX, this.originY + 10 + this.offsetY);
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
      this.drawRef.fillColor(makeColor(255, 0, 0, 1));
      //Too expensive
      // this.drawRef.fillColor(
      //   this.drawRef.createGradient(0, 100, 0, 200, [
      //     [0, "red"],
      //     [0.5, "blue"],
      //     [1, "pink"]
      //   ])
      // );
      this.drawRef.close();
      this.offsetY += 25;
    }
  }
}
