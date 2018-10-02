import Draw from "./draw.js";
import Preloader from "./preloader.js";
import Audio from "./audio.js";
import BloodSprite from "./JS_Sprites/blood.js";
import { WingData, FlapData, NeonData } from "./JS_Sprites/wingData.js";
import SpriteSheet from "./JS_Sprites/SpriteSheet.js";
import NeonPower from "./JS_Sprites/neonPower.js";
import Lightning from "./JS_Sprites/lightning.js";
import {
  makeColor,
  clearScreen,
  requestFullscreen,
  setupCanvasData
} from "./util.js";

/*
* TODO:
* - Take wave form data and get average
* - Add side bars (use sidebar.js for that)
* - Add audio api from last.fm
* - Gradients?
* - Lightning?
*/

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
  let wingScale = 1,
    flapScale = 1; // scale modifier for wings and flaps
  let brightness = 0; // brightness modifier
  // Img effect bools
  let invert, tintRed, neon, noise, bInvert, crazy;
  invert = tintRed = neon = noise = bInvert = crazy = false;
  let time, adjustment, data, waveData; // data will hold the audio array
  time = adjustment = data = waveData = 0;
  //BloodSplatData
  let bdSpriteArray = [];
  let bdAlpha = 0.35; //background alpha

  //bullSounds
  let soundEff;
  //flame sprites
  let flames = [];
  //vortex Eyes
  let vortexEyes = [];

  let neonPowerArr = [];
  let lightning = [];
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
      bdSpriteArray.push(
        new BloodSprite(canvas.width / 2, canvas.height / 2, dw)
      );
    }

    // Audio init
    AudioManager = new Audio(
      document.querySelector("audio"),
      new (window.AudioContext || window.webkitAudioContext)(),
      NUM_SAMPLES,
      0
    );
    AudioManager.playStream("./media/infamousTrack.mp3");
    //AudioManager.selectStream("./media/infamousTrack.mp3"); // Used to prevent autoplay

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
        width: 1324,
        height: 90,
        image: imgData[2],
        ticksPerFrame: 1,
        numberOfFrames: 16
      }),
      new SpriteSheet({
        context: ctx,
        width: 1324,
        height: 90,
        image: imgData[2],
        ticksPerFrame: 1,
        numberOfFrames: 16
      })
    ];
    lightning = [
      new Lightning(
        new SpriteSheet({
          context: ctx,
          width: 1510,
          height: 332,
          image: imgData[3],
          ticksPerFrame: 2.5,
          numberOfFrames: 11
        }),
        2000,
        3,
        300,
        300,
        dw
      )
    ];

    neonPowerArr = [
      new NeonPower(
        dw,
        NeonData,
        makeColor(20, 147, 255, 0.85),
        { x: 50, y: 50 },
        13,
        true
      ),
      new NeonPower(dw, NeonData, makeColor(255, 210, 260, 1))
    ];

    // AudioManager.selectStream("./media/infamousTrack.mp3");

    //All UI setup
    setupUI();
    // start animation loop
    update();
  }

  // Connects DOM events
  let setupUI = () => {
    // Miscellaneous toggles
    document.querySelector("#trackSelect").onchange = function(e) {
      AudioManager.playStream(e.target.value);
    };
    document.querySelector("#fsButton").onclick = function() {
      requestFullscreen(canvas);
    };
    // Image effect toggles
    document.querySelector("#tint").addEventListener("change", e => {
      tintRed = e.target.checked;
    });
    document.querySelector("#neon").addEventListener("change", e => {
      neon = e.target.checked;
    });
    document.querySelector("#crazy").addEventListener("change", e => {
      crazy = e.target.checked;
    });
    document.querySelector("#noise").addEventListener("change", e => {
      noise = e.target.checked;
    });
    document.querySelector("#invert").addEventListener("change", e => {
      invert = e.target.checked;
    });
    // Image effect sliders
    document.querySelector("#wingScaleSlider").addEventListener("input", e => {
      wingScale = e.target.value;
    });
    document.querySelector("#flapScaleSlider").addEventListener("input", e => {
      flapScale = e.target.value;
    });
    document
      .querySelector("#brightnessSlider")
      .addEventListener("input", e => {});
    // Audio effect sliders
    document.querySelector("#delaySlider").addEventListener("input", e => {
      AudioManager.delayNode.delayTime.value = e.target.value;
    });
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
    waveData = new Uint8Array(NUM_SAMPLES / 2);
    AudioManager.analyserNode.getByteFrequencyData(data);
    AudioManager.analyserNode.getByteTimeDomainData(waveData);
    //analyserNode.getByteTimeDomainData(data);
    let dataLength = data.length;
    let total = 0;
    for (let mem of data) {
      total += mem;
    }
    let average = total / dataLength;
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
      item.update(
        1 + highFreq[j] / 96,
        1 + highFreq[j] / 96,
        canvas.width / 2,
        canvas.height / 2
      );
      j++;
    }

    //animate vortex
    dw.save();
    dw.translate(
      canvas.width / 2 - 90 + average / 2.5,
      canvas.height / 2 - 125 + average / 15
    );
    dw.scale(0.65 - average / 300, 0.65 - average / 300);
    vortexEyes[0].update();
    vortexEyes[0].render();
    dw.translate(285, 0);
    dw.scale(-1, 1);
    vortexEyes[1].update();
    vortexEyes[1].render();
    dw.restore();

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

    //activate neon effect here
    if (neon) {
      for (let neonMem of neonPowerArr) {
        dw.save();
        neonMem.update(data);
        dw.translate(canvas.width / 2 - 370, canvas.height / 2 - 350);
        dw.scale(1.9, 1.7);
        neonMem.render();
        dw.restore();
      }
    }

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
    dw.translate(
      canvas.width / 2 - (imgData[1].width * 1.5) / 10 + 60,
      canvas.height / 2 - (imgData[1].height * 1.5) / 10 - 70 - average
    );

    dw.scale(0.9, 0.7 + average / 100);

    flames[0].update();
    flames[0].render();
    dw.translate(135, 0);
    dw.scale(-1, 1);
    flames[1].update();
    flames[1].render();
    dw.restore();

    lightning[0].update();
    lightning[0].render();
    //image effects
    manipulatePixels();
  }

  let drawFlap = () => {
    dw.newL();
    let count = 0;
    for (let vert of FlapData) {
      count++;
      if (count < 60)
        dw.toVertex(
          vert[0] * flapScale,
          vert[1] - (data[count] / 2) * flapScale
        );
      else if (count > 59 && count < 80)
        dw.toVertex(
          vert[0] + (data[count] / 3) * flapScale,
          vert[1] + (data[count] / 2) * flapScale
        );
      else
        dw.toVertex(
          vert[0] - (data[count] / 2) * flapScale,
          vert[1] * flapScale
        );
    }
    dw.close();
  };

  let drawWing = () => {
    dw.newL();
    let count = 0;
    for (let vert of WingData) {
      count++;
      if (count < 5 || count > 75) {
        dw.toVertex(vert[0] * wingScale, vert[1] * wingScale);
      } else if (count > 35 && count < 50) {
        dw.toVertex(
          vert[0] + (data[count] / 2) * wingScale,
          vert[1] + (data[count] / 3) * wingScale
        );
      } else if (count > 60 && count <= 75) {
        dw.toVertex(
          vert[0] + (data[count] / 4) * wingScale,
          vert[1] + data[count] * wingScale
        );
      } else {
        dw.toVertex(
          vert[0] + (data[count] / 2) * wingScale,
          vert[1] - (data[count] / 4) * wingScale
        );
      }
    }
    dw.close();
  };

  let manipulatePixels = () => {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    let length = data.length;
    //let width = imageData.width;

    for (let i = 0; i < length; i += 4) {
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

      /*if (lines) {
        let row = Math.floor(i / 4 / width);
        if (row % 50 == 0) {
          data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 255;
          data[i + width * 4] = data[i + width * 4 + 1] = data[
            i + width * 4 + 2
          ] = data[i + width * 4 + 3] = 255;
        }
      }*/
    }
    ctx.putImageData(imageData, 0, 0);
  };

  //window events.
  //Keep in main as only .js files that were added to html can use the window object
  window.addEventListener("load", () => {
    loadManager.LoadImages(
      [
        "./images/background_crop_png.png",
        "./images/flames.png",
        "./images/vortex.png",
        "./images/lightning2.png"
      ],
      init
    );
  });
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bdAlpha = 1.0;
  });
})();
