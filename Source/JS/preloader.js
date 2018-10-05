/*
====================================================================================
PRELOADER.JS
-> simple preloader that is used to get a list of images and load them in asyncronously
-> once loaded, record the index so that the images get returned in the same order they were supplied
-> Base code credit goes to @tonethar. Edited in order to be able to load multiple images instead of 1
====================================================================================
*/
export default class Preloader {
  constructor() {
    this.totalImages = [];
  }
  //Call for async image load
  LoadImages(imgArray, callback) {
    const length = imgArray.length;
    let totalLoad = 0;
    imgArray.map((location, i) => {//Record index to correctly assign into array
      let img = new Image();
      img.src = location;
      img.onload = _ => {
        totalLoad++;
        this.totalImages[i] = img;
        if (totalLoad == length) {
          setTimeout(() => {
            callback(this.totalImages);
          }, 100);//wait a little in case trailing load
        }
      };
      img.onerror = _ => {//show error in case of image load error
        console.log(`Image at url "${url}" wouldn't load! Check your URL!`);
      };
    });
  }
}
