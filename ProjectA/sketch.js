/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let x;
let y;
let R = 100;
let vNumber = 200;
let smoothness = 0.5;

// function setup() {
//     let canvas = createCanvas(800, 500);
//     canvas.id("p5-canvas");
//     canvas.parent("p5-canvas-container");
// }

let s = 8; 
let inset = true; 
let insetLine = true; 
let randomNum; 
let count = 0; 
let shapeSwitch = true;
let drawing; 
let creatures = 1; 
let currentX = 0;
let currentY = 0;
let colorSeed; 

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");

    // createCanvas(800, 500);
    colorMode(HSB);
    randomNum = random(420);
    colorSeed = random(1, 100);
    
    drawing = createGraphics(width, height);
    drawing.colorMode(HSB);
}

function draw() {
    background(map(noise(frameCount/200, 
                        frameCount/100), 0, 1, 50, 110), 55, 50);
    randomSeed(randomNum);
    noStroke();
    flowers();
    stem();
    
    // draw()
    drawing.erase(0.05, 0);
    drawing.noStroke();
    drawing.rect(0, 0, width, height);
    drawing.noErase();
    
    image(drawing, 0, 0);
    
    for (let i = 0; i < creatures; i+= 1){
        let orb_size = map(sin(frameCount/ random(30, 50) + random(40)), -1, 1, 30, 60);
        drawCreature(orb_size, i);
    }
}

function mouseClicked(){
    creatures += 1; 
}

function keyPressed() {
    if (keyCode === 32) {
        creatures = 0;
        colorSeed = random(10000);
        drawing.clear(); 
    }
}

function drawCreature(orb_size, index) {
    let offset = index * 1000;
    
    let x = random(0.7, 1.5) * width * 
                noise(frameCount/ random(200, 500) + offset + 
                random(400, 800));
    
    let y = random(0.3, 1.8) * height * 
                noise(frameCount/ random(200, 600) + offset + 
                random(300, 500));
    
    if (x > width - orb_size/2){
        x = width - orb_size/2;
    } else if (x < 0 + orb_size/2) {
        x = orb_size/2; 
    }
    
    if ( y > height - orb_size/2){
        y = height - orb_size/2;
    } else if (y < 0 + orb_size/2) {
        y = orb_size/2; 
    }
    
    
    // default x and y above ↑
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        let speed = random(0.01, 0.09); 
        let mouseDis = 10 * random(5, 20);
        let angle = frameCount * speed;

        x = mouseX + cos(angle) * mouseDis;
        y = mouseY + sin(angle) * mouseDis;
        
        x += map(noise(frameCount/random(100, 200)), 0, 1, -10, 10);
        y += map(noise(frameCount/random(100, 200)), 0, 1, -10, 10);
    }

    noStroke();
    randomSeed(colorSeed + offset);
    let h = random(360);      // hue 
    let s = random(50, 100);  // saturation 
    let b = random(50, 100);  // brightness 
    let a = map(sin(frameCount/ 100 + random(1, 10)), -1, 1, 0.2, 0.8); // transparency 
    
    // drawCreature(...) function
    drawing.noStroke();
    drawing.fill(h, s, b, a); 
    drawing.circle(x, y, orb_size); 

    fill(h, s, b, 0);
    circle(x, y, orb_size);
    let pattern_angle = random(360);
    
    draw_pattern(x, y, orb_size, pattern_angle, h, s, b);
}

function draw_pattern(wid, hig, size, angle, cHue, cSat, cBright) {
    let iteration = int(random(0, 5));

    draw_orbit(wid, hig, size, cHue, cSat, cBright);
    spikey_pattern(wid, hig, size/3, iteration, cHue, cSat, cBright);  
    draw_eyes(wid, hig, size);
    weird_blob(wid, hig, size); 
}

function draw_orbit(wid, hig, size, cHue, cSat, cBright) {
    push(); 
    translate(wid, hig);
    let constrast_hue; 
    
    for (let j = size/ 1.9; j > size/4; j /= 1.3){
        for (let i = 0; i < 360; i += 10) {
        rotate(radians(i));

        stroke(cHue, cSat + random(-10,10), 100);
        strokeWeight(0.9 + abs(sin(frameCount/100)) * map(size, 30, 60, 0.7, 0.9));
        
        let pulse = map(sin(frameCount / 100), -1, 1, -size / 9, size / 9);
        line(j, 0, j, pulse);
        }
    }  
    pop();
}

