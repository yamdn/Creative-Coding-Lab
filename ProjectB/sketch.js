// states
let homePage, directoryPage; 
let compIcon, folderIcon, globeIcon, musicIcon, camIcon, noteIcon, gambleIcon; 

let windows, closeImg, windW, windH, windX, windY, isWindowVisible;
let windowArr = [];  
let windowPrompts = ["screen", "app", "rate"];
let windowDict; 

let appWindow, rateWindow, screenWindow, tokenWindow, noTokenWindow; 

// audio 
let churchill, santa, sinatra, vocals;

// new fonts
let pixFont; 

// tokens 
let token = 1000;
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

// check bank 
let bankInfo = ["starting tokens: " + token];
let bankWindow;
let bankWindW, bankWindH;
let bankScroll = 0;

// kslia 
let ksliaY1, ksliaY2;
let scrollDeltaK = 0;
let rectX, rectY, rectW, rectH, rectY1, rectY2;

// drawpad 
let drawX, drawY, drawW, drawH, drawTool, drawWindow;
let penColor = "";
let penSize = 5; 
let isDrawingClear = true;

// playMusic 
let currentSong; 
let musicAction; 
let musicPlaylist = []; 
let musicIndex = 0;
let musicProgress = 0;
let musicBarX, musicBarY, musicBarW, musicBarH, musicBar;

// checkNews
let checkNewsY1, checkNewsY2;
let scrollDeltaC = 0;
let totalScrolled; 
let paywallTarget; // Set the first random stopping point
let isScrollLocked = false;
let amtScrollY = 0;
let maxUnlockedY;
let minNewsScroll = 0;

// paywall tokens 
let paywall = {
  // drawpad features
  drawpad:   { cost: 30,  paid: false },
  eraser:    { cost: 10,  paid: false },
  red_pen:   { cost: 12,  paid: false },
  green_pen: { cost: 15,  paid: false },
  blue_pen:  { cost: 17,  paid: false },

  // playMusic features
  playMusic: { cost: 30,  paid: false },
  next:      { cost: 10,  paid: false },
  prev:      { cost: 10,  paid: false },

  // checkNews features
  checkNews: { cost: 80,  paid: false },
  scroll:    { cost: 100, paid: false },

  // extra
  removeAds:  { cost: 200, paid: false }
};
let drawPay, eraserPay, redPay, greenPay, bluePay, musicPay, nextPay, prevPay, newsPay, scrollPay, adPay;
let yesPressed = false;

let playGame, checkToken, kslia, drawpad, playMusic, checkNews; 



