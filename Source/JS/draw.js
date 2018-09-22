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
  rotate(x, y) {
    this.ctx.rotate(x, y);
  }
  newL(x = 0, y = 0) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }
  close() {
    this.ctx.closePath();
  }
  toVertex(x, y) {
    this.ctx.lineTo(x, y);
  }
  fillColor(rgba = {}) {
    this.ctx.fillStyle = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    console.log(this.ctx.fillStyle);
    this.ctx.fill();
  }
  strokeColor(rgba = {}) {
    this.ctx.strokeStyle = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
    this.ctx.stroke();
  }
}