function spikey_pattern(wid, hig, size, iter, cHue, cSat, cBright){
    push(); 
    translate(wid, hig);
    for (let j = 0; j < iter; j++){          // number of itererations 
      for (let i = 0; i < 360; i += random(10, 50)) {    // step of rotation around the orb 
        rotate(radians(i));
        stroke(cHue + random(-50, 50), 
               cSat + random(-20, 20), 
               cBright + random(-10, 30));
        // stroke('black');
        strokeWeight(0.9 + abs(sin(frameCount/100)) * map(size, 20, 100, 0.8, 1));

        line(0, random(0.1,1), 
             size, map(sin(frameCount/ random(10,50)), 
             -1, 1, 
             -size, size));
      }
    }
    pop();
}

function draw_eyes(wid, hig, size) {
    push();
    translate(wid, hig); 
    
    fill(255, 0.8); 
    strokeWeight(1);

    let eyeDist = size / 5;    // How far apart the eyes are
    let eyeSize = size / 4;    // How big the eyes are
    let eyeHeight = size / 35; // How high up they are on the face

    // Left Eye
    circle(-eyeDist, -eyeHeight, eyeSize);
    
    // Right Eye
    circle(eyeDist, -eyeHeight, eyeSize);
    
    fill(50, 1);
    let lookX = map(sin(frameCount/ 40 + random(10)), -1, 1, -2, 2);
    circle(-eyeDist + lookX, -eyeHeight, eyeSize / 2);
    circle(eyeDist + lookX, -eyeHeight, eyeSize / 2);
    
    pop();
}


function weird_blob(wid, hig, orb_size) {
    push(); 
    translate(wid, hig); 
    beginShape();
    stroke(255);
    
    let n = 80;
    let curves = random(3, 9);
    
    noFill(); 

    for (let i = -2; i <= n + 3; i++) {
        let angle = map(i, 0, n, 0, TWO_PI);
        
        // wobble logic
        let offset = map(i, 0, n, 0, TWO_PI * curves); 
        let rad = (orb_size / 2) + sin(frameCount / 10 + offset) * 10;
        
        // x and y calculated relative to (0,0)
        let x = cos(angle) * rad;
        let y = sin(angle) * rad;
        
        curveVertex(x, y);
    }
    
    endShape(); 
    pop(); 
}



// ====== BACKGROUND COMPONENTS ======
function flowers(){
    fill(255);
    for(let x = 10; x < width; x+=30){
        for(let y = 5; y < height + 20; y+=10){
            let noiseVal = noise(x/60 + frameCount/300, y/50 + frameCount/700);      
            let s = map(noiseVal, 0, 1, 0, 10);
            fill(map(noiseVal, 0, 1, 0, 100), 
                map(noiseVal, 0, 1, 55, 75), 
                map(noiseVal, 0, 1, 80, 90));

            if (!inset){
                noStroke();
                circle(x + 10, y-s, s*3);
                line(x + 10, y-s, x + 10, y+10-s);
                inset = true; 
            }
            else {
                line(x, y-s, x, y + 10-s);
                circle(x, y-s, s*5);
                inset = false;
            }
        }
    }
}


function stem() {
    noFill();
    strokeWeight(2);

    // Keep the plants in their random spots
    randomSeed(randomNum); 

    for (let i = 0; i < 400; i++) {
        let x = random(width);
        let y = random(height);
        
        let noiseVal = noise(x/10 + frameCount/random(80,100), 
                            y/10 + frameCount/random(80,100));      
        let sway = map(noiseVal, 0, 1, random(10), random(30,80));
        let h = random(5, 20);
        

        stroke('green');
        strokeWeight(random(3))

        curve(
        x, y + 50,          // Control Point 1 
        x, y,               // Start Point 
        
        x - sway * 0.95, y - h * 2.1,    // End Point 
        x - sway * 1.05, y - h * random(3, 5) + sway // Control Point 2 
        );
    }
}
