//A couple of curves drawn as an outline of the bull head and wings
"use strict";
export default class NeonPower {
  constructor(
    drawRef,
    NeonData = [],
    color,
    startingLocation = { x: 50, y: 50 }
  ) {
    this.drawRef = drawRef;
    this.NeonData = NeonData;
    this.Offsets = new Uint8Array(NeonData.length * 2);
    this.color = color;
    this.startLoc = startingLocation;
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
    this.drawRef.context.lineWidth = 10;
    this.drawRef.strokeColor(this.color);
    this.drawRef.close(); //Could be removed later on
  }
}