function preload() {
  homePage = loadImage("assets/images/homePage.png");
  directoryPage = loadImage("assets/images/directoryPage.png")
  appWindow = loadImage("assets/images/app.png");
  rateWindow = loadImage("assets/images/rate.png");
  screenWindow = loadImage("assets/images/screen.png");
  closeImg = loadImage("assets/images/closeWindow.png");

  playGame = loadImage("assets/images/playGame.png")
  handPose = ml5.handPose();

  checkToken = loadImage("assets/images/checkToken.png");
  kslia = loadImage("assets/images/kslia.png")
  drawpad = loadImage("assets/images/drawpad.png");
  playMusic = loadImage("assets/images/playMusic.png");
  checkNews = loadImage("assets/images/checkNews.png");

  soundFormats("mp3");
  churchill = loadSound("assets/audio/churchill");
  santa = loadSound("assets/audio/santa");
  sinatra = loadSound("assets/audio/sinatra");
  vocals = loadSound("assets/audio/vocals");

  pixFont = loadFont("assets/Retropix.ttf"); 
  windows = loadImage("assets/images/window.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initIcons();
  initMusic();
  textFont(pixFont);
  rateWindow = crop(windows, 0, 0, 1918, 628);
  appWindow = crop(windows, 0, 633, 1918, 618);
  screenWindow = crop(windows, 0, 630+622, 1918, 624);
  tokenWindow =  crop(windows, 0, 630+624+629, 1918, 624);
  noTokenWindow = crop(windows, 0, 630+624+629+630, 1924, 624);

  // ===== popup window =====
  windowDict = {
    app: appWindow,
    rate: rateWindow,
    screen: screenWindow,
    token: tokenWindow
  };
  spawnWindow(); 

  // bank scroll window settings 
  bankWindW = width*0.396;
  bankWindH = height*0.587;
  bankWindow = createGraphics(bankWindW, bankWindH);
  bankWindow.textFont(pixFont); 

  // kslia infinte loop settings 
  kslia.resize(width, 0); 
  ksliaY1 = 0;
  ksliaY2 = -kslia.height;

  rectX = kslia.width * 0.8123; // for the back toHomePage button
  rectY1 = ksliaY1 + (kslia.height * 0.05367); 
  rectY2 = ksliaY2 + (kslia.height * 0.05367); 

  rectW = kslia.width * 0.1575;
  rectH = kslia.height * 0.0234;

  // drawpad draw settings 
  drawX = width * 0.1;
  drawY = height * 0.158; 
  drawW = width * 0.794;
  drawH = height *0.6;
  drawWindow = createGraphics(drawW, drawH);
  drawWindow.clear();

  // playMusic 
  musicBarX = width*0.2371;
  musicBarY = height*0.49;
  musicBarW = width*0.50;
  musicBarH = height*0.12;

  musicBar = createGraphics(musicBarW, musicBarH)
  musicBar.textFont(pixFont);

  // checkNews infinte loop settings (similar to kslia)
  checkNews.resize(width, 0); 
  checkNewsY1 = 0;
  checkNewsY2 = -checkNews.height;
  paywallTarget = random(100, 500); // Set the first random stopping point
  totalScrolled = height;


  homePage.resize(width, height); 
}

function initMusic() {
  musicPlaylist.push({song: santa, display: "christmas theme"});
  musicPlaylist.push({song: vocals, display: "let's sing"});
  musicPlaylist.push({song: sinatra, display: "oldie but goodie"});
  musicPlaylist.push({song: churchill, display: "radio broadcast"});

  // musicPlaylist.push({song: , display: ""});
}

function initIcons() {
  // Left Side Icons
  icons.push({rx: 0.027,  ry: 0.08,  rw: 0.089,  rh: 0.198, page: "homePage", id: "playGame"});
  icons.push({rx: 0.017,  ry: 0.33,  rw: 0.095,  rh: 0.135, page: "homePage", id: "checkToken"});
  icons.push({rx: 0.026,  ry: 0.52,  rw: 0.089,  rh: 0.16,  page: "homePage", id: "kslia"});

  // Right Side Icons
  icons.push({rx: 0.8538, ry: 0.07,  rw: 0.103,  rh: 0.193, page: "homePage", id: "playMusic"});
  icons.push({rx: 0.8538, ry: 0.303, rw: 0.096,  rh: 0.175, page: "homePage", id: "drawpad"});
  
  // Taskbar / Bottom Area
  icons.push({rx: 0.741,  ry: 0.807, rw: 0.2485, rh: 0.098, page: "homePage", id: "toDirectoryPage"});
  icons.push({rx: 0.0115, ry: 0.938, rw: 0.033,  rh: 0.055, page: "homePage", id: "checkNews"}); 
  icons.push({rx: 0.9476, ry: 0.9352,rw: 0.03,   rh: 0.054, page: "homePage", id: "removeAds"});

  // directoryPage
  icons.push({rx: 0.525,  ry: 0.306,  rw: 0.093,  rh: 0.215, page: "directoryPage", id: "playGame"});
  icons.push({rx: 0.649,  ry: 0.33,   rw: 0.123,  rh: 0.19,  page: "directoryPage", id: "kslia"});
  icons.push({rx: 0.791,  ry: 0.33,   rw: 0.123,  rh: 0.19,  page: "directoryPage", id: "playMusic"});
  icons.push({rx: 0.534,  ry: 0.635,  rw: 0.078,  rh: 0.17,  page: "directoryPage", id: "drawpad"});
  icons.push({rx: 0.656,  ry: 0.635,  rw: 0.098,  rh: 0.17,  page: "directoryPage", id: "checkToken"});
  icons.push({rx: 0.797,  ry: 0.622,  rw: 0.11,   rh: 0.185, page: "directoryPage", id: "checkNews"});
  icons.push({rx: 0.029,  ry: 0.1645, rw: 0.1575, rh: 0.079, page: "directoryPage", id: "toHomePage"});

  //playGame 
  icons.push({rx: 0.054,  ry: 0.825, rw: 0.1575, rh: 0.079, page: "playGame", id: "toHomePage"});

  //checkToken 
  icons.push({rx: 0.054,  ry: 0.825, rw: 0.1575, rh: 0.079, page: "checkToken", id: "toHomePage"});

  // kslia + checkNews - independent icon function 

  //drawpad 
  icons.push({rx: 0.02533,  ry: 0.34235, rw: 0.0623, rh: 0.11, page: "drawpad", id: "trash"});
  icons.push({rx: 0.02533,  ry: 0.4776, rw: 0.0623, rh: 0.11, page: "drawpad", id: "pencil"});
  icons.push({rx: 0.02533,  ry: 0.6123, rw: 0.0623, rh: 0.11, page: "drawpad", id: "eraser"});
  icons.push({rx: 0.90647,  ry: 0.2084, rw: 0.0623, rh: 0.11, page: "drawpad", id: "minus_pen"}); 
  icons.push({rx: 0.90647,  ry: 0.3432, rw: 0.0623, rh: 0.11, page: "drawpad", id: "add_pen"}); 
  icons.push({rx: 0.90647,  ry: 0.4774, rw: 0.0623, rh: 0.11, page: "drawpad", id: "red_pen"}); 
  icons.push({rx: 0.90647,  ry: 0.6123, rw: 0.0623, rh: 0.11, page: "drawpad", id: "green_pen"}); 
  icons.push({rx: 0.90647,  ry: 0.7468, rw: 0.0623, rh: 0.11, page: "drawpad", id: "blue_pen"}); 
  icons.push({rx: 0.0541,  ry: 0.826365, rw: 0.1574, rh: 0.0779, page: "drawpad", id: "toHomePage"}); 

  // playMusic 
  icons.push({rx: 0.2371,  ry: 0.6245, rw: 0.1194, rh: 0.0611, page: "playMusic", id: "play"}); 
  icons.push({rx: 0.3667,  ry: 0.6245, rw: 0.1194, rh: 0.0611, page: "playMusic", id: "pause"}); 
  icons.push({rx: 0.4962,  ry: 0.6245, rw: 0.1194, rh: 0.0611, page: "playMusic", id: "next"}); 
  icons.push({rx: 0.6257,  ry: 0.6245, rw: 0.1194, rh: 0.0611, page: "playMusic", id: "prev"}); 
  icons.push({rx: 0.0541,  ry: 0.826365, rw: 0.1574, rh: 0.0779, page: "playMusic", id: "toHomePage"}); 
}



function draw() { 
  if (currentScreen == "homePage"){
    image(homePage, 0, 0);
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
    textAlign(LEFT, BASELINE);
    playRPS(videoX, videoY, videoW, videoH);
    fill('purple');
    textSize(width*0.06);
    text(str(token), width*0.21, height*0.45);
    noFill();

    drawHitboxes();

  } else if (currentScreen == "checkToken"){
    image(checkToken, 0, 0, width, height);

    drawHitboxes();
    displayBankInfo();

  } else if (currentScreen == "kslia"){
    image(kslia, 0, ksliaY1);
    drawKsliaHitbox(ksliaY1);

    image(kslia, 0, ksliaY2);
    drawKsliaHitbox(ksliaY2);

    scrollKsliaPage();

  } else if (currentScreen == "drawpad"){
    image(drawpad, 0, 0, width, height);
    drawHitboxes();
    drawOnCanvas();   

  } else if (currentScreen == "playMusic"){
    image(playMusic, 0, 0, width, height);
    drawHitboxes();
    startMusic(); 

  } else if (currentScreen == "checkNews"){
    image(checkNews, 0, checkNewsY1);
    drawKsliaHitbox(checkNewsY1);

    image(checkNews, 0, checkNewsY2);
    drawKsliaHitbox(checkNewsY2);

    scrollCheckNewsPage();
  }

  // display annoying windows 
  for(let i = 0; i <windowArr.length; i++) {
    windowArr[i].display(); 
  }
}

function isPaid(tool){
  return paywall.find(item => item.function === tool).paid(); 
}


function scrollCheckNewsPage() {

  console.log(checkNewsY1, scrollDeltaC, amtScrollY, paywallTarget);
  if (!(abs(amtScrollY) >= checkNews.height - height)){
    if (checkNewsY1 + scrollDeltaC > 0) {
      console.log("1")
      scrollDeltaC = 0;
    }


    let intendedDepth = abs(amtScrollY + scrollDeltaC);

    if (intendedDepth >= paywallTarget && !isScrollLocked) {
      isScrollLocked = true;  // prevent scrolling until the player chooses yes or no 
      scrollDeltaC = 0;     
      windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall.scroll.cost, "scroll"));
    
    // if they pressed no -- didn't pay more 
    }  else if (isScrollLocked) {
        // players are able to continue to scroll upwards, but not downwards. capped at amtScrollY == paywallTarget 
        if (checkNewsY1 + scrollDeltaC > amtScrollY) {
          checkNewsY1 += scrollDeltaC; 
        } else {
          scrollDeltaC = 0; // reset delta if players spam scroll downwards to bypass paywall
        }
    }

    // if they pressed yes -- continue scrolling 
    if (!isScrollLocked) {
      console.log("4")
      checkNewsY1 += scrollDeltaC;
      amtScrollY += scrollDeltaC; 
    }


  } else {
    console.log("no")
    checkNewsY1 += scrollDeltaC;
    checkNewsY2 += scrollDeltaC; 
    scrollDeltaC *= 0.92;
    
    if (checkNewsY1 > height) {
      checkNewsY1 = checkNewsY2 - checkNews.height; 
    } 
    if (checkNewsY2 > height) {
      checkNewsY2 = checkNewsY1 - checkNews.height; 
    }
    if (checkNewsY1 < -checkNews.height) {
      checkNewsY1 = checkNewsY2 + checkNews.height; 
    } 
    if (checkNewsY2 < -checkNews.height) {
      checkNewsY2 = checkNewsY1 + checkNews.height; 
    }

  }
}

