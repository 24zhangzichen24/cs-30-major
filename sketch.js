let cards = [];
let numberOfCards = 17;
let numberOfDrawing_round = 6;
let numberOfHolding = 0;
let cardsize = 60;
let drawCardsPile = [];
let holdCards = [];
let foldCardsPile = [];
let mapList = [];
let ifDragging = false;

let discardPilePositionX;
let discardPilePositionY;
let drawPilePositionX;
let drawPilePositionY;
let upperPartHeight;
let mapWidth;

let map_symbol;
let gamemode = 'map'; // 'map' or 'combat'

function preload() {
  // Load any assets (images, sounds, etc.) here if needed
  preloadCardImages();
  map_symbol = loadImage('map_symbol.png');
  

}

function preloadCardImages() {
  // This function can be used to load card images if you have them
}

class Card {
  constructor(number) {
    this.number = number;
    this.rarity = random(['common', 'rare', 'legendary']);
    this.category = random(['attack', 'skill', 'ability']);
    this.x = 0;
    this.y = 0;
    this.ifBeingDragged = false;
    this.size = 60;
  }


  displayACard(index, ifDragging = false) {
    let startX = (width - (holdCards.length * (this.size + 10) - 10)) / 2;
    if (!ifDragging) {
      this.x = startX + index * (this.size + 10);
      this.y = height - this.size - 90;
    }

    fill(255);
    rect(this.x, this.y, this.size, this.size * 1.5);

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(12);
    text(`${this.number}`, this.x + this.size / 2, this.y + this.size * 1.5 / 4);
    text(`${this.rarity}`, this.x + this.size / 2, this.y + this.size * 1.5 / 2);
    text(`${this.category}`, this.x + this.size / 2, this.y + 3 * this.size * 1.5 / 4);  
  }

  update(){
    this.adjustSizeBasedOnMouse();
  }

  adjustSizeBasedOnMouse(){
    let mouseDistance = dist(mouseX,mouseY,this.x,this.y);
    if (ifTouchingCard){
      let theSize = map(mouseDistance, 0, this.reach, this.maxRadius, this.minRadius);
      this.radius = theSize;
    }
    else{
      this.radius = this.minRadius;
    }
  }

  // foldingAnime(){
  //   let t = 0;
  //   // change this.x and this.y to Discard position by a quadratic function
  //   while(t < 120){
  //     this.x += (discardPilePositionX - this.x) / 120;
  //     this.y += (discardPilePositionY - this.y) / 120;
  //     t++;
  //     console.log(this.x, this.y);
  //   }

  // }
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  setGolbalVariables();
  creatMap();
  
  for (let i = 0; i < numberOfCards; i++) {
    let card = new Card(i+1);
    cards.push(card);
    // At the start of the game, the cards are shuffled into the draw pile in a random order.
    drawCardsPile.push(cards[i]);
  }

  shuffle(drawCardsPile, true);

  for (let i = 0; i < numberOfDrawing_round; i++) {
    if (drawCardsPile.length > 0) {
      let drawnCard = drawCardsPile.pop();
      holdCards.push(drawnCard);
    }
  }

  numberOfHolding = holdCards.length;
}



function draw() {
  background(100);
  
  // Display the cards in the player's hand
  
  // Display the number of cards in the draw pile and discard pile
  partOfText();
  for (let i = 0; i < holdCards.length; i++) {
    holdCards[i].displayACard(i, ifDragging);
  }
  if (gamemode === 'map') {
    drawMap();
  }
  fill(150);
  rect(0, 0, width, upperPartHeight);
  imageMode(CENTER);
  image(map_symbol, 50, 10, 40, 40);
  
}


// displays one card on the screen based on its position in the player's hand.


function partOfText(){
  fill(255);
  textSize(16);
  textAlign(LEFT, BOTTOM);
  text(`Draw Pile: ${drawCardsPile.length}`, drawPilePositionX, drawPilePositionY);
  textAlign(RIGHT, BOTTOM);
  text(`Discard Pile: ${foldCardsPile.length}`, discardPilePositionX, discardPilePositionY);
}


