/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let littleGuy1;
let littleGuy2;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  let headSize = 50;
  let r = random(255);
  let g = random(255);
  let b = random(255); 

  littleGuy1 = new littleGuy(width / 2, height / 2, headSize, r, g, b);
  littleGuy2 = new littleGuy(width / 2, height / 2, headSize, r + 100, g + 100, b + 100, true);
}

function draw() {
  background(0);
  drawFloor(); // for reference only
  

  littleGuy1.update();
  littleGuy1.display();

  littleGuy2.update();
  littleGuy2.display();

}

class littleGuy {
  constructor(startX, startY, headSize, r, g, b, reflect = false) {
    this.x = startX;
    this.y = startY;
    this.headSize = headSize;
    this.reflect = reflect;

    // animation variables
    this.bobX = 0;
    this.bobY = 0;
    this.legStep = 0;
    this.armL = 0;
    this.armR = 0;

    this.bodyColor = color(r, g, b); 
  }

  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
    let choppyTime = floor(frameCount / 10) * 0.7;
    let armTime = floor(frameCount / 13) * 0.6;

    // bobbing head motion
    this.bobX = map(cos(choppyTime), -1, 1, -2.8, 2);
    this.bobY = map(cos(choppyTime), -1, 1, -2.8, 2);
    
    // leg movement variable
    this.legStep = map(cos(choppyTime), -1, 1, -3, 8);
    
    // arm movement variables (opposite movement)
    this.armL = map(sin(armTime), -1, 1, 0, this.headSize - 10);
    this.armR = map(-sin(armTime), -1, 1, 0, this.headSize - 10);   
  }

  display() {
    push();
    translate(this.x, this.y);
    if (this.reflect) {
      translate(this.headSize/1.5, 0);
      scale(-1, 1);
    } else {
      translate(-this.headSize/1.5, 0);
    }

    fill(this.bodyColor);
    stroke(10);
    this.drawLegs();
    this.drawArms();

    fill(this.bodyColor);
    beginShape();
    curveVertex(-this.headSize / 2.8, this.headSize / 3);
    curveVertex(-this.headSize / 2.8 + this.bobX, this.headSize / 3);

    curveVertex(-this.headSize / 3 + (this.bobX/2), (this.headSize * 1.1)); 
    curveVertex(this.headSize / 3 + (this.bobX/2), (this.headSize * 1.1));

    curveVertex(this.headSize / 2.8 + this.bobX, this.headSize / 3);
    curveVertex(this.headSize / 2.8, this.headSize / 3);
    endShape();  

    circle(this.bobX, this.bobY, this.headSize);
    this.drawFace();


    this.drawFace();
    if (!this.reflect) {
        this.drawHeart();
        this.drawReferenceShapes();
    }
    pop();
  }

  drawLegs() {
    triangle(-this.headSize / 3, (this.headSize * 1.1), 
             -this.headSize / 2.4 + this.legStep, (this.headSize * 1.45), 
             -this.headSize / 8, (this.headSize * 1.2)); 

    triangle(this.headSize / 3, (this.headSize * 1.1), 
             this.headSize / 2.4 + this.legStep, (this.headSize * 1.45), 
             this.headSize / 8, (this.headSize * 1.2)); 
  }

  drawArms() {
    let differY = (this.headSize * 1.1 - this.headSize / 3) * 0.96;
    
    triangle(-this.headSize / 3, differY,
             -this.headSize / 1.4, (differY * 0.2) + this.armL,
             -this.headSize / 3, differY * 0.68);

    triangle(this.headSize / 3, differY,
             this.headSize / 1.4, (differY * 0.2) + this.armR,
             this.headSize / 3, differY * 0.68);
  }

  drawFace() {
    textAlign(CENTER, CENTER);
    textSize(this.headSize/3);
    fill(0);
    noStroke();
    
    //  screen position for face hover to change expression
    let currentX = this.x + (this.reflect ? this.headSize/1.5 : -this.headSize/1.5);
    let d = dist(mouseX, mouseY, currentX + this.bobX, this.y + this.bobY);

    if (d < this.headSize / 2) {
      text(" ͡= ㅅ ͡=", this.bobX, this.bobY);
    } else {
      text(" ͡• ㅅ ͡•", this.bobX, this.bobY);
    }
  }

  drawHeart() {
    push();
    translate(this.headSize/1.5, 0); 

    fill('pink');
    textAlign(CENTER, CENTER);  
    textSize(this.headSize/3);
    text("˚ʚ♡ɞ˚", 0, -this.headSize*2/3 + map(sin(frameCount/50), -1, 1, -1, -5));

    pop();
  }

  drawReferenceShapes() {
    push(); // new translation
    translate(this.headSize/1.5, 0); 

    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
    pop();
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/