function startMusic(){
  currentSong = musicPlaylist[musicIndex]; 
  let song = currentSong.song;
  displaySong();

  if (song.isLoaded()) {
    musicProgress = song.currentTime()/ song.duration(); 
  }
  
  musicBar.fill(0);
  musicBar.rect(0, height*0.094, width, height*0.015);

  musicBar.noStroke();
  musicBar.fill(255);
  musicBar.rect(width*0.003, height*0.0975, musicBarW * 0.987 * musicProgress, height*0.008);
      
  image(musicBar, musicBarX, musicBarY)

  if (musicAction === "play" && !song.isPlaying()){
    song.play();
  
  } else if (musicAction === "pause" && song.isPlaying()){
    song.pause();
  
  } else if (musicAction === "next"){
    skipSong();
    musicAction = "play"; // reset the action so it doesn't loop!

  } else if (musicAction === "prev"){
    prevSong();
    musicAction = "play"; // reset the action so it doesn't loop!
  
  } 
}

function displaySong() {
  musicBar.clear()
  musicBar.fill(0);
  musicBar.textSize(width*0.02)
  musicBar.text("playing now: ", 0, height*0.055);

  musicBar.textSize(width*0.04)
  musicBar.text(currentSong.display, width*0.13, height*0.055);
}

function skipSong() {
  musicPlaylist[musicIndex].song.stop(); 
  musicIndex++; // move to next
  
  if (musicIndex >= musicPlaylist.length) {
    musicIndex = 0;
  }
}

