let cards = [];
let numberOfCards = 17;
let numberOfDrawing_round = 6;
let numberOfHolding = 0;
let cardsize = 60;
let drawCardsPile = [];
let holdCards = [];
let foldCardsPile = [];
let ifDragging = false;

let discardPilePositionX;
let discardPilePositionY;
let drawPilePositionX;
let drawPilePositionY;


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


  display() {
    fill(255);
    rect(this.x, this.y, cardsize, cardsize * 1.5);
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(12);
    text(`${this.number}`, this.x + cardWidth / 2, this.y + cardHeight / 4);
    text(`${this.rarity}`, this.x + cardWidth / 2, this.y + cardHeight / 2);
    text(`${this.category}`, this.x + cardWidth / 2, this.y + 3 * cardHeight / 4); 
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

  foldingAnime(){
    let t = 0;
    // change this.x and this.y to Discard position by a quadratic function
    while(t < 120){
      this.x += (discardPilePositionX - this.x) / 120;
      this.y += (discardPilePositionY - this.y) / 120;
      t++;
      console.log(this.x, this.y);
    }

  }
}



function setup() {
  createCanvas(windowWidth, windowHeight);

  discardPilePositionX = width-10;
  discardPilePositionY = height-10;
  drawPilePositionX = 10;
  drawPilePositionY = height-10;
  
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
  for (let i = 0; i < holdCards.length; i++) {
    displayCards(holdCards[i], i, ifDragging);
  }

  // Display the number of cards in the draw pile and discard pile
  fill(255);
  textSize(16);
  textAlign(LEFT, BOTTOM);
  text(`Draw Pile: ${drawCardsPile.length}`, drawPilePositionX, drawPilePositionY);
  textAlign(RIGHT, BOTTOM);
  text(`Discard Pile: ${foldCardsPile.length}`, discardPilePositionX, discardPilePositionY);
}


// displays one card on the screen based on its position in the player's hand.
function displayCards(card, index, ifDragging = false) {
  let cardWidth = cardsize;
  let cardHeight = cardsize * 1.5;
  let totalWidth = holdCards.length * cardWidth + (holdCards.length - 1) * 10;
  let startX = width / 2 - totalWidth / 2;
  if (!ifDragging) {
    card.x = startX + index * (cardWidth + 10);
    card.y = height / 2 - cardHeight / 2;
  }

  fill(255);
  rect(card.x, card.y, cardWidth, cardHeight);

  textAlign(CENTER, CENTER);
  fill(0);
  textSize(12);
  text(`${card.number}`, card.x + cardWidth / 2, card.y + cardHeight / 4);
  text(`${card.rarity}`, card.x + cardWidth / 2, card.y + cardHeight / 2);
  text(`${card.category}`, card.x + cardWidth / 2, card.y + 3 * cardHeight / 4);  
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
  holdCards[index].foldingAnime();
  foldCardsPile.push(holdCards[index]);
  holdCards.splice(index, 1);
  numberOfHolding--;
}

function mousePressed() {
  // Check if the mouse is dragging a card
  for (let i = holdCards.length - 1; i >= 0; i--) {
    if (ifTouchingCard(holdCards[i])) {
      ifDragging = true;
      holdCards[i].ifBeingDragged = true;
      holdCards[i].x = mouseX - cardsize / 2;
      holdCards[i].y = mouseY - cardsize * 1.5 / 2;
      console.log(`Dragging card ${holdCards[i].number}`);
      break; // Stop checking after the first card is found
    }
  }
}

function mouseDragged() {
  if (ifDragging) {
    for (let i = holdCards.length - 1; i >= 0; i--) {
      if (holdCards[i].ifBeingDragged) {
        holdCards[i].x = pmouseX - cardsize / 2;
        holdCards[i].y = pmouseY - cardsize * 1.5 / 2;
        break; // Stop checking after the first card is found
      }
    }
  }
}


function mouseReleased() {
  ifDragging = false;
  for (let i = holdCards.length - 1; i >= 0; i--) {
    holdCards[i].ifBeingDragged = false;
    if (holdCards[i].x < width*0.8 && holdCards[i].x + cardsize > width*0.2
      && holdCards[i].y < height*0.3) {
      foldingCards(i);
    }
  }
  
}


function ifTouchingCard(card) {
  // Check if the mouse is within the bounds of the card
  return mouseX > card.x && 
  mouseX < card.x + cardsize && 
  mouseY > card.y && 
  mouseY < card.y + cardsize * 1.5;
}

function keyPressed() {
  if (key === 'e' || key === 'E') {
    for (let i = numberOfHolding - 1; i >= 0; i--) {
      foldingCards(i);
    }
    drawingCards(numberOfDrawing_round);
  }
}




function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
