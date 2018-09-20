"use strict";
let makeColor = (red, green, blue, alpha) => {
  let color = "rgba(" + red + "," + green + "," + blue + ", " + alpha + ")";
  return color;
};
let clearScreen = ctx => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

let requestFullscreen = element => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullscreen) {
    element.mozRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
};

export { makeColor, clearScreen, requestFullscreen };