function prevSong() {
  musicPlaylist[musicIndex].song.stop();
  musicIndex--;
  
  if (musicIndex < 0) {
    musicIndex = musicPlaylist.length - 1;
  }
}

function drawOnCanvas(){
  image(drawWindow, drawX, drawY);

    if (mouseIsPressed) {
      if (mouseX > drawX && mouseX < drawX + drawW && mouseY > drawY && mouseY < drawY + drawH){
        
        let localX = mouseX - drawX;
        let localY = mouseY - drawY;
        let localPX = pmouseX - drawX;
        let localPY = pmouseY - drawY;

        drawWindow.strokeWeight(penSize);

        if (drawTool !== "trash") {
          if (drawTool === "eraser") {
          drawWindow.stroke(penColor); 
          } else {
          drawWindow.stroke(penColor);
          }
          drawWindow.line(localPX, localPY, localX, localY);
          isDrawingClear = false;

      }
    }
  }
}

function scrollKsliaPage(){
    ksliaY1 += scrollDeltaK;
    ksliaY2 += scrollDeltaK; 

    scrollDeltaK *= 0.92;

    if (ksliaY1 > height) {
      ksliaY1 = ksliaY2 - kslia.height; 
    } 
    if (ksliaY2 > height){
      ksliaY2 = ksliaY1 - kslia.height; 
    }

    if (ksliaY1 < -kslia.height) {
      ksliaY1 = ksliaY2 + kslia.height; 
    } 
    if (ksliaY2 < -kslia.height){
      ksliaY2 = ksliaY1 + kslia.height; 
    }
}

