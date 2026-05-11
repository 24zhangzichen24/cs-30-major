// bizerel demo

let pointX ;
let pointY;
let pointSize = 20;
let lineImage;
let ArrowImage;

function preload() {
  lineImage = loadImage('line.png');
  ArrowImage = loadImage('arrow.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  pointX = width / 2;
  pointY = height / 2;
}

function draw() {
  background(220);
  circle(pointX, pointY, pointSize);
  noFill();
  // bezier(P1X, P1Y, P2X, P2Y, P3X, P3Y, P4X, P4Y)
  // P2 = P1 + (P4 - P1) * Vector(-0.3, 0.8)
  // P3 = P1 + (P4 - P1) * Vector(0.1, 1.4)
  bezier(pointX, pointY,
    pointX + (mouseX - pointX) * -0.3, pointY + (mouseY - pointY) * 0.8,
    pointX + (mouseX - pointX) * 0.1, pointY + (mouseY - pointY) * 1.4,
    mouseX, mouseY
  );
  let arrowAngle = bezierTangent(pointX, pointY,
    pointX + (mouseX - pointX) * -0.3, pointY + (mouseY - pointY) * 0.8,
    pointX + (mouseX - pointX) * 0.1, pointY + (mouseY - pointY) * 1.4,
    mouseX, mouseY, 0.99
  );
  push();
  translate(mouseX, mouseY);
  rotate(arrowAngle);
  image(ArrowImage,-10,-10,20,20);
  pop();
  
 
}

