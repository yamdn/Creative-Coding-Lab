// states
let homePage; 
let compIcon, folderIcon, globeIcon, musicIcon, camIcon, noteIcon, gambleIcon; 

let windowImg1, closeImg, windW, windH, windX, windY, isWindowVisible;
let windowArr = [];  
let windowPrompts = ["app", "rate", "time"];
let windowDict; 

// audio 
let churchill, santa, sinatra, vocals;

// new fonts
let pixFont; 

// annoying window 
// windowPrompts = {rate: "Rate your experience (˶ᵔ ᵕ ᵔ˶)", app: "Download our App! 𐦂𖨆𐀪𖠋", time: "That's enough screen time. (ㆆࡇㆆ)"}; 

function preload() {
  homePage = loadImage("assets/images/homePage.png");
  homeIcons = loadImage ("assets/images/homeIcons.png");
  windowImg1 = loadImage("assets/images/appWindow.png");
  closeImg = loadImage("assets/images/closeWindow.png");

  // soundFormats("mp3");
  // churchill = loadSound("assets/audio/churchill");
  // santa = loadSound("assets/audio/santa");
  // sinatra = loadSound("assets/audio/sinatra");
  // vocals = loadSound("assets/audio/vocals");

  // pixFont = loadFont("/assets/Retropix.ttf"); 
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // ===== cropping desktop icons =====
  compIcon = crop(homeIcons, 60, 90, 155, 190);
  folderIcon = crop(homeIcons, 60, 360, 160, 130);
  globeIcon = crop(homeIcons, 50, 560, 170, 170);
  musicIcon = crop(homeIcons, 1640, 80, 198, 200);
  
  camIcon = crop(homeIcons, 20, 1011, 65, 60);
  noteIcon = crop(homeIcons, 100, 1011, 50, 55);
  gambleIcon = crop(homeIcons, 1818, 1008, 63, 63);

  // ===== popup window =====
  windowDict = {
    app: windowImg1,
    rate: windowImg1,
    time: windowImg1
  };

  spawnWindow(); // can maybe removed later? 

}

function draw() {
  // background(220, 0, 0);
  image(homePage, 0, 0, width, height);

  for(let i = 0; i <windowArr.length; i++) {
    windowArr[i].display(); 
  }
}

function spawnWindow() {
  let randKey = random(windowPrompts); 
  let img = windowDict[randKey];

  windowArr.push(new createWindow(img, closeImg));
  setTimeout(spawnWindow, random(2000, 5000)); 
}

function mousePressed() {
  for(let i = windowArr.length -1; i>=0; i--){
    if (windowArr[i].checkClicked()) {
      windowArr.splice(i, 1);
      break;
    }
  }
}

class createWindow {
  constructor(windowImg, closeImg) {
    this.windowImg = windowImg;
    this.closeImg = closeImg;

    // this.windScale = random(windowWidth*0.0002, windowWidth*0.0004); 
    this.windScale = random(0.4, 0.8);
    this.windW = this.windowImg.width * this.windScale;
    this.windH = this.windowImg.height * this.windScale;
    this.windX = random(0, width - this.windW); 
    this.windY = random(0, height - this.windH); 

    this.closeX = this.windX + (this.windW * 0.893);
    this.closeY = this.windY + (this.windH * 0.074);
    this.closeW = this.windW * 0.055;
    this.closeH = this.windH * 0.165;
  }

  display() {
    image(this.windowImg, this.windX, this.windY, this.windW, this.windH);
    
    if (this.isMouseOverClose()) {
      push();
      tint(255, 0, 0); 
      image(this.closeImg, this.closeX, this.closeY, this.closeW, this.closeH);
      pop();
    }
  }

  isMouseOverClose() {
    return (mouseX > this.closeX && mouseX < this.closeX + this.closeW && 
            mouseY > this.closeY && mouseY < this.closeY + this.closeH) 
  }

  // called by the mousePressed function 
  checkClicked() {
    return this.isMouseOverClose(); 
  }
}

function crop(img, x, y, w, h) {
  return img.get(x, y, w, h);
}

