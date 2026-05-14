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
  let x1 = pointX + (mouseX - pointX) * -0.3;
  let y1 = pointY + (mouseY - pointY) * 0.8;
  let x2 = pointX + (mouseX - pointX) * 0.1;
  let y2 = pointY + (mouseY - pointY) * 1.4;
  
  bezier(pointX, pointY,
    x1, y1,
    x2, y2,
    mouseX, mouseY
  );
  let tx = bezierTangent(pointX,
    x1, 
    x2,
    mouseX, 0.99);
  let ty = bezierTangent(pointY,
    y1, 
    y2,
    mouseY, 0.99);
  let arrowAngle = atan2(ty, tx
  );
  push();
  translate(mouseX, mouseY);
  rotate(PI);
  image(ArrowImage,-10,-10,20,20);
  pop();
  console.log(arrowAngle);
 
}

