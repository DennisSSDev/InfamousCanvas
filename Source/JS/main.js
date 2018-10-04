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
  setupCanvasData,
  getRandomColor
} from "./util.js";

/*
* TODO:
* - Sidebars need to be cubic beziere
* - add a dropbox for audio
* - Gradients
*/

(function() {
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
  let wingScale = 1, flapScale = 1; // scale modifier for wings and flaps
  //let brightness = 1; // brightness modifier
  //let frameCount = 0;
  // Img effect bools
  let invert, randomFilter, neon, noise, bInvert;
  invert = randomFilter = neon = noise = bInvert = false;
  let time, adjustment, data, waveData; // data will hold the audio array
  time = adjustment = data = waveData = 0;

  //BloodSplatData
  let bdSpriteArray = [];
  let bdAlpha = 0.35; //background alpha
  // Color for random filter
  let randomFilterColor = getRandomColor();
  //flame sprites
  let flames = [];
  //vortex Eyes
  let vortexEyes = [];
  let eyeColor = "green"; // color of filter applied to eyes
  let randomEyeColor = getRandomColor();

  let neonPowerArr = [];
  let lightning = [];
  let sideBar;
  let sideBar2;
  //Serves as the main entrance point
  function init(data_) {
    //grab the preloaded images
    imgData = data_;

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
      1      
    );
    // AudioManager.playStream("./media/infamousTrack.mp3");
    AudioManager.selectStream("./media/infamousTrack.mp3"); // Used to prevent autoplay

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

    let selection = 0;
    for (let i = 0; i < 10; i++) {
      let nwLightning;
      selection = Math.random() * 4;
      if (selection < 1) {
        nwLightning = new Lightning(
          new SpriteSheet({
            context: ctx,
            width: 394,
            height: 89,
            image: imgData[3],
            ticksPerFrame: 2,
            numberOfFrames: 9
          }),
          2000,
          3,
          dw,
          1.5,
          1.5,
          i
        );
      } else if (selection >= 1 && selection < 2) {
        nwLightning = new Lightning(
          new SpriteSheet({
            context: ctx,
            width: 1500,
            height: 303,
            image: imgData[4],
            ticksPerFrame: 3,
            numberOfFrames: 11
          }),
          1500,
          3,
          dw,
          0.4,
          0.4,
          i
        );
      } else if (selection >= 2 && selection < 3) {
        nwLightning = new Lightning(
          new SpriteSheet({
            context: ctx,
            width: 1500,
            height: 303,
            image: imgData[5],
            ticksPerFrame: 3,
            numberOfFrames: 11
          }),
          1500,
          3,
          dw,
          0.4,
          0.4,
          i
        );
      } else if (selection >= 3 && selection < 4) {
        nwLightning = new Lightning(
          new SpriteSheet({
            context: ctx,
            width: 1500,
            height: 303,
            image: imgData[6],
            ticksPerFrame: 3,
            numberOfFrames: 11
          }),
          1500,
          3,
          dw,
          0.4,
          0.4,
          i
        );
      } else {
        nwLightning = new Lightning(
          new SpriteSheet({
            context: ctx,
            width: 1500,
            height: 303,
            image: imgData[5],
            ticksPerFrame: 3,
            numberOfFrames: 11
          }),
          1500,
          3,
          dw,
          0.4,
          0.4,
          i
        );
      }
      lightning.push(nwLightning);
    }

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
  // create a new array of 8-bit integers (0-255)
    // sideBar = new SideBar(0, 7, 2, dw);
    // sideBar2 = new SideBar(canvas.width, 7, 2, dw);
    // AudioManager.selectStream("./media/infamousTrack.mp3");

    data = new Uint8Array(NUM_SAMPLES / 2);
    waveData = new Uint8Array(NUM_SAMPLES / 2);

    //All UI setup
    setupUI();
    // start animation loop
    update(0);
  }
  function createGradientWithCurves(AudioData) {

    // Create off-screen canvas and gradient
    let fogCanvas = document.createElement('canvas');
    let ctx = fogCanvas.getContext('2d');
    let grd = ctx.createLinearGradient(0, 5, 100, 800);

    fogCanvas.width = 700;
    fogCanvas.height = 700;

    grd.addColorStop(0,"red");
    grd.addColorStop(1,"blue");

    // Fill with gradient
    ctx.strokeStyle = grd;

    ctx.beginPath();
    ctx.moveTo(20,20);
    ctx.bezierCurveTo(20,100,200,100,200,20);
    ctx.stroke();
    return fogCanvas;
}

  // Connects DOM events
  let setupUI = () => {
    document.querySelector("#selectors").style.visibility = "visible";
    // Miscellaneous
    document.querySelector("#trackSelect").onchange = function(e) {
      AudioManager.playStream(e.target.value);
    };
    document.querySelector("#colorSelect").onchange = function(e) {
      eyeColor = e.target.value;
    };
    document.querySelector("#fsButton").onclick = function() {
      requestFullscreen(canvas);
    };
    document.querySelector("#minMax").onclick = function() {
      let selectors = document.querySelector("#selectors");
      
      if(selectors.style.visibility == "visible"){
        selectors.style.visibility = "hidden";
      }else{
        selectors.style.visibility = "visible";
      }
    };
    // Image effect toggles
    document.querySelector("#filter").addEventListener("change", e => {
      randomFilter = e.target.checked;
      // Do this to prevent an obvious box from appearing around the eyes
      document.querySelector('#colorSelect [value="green"]').selected = true;
    });
    document.querySelector("#neon").addEventListener("change", e => {
      neon = e.target.checked;
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
    document.querySelector("#bassSlider").addEventListener("input", e => {
      AudioManager.bassScale = e.target.value;
    });
    // Audio effect sliders
    document.querySelector("#delaySlider").addEventListener("input", e => {
      AudioManager.delayNode.delayTime.value = e.target.value;
    });
  };

  //do 60 times a second
<<<<<<< HEAD
  function update() {
    requestAnimationFrame(update);
=======
  function update(frameCount_) {
    requestAnimationFrame(() =>(update(frameCount_)));
    
>>>>>>> 6d1822eecddd1717f946e899884b7ac6902293e1
    AudioManager.analyserNode.getByteFrequencyData(data);
    AudioManager.analyserNode.getByteTimeDomainData(waveData);
    let dataLength = data.length;
    let total = 0;
    for (let mem of data) {
      total += mem;
    }
    let average = total / dataLength;
    clearScreen(ctx);

    let obj_cv = createGradientWithCurves();

    dw.drawImg(obj_cv);
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

    // sideBar.update(50,5,false,highFreq);
    // sideBar2.update(50,5,true, highFreq);
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

    //animate vortex eyes
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

    

    // Change colors every 2 seconds
    if (frameCount_ > 60) {
      randomEyeColor = getRandomColor();
      randomFilterColor = getRandomColor();
      frameCount_ = 0;
    } else {
      // Increment number of frames
      frameCount_ += 1;
    }

    //image effects
    manipulatePixels(randomFilterColor);
    manipulateEyes(randomEyeColor);

    //Lightning should not be affected by image effects
    let index = 0;
    for (let lightmem of lightning) {
      lightmem.xOff = canvas.width / 2;
      lightmem.yOff = canvas.height / 2;
      lightmem.update(-waveData[index] / 3, waveData[index + 1] / 6);
      lightmem.render();
      index++;
    }

    // AUDIO
    AudioManager.updateAudio();
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

  let manipulatePixels = (colors) => {
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
      // Random color filter
      if (randomFilter) {
        eyeColor = "green"; // Do this to prevent an obvious box from appearing around the eyes
        data[i] += colors[0];
        data[i + 1] += colors[1];
        data[i + 2] += colors[2];
      }
      // Inverted color filter
      if (invert) {
        let red = data[i],
          green = data[i + 1],
          blue = data[i + 2];

        data[i] = 255 - red;
        data[i + 1] = 255 - green;
        data[i + 2] = 255 - blue;
      }
      // Static noise filter
      if (noise && Math.floor(Math.random() * 500) < 2) {
        data[i] = data[i + 1] = data[i + 2] = 255;
      }

      // Brightness adjustment not working
      // if (brightness) {
      //   // Apply brightness adjustment
      //   data[i] += brightness;
      //   if (data[i] > 255) {
      //     data[i] = 255;
      //   }
      //   data[i + 1] += brightness;
      //   if (data[i + 1] > 255) {
      //     data[i + 1] = 255;
      //   }
      //   data[i + 2] += brightness;
      //   if (data[i + 2] > 255) {
      //     data[i + 2] = 255;
      //   }
      // }

    }
    ctx.putImageData(imageData, 0, 0);
  };

  // Used to apply a color filter to the skull's eyes
  let manipulateEyes = (colors) => {
    // Get image data (from the same eye because it's easier)
    let leftEye = ctx.getImageData(canvas.width / 2 - 74,canvas.height / 2 - 120,34,34);
    let rightEye = ctx.getImageData(canvas.width / 2 + 44,canvas.height / 2 - 120,34,34);

    let leftData = leftEye.data;
    let leftLength = leftData.length;
    let rightData = rightEye.data;

    for (let i = 0; i < leftLength; i += 4) {
      switch (eyeColor) {
        // if() in each case checks to prevent black pixels from being changed
        case "random":
          if (leftData[i] >= 12) leftData[i] = colors[0];
          if (rightData[i] >= 12) rightData[i] = colors[0];
          if (leftData[i + 1] >= 12) leftData[i + 1] = colors[1];
          if (rightData[i + 1] >= 12) rightData[i + 1] = colors[1];
          if (leftData[i + 2] >= 12) leftData[i + 2] = colors[2];
          if (rightData[i + 2] >= 12) rightData[i + 2] = colors[2];
          break;
        case "red":
          if (leftData[i] >= 20) leftData[i] = 255;
          if (rightData[i] >= 20) rightData[i] = 255;
           leftData[i + 1] = 0;
           rightData[i + 1] = 0;
           leftData[i + 2] = 0;
           rightData[i + 2] = 0;
          break;
        case "green":
          break;
        case "blue":
          if (leftData[i + 2] >= 10) leftData[i + 2] = 255;
          if (rightData[i + 2] >= 10) rightData[i + 2] = 255;
          break;
        case "yellow":
          if (leftData[i] >= 20) leftData[i] = 255;
          if (rightData[i] >= 20) rightData[i] = 255;
          if (leftData[i + 1] >= 100) leftData[i + 1] = 255;
          if (rightData[i + 1] >= 100) rightData[i + 1] = 255;
          if (leftData[i + 2] >= 0) leftData[i + 2] = 0;
          if (rightData[i + 2] >= 0) rightData[i + 2] = 0;
          break;
      }
    }

    //ctx.putImageData(leftEye, canvas.width / 2 - 75, canvas.height / 2 - 120);
    //ctx.putImageData(rightEye, canvas.width / 2 + 305, canvas.height / 2 - 120);

    ctx.putImageData(leftEye, canvas.width / 2 - 74, canvas.height / 2 - 120);
    ctx.putImageData(rightEye, canvas.width / 2 + 44, canvas.height / 2 - 120);
  };

  //window events.
  //Keep in main as only .js files that were added to html can use the window object
  window.addEventListener("load", () => {
    loadManager.LoadImages(
      [
        "./images/background_crop_png.png",
        "./images/flames.png",
        "./images/vortex.png",
        "./images/lightning1.png",
        "./images/lightning2.png",
        "./images/lightning4.png",
        "./images/lightning6.png"
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
