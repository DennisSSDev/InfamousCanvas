import Draw from "./draw.js";
import Preloader from "./preloader.js";
import Audio from "./audio.js";
import BloodSprite from "./JS_Sprites/blood.js";
import { WingData, FlapData } from "./JS_Sprites/wingData.js";
import SpriteSheet from "./JS_Sprites/SpriteSheet.js";
import {
  makeColor,
  clearScreen,
  requestFullscreen,
  setupCanvasData
} from "./util.js";

(function() {
  "use strict";
  //image Preloader
  const loadManager = new Preloader();

  //draw lib
  let dw;
  // holds preloader data
  let imgData;
  //Audio vars
  let AudioManager;
  const NUM_SAMPLES = 256;
  //Canvas vars
  let canvas, ctx;
  //Img effect togglers
  let invert, tintRed, lines, noise, BadTV, bInvert;
  invert = tintRed = lines = noise = BadTV = bInvert = false;

  let time, adjustment, data; // data will hold the audio array
  time = adjustment = data = 0;
  //BloodSplatData
  let bdSpriteArray = [];

  let bdAlpha = 0.35; //background alpha

  //bullSounds
  let soundEff;
  //flame sprites
  let flames = [];
  //vortex Eyes
  let vortexEyes = [];

  //Serves as the main entrance point
  function init(data) {
    //grab the preloaded images
    imgData = data;

    soundEff = document.createElement("audio");
    soundEff.volume = 0.4;
    soundEff.src = "./media/bull.mp3";

    //canvas init
    canvas = document.querySelector("canvas");
    ctx = setupCanvasData(canvas, window.innerWidth, window.innerHeight);

    //drawer init
    dw = new Draw(ctx);

    for (let i = 0; i < 30; i++) {
      bdSpriteArray.push(new BloodSprite(300, 300, dw));
    }

    // Audio init
    AudioManager = new Audio(
      document.querySelector("audio"),
      new (window.AudioContext || window.webkitAudioContext)(),
      NUM_SAMPLES
    );
    AudioManager.playStream("./media/infamousTrack.mp3");

    flames = [
      new SpriteSheet({
        context: ctx,
        width: 800,
        height: 125,
        image: imgData[1],
        ticksPerFrame: 2,
        numberOfFrames: 10
      }),
      new SpriteSheet({
        context: ctx,
        width: 800,
        height: 125,
        image: imgData[1],
        ticksPerFrame: 1,
        numberOfFrames: 10
      })
    ];

    vortexEyes = [
      new SpriteSheet({
        context: ctx,
        width: 1362,
        height: 100,
        image: imgData[2],
        ticksPerFrame: 1,
        numberOfFrames: 16
      }),
      new SpriteSheet({
        context: ctx,
        width: 1362,
        height: 100,
        image: imgData[2],
        ticksPerFrame: 1,
        numberOfFrames: 16
      })
    ];

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

  //do 60 times a second
  function update() {
    requestAnimationFrame(update);
    /*
        Nyquist Theorem
        http://whatis.techtarget.com/definition/Nyquist-Theorem
        The array of data we get back is 1/2 the size of the sample rate 
    */
    // create a new array of 8-bit integers (0-255)
    data = new Uint8Array(NUM_SAMPLES / 2);

    AudioManager.analyserNode.getByteFrequencyData(data);
    //analyserNode.getByteTimeDomainData(data);

    clearScreen(ctx);

    //background draw
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = bdAlpha;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    //Bubles audio edit
    let highFreq = new Uint8Array(30);
    for (let i = 0; i < 30; i++) {
      highFreq[i] = data[i + 20];
    }
    let j = 0;
    for (let item of bdSpriteArray) {
      item.update(1 + highFreq[j] / 96, 1 + highFreq[j] / 96);
      j++;
    }

    //skullhead draw
    dw.save();
    dw.translate(
      canvas.width / 2 - (imgData[0].width * 0.7) / 2,
      canvas.height / 2 - (imgData[0].height * 0.7) / 2
    );
    dw.scale(0.7, 0.7);
    dw.drawImg(imgData[0]);
    dw.restore();

    //Flaps draw
    dw.save();
    dw.translate(canvas.width / 2 + 100, canvas.height / 2 + 60);
    dw.scale(0.9, 0.9);
    drawFlap();
    dw.fillColor(makeColor(0, 0, 101));
    dw.restore();
    dw.save();
    dw.translate(canvas.width / 2 - 100, canvas.height / 2 + 60);
    dw.scale(-0.9, 0.9);
    drawFlap();
    dw.fillColor(makeColor(0, 0, 101));
    dw.restore();

    //wings draw
    dw.save();
    dw.translate(canvas.width / 2 + 90, canvas.height / 2 + 50);
    dw.scale(0.45, 0.45);
    drawWing();
    dw.fillColor(makeColor(128, 0, 0));
    dw.restore();
    dw.save();
    dw.translate(canvas.width / 2 - 90, canvas.height / 2 + 50);
    dw.scale(-0.45, 0.45);
    drawWing();
    dw.fillColor(makeColor(128, 0, 0));
    dw.restore();

    //animate flames
    dw.save();
    dw.translate(canvas.width / 2 - 70, canvas.height / 2 - 110);
    flames[0].update();
    flames[0].render();
    dw.translate(140, 0);
    dw.scale(-1, 1);
    flames[1].update();
    flames[1].render();
    dw.restore();

    //animate vortex
    dw.save();
    dw.translate(canvas.width / 2 - 75, canvas.height / 2 - 120);
    dw.scale(0.4, 0.4);
    vortexEyes[0].update();
    vortexEyes[0].render();
    dw.translate(380, 0);
    dw.scale(-1, 1);
    vortexEyes[1].update();
    vortexEyes[1].render();
    dw.restore();

    //image effects
    manipulatePixels();
  }

  let drawFlap = () => {
    dw.newL();
    let count = 0;
    for (let vert of FlapData) {
      count++;
      if (count < 60) dw.toVertex(vert[0], vert[1] - data[count] / 3);
      else if (count > 59 && count < 80)
        dw.toVertex(vert[0] + data[count] / 10, vert[1] + data[count] / 2);
      else dw.toVertex(vert[0] - data[count] / 5, vert[1]);
    }
    dw.close();
  };

  let drawWing = () => {
    dw.newL();
    let count = 0;
    for (let vert of WingData) {
      count++;
      if (count < 5 || count > 75) {
        dw.toVertex(vert[0], vert[1]);
      } else if (count > 35 && count < 50) {
        dw.toVertex(vert[0] + data[count] / 3, vert[1] + data[count] / 5);
      } else if (count > 60 && count <= 75) {
        dw.toVertex(vert[0] + data[count] / 5, vert[1] + data[count]);
      } else {
        dw.toVertex(vert[0] + data[count] / 3, vert[1] - data[count] / 5);
      }
    }
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
        data[i + 1] = 255 - green;
        data[i + 2] = 255 - blue;
      }
      if (noise && Math.floor(Math.random() * 500) < 2) {
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

  //window events.
  //Keep in main as only .js files that were added to html can use the window object
  window.addEventListener("load", () => {
    loadManager.LoadImages(
      [
        "./images/background_crop.jpg",
        "./images/flames.png",
        "./images/vortex.jpg"
      ],
      init
    );
  });
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bdAlpha = 1.0;
    soundEff.play();
  });
})();
