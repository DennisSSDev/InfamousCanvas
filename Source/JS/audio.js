/*
====================================================================================
AUDIO.JS
-> Audio manager that handles the audio API
-> Holds data like references to the audio context, audio nodes (source, anaylser,effector nodes), audio samples
-> allows us to retrieve audio samples with filters applied to them in a modular way + abstraction
====================================================================================
*/

export default class Audio {
  constructor(audioElement, audioCtx, NUM_SAMPLES, bassScale = 1) {
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
  ///Prereq for getting audio data to work
  ///Create the neccessary nodes and assign references for future manipulation of the audio  
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
    if (this.lowShelfNode == undefined) {
      this.lowShelfNode = this.audioCtx.createBiquadFilter();
      this.lowShelfNode.type = "lowshelf";
    }
    // Connect the source node to both the destinationa and other nodes
    // to get a true reverb effect
    sourceNode.connect(this.audioCtx.destination);
    sourceNode.connect(this.lowShelfNode);
    this.lowShelfNode.connect(this.delayNode);
    this.delayNode.connect(analyserNode);
    // here we connect to the destination i.e. speakers
    analyserNode.connect(this.audioCtx.destination);
    return analyserNode;
  }
  //Easy method for playing the audio from a specified path
  playStream(path) {
    this.audioElement.src = path;
    this.audioElement.play();
    this.audioElement.volume = 0.2;
    //show the audio being played through the UI
    document.querySelector("#status").innerHTML = "Now playing: " + path;
  }
  //Show current selection through a specified path. The first method being called to prevent auto play
  selectStream(path) {
    this.audioElement.src = path;
    this.audioElement.autoplay = false;
    this.audioElement.volume = 0.2;
    document.querySelector("#status").innerHTML = "Selected track: " + path;
  }
  //sync the audio effects through the update (called in main 60 times a second)
  updateAudio() {
    if (this.bassScale > 1) {
      this.lowShelfNode.frequency.setValueAtTime(
        1000,
        this.audioCtx.currentTime
      );
      this.lowShelfNode.gain.setValueAtTime(
        15 * this.bassScale,
        this.audioCtx.currentTime
      );
    } else {
      this.lowShelfNode.gain.setValueAtTime(5, this.audioCtx.currentTime);
    }
  }
  //getters in case you need immediate access to the audio
  get AudioContext() {
    return this.audioCtx;
  }
  get AnalyserNode() {
    return this.analyserNode;
  }
}