function drawKsliaHitbox(imgY){
  noFill();
  strokeWeight(width * 0.002);

  let rectY = imgY + (kslia.height * 0.05367); 
  let centerX = rectX + rectW / 2;
  let centerY = rectY + rectH / 2;
  let d = dist(mouseX, mouseY, centerX, centerY);
  let sensorRange = 130; 

  if (d < sensorRange) {
      let opacity = map(d, 0, sensorRange, 255, 0);
      strokeWeight(width * 0.002);
      stroke(128, 0, 128, opacity); 
      rect(rectX, rectY, rectW, rectH);  
    }
  noStroke();
}

function isMouseOverKsliaRect(imgY1, imgY2){
  let rectY1 = imgY1 + (kslia.height * 0.05367);
  let rectY2 = imgY2 + (kslia.height * 0.05367); 

  let overX = mouseX > rectX && mouseX < rectX + rectW;
  let overY1 = mouseY > rectY1 && mouseY < rectY1 + rectH;
  let overY2 = mouseY > rectY2 && mouseY < rectY2 + rectH;

  return overX && (overY1 || overY2);
}

function displayBankInfo() {
  bankWindow.background(0); 
  
  bankWindow.fill(0, 255, 0);
  bankWindow.textSize(width*0.02);
  bankWindow.textAlign(LEFT);

  bankWindow.text('Total tokens: ' + token, bankWindW*0.03, (bankWindH * 0.1) + bankScroll);
  bankWindow.text('===========', bankWindW*0.03, (bankWindH * 0.172) + bankScroll);

  for (let i = 0; i < bankInfo.length; i++) {
    let offset = bankWindH*(i/13);
    let yPosition = (bankWindH * 0.28) + offset + bankScroll; 

    bankWindow.text(bankInfo[i], bankWindW*0.03, yPosition);
  }

  image(bankWindow, width * 0.294, height * 0.25);
  
  // border 
  noFill();
  stroke(0, 0, 255);
  rect(width * 0.294, height * 0.25, bankWindW, bankWindH);
}

