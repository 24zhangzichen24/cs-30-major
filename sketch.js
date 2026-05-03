// ====================
// 1. GLOBAL VARIABLES
// ====================


let numberOfDrawing_round = 6;


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

let player = {
  hp: 80,
  maxHp: 80,
  energy: 3,
  block: 0
};

let enemies = [];

let drawCardsPile = [];
let holdCards = [];
let foldCardsPile = [];
// let exhaustPile = []; // Save this for later when you add exhaust mechanics

// let turnState = 'player'; // Save this for later when enemy turn logic becomes more complete


// ====================
// 2. CARD DATA
// ====================

let starterDeck = [
  'strike',
  'strike',
  'strike',
  'strike',
  'defend',
  'defend',
  'defend',
  'defend',
  'bash',
  'heal'
];

const cardLibrary = {
  strike: {
    name: 'Strike',
    cost: 1,
    rarity: 'common',
    category: 'attack',
    description: 'Deal 6 damage.',
    effect: {
      type: 'damage',
      value: 6
    }
  },

  defend: {
    name: 'Defend',
    cost: 1,
    rarity: 'common',
    category: 'skill',
    description: 'Gain 5 block.',
    effect: {
      type: 'block',
      value: 5
    }
  },

  bash: {
    name: 'Bash',
    cost: 2,
    rarity: 'rare',
    category: 'attack',
    description: 'Deal 8 damage.',
    effect: {
      type: 'damage',
      value: 8
    }
  },

  heal: {
    name: 'Heal',
    cost: 1,
    rarity: 'legendary',
    category: 'ability',
    description: 'Heal 4 HP.',
    effect: {
      type: 'heal',
      value: 4
    }
  },

  bashShield: {
    name: 'Bash Shield',
    cost: 2,
    rarity: 'rare',
    category: 'attack',
    description: 'Deal 8 damage. Gain 5 block.',
    effects: [
      { type: 'damage', value: 8 },
      { type: 'block', value: 5 }
    ]
  }
};


// ====================
// 3. PRELOAD
// ====================

function preload() {
  preloadCardImages();
  map_symbol = loadImage('map_symbol.png');
}

function preloadCardImages() {
   //load card images
}


// ====================
// 4. CLASSES
// ====================

class Card {
  constructor(cardId) {
    let data = cardLibrary[cardId];

    this.id = cardId;
    this.name = data.name;
    this.cost = data.cost;
    this.rarity = data.rarity;
    this.category = data.category;
    this.description = data.description;
    this.effects = [data.effect];
    

    this.x = 0;
    this.y = 0;
    this.ifBeingDragged = false;
    this.ifCanBePlayed = false;
    this.size = 60;
    this.reach = 200;
    this.maxSize = 80;
    this.minSize = 60;
  }

  displayACard(index, x, y, ifDragging = false) {
    let startX = (width - (holdCards.length * (this.size + 10) - 10)) / 2;

    if (!ifDragging) {
      this.x = startX + index * (this.size + 10);
      this.y = height - this.size - 90;
    }

    let drawX = ifDragging ? x : this.x;
    let drawY = ifDragging ? y : this.y;

    fill(this.rarity === 'common' ? 'gray' : this.rarity === 'rare' ? 'pink' : 'orange');
    stroke(this.ifBeingDragged ? 'gold' : 'black');
    strokeWeight(this.ifBeingDragged && this.ifCanBePlayed ? 5 : 1);

    rect(drawX, drawY, this.size, this.size * 1.5);
    noStroke();

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(10);
    text(this.name, drawX + this.size / 2, drawY + this.size * 0.2);
    text("Cost: " + this.cost, drawX + this.size / 2, drawY + this.size * 0.45);
    text(this.rarity, drawX + this.size / 2, drawY + this.size * 0.7);
    text(this.category, drawX + this.size / 2, drawY + this.size * 1.0);
    text(this.description, drawX + this.size / 2, drawY + this.size * 1.25);
  }
}

class Enemy {
  constructor(hp, attack) {
    this.hp = hp;
    this.maxHp = hp;
    this.attack = attack;
    this.intent = 'attack';
    this.x = width / 2;
    this.y = height / 4;
  }
}


// ====================
// 5. SETUP / DRAW
// ====================

function setup() {
  createCanvas(windowWidth, windowHeight);
  setGolbalVariables();
  creatMap();

  for (let i = 0; i < starterDeck.length; i++) {
    let card = new Card(starterDeck[i]);
    drawCardsPile.push(card);
  }

  shuffle(drawCardsPile, true);
  drawingCards(numberOfDrawing_round);
}

function draw() {
  background(100);

  if (gamemode === 'combat') {
    drawCombatScene();
  } else if (gamemode === 'map') {
    drawMap();
  } else if (gamemode === 'checkdiscardPile') {
    displayDiscardPile();
  } else if (gamemode === 'checkdrawPile') {
    displayDrawPile();
  }

  drawTopBar();
}


// ====================
// 6. CORE GAMEPLAY
// ====================

