// images 
let scanned = [];
let temp_green = [];
let temp_purple = [];

let blue;
let green; 
let purple; 

// background
let bg_img;
let bgX = 0; 
let bgY = 0;
let setSeed;  

// stars
let stars = []; 
let starX = [];
let starY =[];
let starColor = [];
let starOffset = [];
let starSFX;

// blue creature
let blueX; 
let blueY; 
let targetX;
let targetY; 

// green creature
let greenX;
let greenY;
let greenSpeedX = 3;
let greenSpeedY = 3; 
let greenSize = 0.1; 
let greenSFX; 

// current frames
let curBlue = 0;
let curGreen = 0;
let curStar = 0;

function preload() {
  for (let i = 1; i <= 7; i++) {
    scanned.push(loadImage("20260320115654-" + i + ".jpg"));
  }
  bg_img = loadImage("color.jpg");
  greenSFX = loadSound("punch.mp3");
  starSFX = loadSound("sparkle.mp3");
}

function setup() {
  createCanvas(800, 500);
  eraseBg(scanned, 10);
  temp_green.push(scanned[0]);
  temp_green.push(scanned[2]);
  temp_green.push(scanned[3]);

  temp_purple.push(scanned[3]); 
  temp_purple.push(scanned[2]); 
  temp_purple.push(scanned[1]); 

  blue = crop(scanned.slice(4, 7), 100, 200, 750, 900);
  green = crop(temp_green, 0, 0, 800, 700); 
  purple = crop(temp_purple, 1860, 1200, 1500, 400);

  setSeed = int(random(1000)); 
  // blue creature setup
  blueX = random(width); 
  blueY = random(height); 
  targetX = random(width);
  targetY = random(height);

  // green creature setup
  greenX = random(width);
  greenY = random(height);
}

function draw() {
  randomSeed(setSeed);
  tint(130, 155, 170, 100);
  background(bg_img.get(bgX, bgY, 300, 300), 100);
  noTint();
  
  if (frameCount % 50 == 0) { // background changes every n frames
      bgX = Math.random() * (bg_img.width - 300);
      bgY = Math.random() * (bg_img.height - 300);
  }

  draw_stars(); // stars function 
  draw_blue(); // blue function 
  draw_green(); // green function  
 
  // mouseOnScreen(); 
   
}

function mouseOnScreen(){
  if (mouseX > width || mouseX < 0 || mouseY > height || mouseY < 0){
    return false;
  }
  return true;
}

function draw_green(){
  if (greenSize > 0.8) {
    greenSize = 0.01;
  }

  greenX += greenSpeedX;
  greenY += greenSpeedY;

  let wid = green[0].width * greenSize;
  let hig = green[0].height * greenSize;

  if (greenX > width - wid || greenX < 0) {
    greenSpeedX *= -1;
    greenSize += 0.02; 
    wid = green[0].width * greenSize;     // recompute size after growth
    greenSFX.play();

    // clamp 
    if (greenX > width - wid) greenX = width - wid;
    if (greenX < 0) greenX = 0;
  }

  if (greenY > height - hig || greenY < 0) {
    greenSpeedY *= -1;
    greenSize += 0.02;
    hig = green[0].height * greenSize;     // recompute size after growth
    greenSFX.play();

    // clamp
    if (greenY > height - hig) greenY = height - hig;
    if (greenY < 0) greenY = 0;
  }

  image(green[curGreen], greenX, greenY, wid, hig);
  curGreen = floor((frameCount / 20) % green.length);
}

function draw_blue(){
  image(
    blue[curBlue], 
    blueX,
    blueY,
    blue[0].width * 0.1,
    blue[0].height * 0.1
  );
  print(starX.length);

  if (stars.length == 0 || !(mouseOnScreen())) {
    if (frameCount % 90 == 0) {
    targetX = Math.random() * (width); 
    targetY = Math.random() * (height);
    }

    blueX = lerp(blueX, targetX, 0.01);
    blueY = lerp(blueY, targetY, 0.01);

  }
  else{
    blueX = lerp(blueX, starX[stars.length-1], 0.05);
    blueY = lerp(blueY, starY[stars.length-1], 0.05);
  }
  curBlue = floor((frameCount / 20) % blue.length);
}

function draw_stars(){
  // stars
  for(let i=0; i<stars.length; i++) {
    push();
    translate(starX[i], starY[i]);
    let starSize = random(0.05, 0.2); 
    let localFrame = frameCount + starOffset[i];
    let localStar = floor((localFrame / 20) % stars[i].length);

    let wid = stars[i][localStar].width * starSize;
    let hei = stars[i][localStar].height * starSize; 
    // ++ NOTE: adding tint works for stars < 4 before it begins to lag which we don't want 
    // tint(starColor[i]);  

    image(
      stars[i][localStar],
      0 - wid/6,
      0 - hei,
      wid,
      hei
    );
    pop(); 
  }

  if (frameCount % 150 == 0) {
    stars.shift();
    starX.shift();
    starY.shift();
    // starColor.shift();
    starOffset.shift();

  }
}

function mousePressed(){
  // star object and positions 
  starSFX.play();
  stars.push(purple);
  starX.push(mouseX);
  starY.push(mouseY); 

  // starColor.push([random(255), random(255), random(255)]); // star color -- comment out due to tint related lag
  starOffset.push(random(0, 1000)); // offset movement for each star 
}


// You shouldn't need to modify these helper functions:
function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 10) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned
}
