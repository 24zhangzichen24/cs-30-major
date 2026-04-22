let cards = [];
let numberOfCards = 15;
let numberOfDrawing_round = 6;
let numberOfHolding = 0;
let cardWidth = 50;
let cardHeight = 70;
let drawCardsPile = [];
let holdCards = [];
let foldCardsPile = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < numberOfCards; i++) {
    cards.push({
      number: i + 1,
      rarity: random(['common', 'rare', 'legendary']),
      category: random(['attack', 'skill', 'ability']),
    });
    
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
    displayCards(holdCards[i], i);
  }
}


// displays one card on the screen based on its position in the player's hand.
function displayCards(card, index) {
  let totalWidth = holdCards.length * cardWidth + (holdCards.length - 1) * 10;
  let startX = width / 2 - totalWidth / 2;
  let cardX = startX + index * (cardWidth + 10);
  let cardY = height / 2 - cardHeight / 2;

  fill(255);
  rect(cardX, cardY, cardWidth, cardHeight);

  textAlign(CENTER, CENTER);
  fill(0);
  textSize(12);
  text(`${card.number}`, cardX + cardWidth / 2, cardY + cardHeight / 4);
  text(`${card.rarity}`, cardX + cardWidth / 2, cardY + cardHeight / 2);
  text(`${card.category}`, cardX + cardWidth / 2, cardY + 3 * cardHeight / 4);  
}


// draws new cards from the draw pile into the player's hand.
function drawingCards(num) {
  for (let i = 0; i < num; i++) {   
    if (drawCardsPile.length > 0) {
      let drawnCard = drawCardsPile.pop();
      holdCards.push(drawnCard);
    } else {
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


function useCards() {
  numberOfHolding = holdCards.length;
}


// This function cards in the player's hand into the discard pile.
function foldingCards(index) {
  foldCardsPile.push(holdCards[index]);
  holdCards.splice(index, 1);
  numberOfHolding--;
}

function keyPressed() {
  if (key === 'e' || key === 'E') {
    for (let i = numberOfHolding - 1; i >= 0; i--) {
      foldingCards(i);
    }
    drawingCards();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