function startCombat() {
  enemies = [];
  enemies.push(new Enemy(30, 8));
  player.energy = 3;
  player.block = 0;
  gamemode = 'combat';
}

function startTurn() {
  player.energy = 3;
  player.block = 0;
  drawingCards(numberOfDrawing_round);
}

function endTurn() {
  for (let i = holdCards.length - 1; i >= 0; i--) {
    foldingCards(i);
  }

  enemyTurn();
  startTurn();
}

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
}

function foldingCards(index) {
  if (index < 0 || index >= holdCards.length) {
    return;
  }

  holdCards[index].size = holdCards[index].minSize;
  foldCardsPile.push(holdCards[index]);
  holdCards.splice(index, 1);
}

function playCard(index, target) {
  let card = holdCards[index];

  if (!card) {
    return;
  }

  if (player.energy < card.cost) {
    return;
  }

  player.energy -= card.cost;

  for (let i = 0; i < card.effects.length; i++) {
    resolveEffect(card.effects[i], target);
  }

  foldingCards(index);
}

function resolveEffect(effect, target) {
  if (effect.type === 'damage') {
    if (target) {
      target.hp -= effect.value;
      if (target.hp < 0) {
        target.hp = 0;
      }
    }
  } else if (effect.type === 'block') {
    player.block += effect.value;
  } else if (effect.type === 'heal') {
    player.hp += effect.value;
    player.hp = min(player.hp, player.maxHp);
  } else if (effect.type === 'draw') {
    drawingCards(effect.value);
  }
}

function enemyTurn() {
  if (enemies.length === 0) {
    return;
  }

  let enemy = enemies[0];
  let damageToPlayer = enemy.attack - player.block;

  if (damageToPlayer < 0) {
    damageToPlayer = 0;
  }

  player.block -= enemy.attack;
  if (player.block < 0) {
    player.block = 0;
  }

  player.hp -= damageToPlayer;
  if (player.hp < 0) {
    player.hp = 0;
  }
}




// ====================
// 7. RENDER FUNCTIONS
// ====================

function drawCombatScene() {
  drawPlayer();
  drawEnemies();
  drawHand();
}

function drawHand() {
  for (let i = 0; i < holdCards.length; i++) {
    holdCards[i].displayACard(i, holdCards[i].x, holdCards[i].y, ifDragging);
  }
}

function drawEnemies() {
  if (enemies.length === 0) {
    return;
  }

  for (let i = 0; i < enemies.length; i++) {
    fill(200, 100, 100);
    rect(enemies[i].x - 40, enemies[i].y - 40, 80, 80);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Enemy", enemies[i].x, enemies[i].y - 55);
    text("HP: " + enemies[i].hp, enemies[i].x, enemies[i].y);
    text("ATK: " + enemies[i].attack, enemies[i].x, enemies[i].y + 20);
  }
}

function drawPlayer() {
  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);
  text("Player HP: " + player.hp + "/" + player.maxHp, 20, upperPartHeight + 10);
  text("Energy: " + player.energy, 20, upperPartHeight + 35);
  text("Block: " + player.block, 20, upperPartHeight + 60);
}

function drawTopBar() {
  fill(150);
  rect(0, 0, width, upperPartHeight);

  partOfText();

  imageMode(CENTER);
  image(map_symbol, 50, 10, 40, 40);
}

function partOfText() {
  fill(255);
  textSize(16);
  textAlign(LEFT, BOTTOM);
  text(`Draw Pile: ${drawCardsPile.length}`, drawPilePositionX, drawPilePositionY);

  textAlign(RIGHT, BOTTOM);
  text(`Discard Pile: ${foldCardsPile.length}`, discardPilePositionX, discardPilePositionY);
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

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < 5; row++) {
      fill(255);
      rect(
        10 + width / 2 - mapWidth / 2 + colon * (cellSize + mapWidth / 7),
        row * (cellSize + height / 7),
        cellSize,
        cellSize
      );

      fill(0);
      textAlign(CENTER, CENTER);
      textSize(7);
      text(
        mapList[colon][row],
        10 + width / 2 - mapWidth / 2 + colon * (cellSize + mapWidth / 7) + cellSize / 2,
        row * (cellSize + height / 7) + cellSize / 2
      );
    }
  }
}

function displayDiscardPile() {
  let count = foldCardsPile.length;
  let rows = ceil(count / (mapWidth / 70));

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  if (foldCardsPile.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(255);
    text('No cards in the discard pile', width / 2, height / 2);
    return;
  }

  for (let i = rows; i >= 0; i--) {
    for (let j = 0; j < floor(mapWidth / 70); j++) {
      let index = i * floor(mapWidth / 70) + j;
      let x = 10 + width / 2 - mapWidth / 2 + j * 70;
      let y = 10 + i * 100;

      if (index < foldCardsPile.length) {
        foldCardsPile[index].displayACard(index, x, y, false);
      }
    }
  }
}

