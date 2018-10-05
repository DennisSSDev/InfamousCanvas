import Draw from "./draw.js";
import Preloader from "./preloader.js";
import Audio from "./audio.js";
import BloodSprite from "./JS_Sprites/blood.js";
import { WingData, FlapData, NeonData } from "./JS_Sprites/wingData.js";
import SpriteSheet from "./JS_Sprites/SpriteSheet.js";
import NeonPower from "./JS_Sprites/neonPower.js";
import Lightning from "./JS_Sprites/lightning.js";
import SideBar from "./JS_Sprites/sidebar.js";
import {
  makeColor,
  clearScreen,
  requestFullscreen,
  setupCanvasData,
  getRandomColor
} from "./util.js";

/*
====================================================================================
MAIN.JS
-> Serves as THE entrance point for the canvas API
-> All the relevant vizualization objects and functions are being called here
-> All the pyxel effects are defined and called here
-> All the UI related functions and objects are defined here 
    Note: ONLY js files that are referenced in the DOM have access to the "document" object, thus UI functions are forced to be defined here
-> MAIN.JS is also encapsulated in an IFFE, to prevent function and objects GLOBAL access 
====================================================================================
*/

(function() {

  //image Preloader. Used to load images in onLoad
  const loadManager = new Preloader();
  //DENNIS custom drawing Framework
  let dw;
  // holds preloader image data
  let imgData;
  ///Audio Manager that is responsible for setting up the Audio API and providing references to the audio context 
  ///and audio related functions 
  let AudioManager;
  //Amount of samples to be done for the Frequency and Waveform data
  const NUM_SAMPLES = 256;
  //Canvas variables to hold the 
  let canvas, ctx;
  //Scale modifiers for wings and flaps
  let wingScale = 1,
    flapScale = 1; 
  //Img effect bools for pyxel manipulation
  let invert, randomFilter, neon, noise, bInvert, sidebars;
  invert = randomFilter = neon = noise = bInvert = false;
  sidebars = true;
  //Data will hold the audio arrays from sampling
  let data, waveData, highFreq;
  data = waveData = 0;
  //Blood Sprites img array (Dots in the background)
  let bdSpriteArray = [];
  //background alpha
  let bdAlpha = 0.35; 
  //Color for random filter
  let randomFilterColor = getRandomColor();
  //flame sprites
  let flames = [];
  //Vortex Eyes sprites
  let vortexEyes = [];
  //Color of filter applied to eyes
  let eyeColor = "green"; 
  let randomEyeColor = getRandomColor();
  //Neon power up array (Quadratic Curves)
  let neonPowerArr = [];
  //Lighting sprites Array
  let lightning = [];
  //Side Bars
  let sideBar, sideBar2;
  //Off screen canvas for saving performance (mainly for gradients and Cubic Curves)
  let canvasOff, ctxOff, grd, obj_cv;
  //Storage for total sampling data length and total sum
  let dataLength, total;
  //Drop area reference to the UI elemnt
  let dropArea;


  ///Serves as the main entrance point for the application as soon as it loads
  ///Initializes references to UI, allocates memory for holding freq/waveform data, allocates space for offscreen canvas, Dennis Custom Sprite Renderer
  function init(data_) {
    //grab the preloaded images as soon as they are loaded
    imgData = data_;
    //canvas init
    canvas = document.querySelector("canvas");
    ctx = setupCanvasData(canvas, window.innerWidth, window.innerHeight);
    //ofscreen canvas init
    canvasOff = document.createElement("canvas");
    ctxOff = canvasOff.getContext("2d");
    //gradient to be used on offscreen canvas
    grd = ctxOff.createLinearGradient(0, 0, 500, 500);
    canvasOff.width = 700;
    canvasOff.height = 700;
    grd.addColorStop(0, "red");
    grd.addColorStop(0.5, "blue");
    // Fill with gradient
    ctxOff.strokeStyle = grd;
    ctxOff.lineWidth = 6;
    //Dennis Drawing Framework init
    dw = new Draw(ctx);
    for (let i = 0; i < 28; i++) {
      bdSpriteArray.push(
        new BloodSprite(canvas.width / 2, canvas.height / 2, dw)
      );
    }
    // Audio manager init
    AudioManager = new Audio(
      document.querySelector("audio"),
      new (window.AudioContext || window.webkitAudioContext)(),
      NUM_SAMPLES,
      1
    );
    // Used to prevent autoplay
    AudioManager.selectStream("./media/infamousTrack.mp3");
    //Init the flames sprites with custom data
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
    //Init the vortex eyes sprites with custom data
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
    //On the beginning of the application run through a procedural algorithm that 
    //randomly creates Lightning effects with custom color, width and speed data
    //Will always be different on separate machines
    let selection = 0;
    for (let i = 0; i < 9; i++) {
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
    //Populate the neon array that would hold the Quadratic curve effects
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
    //Init side bars
    sideBar = new SideBar(0, 7, 2, dw);
    sideBar2 = new SideBar(canvas.width, 7, 2, dw);
    //Populate the UintArray that would hold the freq data
    data = new Uint8Array(NUM_SAMPLES / 2);
    //Populate the UintArray that would hold the waveform data
    waveData = new Uint8Array(NUM_SAMPLES / 2);
    //Only high freq data
    highFreq = new Uint8Array(30);
    //Lengths and total inits
    dataLength = data.length;
    total = 0;
    //UI setup and init
    setupUI();
    //Start animation loop and passin in the frame count that would be used to optimize image effects
    update(0);
  }
  //Helper function to prevent unintended behavior from the dropbox zone
  let preventDefaults = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  //interpret the data that was transfered over into the dropbox zone
  let handleDrop = e => {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
  };
  //Once the audio data is parced, submit it into the audio context buffere and upon decoding the data just play it!
  let handleFiles = files => {
    let reader = new FileReader();
    reader.addEventListener("load", e => {
      let data = e.target.result;
      AudioManager.AudioContext.decodeAudioData(data, buffer => {
        playSound(buffer);
      });
    });
    reader.readAsArrayBuffer(files[0]);
  };
  //Helper for playing the dropped audio
  let playSound = buffer => {
    let source = AudioManager.AudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(AudioManager.AnalyserNode);
    source.start(0);
  };
  //helper for activating the highlight of the dropzone background 
  let highlight = _ => {
    dropArea.classList.add('highlight');
  }
  //helper for disabling the highlight of the dropbox background
  let unhighlight = _ => {
    dropArea.classList.remove('highlight');
  }
  ///helper for creating Cubic curves on the offscreen canvas
  ///return the canvas as soon as the curves have been drawn
  let createGradientWithCurves = AudioData => {
    // Create off-screen canvas and gradient
    ctxOff.clearRect(0, 0, 700, 700);
    for (let i = 0; i < 9; i++) {
      ctxOff.beginPath();
      ctxOff.moveTo(10 + i * 70, 0);
      ctxOff.bezierCurveTo(
        20 + i * 70 - AudioData[i + 2] / 3,
        50 + AudioData[i] / 3,
        100 + i * 70 + AudioData[i + 2] / 3,
        50 + AudioData[i + 1] / 3,
        100 + i * 70,
        -50
      );
      ctxOff.stroke();
    }
    return canvasOff;
  };
  /// Connects events to DOM UI
  /// Must be included in MAIN.JS due to access to the "document" object
  let setupUI = () => {
    //Setup for the dropzone
    dropArea = document.querySelector("#dropzone");
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    dropArea.addEventListener("drop", handleDrop, false);
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false)
    });
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false)
    });
    //set the visibility tag to visible on setup so that you can toggle the controls box 
    document.querySelector("#selectors").style.visibility = "visible";
    //selectors init
    document.querySelector("#trackSelect").onchange = e => {
      AudioManager.playStream(e.target.value);
    };
    document.querySelector("#colorSelect").onchange = e => {
      eyeColor = e.target.value;
    };
    document.querySelector("#fsButton").onclick = () => {
      requestFullscreen(canvas);
    };
    document.querySelector("#minMax").onclick = () => {
      let selectors = document.querySelector("#selectors");
      let control = document.querySelector("#minMax");
      if (selectors.style.visibility == "visible") {
        control.innerHTML = "Show Controls";
        selectors.style.visibility = "hidden";
      } else {
        control.innerHTML = "Hide Controls";
        selectors.style.visibility = "visible";
      }
    };
    //Image effect toggles
    document.querySelector("#filter").addEventListener("change", e => {
      randomFilter = e.target.checked;
      // Do this to prevent an obvious box from appearing around the eyes
      document.querySelector('#colorSelect [value="green"]').selected = true;
    });
    //neon toggle
    document.querySelector("#neon").addEventListener("change", e => {
      neon = e.target.checked;
    });
    //noise toggle
    document.querySelector("#noise").addEventListener("change", e => {
      noise = e.target.checked;
    });
    //invert colors toggle
    document.querySelector("#invert").addEventListener("change", e => {
      invert = e.target.checked;
    });
    //side bras toggle (comes in enabled)
    document.querySelector("#sidebars").addEventListener("change", e => {
      sidebars = e.target.checked;
    });
    //Flap and wing sliders
    document.querySelector("#wingScaleSlider").addEventListener("input", e => {
      wingScale = e.target.value;
    });
    document.querySelector("#flapScaleSlider").addEventListener("input", e => {
      flapScale = e.target.value;
    });
    //Audio effect sliders
    document.querySelector("#bassSlider").addEventListener("input", e => {
      AudioManager.bassScale = e.target.value;
    });
    document.querySelector("#delaySlider").addEventListener("input", e => {
      AudioManager.delayNode.delayTime.value = e.target.value;
    });
  };
  ///Main update function that will run as fast as performance allowed
  ///Drawing happens here
  ///Image effects happen here
  let update = frameCount_ => {
    requestAnimationFrame(() => update(frameCount_));
    //clear for screen refresh
    clearScreen(ctx);
    //get the audio data + Pass by ref
    AudioManager.analyserNode.getByteFrequencyData(data);
    AudioManager.analyserNode.getByteTimeDomainData(waveData);
    //calculate the average volume
    total = 0;
    for (let mem of data) {
      total += mem;
    }
    let average = total / dataLength;
    //Drawing Background here
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = bdAlpha;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    //Get high frequency here
    for (let i = 0; i < 30; i++) {
      highFreq[i] = data[i + 20];
    }
    // Sidebar equalizer + enable sidebars
    if (sidebars) {
      sideBar.update(50, 26, false, highFreq);
      sideBar2.update(50, 26, true, highFreq, canvas.width);
    }
    //update the blood sprites according to the high frequency
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
    //Draw the skullhead here (using Dennis draw framework)
    dw.save();
    dw.translate(
      canvas.width / 2 - (imgData[0].width * 0.7) / 2,
      canvas.height / 2 - (imgData[0].height * 0.7) / 2
    );
    dw.scale(0.7, 0.7);
    dw.drawImg(imgData[0]);// skull image itself
    dw.restore();
    //Draw Blue Flaps here (2)
    dw.save();
    dw.translate(canvas.width / 2 + 100, canvas.height / 2 + 60);
    dw.scale(0.9, 0.9);
    drawFlap();//use the Flaps data and manipulate them according to the freq data
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
        neonMem.update(data);//update the neon verticies according to the freq data
        dw.translate(canvas.width / 2 - 370, canvas.height / 2 - 350);
        dw.scale(1.9, 1.7);
        neonMem.render();//render the effect
        dw.restore();
      }
    }
    //Draw the red wings here (2)
    dw.save();
    dw.translate(canvas.width / 2 + 90, canvas.height / 2 + 50);
    dw.scale(0.45, 0.45);
    drawWing();//use the wind data and manipulate according to the freq data
    dw.fillColor(makeColor(128, 0, 0));
    dw.restore();
    dw.save();
    dw.translate(canvas.width / 2 - 90, canvas.height / 2 + 50);
    dw.scale(-0.45, 0.45);
    drawWing();
    dw.fillColor(makeColor(128, 0, 0));
    dw.restore();
    //Update() and Render() the flames here. Animate according to Dennis SpriteSheet renderer 
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
    //Update() and Render() the vortex eyes here. Animate according to Dennis SpriteSheet renderer 
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
    // Change colors every 2 seconds. (Image effect)
    if (frameCount_ > 60) {
      randomEyeColor = getRandomColor();
      randomFilterColor = getRandomColor();
      frameCount_ = 0;
    } else {
      // Increment number of frames
      frameCount_ += 1;
    }
    //image effects actiavtors
    manipulatePixels(randomFilterColor);
    manipulateEyes(randomEyeColor);
    //Lightning should not be affected by image effects. Preserve performance as they are fast enough to not notice the effects on them
    let index = 0;
    ///Update() and Render() lightning + animate the spritesheet 
    ///Will have a random position if waveform data is not provided 
    for (let lightmem of lightning) {
      lightmem.xOff = canvas.width / 2;
      lightmem.yOff = canvas.height / 2;
      lightmem.update(-waveData[index] / 3, waveData[index + 1] / 6);
      lightmem.render();
      index++;
    }
    ///recieve the gradient effect from the offscreen canvas. Significant performance gain. 
    ///Will not recieve image effects to preserve performance
    ///Apply the gradient and Cubic curves via drawImg()
    obj_cv = createGradientWithCurves(waveData);
    dw.save();
    dw.translate(canvas.width / 2 - 330, canvas.height - 100);
    dw.drawImg(obj_cv);
    dw.restore();
    // AUDIO Update
    AudioManager.updateAudio();
  };
  ///Helper function to draw Blue flaps
  ///Utilized FlapData from WingData.js
  //Flap verticies are affected by the Audio frequncy.
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
  ///Helper function to draw Red Wings
  ///Utilized WingData from WingData.js
  ///wing verticies are affected by the Audio frequncy.
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
  //All of the image effects are being calculated here
  let manipulatePixels = colors => {
    //retrieve image data 
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    let length = data.length;
    //effects loop
    for (let i = 0; i < length; i += 4) {
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
    }
    ctx.putImageData(imageData, 0, 0);
  };
  // Used to apply a color filter to the skull's eyes
  let manipulateEyes = colors => {
    // Get image data (from the same eye because it's easier)
    let leftEye = ctx.getImageData(
      canvas.width / 2 - 74,
      canvas.height / 2 - 120,
      34,
      34
    );
    let rightEye = ctx.getImageData(
      canvas.width / 2 + 44,
      canvas.height / 2 - 120,
      34,
      34
    );
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
    ctx.putImageData(leftEye, canvas.width / 2 - 74, canvas.height / 2 - 120);
    ctx.putImageData(rightEye, canvas.width / 2 + 44, canvas.height / 2 - 120);
  };
  ///window events.
  ///Keep in main as only .js files that were added to html can use the window object
  ///This is the very first event that is being called that preloads the images as well as calls init once everything loads
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
  //Update the canvas once the user resizes the window + change the background alpha back to no alpha
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bdAlpha = 1.0;
  });
})();