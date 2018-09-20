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
  scaleObject(xs, ys) {
    this.ctx.scale(xs, ys);
  }
  translateObject(x, y) {
    this.ctx.translate(x, y);
  }
}
