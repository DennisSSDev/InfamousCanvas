/*
====================================================================================
DRAW.JS
-> DENNIS CUSTOM DRAWING FRAMEWORK
-> Abastract away the canvas API draw calls as well as simplify some of the operations for drawing lines
-> Holds helper functions for drawing the curves, gradient, etc effects
====================================================================================
*/
export default class Draw {
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
  //rotate according to the supplied degrees
  rotate(degrees = 0) {
    this.ctx.rotate((degrees * Math.PI) / 180);
  }
  drawRect(x = 0, y = 0, width = 0, height = 0) {
    this.ctx.rect(x, y, width, height);
  }
  //Begin the new line and move in immediately at the origin point. Saves the neccessity to write those two lines separately
  newL(x = 0, y = 0) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }
  //Open the drawing path
  open() {
    this.ctx.beginPath();
  }
  //Enclose the drawing path
  close() {
    this.ctx.closePath();
  }
  //build lines and shapes with this
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
