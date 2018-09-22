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
      canvas.width / 2 - (imgData[0].width * 0.8) / 2,
      canvas.height / 2 - (imgData[0].height * 0.8) / 2
    );
    dw.scale(0.8, 0.8);
    dw.drawImg(imgData[0]);
    dw.restore();

    //wings
    dw.save();
    dw.translate(canvas.width / 2 + 100, canvas.height / 2 + 50);
    dw.scale(0.6, 0.6);
    drawWing();
    dw.fillColor(makeColor(128, 0, 0));
    dw.restore();

    dw.save();
    dw.translate(canvas.width / 2 - 100, canvas.height / 2 + 50);
    dw.scale(-0.6, 0.6);
    drawWing();
    dw.fillColor(makeColor(128, 0, 0));
    dw.restore();

    //Flaps
    dw.save();
    dw.translate(1000, 500);
    drawFlap();
    dw.fillColor(makeColor(0, 0, 101));
    dw.restore();

    //image effects
    manipulatePixels();
  }

  let drawFlap = () => {
    dw.newL();

    dw.close();
  };

  let drawWing = () => {
    dw.newL();
    dw.toVertex(30, -20);
    dw.toVertex(35, -95);
    dw.toVertex(115, -195); //move this lower
    dw.toVertex(140, -275); //move this lower
    dw.toVertex(330, -675);
    dw.toVertex(328, -615);
    dw.toVertex(308, -515);
    dw.toVertex(326, -540);
    dw.toVertex(330, -495);
    dw.toVertex(370, -515);
    dw.toVertex(335, -485);
    dw.toVertex(290, -355);
    dw.toVertex(275, -345);
    dw.toVertex(275, -330);
    dw.toVertex(220, -230); //end of top part of the wing
    dw.toVertex(340, -280);
    dw.toVertex(540, -515);
    dw.toVertex(490, -405);
    dw.toVertex(530, -455);
    dw.toVertex(505, -335);
    dw.toVertex(380, -215);
    dw.toVertex(490, -275);
    dw.toVertex(425, -195);
    dw.toVertex(240, -135);
    dw.toVertex(320, -125);
    dw.toVertex(460, -135);
    dw.toVertex(420, -105);
    dw.toVertex(300, -90);
    dw.toVertex(220, -100);
    dw.toVertex(185, -85);
    dw.toVertex(250, -55);
    dw.toVertex(350, -50);
    dw.toVertex(410, -75);
    dw.toVertex(360, -25);
    dw.toVertex(240, -15);
    dw.toVertex(335, -7);
    dw.toVertex(280, 15);
    dw.toVertex(305, 15);
    dw.toVertex(270, 45);
    dw.toVertex(200, 55);
    dw.toVertex(260, 60);
    dw.toVertex(220, 75);
    dw.toVertex(155, 70);
    dw.toVertex(190, 95);
    dw.toVertex(160, 95);
    dw.toVertex(80, 75);
    dw.toVertex(135, 108);
    dw.toVertex(115, 120);
    dw.toVertex(40, 105);
    dw.toVertex(40, 130);
    dw.toVertex(80, 190);
    dw.toVertex(185, 260);
    dw.toVertex(195, 280);
    dw.toVertex(265, 300);
    dw.toVertex(200, 290);
    dw.toVertex(190, 300);
    dw.toVertex(210, 325);
    dw.toVertex(150, 305);
    dw.toVertex(165, 335);
    dw.toVertex(170, 380);
    dw.toVertex(200, 415);
    dw.toVertex(140, 400);
    dw.toVertex(115, 325);
    dw.toVertex(75, 280);
    dw.toVertex(90, 340);
    dw.toVertex(88, 400);
    dw.toVertex(78, 350);
    dw.toVertex(55, 300);
    dw.toVertex(25, 380);
    dw.toVertex(15, 320);
    dw.toVertex(5, 340);
    dw.toVertex(-5, 415);
    dw.toVertex(-30, 350);
    dw.toVertex(-80, 520);
    //final vertex
    dw.toVertex(-120, 400);

    dw.close();
  };

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