function displayDrawPile() {
  let count = drawCardsPile.length;
  let rows = ceil(count / (mapWidth / 70));

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  if (drawCardsPile.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(255);
    text('No cards in the draw pile', width / 2, height / 2);
    return;
  }

  for (let i = rows; i >= 0; i--) {
    for (let j = 0; j < floor(mapWidth / 70); j++) {
      let index = i * floor(mapWidth / 70) + j;
      let x = 10 + width / 2 - mapWidth / 2 + j * 70;
      let y = 10 + i * 100;

      if (index < drawCardsPile.length) {
        drawCardsPile[index].displayACard(index, x, y, false);
      }
    }
  }
}


// ====================
// 8. MOUSE & KEY INTERACTIONS
// ====================

function mousePressed() {
  for (let i = holdCards.length - 1; i >= 0; i--) {
    if (ifTouchingCard(holdCards[i])) {
      ifDragging = true;
      holdCards[i].ifBeingDragged = true;
      holdCards[i].x = mouseX - holdCards[i].size / 2;
      holdCards[i].y = mouseY - holdCards[i].size * 1.5 / 2;
      console.log(`Dragging card ${holdCards[i].name}`);
      break;
    }
  }

  if (onMapSymbol()) {
    if (gamemode === 'map') {
      startCombat();
    } else {
      gamemode = 'map';
    }
  }

  if (onDiscardPile()) {
    console.log('Clicked on discard pile');
    if (gamemode === 'combat') {
      gamemode = 'checkdiscardPile';
    } else {
      gamemode = 'combat';
    }
  }

  if (onDrawPile()) {
    console.log('Clicked on draw pile');
    if (gamemode === 'combat') {
      gamemode = 'checkdrawPile';
    } else {
      gamemode = 'combat';
    }
  }
}

function mouseDragged() {
  if (ifDragging) {
    for (let i = holdCards.length - 1; i >= 0; i--) {
      if (holdCards[i].ifBeingDragged) {
        holdCards[i].x = pmouseX - holdCards[i].size / 2;
        holdCards[i].y = pmouseY - holdCards[i].size * 1.5 / 2;

        if (
          holdCards[i].x < width * 0.8 &&
          holdCards[i].x + holdCards[i].size > width * 0.2 &&
          holdCards[i].y < height * 0.3
        ) {
          holdCards[i].ifCanBePlayed = true;
        } else {
          holdCards[i].ifCanBePlayed = false;
        }

        break;
      }
    }
  }
}

function mouseReleased() {
  ifDragging = false;

  for (let i = holdCards.length - 1; i >= 0; i--) {
    holdCards[i].ifBeingDragged = false;

    if (
      holdCards[i].x < width * 0.8 &&
      holdCards[i].x + holdCards[i].size > width * 0.2 &&
      holdCards[i].y < height * 0.3
    ) {
      let target = null;

      if (enemies.length > 0) {
        target = enemies[0];
      }

      playCard(i, target);
      break;
    }
  }
}

function mouseWheel(event) {
  if (gamemode === 'map') {
    mapWidth += event.delta;
    mapWidth = constrain(mapWidth, width * 0.3, width * 0.9);
  }

  if (gamemode === 'checkdiscardPile' || gamemode === 'checkdrawPile') {
    if (event.delta > 0) {
      for (let i = 0; i < foldCardsPile.length; i++) {
        foldCardsPile[i].y -= 20;
      }
      for (let i = 0; i < drawCardsPile.length; i++) {
        drawCardsPile[i].y -= 20;
      }
    } else {
      for (let i = 0; i < foldCardsPile.length; i++) {
        foldCardsPile[i].y += 20;
      }
      for (let i = 0; i < drawCardsPile.length; i++) {
        drawCardsPile[i].y += 20;
      }
    }
  }
}

function keyPressed() {
  if (key === 'e' || key === 'E') {
    endTurn();
  }
}


// ====================
// 9. HELPER FUNCTIONS
// ====================

function ifTouchingCard(card) {
  return mouseX > card.x &&
         mouseX < card.x + card.size &&
         mouseY > card.y &&
         mouseY < card.y + card.size * 1.5;
}

function onMapSymbol() {
  return mouseX > 30 && mouseX < 70 && mouseY > 10 && mouseY < 50;
}

function onDiscardPile() {
  return mouseX > discardPilePositionX - 20 && mouseX < discardPilePositionX + 20 &&
         mouseY > discardPilePositionY - 20 && mouseY < discardPilePositionY + 20;
}

function onDrawPile() {
  return mouseX > drawPilePositionX - 20 && mouseX < drawPilePositionX + 20 &&
         mouseY > drawPilePositionY - 20 && mouseY < drawPilePositionY + 20;
}

function setGolbalVariables() {
  discardPilePositionX = width - 10;
  discardPilePositionY = height - 10;
  drawPilePositionX = 10;
  drawPilePositionY = height - 10;
  upperPartHeight = height * 0.05;
  mapWidth = width * 0.7;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setGolbalVariables();
}