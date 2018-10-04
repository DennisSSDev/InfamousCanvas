import { makeColor } from "../util.js";

//A couple of curves drawn as an outline of the bull head and wings
export default class NeonPower {
  constructor(
    drawRef,
    NeonData = [],
    color,
    startingLocation = { x: 50, y: 50 },
    lineWidth = 6,
    interpColor = false
  ) {
    this.drawRef = drawRef;
    this.NeonData = NeonData;
    this.Offsets = new Uint8Array(NeonData.length * 2);
    this.color = color;
    this.r = 255;
    this.g = 20;
    this.b = 177;
    this.colorToLerpTo = 0;
    this.startLoc = startingLocation;
    this.lineWidth = lineWidth;
    this.interpColor = interpColor;
  }
  update(data) {
    for (let i = 0; i < this.Offsets.length; i += 2) {
      this.Offsets[i] = data[i];
      this.Offsets[i + 1] = data[i + 1];
    }
  }
  render() {
    this.drawRef.open();
    this.drawRef.newL(this.startLoc.x, this.startLoc.y);
    let OffsetIterator = 0;
    for (let i = 0; i < this.NeonData.length; i++) {
      //add the offsets here
      if (i < 10 || (i > 25 && i != 28)) {
        let mul = Math.random() * 2 < 1 ? 1.5 : -1.5;
        this.drawRef.quadCurveTo(
          this.NeonData[i][0],
          this.NeonData[i][1],
          this.NeonData[i][2] - mul, //+ this.Offsets[OffsetIterator] / 10,
          this.NeonData[i][3] - this.Offsets[OffsetIterator] / 8 + mul
        );
      } else if (i != 28) {
        let mul = Math.random() * 2 < 1 ? 1.25 : -1.25;
        if (i == 10 || i == 12 || i == 14) {
          this.drawRef.quadCurveTo(
            this.NeonData[i][0],
            this.NeonData[i][1],
            this.NeonData[i][2] - this.Offsets[OffsetIterator] / 6 + mul, //10 and 26
            this.NeonData[i][3] - this.Offsets[OffsetIterator] / 6
          );
        } else if (i == 17 || i == 19 || i == 21 || i == 23 || i == 25) {
          this.drawRef.quadCurveTo(
            this.NeonData[i][0],
            this.NeonData[i][1],
            this.NeonData[i][2] + this.Offsets[OffsetIterator] / 6 + mul, //10 and 26
            this.NeonData[i][3] - this.Offsets[OffsetIterator] / 6
          );
        } else {
          if (i <= 15) {
            this.drawRef.quadCurveTo(
              this.NeonData[i][0],
              this.NeonData[i][1],
              this.NeonData[i][2] + this.Offsets[OffsetIterator] / 6 + mul, //10 and 26
              this.NeonData[i][3] + this.Offsets[OffsetIterator] / 6
            );
          } else {
            this.drawRef.quadCurveTo(
              this.NeonData[i][0],
              this.NeonData[i][1],
              this.NeonData[i][2] - this.Offsets[OffsetIterator] / 6 + mul, //10 and 26
              this.NeonData[i][3] + this.Offsets[OffsetIterator] / 6
            );
          }
        }
      } else {
        this.drawRef.quadCurveTo(
          this.NeonData[i][0],
          this.NeonData[i][1],
          this.NeonData[i][2],
          this.NeonData[i][3]
        );
      }

      OffsetIterator += 2;
    }
    this.drawRef.context.lineJoin = "round";
    this.drawRef.context.lineWidth = this.lineWidth;
    if (this.interpColor) this.updateColor();
    this.drawRef.strokeColor(this.color);
    this.drawRef.close(); //Could be removed later on
  }
  updateColor() {
    //147, 255, 20
    if (this.colorToLerpTo == 0) {
      if (this.r != 255) {
        this.r++;
        if (this.g != 20) this.g--;
        if (this.b != 147) this.b--;
        this.color = makeColor(this.r, this.g, this.b);
      } else {
        this.g = 20;
        this.b = 147;
        this.colorToLerpTo = 1;
        this.color = makeColor(this.r, this.g, this.b);
      }
    } else if (this.colorToLerpTo == 1) {
      if (this.g != 255) {
        this.g++;
        if (this.b != 20) this.b--;
        if (this.r != 147) this.r--;
        this.color = makeColor(this.r, this.g, this.b);
      } else {
        this.r = 147;
        this.b = 20;
        this.colorToLerpTo = 2;
        this.color = makeColor(this.r, this.g, this.b);
      }
    } else if (this.colorToLerpTo == 2) {
      if (this.b != 255) {
        this.b++;
        if (this.r != 20) this.r--;
        if (this.g != 147) this.g--;
        this.color = makeColor(this.r, this.g, this.b);
      } else {
        this.g = 147;
        this.r = 20;
        this.colorToLerpTo = 0;
        this.color = makeColor(this.r, this.g, this.b);
      }
    }
  }
}