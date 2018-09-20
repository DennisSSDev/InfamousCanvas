"use strict";
export default class Preloader {
  constructor() {
    this.totalImages = [];
  }

  LoadImages(imgArray, callback) {
    const length = imgArray.length;
    let totalLoad = 0;
    imgArray.map(location => {
      let img = new Image();
      img.src = location;
      img.onload = _ => {
        totalLoad++;
        this.totalImages.push(img);
        if (totalLoad == length) callback(this.totalImages);
      };
      img.onerror = _ => {
        console.log(`Image at url "${url}" wouldn't load! Check your URL!`);
      };
    });
  }
}