function mouseWheel(event) {
  if (currentScreen === "checkToken") {
    bankScroll -= event.delta;
    
    let totalContentHeight = bankInfo.length * 60;
  
    // constrain so you can't scroll past the content
    bankScroll = constrain(bankScroll, -(totalContentHeight + 200), 0);
  }

  if (currentScreen === "kslia") {
    scrollDeltaK -= event.delta * 0.2;
  }

  if (currentScreen === "checkNews") {
    scrollDeltaC -= event.delta * 0.2;
  }

  return false
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  homePage.resize(width, height);  

  // kslia
  kslia.resize(width, 0);
  ksliaY1 = 0;
  ksliaY2 = -kslia.height; 

  // checkNews
  checkNews.resize(width, 0);
  checkNewsY1 = 0;
  checkNewsY2 = -checkNews.height; 
}

function playRPS(x, y, w, h){
  push(); 
  translate(x,y);
  textAlign(CENTER, CENTER);
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
  textAlign(CENTER, CENTER);
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
    bankInfo.push("won double or nothing RPS x2")

    return 
    
  } else if (result.includes("LOSE") && isGambling) {
    token = 0;
    winStreak = 0; // Reset streak on loss
    multiplier = 1; // Reset multiplier on loss
    bankInfo.push("lost double or nothing RPS >:P")
    return 
  }  
  
  if (result.includes("WON")) {
    winStreak++; 
    token+=1;
    bankInfo.push("won RPS +1")
  } else if (result.includes("Lose")){
    winStreak = 0;
    token-=1;
    bankInfo.push("lost RPS -1")
  }
  console.log(result);
}

function drawHitboxes() {
  let sensorRange = 80; 

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

      if ((b.page == "drawpad" || b.page == "playMusic") && b.id !== "toHomePage" ){
        stroke(0, 90); 
      } else {
        stroke(128, 0, 128, opacity); 
      }
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
    userMove = "Ready";
    aiMove = "Ready";
  }
}

