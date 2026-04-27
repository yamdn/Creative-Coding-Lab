// states
let homePage, directoryPage; 
let compIcon, folderIcon, globeIcon, musicIcon, camIcon, noteIcon, gambleIcon; 

let windowImg1, closeImg, windW, windH, windX, windY, isWindowVisible;
let windowArr = [];  
let windowPrompts = ["app", "rate", "screen"];
let windowDict; 

let appWindow, rateWindow, screenWindow; 

// audio 
let churchill, santa, sinatra, vocals;

// new fonts
let pixFont; 

// tokens 
let token = 0;
let currentScreen = "homePage";
let icons = [];

// directory phrases 
let phrases = ["Unlock features by completing tasks!", "Do tasks to unlock tokens", "Work hard, Get tokens", "Kslia our savior, obtain tokens"];
let phraseIndex = 0;
let charIndex = 0;
let isTyping = true;
let lastStateChange = 0;
let waitTime = 4000; // hold the full text (ms)
let cycleTime = 8000; // total time per phrase cycle (ms)

// play game
let video; 
let isCamOpen = false; 
let handPose;
let hands = [];

let timerValue = 3;
let lastCheckTime = 0;
let isCounting = false;

let result = "Waiting";
let aiGesture = ["rock", "paper", "scissor"];
let aiMove = "Ready";
let userMove = "Ready";
let finalMove = "NONE";

let winStreak = 0;
let multiplier = 1;
let isGambling = false; 



function preload() {
  homePage = loadImage("assets/images/homePage.png");
  directoryPage = loadImage("assets/images/directoryPage.png")
  appWindow = loadImage("assets/images/app.png");
  rateWindow = loadImage("assets/images/rate.png");
  screenWindow = loadImage("assets/images/screen.png");
  closeImg = loadImage("assets/images/closeWindow.png");

  playGame = loadImage("assets/images/playGame.png")
  handPose = ml5.handPose();

  // soundFormats("mp3");
  // churchill = loadSound("assets/audio/churchill");
  // santa = loadSound("assets/audio/santa");
  // sinatra = loadSound("assets/audio/sinatra");
  // vocals = loadSound("assets/audio/vocals");

  pixFont = loadFont("assets/Retropix.ttf");  // some issue on github 

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initIcons();
  textFont(pixFont);

  // ===== popup window =====
  windowDict = {
    app: appWindow,
    rate: rateWindow,
    screen: screenWindow
  };
  spawnWindow(); 

}


function initIcons() {
  // Left Side Icons
  icons.push({rx: 0.027,  ry: 0.08,  rw: 0.089,  rh: 0.198, page: "homePage", id: "playGame"});
  icons.push({rx: 0.017,  ry: 0.33,  rw: 0.095,  rh: 0.135, page: "homePage", id: "checkToken"});
  icons.push({rx: 0.026,  ry: 0.52,  rw: 0.089,  rh: 0.16,  page: "homePage", id: "kslia"});

  // Right Side Icons
  icons.push({rx: 0.8538, ry: 0.07,  rw: 0.103,  rh: 0.193, page: "homePage", id: "playMusic"});
  icons.push({rx: 0.8538, ry: 0.303, rw: 0.096,  rh: 0.175, page: "homePage", id: "notepad"});
  
  // Taskbar / Bottom Area
  icons.push({rx: 0.741,  ry: 0.807, rw: 0.2485, rh: 0.098, page: "homePage", id: "toDirectoryPage"});
  icons.push({rx: 0.0115, ry: 0.938, rw: 0.033,  rh: 0.055, page: "homePage", id: "checkNews"}); 
  icons.push({rx: 0.9476, ry: 0.9352,rw: 0.03,   rh: 0.054, page: "homePage", id: "playGamble"});

  // directoryPage
  icons.push({rx: 0.525,  ry: 0.306,  rw: 0.093,  rh: 0.215, page: "directoryPage", id: "playGame"});
  icons.push({rx: 0.649,  ry: 0.33,   rw: 0.123,  rh: 0.19,  page: "directoryPage", id: "kslia"});
  icons.push({rx: 0.791,  ry: 0.33,   rw: 0.123,  rh: 0.19,  page: "directoryPage", id: "playMusic"});
  icons.push({rx: 0.534,  ry: 0.635,  rw: 0.078,  rh: 0.17,  page: "directoryPage", id: "notepad"});
  icons.push({rx: 0.656,  ry: 0.635,  rw: 0.098,  rh: 0.17,  page: "directoryPage", id: "checkToken"});
  icons.push({rx: 0.797,  ry: 0.622,  rw: 0.11,   rh: 0.185, page: "directoryPage", id: "checkNews"});
  icons.push({rx: 0.029,  ry: 0.1645, rw: 0.1575, rh: 0.079, page: "directoryPage", id: "toHomePage"});

  //playGame 
  icons.push({rx: 0.054,  ry: 0.825, rw: 0.1575, rh: 0.079, page: "playGame", id: "toHomePage"});
}

