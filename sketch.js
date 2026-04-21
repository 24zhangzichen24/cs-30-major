let cards = [];
let numberOfCards = 15;
let numberOfDrawing = 6;
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
  shuffle(drawCardsPile);
  for (let i = 0; i < numberOfDrawing; i++) {
    let drawnCard = drawCardsPile.pop();
    holdCards.push(drawnCard);
  }
}

function draw() {
  background(100);
  // Display the cards in the player's hand
  for (let card of holdCards) {
    displayCards(card);
  }
}

function displayCards(card) {
  let cardX = width / 2 - (holdCards.indexOf(card)-numberOfHolding/2) * cardWidth / 2;
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


function drawingCards() {
  // Card drawing logic here
  for (let i = 0; i < numberOfDrawing; i++) {   
    if (cards.length > 0) {
      let drawnCard = drawCardsPile.pop();
      holdCards.push(drawnCard);

    }
  
    else {
      foldCardsPile = foldCardsPile.concat(drawCardsPile);
      drawCardsPile = foldCardsPile;
      foldCardsPile = [];
      let drawnCard = drawCardsPile.pop();
      holdCards.push(drawnCard);
    }
  }
}


function useCards() {
  // Card usage logic here
  numberOfHolding = holdCards.length;
}

function foldingCards() {
  // Card folding logic here
  foldCardsPile = foldCardsPile.concat(holdCards);
  holdCards = [];
  numberOfHolding = 0;
}

function keyPressed() {
  if (key === 'e') { 
    foldingCards();
    drawingCards();
  }
}

