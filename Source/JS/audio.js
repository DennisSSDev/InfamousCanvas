"use strict";
export default class Audio {
  constructor(audioElement, audioCtx, NUM_SAMPLES) {
    this.delayNode = undefined;
    this.NUM_SAMPLES = NUM_SAMPLES;
    this.audioCtx = audioCtx;
    this.audioElement = audioElement;
    this.analyserNode = this.createWebAudioContextWithAnalyserNode(
      audioElement
    );
  }

  //needs more code for hooking up additional filters
  createWebAudioContextWithAnalyserNode(audioElement) {
    let analyserNode, sourceNode;
    // create an analyser node
    analyserNode = this.audioCtx.createAnalyser();

    if (this.delayNode != undefined) {
      delayNode = this.audioCtx.createDelay();
      delayNode.delayTime.value = delayAmount;
    }

    /*
        We will request NUM_SAMPLES number of samples or "bins" spaced equally 
        across the sound spectrum.
    
        If NUM_SAMPLES (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
        the third is 344Hz. Each bin contains a number between 0-255 representing 
        the amplitude of that frequency.
    */

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = this.NUM_SAMPLES;
    // this is where we hook up the <audio> element to the analyserNode
    console.log(this.audioCtx);
    sourceNode = this.audioCtx.createMediaElementSource(audioElement);
    sourceNode.connect(analyserNode);
    //delay node for... Delaying sounds
    if (this.delayNode != undefined) {
      sourceNode.connect(delayNode);
      delayNode.connect(analyserNode);
    }

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
}