function draw() {
  // background(220, 0, 0);
  
  if (currentScreen == "homePage"){
    image(homePage, 0, 0, width, height);
    drawHitboxes();

  } else if (currentScreen == "directoryPage"){
    image(directoryPage, 0, 0, width, height);
    textAlign(LEFT);

    drawHitboxes();
    writePhrases();

  } else if (currentScreen == "playGame") {
    image(playGame, 0, 0, width, height);
    let videoX = width*0.548;
    let videoY = height*0.26;
    let videoW = width*0.378;
    let videoH = height*0.564; 

    image(video, videoX, videoY, width*0.378, height*0.564);
    textAlign(CENTER);
    playRPS(videoX, videoY, videoW, videoH);
    fill('purple');
    textSize(width*0.06);
    text(str(token), width*0.25, height*0.45);
    noFill();

    drawHitboxes();
  }

  // display annoying windows 
  for(let i = 0; i <windowArr.length; i++) {
    windowArr[i].display(); 
  }
}


function playRPS(x, y, w, h){
  push(); 
  translate(x,y);
  if (isCounting) {
    updateTimer();
    displayUI(w, h);

  }  else if (winStreak == 2 && token > 0) {
    // === DRAW THE GAMBLE MENU ===
    fill(0, 200);
    rect(0, 0, w, h);
    fill(255);
    textSize(30);
    text("WIN STREAK! Double or Nothing?!:", w/2, h/2 - 60);
    
    textSize(20);
    fill(255, 204, 0);
    text("[D] Double - Risk tokens for 2x rewards", w/2, h/2);
    fill(200);
    text("[S] Stay - Keep current rewards", w/2, h/2 + 40);
    text("[N] Do Nothing - Reset streak", w/2, h/2 + 80);
  
  } else {
    fill(0, 150);
    rect(0, 0, w, h);
    fill(255);
    textSize(32);
    text("Your Move " + userMove, w / 2, h / 2 - 40);
    text("AI Move " + aiMove, w / 2, h / 2 - 80);

    if (isGambling){
      fill(255, 255, 0);
      text("!!DOUBLE OR NOTHING ACTIVE!!", w/2, h*0.1);
    }
    textSize(20);
    text("Press 'SPACE' to Play", w / 2, h / 2 + 20);
    text("Result: " + result, w/2, h/2 + 40);
    text("Tokens: " + token, w/2, h/2 + 80);
  }
  pop();
}

function updateTimer() {
  // check if 1 second has passed
  if (millis() - lastCheckTime >= 1000) {
    timerValue--;
    lastCheckTime = millis();
  }

  // when timer hits zero, capture the move
  if (timerValue <= 0) {
    captureGesture();
    gameResult(); 
    isCounting = false;
    timerValue = 3; // Reset for next time
    console.log("UserMove: ", userMove, "AIMove: ", aiMove)
  }
}