// draws new cards from the draw pile into the player's hand.
function drawingCards(num) {
  for (let i = 0; i < num; i++) {   
    if (drawCardsPile.length > 0) {
      let drawnCard = drawCardsPile.pop();
      holdCards.push(drawnCard);
    } 
    else {
      if (foldCardsPile.length > 0) {
        drawCardsPile = foldCardsPile;
        foldCardsPile = [];
        shuffle(drawCardsPile, true);

        let drawnCard = drawCardsPile.pop();
        holdCards.push(drawnCard);
      }
    }
  }

  numberOfHolding = holdCards.length;
}




// This function cards in the player's hand into the discard pile.
function foldingCards(index) {
  // holdCards[index].foldingAnime();
  foldCardsPile.push(holdCards[index]);
  holdCards.splice(index, 1);
  numberOfHolding--;
}

function creatMap() {
  for (let colon = 0; colon < 5; colon++) {
    let row = [];
    for (let i = 0; i < 5; i++) {
      row.push(random(['combat', 'rest', 'shop', 'event', 'elite']));
    }
    mapList.push(row);
  }
}

function drawMap() {
  let cellSize = 20;
  fill(50,150);
  rect(0, 0, width, height);
  fill(150);
  rect(width/2 - mapWidth/2, 0, mapWidth, height);
  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < 5; row++) {
      fill(255);
      rect(10 + width/2 - mapWidth/2 + colon * (cellSize + mapWidth/7), row * (cellSize + height/7), cellSize, cellSize);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(7);
      text(mapList[colon][row], 10 + width/2 - mapWidth/2 + colon * (cellSize + mapWidth/7) + cellSize / 2, row * (cellSize + height/7) + cellSize / 2);
    }
  }
}


function mousePressed() {
  // Check if the mouse is dragging a card
  for (let i = holdCards.length - 1; i >= 0; i--) {
    if (ifTouchingCard(holdCards[i])) {
      ifDragging = true;
      holdCards[i].ifBeingDragged = true;
      holdCards[i].x = mouseX - holdCards[i].size / 2;
      holdCards[i].y = mouseY - holdCards[i].size * 1.5 / 2;
      console.log(`Dragging card ${holdCards[i].number}`);
      break; // Stop checking after the first card is found
    }
  }

  if (onMapSymbol()) {
    if (gamemode === 'map') {
      gamemode = 'combat';
    }
    else {
      gamemode = 'map';
    }
  }
}

function mouseDragged() {
  if (ifDragging) {
    for (let i = holdCards.length - 1; i >= 0; i--) {
      if (holdCards[i].ifBeingDragged) {
        holdCards[i].x = pmouseX - holdCards[i].size / 2;
        holdCards[i].y = pmouseY - holdCards[i].size * 1.5 / 2;
        break; // Stop checking after the first card is found
      }
    }
  }
}


function mouseReleased() {
  ifDragging = false;
  for (let i = holdCards.length - 1; i >= 0; i--) {
    holdCards[i].ifBeingDragged = false;
    if (holdCards[i].x < width*0.8 && holdCards[i].x + holdCards[i].size > width*0.2
      && holdCards[i].y < height*0.3) {
      foldingCards(i);
    }
  }
  
}


function ifTouchingCard(card) {
  // Check if the mouse is within the bounds of the card
  return mouseX > card.x && 
  mouseX < card.x + card.size && 
  mouseY > card.y && 
  mouseY < card.y + card.size * 1.5;
}

function onMapSymbol() {
  return mouseX > 30 && mouseX < 70 && mouseY > 10 && mouseY < 50;
}

function keyPressed() {
  if (key === 'e' || key === 'E') {
    for (let i = numberOfHolding - 1; i >= 0; i--) {
      foldingCards(i);
    }
    drawingCards(numberOfDrawing_round);
  }

  // end a combat for test
  if (key === 'w' || key === 'W'){

  }
}

function setGolbalVariables(){
  discardPilePositionX = width-10;
  discardPilePositionY = height-10;
  drawPilePositionX = 10;
  drawPilePositionY = height-10;
  upperPartHeight = height*0.05;
  mapWidth = width*0.6;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
