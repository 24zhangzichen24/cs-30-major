// ====================
// 1. GLOBAL VARIABLES
// ====================


let numberOfDrawing_round = 5;


let mapList = [];
let ifChoossing = false;

let discardPilePositionX;
let discardPilePositionY;
let drawPilePositionX;
let drawPilePositionY;
let upperPartHeight;
let mapWidth;

let map_symbol;
let coin_symbol;
let gamemode = 'combat';

let player = {
  hp: 80,
  maxHp: 80,
  energy: 100,
  block: 0,
  buff: [],
  image: 'player.png',
  money: 0,
  buffs: []
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
  'strike',
  'defend',
  'defend',
  'defend',
  'defend',
  'defend',
  'bash',
  'heal',
  'bashShield'
];

const cardLibrary = {
  strike: {
    name: 'Strike',
    cost: 1,
    rarity: 'common',
    category: 'attack',
    description: 'Deal 6 damage',
    effect: {
      type: 'damage',
      value: 6
    },
    image: 'strike.png'
  },

  defend: {
    name: 'Defend',
    cost: 1,
    rarity: 'common',
    category: 'skill',
    description: 'Gain 5 block',
    effect: {
      type: 'block',
      value: 5
    },
    image: 'defend.png'
  },

  bash: {
    name: 'Bash',
    cost: 2,
    rarity: 'rare',
    category: 'attack',
    description: 'Deal 15 damage',
    effect: {
      type: 'damage',
      value: 15
    },
    image: 'bash.png'
  },

  heal: {
    name: 'Heal',
    cost: 1,
    rarity: 'legendary',
    category: 'ability',
    description: 'Heal 4 HP',
    effect: {
      type: 'heal',
      value: 4
    },
    image: 'heal.png'
  },

  bashShield: {
    name: 'Bash Shield',
    cost: 2,
    rarity: 'rare',
    category: 'attack',
    description: 'Deal 8 damage. Gain 5 block.',
    effect: [
      { type: 'damage', value: 8 },
      { type: 'block', value: 5 }
    ]
  },
  poisionStab: {
      name: 'Poison Stab',
      cost: 1,
      rarity: 'common',
      category: 'attack',
      description: 'Deal 4 damage. Apply 2 poison.',
      effect: [
        { type: 'damage', value: 4 },
        { type: 'buff', value: { type: 'poison', stacks: 2 } }
      ],
      image: 'poison_stab.png'
    }
  },

};

const buffLibrary = {
  strength: {
    name: 'Strength',
    description: 'Increases damage by 1 for each stack.',
    image: 'strength.png',
  },
  dexterity: {
    name: 'Dexterity',
    description: 'Increases block by 1 for each stack.',
    image: 'dexterity.png',
  },
  vulnerable: {
    name: 'Vulnerable',
    description: 'Takes 50% more damage for each stack.',
    image: 'vulnerable.png',
  },
  weak: {
    name: 'Weak',
    description: 'Deals 25% less damage for each stack.',
    image: 'weak.png',
  },
  poision: {
    name: 'Poison',
    description: 'Takes damage at the start of turn for each stack. then lose 1 stack.',
    image: 'poison.png',
  }
};

const elementLibrary = {
  pyro: {
    name: 'Pyro',
    description: 'fire element',
    image: 'fireElement.png',
  },
  hydro: {
    name: 'Hydro',
    description: 'water element',
    image: 'waterElement.png',
  },
  grass: {
    name: 'Grass',
    description: 'grass element',
    image: 'grassElement.png',
  },
  ice: {
    name: 'Ice',
    description: 'ice element',
    image: 'iceElement.png',
  },
  wind: {
    name: 'Wind',
    description: 'wind element',
    image: 'windElement.png',
  },
  gyo: {
    name: 'Gyo',
    description: 'Earth element',
    image: 'EarthElement.png',
  },
  eletricity: {
    name: 'Eletricity',
    description: 'eletricity element',
    image: 'eletricityElement.png',
  }
};

const elementReactionLibrary = {
  pyro_hydro: {
    name: 'Vaporize',
    description: 'Pyro clean 1 Hydro stacks. Deal 1.5x damage. Hydro is the source, deal 2x damage and clean 2 Pyro stack.',
  },
  pyro_ice: {
    name: 'Melt',
    description: 'Pyro clean 2 Ice stacks. Deal 2x damage. Ice is the source, deal 1.5x damage and clean 1 Pyro stack.',
  },
  pyro_grass: {
    name: 'combustion',
    description: 'a special element: Burn(Pyro) create. At the end of turn if the Burn is not cleaned. Clean 1 Burn stack to deal 4 damage immediately.',
  }
};