function mousePressed() {
  // check annoying windows FIRST (Top layer)
  for (let i = windowArr.length - 1; i >= 0; i--) {
    let win = windowArr[i];

    if (win.checkClicked()) {
      if (win.windowID === "token" && !win.checkPaid() && yesPressed ) {
        windowArr.splice(i, 1);
        let noToken = new createWindow(noTokenWindow, closeImg, "noToken");
        windowArr.push(noToken);
      
      } else {
        windowArr.splice(i, 1);
        
        // YES paid for more scroll
        if (currentScreen === "checkNews" && yesPressed){
          paywallTarget += random(100, 500); 
          isScrollLocked = false;
          scrollDeltaC = 0;   

          // NO pay for more scroll
        } else if (currentScreen === "checkNews"){
          isScrollLocked = false;
          scrollDeltaC = 0;   
        }

        return;
      }
    }    
  }

  for (let b of icons) {
    if (b.page !== currentScreen) continue;

    let realX = width * b.rx;
    let realY = height * b.ry;
    let realW = width * b.rw;
    let realH = height * b.rh;

    if (mouseX > realX && mouseX < realX + realW &&
        mouseY > realY && mouseY < realY + realH) {
      
      console.log("Icon Pressed: " + b.id);

      // transitions
      if (b.id === "toDirectoryPage") {
        currentScreen = "directoryPage";

      } else if (b.id === "toHomePage") {
        // if we're leaving the game screen kill the camera
        if (currentScreen === "playGame") {
          toggleCamera(); 
        }
        currentScreen = "homePage";

      } else if (b.id === "playGame") {
        toggleCamera(); 
        currentScreen = "playGame";

      } else if (b.id === "checkToken"){
        currentScreen = "checkToken";

      } else if(b.id === "kslia"){
        currentScreen = "kslia";
      
      } else if (b.id === "removeAds") {
        if (!paywall[b.id].paid){
          windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall[b.id].cost, b.id));
        }

      } else if (b.id === "drawpad"){
        if (paywall[b.id].paid){
          currentScreen = "drawpad";
        } else {
          windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall[b.id].cost, b.id));
        }
      
      } else if (b.id === "playMusic"){
        if (paywall[b.id].paid){
          currentScreen = "playMusic";
        } else {
          windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall[b.id].cost, b.id));
        }
      
      } else if (b.id === "checkNews"){
        if (!paywall[b.id].paid){
          windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall[b.id].cost, b.id));
        } else {
          currentScreen = "checkNews";
        }
      }

      if (b.id === "trash" || b.id === "pencil" || b.id === "eraser" || b.id === "minus_pen" || b.id === "add_pen" || b.id === "red_pen" || b.id === "green_pen" || b.id === "blue_pen"){

        if (b.id === "trash" && isDrawingClear != true){
          drawWindow.clear()
          isDrawingClear = true;
        
        } else if  (b.id === "minus_pen" && penSize > 1){
          penSize -= 2; 

        } else if  (b.id === "add_pen" && penSize < 13){
          penSize += 2; 

        } else if  (b.id === "pencil"){
          penColor = 'black'; 
        
        } else if  (b.id === "red_pen"){
          if (paywall[b.id].paid){
            penColor = 'red'; 
          } else {
            windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall[b.id].cost, b.id));
          }
        
        } else if  (b.id === "green_pen"){
          if (paywall[b.id].paid){
            penColor = 'green'; 
          } else {
            windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall[b.id].cost, b.id));
          }
        
        } else if  (b.id === "blue_pen"){
          if (paywall[b.id].paid){
            penColor = 'blue'; 
          } else {
            windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall[b.id].cost, b.id));
          }
        } else if (b.id === "eraser"){
          if (paywall[b.id].paid){
            penColor = 'white'; 
          } else {
            windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall[b.id].cost, b.id));
          }
        }  

        drawTool = b.id;
      }

      if (b.id === "play" || b.id === "pause") {
        musicAction = b.id; 
      
      } else if (b.id === "next" || b.id === "prev"){
        if (!paywall[b.id].paid){
          windowArr.push(new createWindow(tokenWindow, closeImg, "token", paywall[b.id].cost, b.id));
        } else {
          musicAction = b.id; 
        }
      }
    }
  }

  if (currentScreen === "kslia" && isMouseOverKsliaRect(ksliaY1, ksliaY2)){
    currentScreen = "homePage"
  }

  if (currentScreen === "checkNews" && isMouseOverKsliaRect(checkNewsY1, checkNewsY2)){
    currentScreen = "homePage"
  }
}

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
  if (paywall.removeAds.paid) {
    return;
  }
  let randKey = random(windowPrompts); 
  let img = windowDict[randKey];

  windowArr.push(new createWindow(img, closeImg, randKey));
  // setTimeout(spawnWindow, random(1000, 3000)); 
  setTimeout(spawnWindow, random(30000, 60000)); 
}

