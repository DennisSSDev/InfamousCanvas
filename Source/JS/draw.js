"use strict";
export default class Draw {
  //needs more code for global compositing
  constructor(ctx) {
    this.ctx = ctx;
  }
  save() {
    this.ctx.save();
  }
  restore() {
    this.ctx.restore();
  }
  drawImg(img) {
    this.ctx.drawImage(img, 0, 0);
  }
  scale(xs = 1, ys = 1) {
    this.ctx.scale(xs, ys);
  }
  translate(x = 0, y = 0) {
    this.ctx.translate(x, y);
  }
  rotate(degrees = 0) {
    this.ctx.rotate((degrees * Math.PI) / 180);
  }
  newL(x = 0, y = 0) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }
  open() {
    this.ctx.beginPath();
  }
  close() {
    this.ctx.closePath();
  }
  toVertex(x, y) {
    this.ctx.lineTo(x, y);
  }
  ellipse(x, y, radX, radY, rot, stAngle, endAngle, anticlockwise = false) {
    this.ctx.ellipse(x, y, radX, radY, rot, stAngle, endAngle, anticlockwise);
  }
  quadCurveTo(cntrP_X = 0, cntrP_Y = 0, x = 0, y = 0) {
    this.ctx.quadraticCurveTo(cntrP_X, cntrP_Y, x, y);
  }
  fillColor(rgba = "black") {
    this.ctx.fillStyle = rgba;
    this.ctx.fill();
  }
  strokeColor(rgba = "black") {
    this.ctx.strokeStyle = rgba;
    this.ctx.stroke();
  }
  get context() {
    return this.ctx;
  }
}