const enemyLibrary = {
  slime: {
    name: 'Slime',
    hp: 30,
    effect: {
      type: 'attack',
      value: 8
    },
    attack: 8,
    image: 'slime.png',
  }
};


// ====================
// 3. PRELOAD
// ====================

function preload() {
  preloadCardImages();
  map_symbol = loadImage('map_symbol.png');
  coin_symbol = loadImage('coin_symbol.png');
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
    this.image = data.image;

    this.x = 0;
    this.y = 0;
    this.ifBeingChoosed = false;
    this.ifCanBePlayed = false;
    this.size = 60;
    this.reach = 200;
    this.maxSize = 80;
    this.minSize = 60;
  }

  displayACard(index, x, y, ifChoossing = false) {
    let startX = (width - (holdCards.length * (this.size + 10) - 10)) / 2;

    if (!ifChoossing && !this.ifBeingChoosed) {
      this.x = startX + index * (this.size + 10);
      this.y = height - this.size - 90;
    }
    else {
      this.x = x;
      this.y = y;
    }



    this.adjustSizeBasedOnMouse();
    
    fill(this.rarity === 'common' ? 'gray' : this.rarity === 'rare' ? 'pink' : 'orange');
    stroke(this.ifBeingChoosed ? 'gold' : 'black');
    strokeWeight(this.ifBeingChoosed && this.ifCanBePlayed ? 5 : 1);

    rect(this.x, this.y, this.size, this.size * 1.5);
    noStroke();

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(10);
    text(this.name, this.x + this.size / 2, this.y + this.size * 0.2);
    text("Cost: " + this.cost, this.x + this.size / 2, this.y + this.size * 0.45);
    text(this.rarity, this.x + this.size / 2, this.y + this.size * 0.7);
    text(this.category, this.x + this.size / 2, this.y + this.size * 1.0);
    text(this.description, this.x + this.size / 2, this.y + this.size * 1.25);
  }

  adjustSizeBasedOnMouse() {
    let distanceToMouse = dist(mouseX, mouseY, this.x + this.size / 2, this.y + this.size * 0.75);
    if (distanceToMouse < this.reach) {
      this.size = map(distanceToMouse, 0, this.reach, this.maxSize, this.minSize);
    } 
    else {
      this.size = this.minSize;
    }
  } 
}

class Enemy {
  constructor(enemyId) {
    let data = enemyLibrary[enemyId];

    this.hp = data.hp;
    this.maxHp = data.hp;
    this.attack = data.attack;
    this.intent = 'attack';
    this.x = width / 4 *3;
    this.y = height / 2;
    this.buffs = [];
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
  startCombat();
}

function draw() {
  background(100);

  if (gamemode === 'combat') {
    drawCombatScene();
  } 
  else if (gamemode === 'map') {
    drawMap();
  } 
  else if (gamemode === 'checkdiscardPile') {
    displayDiscardPile();
  } 
  else if (gamemode === 'checkdrawPile') {
    displayDrawPile();
  }

  drawTopBar();
}


// ====================
// 6. CORE GAMEPLAY
// ====================

function startCombat() {
  enemies = [];
  enemies.push(new Enemy('slime'));
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
    console.log('1');
  } 
  else if (effect.type === 'block') {
    player.block += effect.value;
  } 
  else if (effect.type === 'heal') {
    player.hp += effect.value;
    player.hp = min(player.hp, player.maxHp);
  } 
  else if (effect.type === 'draw') {
    drawingCards(effect.value);
  }
  else if (effect.type === 'buff') {
    if (target) {
      let existingBuff = target.buffs.find(buff => buff.type === effect.value.type);
      if (existingBuff) {
        existingBuff.stacks += effect.value.stacks;
      }
      else {
        target.buffs.push({ type: effect.value.type, stacks: effect.value.stacks });
      }
    }
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
    holdCards[i].displayACard(i, holdCards[i].x, holdCards[i].y, ifChoossing);
    if (holdCards[i].ifBeingChoosed) {
      holdCards[i].displayACard(i, mouseX - holdCards[i].size / 2, mouseY - holdCards[i].size / 2, true);
    }
  }
}