class createWindow {
  constructor(windowImg, closeImg, windowID, token = null, tool = null) {
    this.windowID = windowID;
    this.windowImg = windowImg;
    this.closeImg = closeImg;
    this.token = token; 
    this.tool = tool;


    // this.windScale = random(windowWidth*0.0002, windowWidth*0.0004); 
    if(windowID === "token" || windowID === "noToken"){
      this.windScale = width*0.0003;
    } else {
      this.windScale = random(0.2, 0.4);
    }

    this.windW = this.windowImg.width * this.windScale;
    this.windH = this.windowImg.height * this.windScale;
    
    if (windowID === "token" || windowID === "noToken"){
      this.windX = (width / 2) - (this.windW / 2);
      this.windY = (height / 2) - (this.windH / 2);
  
    } else {
      this.windX = random(0, width - this.windW); 
      this.windY = random(0, height - this.windH); 
    }

    this.closeX = this.windX + (this.windW * 0.8914);
    this.closeY = this.windY + (this.windH * 0.0867);
    this.closeW = this.windW * 0.055;
    this.closeH = this.windH * 0.165;

    // rating window 
    this.rateDia = this.windW * 0.116;
    this.rateRad = this.rateDia / 2; 

    this.rateX1 = this.windW * 0.628;
    this.rateX2 = this.windW * 0.3643;
    this.rateY = this.windH * 2.19/3;

    // screen window 
    this.screenW = this.windW * 0.293;
    this.screenH = this.windH * 0.259; 

    this.screenY = this.windH * 0.5899;
    this.screenX1 = this.windW * 0.51;
    this.screenX2 = this.windW * 0.189;  

    // token window 
    this.tokenX1 = this.windW * 0.572; 
    this.tokenX2 = this.windW * 0.193; 
    this.tokenY = this.windH * 0.655;
    this.tokenW = this.windW * 0.236;
    this.tokenH = this.windH * 0.209; 

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
      noStroke();
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
      noStroke();
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

    if (this.windowID == "token"){
      noStroke();

      fill(0)
      textAlign(CENTER, CENTER); 
      textSize(width*0.035);
      text("token plz:  " + this.token + "  -`v´-", this.windW/2 + this.windX, this.windH * 0.47 + this.windY);

      let tokenState = this.getMouseOverScreen();
      
      noFill();
      strokeWeight(this.windW * 0.004);
      if (tokenState == "no") stroke(0, 96);
      else noStroke();
      rect(this.windX + this.tokenX1, this.windY + this.tokenY, this.tokenW, this.tokenH);

      if (tokenState == "yes") stroke(0, 96);
      else noStroke();
      rect(this.windX + this.tokenX2, this.windY + this.tokenY, this.tokenW, this.tokenH);
    }
  }

  isMouseOverClose() {
    return (mouseX > this.closeX && mouseX < this.closeX + this.closeW && 
            mouseY > this.closeY && mouseY < this.closeY + this.closeH) 
  }

  // called by the mousePressed function 
  checkClicked() {
    if(this.getMouseOverRate() === "right" && this.windowID == "rate"){
      token+=5;
      bankInfo.push("positive rating +5 token");

    } else if(this.getMouseOverRate() === "left" && this.windowID == "rate"){
      token-=3; 
      bankInfo.push("negative rating -3 token");

    } else if (this.getMouseOverScreen() === "yes" && this.windowID == "screen"){
      let coinflip = random(0, 1);
      if (coinflip > 0.5){
        token *= 2; 
        bankInfo.push("you want screen time. x2 token!");
      } else {
        token = 0; 
        bankInfo.push("fine. leave.");
      }
      
    } else if (this.getMouseOverScreen() === "no" && this.windowID == "screen"){
      token += 5; 
      bankInfo.push("keep on playing~ +5 token");
    
    } else if (this.getMouseOverToken() === "yes" && this.windowID == "token"){
      yesPressed = true;      
    } 

    else if (this.getMouseOverToken() === "no" && this.windowID == "token"){
      yesPressed = false;
    }

    return (this.isMouseOverClose() || this.getMouseOverRate() == "right" || this.getMouseOverRate() == "left" || this.getMouseOverScreen() == "yes" || this.getMouseOverScreen() == "no");
  }

  checkPaid(){
    if (this.token === null){
      return;
    }

    if (token >= this.token && yesPressed){
      token -= this.token;
      bankInfo.push(this.tool + " feature unlocked! paid " + this.token);
      paywall[this.tool].paid = true; 
      return true
    } 
    return false;
  }

  getMouseOverToken(){
    if (mouseX > this.windX + this.tokenX1 && 
        mouseX < this.windX + this.tokenX1 + this.tokenW && 
        mouseY > this.windY + this.tokenY && 
        mouseY < this.windY + this.tokenY + this.tokenH) {
          return "no"
        }

    if (mouseX > this.windX + this.tokenX2 && 
        mouseX < this.windX + this.tokenX2 + this.tokenW && 
        mouseY > this.windY + this.tokenY && 
        mouseY < this.windY + this.tokenY + this.tokenH) {
          return "yes"
        }
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