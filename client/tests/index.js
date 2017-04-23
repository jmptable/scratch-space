const util = require('../src/utilities');
const vinyl = require('../src/vinyl-press');

function addLabelledImage(name, image) {
  const div = document.createElement('div');

  const label = document.createElement('p');
  label.innerHTML = name;

  div.appendChild(label);
  div.appendChild(image);

  document.body.appendChild(div);
}

function linearRampDown(templateImage) {
  const ctx = templateImage.getContext('2d');

  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(templateImage.width, templateImage.height);
  ctx.stroke();

  return templateImage;
}

function getHiroDisk() {
  return util.loadImageAsCanvas('/images/hiro-disk.png');
}

function resizeImage(image, newWidth, newHeight) {
  const newImage = document.createElement('canvas');
  newImage.width = newWidth;
  newImage.height = newHeight;

  const ctx = newImage.getContext('2d');
  ctx.drawImage(image, 0, 0, newImage.width, newImage.height);

  return Promise.resolve(newImage);
}

function run() {
  const startTime = Date.now();
  /*
  const SMALL = 512;

  getHiroDisk().then(diskImage => Promise.resolve(vinyl.unspin(diskImage)))
  .then((unspunDisk) => {
    addLabelledImage('unspun', unspunDisk);

    const smallDiskPromise = resizeImage(unspunDisk, SMALL, SMALL);

    // Test sonification
    smallDiskPromise.then((smallDisk) => {
      const smallDiskWithTest = linearRampDown(smallDisk);
      addLabelledImage('linear ramp down', smallDiskWithTest);
      const audioBuffer = vinyl.sonify(smallDiskWithTest);
      return vinyl.coverArt(audioBuffer);
    })
    .then(coverArt => addLabelledImage('cover art', coverArt));
  });
  */

  util.loadImageAsCanvas('/images/linear-ramp-down.png')
  .then((smallDiskWithTest) => {
    addLabelledImage('linear ramp down', smallDiskWithTest);
    const audioBuffer = vinyl.sonify(smallDiskWithTest);
    return vinyl.coverArt(audioBuffer);
  })
  .then((coverArt) => {
    const endTime = Date.now();
    console.log('sonification took', (endTime - startTime) / 1000, 'seconds');
    return Promise.resolve(coverArt);
  })
  .then(coverArt => addLabelledImage('cover art', coverArt));
}

module.exports = {
  run,
};
