/*
====================================================================================
UTIL.JS
-> Collection of helper that are used across many modules
-> Examples include functions for creating color data, screen Clear, canvas setup, etc
====================================================================================
*/
//return a string representing the rgba color values
let makeColor = (red, green, blue, alpha = 1.0) => {
  let color = "rgba(" + red + "," + green + "," + blue + ", " + alpha + ")";
  return color;
};
//clear the screen for refresh of the animations
let clearScreen = ctx => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
//resize the canvas to fit full screen and hide the UI. Make sure to account for all browsers
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
//return the generated ctx
let setupCanvasData = (canvas, width, height) => {
  canvas.width = width;
  canvas.height = height;
  return canvas.getContext("2d");
};
//Return randomized color for image effects
let getRandomColor = () => {
  const getByte = _ => 55 + Math.round(Math.random() * 200);
  let values = new Array(3);
  values[0] = getByte();
  values[1] = getByte();
  values[2] = getByte();
  return values;
};
export {
  makeColor,
  clearScreen,
  requestFullscreen,
  setupCanvasData,
  getRandomColor
};