function drawEnemies() {
  if (enemies.length === 0) {
    return;
  }

  for (let i = 0; i < enemies.length; i++) {
    drawBuff(enemies[i]);
    fill(200, 100, 100);
    rect(enemies[i].x - 40, enemies[i].y - 40, 80, 80);

    fill(255, 0, 0);
    rect(enemies[i].x - 50, enemies[i].y + 60, 100, 20);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(enemies[i].name, enemies[i].x, enemies[i].y - 55);
    text("HP: " + enemies[i].hp, enemies[i].x, enemies[i].y + 70); 
    text("ATK: " + enemies[i].attack, enemies[i].x, enemies[i].y - 60 + sin(frameCount * 0.06) * 3);
  }
}

function drawBuff(target) {
  for (let i = 0; i < target.buffs.length; i++) {
    let buff = target.buffs[i];
    imageMode(CENTER);
    image(loadImage(buffLibrary[buff.type].image), target.x - 40 + i * 20, target.y - 40, 15, 15);
  }
}
function drawPlayer() {
  let playerX = width / 4;
  let playerY = height / 2;
  fill(100, 200, 100);
  rect(playerX - 40, playerY - 40, 80, 80);

  drawBuff(player);

  fill(255, 0, 0);
  rect(playerX - 50, playerY + 60, 100, 20);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);
  text("Player HP: " + player.hp + "/" + player.maxHp, playerX - 40, playerY + 50);
  text("Energy: " + player.energy, playerX - 40, playerY + 80);
  text("Block: " + player.block, playerX - 40, playerY + 110);
}


function drawTopBar() {
  fill(150);
  rect(0, 0, width, upperPartHeight);

  partOfText();

  imageMode(CENTER);
  image(map_symbol, 50, 13, 40, 40);


  image(coin_symbol, 100, 13, 20, 20);
  textAlign(LEFT, TOP);
  textSize(16);
  fill('gold');
  text(player.money, 120, 5);
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
      let x = 10 + width/2 - mapWidth/2 + j * 70;
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
  function drawCardPlayArrow(card) {
    bezier(
      card.x + card.size / 2, 
      card.y + card.size * 0.75, 
      mouseX, 
      mouseY, 
      mouseX, 
      mouseY, 
      mouseX, 
      mouseY
    );
  }
}


// ====================
// 8. MOUSE & KEY INTERACTIONS
// ====================

function mousePressed() {
  for (let i = holdCards.length - 1; i >= 0; i--) {
    if (ifTouchingCard(holdCards[i])) {
      if (holdCards[i].ifBeingChoosed && ifChoossing) {
        ifChoossing = false;
        holdCards[i].ifBeingChoosed = false;
      }
      else {
        ifChoossing = true;
        holdCards[i].ifBeingChoosed = true;
      }
      holdCards[i].x = mouseX - holdCards[i].size / 2;
      holdCards[i].y = mouseY - holdCards[i].size * 1.5 / 2;
      break;
    }
  }

  if (ifChoossing) {
    for (let i = 0; i < enemies.length; i++) {
      if (mouseY < height / 2) {
        for (let j = holdCards.length - 1; j >= 0; j--) {
          if (holdCards[j].ifBeingChoosed) {
            playCard(j, enemies[i]);
            holdCards[j].ifBeingChoosed = false;
            ifChoossing = false;
            break;
          }
        }
        break;
      }
    }
  }

  if (onMapSymbol()) {
    if (gamemode === 'map') {
      startCombat();
    } 
    else {
      gamemode = 'map';
    }
  }

  if (onDiscardPile()) {
    console.log('Clicked on discard pile');
    if (gamemode === 'combat') {
      gamemode = 'checkdiscardPile';
    } 
    else {
      gamemode = 'combat';
    }
  }

  if (onDrawPile()) {
    console.log('Clicked on draw pile');
    if (gamemode === 'combat') {
      gamemode = 'checkdrawPile';
    } 
    else {
      gamemode = 'combat';
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
    } 
    else {
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
  if (key === 'm' || key === 'M'){
    if(gamemode === 'map'){
      gamemode = 'combat';
    }
    else {
      gamemode = 'map';
    }
  }

  if (key in ['1', '2', '3', '4', '5', '6', '7', '8', '9']) {
    let index = parseInt(key) - 1;
    if (index >= 0 && index < holdCards.length) {
      holdCards[index].ifBeingChoosed = true;
      holdCards[index].x = mouseX - holdCards[index].size / 2;
      holdCards[index].y = mouseY - holdCards[index].size * 1.5 / 2;
    }
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