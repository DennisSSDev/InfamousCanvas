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
let setupCanvasData = (canvas, width, height) => {
  canvas.width = width;
  canvas.height = height;
  return canvas.getContext("2d");
};

export { makeColor, clearScreen, requestFullscreen, setupCanvasData };