function displayUI(wid, hei) {
   // Countdown
  fill(255, 255, 0);
  textSize(width*0.1);
  text(timerValue, wid/ 2, hei / 2);

  // Instructions
  textSize(width*0.02);
  fill(255);
  text("GET READY...", wid/ 2, hei / 2 + 80);
}

function captureGesture() {
  aiMove = random(aiGesture);

  if (hands.length > 0) {
    let hand = hands[0];

    let wrist = hand.keypoints[0];
    let indexTip = hand.keypoints[8];
    let middleTip = hand.keypoints[12];
    let ringTip = hand.keypoints[16];
    let pinkyTip = hand.keypoints[20];

    let d1 = dist(wrist.x, wrist.y, indexTip.x, indexTip.y); // index to wrist
    let d2 = dist(wrist.x, wrist.y, middleTip.x, middleTip.y); // middle to wrist
    let d3 = dist(wrist.x, wrist.y, ringTip.x, ringTip.y); // ring to wrist
    let d4 = dist(wrist.x, wrist.y, pinkyTip.x, pinkyTip.y); // pink to wrist
    
    console.log("d1: ", d1, "d2: ", d2, "d3 ", d3, "d4 ", d4)

    if (d1 < 140 && d2 < 140 && d3 < 140 && d4 < 140) {
      userMove = "rock";
    } else if (d1 > 200 && d2 > 200 && d3 < 150 && d4 < 140) {
      userMove = "scissor";
    } else if (d1 > 200 && d2 > 200 && d3 > 200 && d4 > 200) {
      userMove = "paper";
    } else {
      userMove = "INVALID MOVE";
    }

    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
      for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

function gameResult() { 
  if (userMove == "paper") {
    if (aiMove == "paper") {
      result = "DRAW. No token added.";
      
    } else if (aiMove == "scissor") {
      result = "LOSE. Token Deducted.";
      token -= 1;
      
    } else if (aiMove == "rock") {
      result = "WON. Token Added.";
      token += 1;
    }
    
  } else if (userMove == "scissor") {
    if (aiMove == "scissor") {
      result = "DRAW. No token added.";
    } else if (aiMove == "rock") {
      result = "LOSE. Token Deducted.";
      token -= 1;
    } else if (aiMove == "paper") {
      result = "WON. Token Added.";
      token += 1;
    }
    
  } else if (userMove == "rock") {
    if (aiMove == "rock") {
      result = "DRAW. No token added.";
    } else if (aiMove == "paper") {
      result = "LOSE. Token Deducted.";
      token -= 1;
    } else if (aiMove == "scissor") {
      result = "WON. Token Added.";
      token += 1;
    }
  } else {
    result = "Invalid. Try Again."
  }
  
  if (result.includes("WON") && isGambling) {
    token = token * multiplier; // Use the multiplier
    winStreak++;
    return 
    
  } else if (result.includes("LOSE") && isGambling) {
    token = 0;
    winStreak = 0; // Reset streak on loss
    multiplier = 1; // Reset multiplier on loss
    return 
  }  
  
  if (result.includes("WON")) {
    winStreak++; 
  } else if (result.includes("Lose")){
    winStreak = 0;
  }
  console.log(result);
}

function drawHitboxes() {
  let sensorRange = 130; 

  for (let b of icons) {
    // Only check icons belonging to the current page
    if (b.page !== currentScreen) continue;

    // Convert all relative values to actual pixel values
    let realX = width * b.rx;
    let realY = height * b.ry;
    let realW = width * b.rw;
    let realH = height * b.rh;
    
    // Calculate center for distance check
    let centerX = realX + realW / 2;
    let centerY = realY + realH / 2;
    
    let d = dist(mouseX, mouseY, centerX, centerY);

    if (d < sensorRange) {
      let opacity = map(d, 0, sensorRange, 255, 0);
      
      noFill();
      if (b.rw < 0.05) {
        strokeWeight(width * 0.0015);
      } else {
        strokeWeight(width * 0.002);
      }
      
      stroke(128, 0, 128, opacity); 
      rect(realX, realY, realW, realH);
    }
  }
  noStroke();
}

function writePhrases(){
  let currentPhrase = phrases[phraseIndex];
  let displayString = currentPhrase.substring(0, charIndex);

  // Add a blinking cursor
  if (frameCount % 40 < 20) {
    displayString += "_";
  }
  textSize(width * 0.024);
  fill("#1818b7");
  text(displayString, width*0.04, height*0.87);

  // check every # frames to give it a mechanical rhythm
  if (frameCount % 6 === 0) {
    if (isTyping) {
      if (charIndex < currentPhrase.length) {
        charIndex++;
      } else {
        // wait at the end of the string
        if (millis() - lastStateChange > waitTime) {
          isTyping = false;
          lastStateChange = millis();
        }
      }
    } else {
      if (charIndex > 0) {
        charIndex--;
      } else {
        // switch to the next phrase once fully erased
        phraseIndex = (phraseIndex + 1) % phrases.length;
        isTyping = true;
        lastStateChange = millis();
      }
    }
  }
}

function keyPressed() {
  if (winStreak == 2 && token > 0) {
    if (key === 'd' || key === 'D') {
      multiplier *= 2;
      isGambling = true;
      winStreak = 0; 
      
    } else if (key === 's' || key === 'S') {
      // Stay same: multiplier stays 1, streak resets so prompt doesn't loop
      isGambling = false;
      winStreak = 0; 
      
    } else if (key === 'n' || key === 'N') {
      multiplier = 1;
      winStreak = 0;
      isGambling = false;
      winStreak = 0; 
    }
    
  } else if (key === " " && !isCounting) {
    isCounting = true;
    lastCheckTime = millis();
    timerValue = 3;
    // Reset moves for the new round
    userMove = "Ready";
    aiMove = "Ready";
  }
}

function mousePressed() {
  // 1. Check annoying windows FIRST (Top layer)
  for (let i = windowArr.length - 1; i >= 0; i--) {
    if (windowArr[i].checkClicked()) {
      windowArr.splice(i, 1);
      return; 
    }
  }

  // 2. Check desktop icons SECOND
  for (let b of icons) {
    // CRITICAL: Only check icons that belong to the current screen
    if (b.page !== currentScreen) continue;

    let realX = width * b.rx;
    let realY = height * b.ry;
    let realW = width * b.rw;
    let realH = height * b.rh;

    if (mouseX > realX && mouseX < realX + realW &&
        mouseY > realY && mouseY < realY + realH) {
      
      console.log("Icon Pressed: " + b.id);

      // Handle transitions
      if (b.id === "toDirectoryPage") {
        currentScreen = "directoryPage";

      } else if (b.id === "toHomePage") {
        // If we are leaving the game screen, kill the camera
        if (currentScreen === "playGame") {
          toggleCamera(); 
        }
        currentScreen = "homePage";

      } else if (b.id === "playGame") {
        // Start camera hardware and switch screen
        toggleCamera(); 
        currentScreen = "playGame";
      }

      // We found our click, stop the loop
      return b.id; 
    }
  }
}

// +++++ 
function toggleCamera() {
  if (!isCamOpen) {
    isCamOpen = true;

    // Re-initialize capture
    video = createCapture(VIDEO, { flipped: true }, () => {
      console.log("Video is ready, starting hand detection...");
      handPose.detectStart(video, gotHands);
    });
    
    video.hide();

  } else {
    isCamOpen = false;

    if (video) {
      handPose.detectStop(); 

      let stream = video.elt.srcObject;
      if (stream) {
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      video.remove();
      video = null;
      console.log("Camera and Detection Stopped");
    }
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

////////////////////////////
function spawnWindow() {
  let randKey = random(windowPrompts); 
  let img = windowDict[randKey];

  windowArr.push(new createWindow(randKey, img, closeImg));
  setTimeout(spawnWindow, random(7000, 10000)); 
}

class createWindow {
  constructor(windowID, windowImg, closeImg) {
    this.windowID = windowID;
    this.windowImg = windowImg;
    this.closeImg = closeImg;

    // this.windScale = random(windowWidth*0.0002, windowWidth*0.0004); 
    this.windScale = random(0.4, 0.8);
    this.windW = this.windowImg.width * this.windScale;
    this.windH = this.windowImg.height * this.windScale;
    this.windX = random(0, width - this.windW); 
    this.windY = random(0, height - this.windH); 

    this.closeX = this.windX + (this.windW * 0.8920);
    this.closeY = this.windY + (this.windH * 0.0815);
    this.closeW = this.windW * 0.055;
    this.closeH = this.windH * 0.165;

    // rating window 
    this.rateDia = this.windW * 0.116;
    this.rateRad = this.rateDia / 2; 

    this.rateX1 = this.windW * 1.891/3;
    this.rateX2 = this.windW * 1.109/3;
    this.rateY = this.windH * 2.19/3;

    // screen window 
    this.screenW = this.windW * 0.293;
    this.screenH = this.windH * 0.264; 

    this.screenY = this.windH * 0.5815;
    this.screenX1 = this.windW * 0.515;
    this.screenX2 = this.windW * 0.197;  
  }

  display() {
    image(this.windowImg, this.windX, this.windY, this.windW, this.windH);
    
    if (this.isMouseOverClose()) {
      push();
      tint(255, 0, 0); 
      image(this.closeImg, this.closeX, this.closeY, this.closeW, this.closeH);
      pop();
    }

    if(this.windowID == "rate") {
      noFill(); 
      strokeWeight(this.windW * 0.0085);

      let rateState = this.getMouseOverRate(); 

      if (rateState == "right") stroke(255, 6, 5, 99.9); 
      else noStroke(); 
      circle(this.windX + this.rateX1, this.windY + this.rateY, this.rateDia);

      if (rateState == "left") stroke(70, 200, 70); 
      else noStroke();
      circle(this.windX + this.rateX2, this.windY + this.rateY, this.rateDia);
    }

    if(this.windowID == "screen"){
      noFill();
      strokeWeight(this.windW * 0.004);
      
      let screenState = this.getMouseOverScreen();

      if (screenState == "no") stroke(0, 96);
      else noStroke();
      rect(this.windX + this.screenX1, this.windY + this.screenY, this.screenW, this.screenH);

      if(screenState == "yes") stroke(0, 96);
      else noStroke(); 
      rect(this.windX + this.screenX2, this.windY + this.screenY, this.screenW, this.screenH);
    }
  }

  isMouseOverClose() {
    return (mouseX > this.closeX && mouseX < this.closeX + this.closeW && 
            mouseY > this.closeY && mouseY < this.closeY + this.closeH) 
  }

  // called by the mousePressed function 
  checkClicked() {
    return (this.isMouseOverClose() || this.getMouseOverRate() == "right" || this.getMouseOverRate() == "left" || this.getMouseOverScreen() == "yes" || this.getMouseOverScreen() == "no");
    
  }

  getMouseOverScreen() {
    if (mouseX > this.windX + this.screenX1 && 
        mouseX < this.windX + this.screenX1 + this.screenW && 
        mouseY > this.windY + this.screenY && 
        mouseY < this.windY + this.screenY + this.screenH) {
          return "no"
        }

    if (mouseX > this.windX + this.screenX2 && 
        mouseX < this.windX + this.screenX2 + this.screenW && 
        mouseY > this.windY + this.screenY && 
        mouseY < this.windY + this.screenY + this.screenH) {
          return "yes"
        }
        
    return "none";
  }

  getMouseOverRate() {
    // to do 
    if (dist(mouseX, mouseY, this.windX + this.rateX1, this.windY + this.rateY) < this.rateRad) {
      return "right";

    } else if (dist(mouseX, mouseY, this.windX + this.rateX2, this.windY + this.rateY) < this.rateRad){
      return "left";
    }
    return "none";
  }
}

function crop(img, x, y, w, h) {
  return img.get(x, y, w, h);
}

