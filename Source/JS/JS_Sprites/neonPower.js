import { makeColor } from "../util.js";
/*
====================================================================================
NEONPOWER.JS
-> Quadratic curve effect that symbolizes a "power up"
-> Verticies are manipluated by control points that are randomized + added audio manipulation
-> uses the WingData for control point locations
====================================================================================
*/
export default class NeonPower {
  constructor(
    drawRef,
    NeonData = [],
    color,
    startingLocation = { x: 50, y: 50 },
    lineWidth = 6,
    interpColor = false
  ) {
    this.drawRef = drawRef;//refernce to the Dennis Draw framework
    this.NeonData = NeonData;//data to be used for the verticies
    this.Offsets = new Uint8Array(NeonData.length * 2);//audio data represented in offsets
    this.color = color;//hold the overall color
    this.r = 255;//interpolate each channel seprately
    this.g = 20;
    this.b = 177;
    this.colorToLerpTo = 0;// 0 == red || 1 == green || 2 == blue 
    this.startLoc = startingLocation;
    this.lineWidth = lineWidth;
    this.interpColor = interpColor;
    this.mul = 1;//multiplier for the jitteryness
    this.OffsetIterator = 0;
  }
  //update the curves according to the audio manipulation
  update(data) {
    for (let i = 0; i < this.Offsets.length; i += 2) {
      this.Offsets[i] = data[i];
      this.Offsets[i + 1] = data[i + 1];
    }
  }
  //render the curves using the WingData
  render() {
    this.drawRef.open();
    this.drawRef.newL(this.startLoc.x, this.startLoc.y);
    this.OffsetIterator = 0;
    for (let i = 0; i < this.NeonData.length; i++) {
      //add the offsets here from audio data. Add extra manipulation for "jittery" effect aka looks like a lightning stream
      if (i < 10 || (i > 25 && i != 28)) {
        this.mul = Math.random() * 2 < 1 ? 1.5 : -1.5;
        this.drawRef.quadCurveTo(
          this.NeonData[i][0],
          this.NeonData[i][1],
          this.NeonData[i][2] - this.mul,
          this.NeonData[i][3] - this.Offsets[this.OffsetIterator] / 8 + this.mul
        );
      } else if (i != 28) {
        this.mul = Math.random() * 2 < 1 ? 1.25 : -1.25;
        if (i == 10 || i == 12 || i == 14) {
          this.drawRef.quadCurveTo(
            this.NeonData[i][0],
            this.NeonData[i][1],
            this.NeonData[i][2] -
              this.Offsets[this.OffsetIterator] / 6 +
              this.mul, //10 and 26
            this.NeonData[i][3] - this.Offsets[this.OffsetIterator] / 6
          );
        } else if (i == 17 || i == 19 || i == 21 || i == 23 || i == 25) {
          this.drawRef.quadCurveTo(
            this.NeonData[i][0],
            this.NeonData[i][1],
            this.NeonData[i][2] +
              this.Offsets[this.OffsetIterator] / 6 +
              this.mul, //10 and 26
            this.NeonData[i][3] - this.Offsets[this.OffsetIterator] / 6
          );
        } else {
          if (i <= 15) {
            this.drawRef.quadCurveTo(
              this.NeonData[i][0],
              this.NeonData[i][1],
              this.NeonData[i][2] +
                this.Offsets[this.OffsetIterator] / 6 +
                this.mul, //10 and 26
              this.NeonData[i][3] + this.Offsets[this.OffsetIterator] / 6
            );
          } else {
            this.drawRef.quadCurveTo(
              this.NeonData[i][0],
              this.NeonData[i][1],
              this.NeonData[i][2] -
                this.Offsets[this.OffsetIterator] / 6 +
                this.mul, //10 and 26
              this.NeonData[i][3] + this.Offsets[this.OffsetIterator] / 6
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
      this.OffsetIterator += 2;
    }
    this.drawRef.context.lineJoin = "round";
    this.drawRef.context.lineWidth = this.lineWidth;
    if (this.interpColor) this.updateColor();
    this.drawRef.strokeColor(this.color);
    this.drawRef.close();
  }
  ///Slowly update the neon color over its lifetime
  ///Goes like this:
  ///   r -> g -> b -> r...  
  updateColor() {
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
