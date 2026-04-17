let homePage, homeIcons;
let windowImg1, closeImg;
let windowArr = []; // Initialize as an empty array
let windowDict; 
let windowPrompts = ["app", "rate", "time"]; // Keys for your dictionary

function preload() {
  homePage = loadImage("assets/images/homePage.png");
  homeIcons = loadImage("assets/images/homeIcons.png");
  windowImg1 = loadImage("assets/images/appWindow.png");
  closeImg = loadImage("assets/images/closeWindow.png");
  pixFont = loadFont("assets/Retropix.ttf"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Set up your dictionary
  windowDict = {
    app: windowImg1,
    rate: windowImg1, // You can add different images here later
    time: windowImg1
  };

  spawnWindow(); 
}

function draw() {
  image(homePage, 0, 0, width, height);

  // Loop through the array and tell each window to show itself
  for (let i = 0; i < windowArr.length; i++) {
    windowArr[i].display();
  }
}

function spawnWindow() {
  // Pick a random key from our prompt list
  let randKey = random(windowPrompts);
  let img = windowDict[randKey];

  // Add a new instance to the array
  windowArr.push(new WindowChild(img, closeImg));

  // Wait a random amount of time before spawning the next annoying window
  setTimeout(spawnWindow, random(2000, 5000));
}

function mousePressed() {
  // Loop BACKWARDS through the array (top window to bottom window)
  for (let i = windowArr.length - 1; i >= 0; i--) {
    // Check if the click happened on THIS window's close button
    if (windowArr[i].checkClick()) {
      windowArr.splice(i, 1); // Remove 1 element at index i
      break; // Stop the loop so we don't click through to windows underneath
    }
  }
}

class WindowChild {
  constructor(windowImg, closeImg) {
    this.windowImg = windowImg;
    this.closeImg = closeImg;

    // Scaling logic
    this.scale = random(0.4, 0.8);
    this.w = this.windowImg.width * this.scale;
    this.h = this.windowImg.height * this.scale;
    
    this.x = random(0, width - this.w); 
    this.y = random(0, height - this.h); 

    // Pre-calculate button bounds for better performance
    this.btnX = this.x + (this.w * 0.893);
    this.btnY = this.y + (this.h * 0.074);
    this.btnW = this.w * 0.055;
    this.btnH = this.h * 0.165;
  }

  display() {
    image(this.windowImg, this.x, this.y, this.w, this.h);
    
    // Check for hover state
    if (this.isMouseOverButton()) {
      push();
      tint(255, 0, 0); 
      image(this.closeImg, this.btnX, this.btnY, this.btnW, this.btnH);
      pop();
    } else {
      image(this.closeImg, this.btnX, this.btnY, this.btnW, this.btnH);
    }
  }

  // Helper function to see if mouse is over the close button
  isMouseOverButton() {
    return (mouseX > this.btnX && mouseX < this.btnX + this.btnW && 
            mouseY > this.btnY && mouseY < this.btnY + this.btnH);
  }

  // Called by the main mousePressed function
  checkClick() {
    return this.isMouseOverButton();
  }
}

function crop(img, x, y, w, h) {
  return img.get(x, y, w, h);
}