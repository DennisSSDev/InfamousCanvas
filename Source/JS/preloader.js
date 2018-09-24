"use strict";
export default class Preloader {
  constructor() {
    this.totalImages = [];
  }

  LoadImages(imgArray, callback) {
    const length = imgArray.length;
    let totalLoad = 0;
    imgArray.map((location, i) => {
      let img = new Image();
      img.src = location;
      img.onload = _ => {
        totalLoad++;
        this.totalImages[i] = img;
        if (totalLoad == length) {
          setTimeout(() => {
            callback(this.totalImages);
          }, 100);
        }
      };
      img.onerror = _ => {
        console.log(`Image at url "${url}" wouldn't load! Check your URL!`);
      };
    });
  }
}
