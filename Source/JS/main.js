// An IIFE ("Iffy") - see the notes in mycourses
import Draw from "./draw.js";
import Preloader from "./preloader.js";
import Audio from "./audio.js";
import { makeColor, clearScreen, requestFullscreen } from "./util.js";

(function() {
  "use strict";

  const loadManager = new Preloader();
  let dw;
  let imgData;
  //Audio vars
  let AudioManager;
  const NUM_SAMPLES = 256;

  //Canvas vars
  let canvas, ctx;

  //Img effects
  let maxRadius = 100;
  let invert = false,
    tintRed = false,
    lines = false,
    noise = false,
    BadTV = false,
    crazyLines = false;

  let time = 0;
  let speed = 2;
  let adjustment = 0;

  //Serves as the main function
  function init(data) {
    imgData = data;
    canvas = document.querySelector("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    dw = new Draw(ctx);

    // Audio Related init
    AudioManager = new Audio(
      document.querySelector("audio"),
      new (window.AudioContext || window.webkitAudioContext)(),
      NUM_SAMPLES
    );

    //All UI setup
    setupUI();

    // start animation loop
    update();
  }

  let setupUI = () => {
    document.querySelector("#trackSelect").onchange = function(e) {
      AudioManager.playStream(e.target.value);
    };
    document.querySelector("#fsButton").onclick = function() {
      requestFullscreen(canvas);
    };
    document.querySelector("#RadiusSlider").addEventListener("input", e => {
      maxRadius = e.target.value;
    });
    document.querySelector("#tint").addEventListener("change", e => {
      tintRed = e.target.checked;
    });
    document.querySelector("#lines").addEventListener("change", e => {
      lines = e.target.checked;
    });
    document.querySelector("#crazy").addEventListener("change", e => {
      crazyLines = e.target.checked;
    });
    document.querySelector("#noise").addEventListener("change", e => {
      noise = e.target.checked;
    });
    document.querySelector("#invert").addEventListener("change", e => {
      invert = e.target.checked;
    });
    document.querySelector("#BadTV").addEventListener("change", e => {
      BadTV = e.target.checked;
    });
    document.querySelector("#TVSlider").addEventListener("input", e => {
      speed = e.target.value;
    });
    document.querySelector("#delay").addEventListener("input", e => {
      delayAmount = e.target.value;
    });
    document.querySelector("#Brightness").addEventListener("input", e => {
      adjustment = e.target.value;
      allowedAdjustment = true;
    });
  };

  function update() {
    // this schedules a call to the update() method in 1/60 seconds
    requestAnimationFrame(update);
    time += 0.1;

    /*
        Nyquist Theorem
        http://whatis.techtarget.com/definition/Nyquist-Theorem
        The array of data we get back is 1/2 the size of the sample rate 
    */
    // create a new array of 8-bit integers (0-255)
    let data = new Uint8Array(NUM_SAMPLES / 2);

    // notice these arrays can be passed "by reference"
    AudioManager.analyserNode.getByteFrequencyData(data);
    // OR
    //analyserNode.getByteTimeDomainData(data);
    clearScreen(ctx);
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    dw.save();
    dw.translateObject(
      canvas.width / imgData[0].width - 70,
      canvas.height / imgData[0].height - 150
    );
    dw.drawImg(imgData[0]);
    dw.restore();

    // loop through the data and draw!
    ctx.save();
    for (var i = 0; i < data.length; i++) {
      ctx.save();
      ctx.strokeStyle = `rgba(255,0,0,0.6)`;
      ctx.beginPath();
      ctx.translate(i * 50, 256 - data[i] - 20);
      ctx.moveTo(0, 0);
      ctx.lineTo(25, 25);
      ctx.lineTo(50, 0);

      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = `rgba(25,0,130,0.8)`;
      ctx.beginPath();
      ctx.translate(i * 50, 170 + (data[i] - 20));
      ctx.moveTo(0, 0);
      ctx.lineTo(25, 25);
      ctx.lineTo(50, 0);

      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();

      var percent = data[i] / 255;
      var circleRadius = percent * maxRadius;
      ctx.beginPath();
      ctx.fillStyle = makeColor(255, 111, 111, 0.34 - percent / 3.0);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        circleRadius,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
      ctx.closePath();
      // blue-ish circles, bigger, more transparent
      ctx.beginPath();
      ctx.fillStyle = makeColor(0, 0, 255, 0.1 - percent / 10.0);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        circleRadius * 1.5,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
      ctx.closePath();
      // yellow-ish circles, smaller
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = makeColor(200, 200, 0, 0.5 - percent / 5.0);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        circleRadius * 0.5,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
    ctx.restore();

    manipulatePixels();
  }

  let manipulatePixels = () => {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    for (let i = 0; i < length; i += 4) {
      if (BadTV) {
      }

      if (adjustment > 0) {
        let brChange = adjustment;
        data[i] += Math.floor(brChange);
        data[i + 1] += Math.floor(brChange);
        data[i + 2] += Math.floor(brChange);
      }

      if (tintRed) {
        data[i] = data[i] + 100;
      }
      if (invert) {
        let red = data[i],
          green = data[i + 1],
          blue = data[i + 2];
        data[i] = 255 - red;
        data[i + 1] =
          255 -
          green *
            Math.min(
              Math.max(Math.sin(time / 10) + Math.cos(time / 10), 0.5),
              1
            );
        data[i + 2] = 255 - blue;
      }
      if (noise && Math.random() < 0.05) {
        data[i] = data[i + 1] = data[i + 2] = 255;
      }
      if (lines) {
        let row = Math.floor(i / 4 / width);
        if (row % 50 == 0) {
          data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 255;
          data[i + width * 4] = data[i + width * 4 + 1] = data[
            i + width * 4 + 2
          ] = data[i + width * 4 + 3] = 255;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  window.addEventListener("load", () => {
    loadManager.LoadImages(["./images/background.jpg"], init);
  });
})();
