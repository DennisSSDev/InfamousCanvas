// An IIFE ("Iffy") - see the notes in mycourses
import Draw from "./draw.js";
import Preloader from "./preloader.js";
import Audio from "./audio.js";
import {
  makeColor,
  clearScreen,
  requestFullscreen,
  setupCanvasData
} from "./util.js";

(function() {
  "use strict";
  const loadManager = new Preloader();
  let dw; //draw lib
  let imgData; //will hold preloader data
  //Audio vars
  let AudioManager;
  const NUM_SAMPLES = 256;

  //Canvas vars
  let canvas, ctx;

  //Img effect togglers
  let invert = false,
    tintRed = false,
    lines = false,
    noise = false,
    BadTV = false,
    bInvert = false;

  let time = 0;
  let adjustment = 0;
  let data = 0; // will hold the audio array

  //Serves as the main entrance point
  function init(data) {
    //grab the preloaded images
    imgData = data;

    //canvas init
    canvas = document.querySelector("canvas");
    ctx = setupCanvasData(canvas, window.innerWidth, window.innerHeight);

    //drawer init
    dw = new Draw(ctx);

    // Audio init
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
    document.querySelector("#crazy").addEventListener("change", e => {});
    document.querySelector("#noise").addEventListener("change", e => {
      noise = e.target.checked;
    });
    document.querySelector("#invert").addEventListener("change", e => {
      invert = e.target.checked;
    });
    document.querySelector("#BadTV").addEventListener("change", e => {});
    document.querySelector("#TVSlider").addEventListener("input", e => {});
    document.querySelector("#delay").addEventListener("input", e => {});
    document.querySelector("#Brightness").addEventListener("input", e => {});
  };

  function update() {
    // this schedules a call to the update() method in 1/60 seconds
    requestAnimationFrame(update);
    /*
        Nyquist Theorem
        http://whatis.techtarget.com/definition/Nyquist-Theorem
        The array of data we get back is 1/2 the size of the sample rate 
    */
    // create a new array of 8-bit integers (0-255)
    data = new Uint8Array(NUM_SAMPLES / 2);

    // notice these arrays can be passed "by reference"
    AudioManager.analyserNode.getByteFrequencyData(data);
    // OR
    //analyserNode.getByteTimeDomainData(data);
    clearScreen(ctx);

    //background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    //skullhead
    dw.save();
    dw.translate(
      canvas.width / 2 - imgData[0].width / 2,
      canvas.height / 2 - imgData[0].height / 2
    );
    dw.drawImg(imgData[0]);
    dw.restore();

    //wings
    dw.save();
    dw.translate(1080, 750);
    dw.newL();
    dw.toVertex(80, -180);
    dw.toVertex(95, -190);
    dw.toVertex(97, -230);
    dw.toVertex(205, -350); //move this lower
    dw.toVertex(210, -375); //move this lower
    dw.toVertex(330, -660);
    dw.toVertex(328, -590);
    dw.toVertex(308, -500);
    dw.toVertex(326, -525);
    dw.toVertex(330, -480);
    dw.toVertex(370, -500);
    dw.toVertex(335, -470);
    dw.toVertex(290, -340);
    dw.toVertex(275, -330);
    dw.toVertex(275, -315);
    dw.toVertex(240, -240); //end of top part of the wing
    dw.toVertex(380, -275);
    dw.toVertex(540, -500);
    dw.toVertex(480, -400);
    //final vertex
    dw.toVertex(5, 100);

    dw.close();
    dw.fillColor({ r: 255, g: 0, b: 0, a: 1 });
    dw.restore();

    //image effects
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

        if (time > 50 && bInvert) {
          bInvert = false;
        } else if (time < -50 && !bInvert) {
          bInvert = true;
        }

        if (bInvert) time += 0.01;
        else time -= 0.01;

        data[i + 1] = 255 - green * (time / 2);
        data[i + 2] = 255 - blue;
      }
      if (noise && Math.floor(Math.random() * 300 + 1) < 2) {
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

  //window events. keep them in main as only classes that are added to the html can be using the window object
  window.addEventListener("load", () => {
    loadManager.LoadImages(["./images/background.jpg"], init);
  });
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
})();
