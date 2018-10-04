"use strict";
export default class Audio {
  constructor(audioElement, audioCtx, NUM_SAMPLES, bassScale=1) {
    this.delayNode = undefined;
    this.lowShelfNode = undefined;
    this.bassScale = bassScale;
    this.delayAmount = 0;
    this.NUM_SAMPLES = NUM_SAMPLES;
    this.audioCtx = audioCtx;
    this.audioElement = audioElement;
    this.analyserNode = this.createWebAudioContextWithAnalyserNode(
      audioElement
    );
  }

  //needs more filters so that the audio could be manipulated more
  createWebAudioContextWithAnalyserNode(audioElement) {
    let analyserNode, sourceNode;
    // create an analyser node
    analyserNode = this.audioCtx.createAnalyser();

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = this.NUM_SAMPLES;

    // hook up <audio> element to analyserNode
    sourceNode = this.audioCtx.createMediaElementSource(audioElement);

    // delay node for reverb effect
    if (this.delayNode == undefined) {
      this.delayNode = this.audioCtx.createDelay();
      this.delayNode.delayTime.value = this.delayAmount;
    }

    // Lowshelf node for bass boost
    if(this.lowShelfNode == undefined){
      this.lowShelfNode =  this.audioCtx.createBiquadFilter();
      this.lowShelfNode.type = "lowshelf";
    }

    sourceNode.connect(this.audioCtx.destination);

    this.lowShelfNode.connect(this.delayNode);
    
    
    // if (this.delayNode != undefined) {
    //   sourceNode.connect(this.delayNode);
    //   this.delayNode.connect(analyserNode);
    // }
    // else{
    //   sourceNode.connect(analyserNode);
    // }
    
    // here we connect to the destination i.e. speakers
    analyserNode.connect(this.audioCtx.destination);
    return analyserNode;
  }

  playStream(path) {
    this.audioElement.src = path;
    this.audioElement.play();
    this.audioElement.volume = 0.2;
    document.querySelector("#status").innerHTML = "Now playing: " + path;
  }

  selectStream(path) {
    this.audioElement.src = path;
    this.audioElement.autoplay = false;
    this.audioElement.volume = 0.2;
    document.querySelector("#status").innerHTML = "Selected track: " + path;
  }

  playSound(path) {
    let snd = new Audio();
    let src = document.createElement("source");
    src.type = "audio/mpeg";
    src.src = path;
    snd.appendChild(src);
    snd.play();
  }

  updateAudio(){
    this.lowShelfNode.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
    this.lowShelfNode.gain.setValueAtTime(15 * this.bassScale, this.audioCtx.currentTime);
  }
}

// 	this.sourceNode = this.audioCtx.createMediaElementSource(audioElement);

// this.lowShelfNode = this.audioCtx.createBiquadFilter();
// this.lowShelfNode.type = "lowshelf";

// sourceNode.connect(analyserNode);

// //delay node for... Delaying sounds
// if (this.delayNode != undefined) {
//   sourceNode.connect(this.delayNode);
//   this.delayNode.connect(analyserNode);
// }
// else{
//   sourceNode.connect(analyserNode);
// }

// // Lowshelf node for bass boost
// if (this.lowShelfNode != undefined) {
//   this.delayNode.connect(this.lowShelfNode);
//   this.lowShelfNode.connect(analyserNode);
// }
// else{
//   this.delayNode.connect(analyserNode);
// }

// // here we connect to the destination i.e. speakers
// analyserNode.connect(this.audioCtx.destination);
// return analyserNode;
// }