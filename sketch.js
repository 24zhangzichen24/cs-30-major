// ===========================================================
// 1. GLOBAL VARIABLES
// ===========================================================


let numberOfDrawing_round = 5;


let mapList = [];
let currentMapColon = -1;
let currentMapRow = -1;
let ifChoossing = false;


let discardPilePositionX;
let discardPilePositionY;
let drawPilePositionX;
let drawPilePositionY;
let upperPartHeight;
let mapWidth;
const MAPROW = 10;
const MAPCOLON = 5;

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
  buffs: [],
  poisionOnMap : {x : 0, y : 0, stacks : 0},
};

let enemies = [];

let deck = [];
let drawCardsPile = [];
let holdCards = [];
let foldCardsPile = [];

let rewardOptions = [];
let potionBag = [];
// let exhaustPile = []; // Save this for later when you add exhaust mechanics

// let turnState = 'player'; // Save this for later when enemy turn logic becomes more complete


// =====================================
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
    effect: [{
      type: 'damage',
      value: 6
    }],
    image: 'strike.png'
  },

  defend: {
    name: 'Defend',
    cost: 1,
    rarity: 'common',
    category: 'skill',
    description: 'Gain 5 block',
    effect: [{
      type: 'block',
      value: 5
    }],
    image: 'defend.png'
  },

  bash: {
    name: 'Bash',
    cost: 2,
    rarity: 'rare',
    category: 'attack',
    description: 'Deal 15 damage',
    effect: [{
      type: 'damage',
      value: 15
    }],
    image: 'bash.png'
  },

  heal: {
    name: 'Heal',
    cost: 1,
    rarity: 'legendary',
    category: 'ability',
    description: 'Heal 4 HP',
    effect: [{
      type: 'heal',
      value: 4
    }],
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
  pyro_electricity: {
    name: 'Overload',
    description: 'Pyro clean 1 Eletricity stacks. Deal 10 Pyro damage to every enemy.',
  },
  hydro_ice: {
    name: 'Freeze',
    description: 'a special element: Frozen create. If frozen stack reaches 5 at the start of turn, let target skip its turn.',
  },
  hydro_electricity: {
    name: 'Electro-Charged',
    description: "create a special element: Electro-Charged. At the end of turn, Electro-Charged will deal 5 damage to target and every live with Hydro.",
  },
  ice_electricity: {
    name: 'Superconduct',
    description: 'Ice clean 1 Eletricity stacks. Deal 2 Ice damage to every enemy. Give every enemy 1 weak.',
  },
  wind_any: {
    name: 'diffusion',
    description: 'Wind clean 1 stack of any element. Deal 4 element damage to every enemy.',
  },
  gyo_any: {
    name: 'crystallize',
    description: 'crate 8 block',
  }
};

const relicLibrary = {
  redCandle: {
    name: 'Red Candle',
    rarity: 'common',
    description: 'Increases fire damage by 1.',
    image: 'red_candle.png'
  }
  
};

const enemyLibrary = {
  slime: {
    name: 'Slime',
    hp: 30,
    attack: 6,
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
    this.effects = Array.isArray(data.effect) ? data.effect : [data.effect];
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

    this.name = data.name;
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

  deck = starterDeck.slice();

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
  else if (gamemode === 'PlayerDefeated') {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 0, 0);
    text('Game Over', width / 2, height / 2);
  }
  else if (gamemode === 'reward') {
    drawRewardScreen();
  }


  drawTopBar();
}


// ====================
// 6. CORE GAMEPLAY
// ====================

function startCombat() {
  drawCardsPile = [];
  holdCards = [];
  foldCardsPile = [];

  for (let i = 0; i < deck.length; i++) {
    let card = new Card(deck[i]);
    drawCardsPile.push(card);
  }

  shuffle(drawCardsPile, true);

  enemies = [];
  enemies.push(new Enemy('slime'));

  player.energy = 3;
  player.block = 0;

  drawingCards(numberOfDrawing_round);

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
    return false;
  }

  if (player.energy < card.cost) {
    return false;
  }

  player.energy -= card.cost;

  for (let i = 0; i < card.effects.length; i++) {
    resolveEffect(card.effects[i], target);
  }

  foldingCards(index);
  return true;
}

function resolveEffect(effect, target) {
  if (effect.type === 'damage') {
    if (target) {
      target.hp -= effect.value;
      if (target.hp < 0) {
        target.hp = 0;
      }
    }

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

function displayDamageText(amount, target) {
  // Implementation for displaying damage text
}

function enemyTurn() {
  if (enemies.length === 0) {
    return;
  }

  let enemy = enemies[0];
  let damage = enemy.attack;

  if (player.block >= damage) {
    player.block -= damage;
    damage = 0;
  }
  else {
    damage -= player.block;
    player.block = 0;
  }

  player.hp -= damage;

  if (player.hp < 0) {
    player.hp = 0;
  }
}

function generateRewards() {
  rewardOptions = [];

  // card reward
  let cardIds = Object.keys(cardLibrary);
  let randomCardId = random(cardIds);

  rewardOptions.push({
    type: 'card',
    cardId: randomCardId
  });

  // coins reward
  rewardOptions.push({
    type: 'coin',
    amount: floor(random(15, 31))
  });

  // potion reward
  rewardOptions.push({
    type: 'potion',
    potionId: 'healPotion',
    name: 'Heal Potion',
    description: 'Heal 10 HP'
  });
}


// ====================
// 7. RENDER FUNCTIONS
// ====================

function drawCombatScene() {
  drawPlayer();
  drawEnemies();
  drawHand();
  checkIfCombatEnded();
}

function drawHand() {
  for (let i = 0; i < holdCards.length; i++) {
    if (holdCards[i].ifBeingChoosed) {
      holdCards[i].displayACard(i, mouseX - holdCards[i].size / 2, mouseY - holdCards[i].size * 1.5 / 2,true);
    } 
    else {
      holdCards[i].displayACard(i, holdCards[i].x, holdCards[i].y, false);
    }
  }
}

function drawEnemies() {
  if (enemies.length === 0) {
    return;
  }

  for (let i = 0; i < enemies.length; i++) {
    drawEnemyImage(i);
    drawEnemyName(i);
    drawEnemyIntent(i);
    drawEnemyHP(i);
    checkIfEnemyDefeated(i);
  }
}

function drawEnemyName(index) {
  let enemy = enemies[index];
  textAlign(CENTER, BOTTOM);
  if (getEnemyAtMouse()) {
    text(enemy.name, enemy.x, enemy.y - 60);
  }
}

function drawEnemyImage(index) {
  let enemy = enemies[index];
  push();
  fill(200, 100, 100);
  rect(enemy.x - 40, enemy.y - 40, 80, 80);
  // image(enemy.image, enemy.x, enemy.y);
  pop();
}

function drawEnemyIntent(index) {
  let enemy = enemies[index];
  if (enemy.intent === 'attack') {
    text("ATK: " + enemy.attack, enemy.x, enemy.y - 60 + sin(frameCount * 0.06) * 3);
  }
  else if (enemy.intent === '') {
  }
}

function drawEnemyHP(index) {
  let enemy = enemies[index];
  let hpRatio = enemy.hp / enemy.maxHp;
  let hpBarWidth = 100;
  let hpBarHeight = 20;
  let filledWidth = hpBarWidth * hpRatio;
  push();
  stroke(0);
  fill(255, 0, 0, 0);
  rect(enemy.x - 50, enemy.y + 60, hpBarWidth, hpBarHeight);
  fill(255, 0, 0);
  noStroke();
  rect(enemy.x - 50, enemy.y + 60, filledWidth, hpBarHeight);
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(18);
  text("HP: " + enemy.hp, enemy.x, enemy.y + 70);
  pop();
}

function checkIfEnemyDefeated(index) {
  let enemy = enemies[index];
  if (enemy.hp <= 0) {
    enemies.splice(index, 1);
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

  drawPlayerHP(playerX, playerY);
  changeOfPlayerHP();

  fill(255);
  textAlign(LEFT, TOP);
  textSize(18);
  text("Player HP: " + player.hp + "/" + player.maxHp, 40, 60);
  text("Energy: " + player.energy, 40, 90);
  text("Block: " + player.block, 40, 120  );

  
}

function drawPlayerHP(x, y) {
  let hpRatio = player.hp / player.maxHp;
  let hpBarWidth = 100;
  let hpBarHeight = 20;
  let filledWidth = hpBarWidth * hpRatio;
  push();
  stroke(0);
  fill(255, 0, 0, 0);
  rect(x - 50, y + 60, hpBarWidth, hpBarHeight);
  fill(255, 0, 0);
  noStroke();
  rect(x - 50, y + 60, filledWidth, hpBarHeight);
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(18);
  text("HP: " + player.hp, x, y + 70);
  pop();
}

function changeOfPlayerHP() {
  
}

function checkIfCombatEnded() {
  if (player.hp <= 0) {
    gamemode = 'PlayerDefeated';
  }
  else if (enemies.length === 0) {
    generateRewards();
    gamemode = 'reward';
  }
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

  textAlign(RIGHT, TOP);
  text(deck.length, width - 40, 5);
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
  // [kind][x][y][path]
  mapList = [
    [['combat'], ['combat'], ['rest'], ['combat'], ['shop'],['combat'], ['combat'], ['rest'], ['combat'], ['shop']],
    [['combat'], ['elite'], ['event'], ['combat'], ['rest'],['combat'], ['event'], ['rest'], ['combat'], ['combat']],
    [['rest'], ['combat'], ['combat'], ['elite'], ['combat'],['combat'], ['event'], ['rest'], ['combat'], ['combat']],
    [['combat'], ['event'], ['rest'], ['combat'], ['combat'],['combat'], ['event'], ['rest'], ['combat'], ['combat']],
    [['shop'], ['combat'], ['elite'], ['combat'], ['rest',], ['combat'], ['rest'], ['combat'], ['shop'],['combat']]
  ];

  let startX = width / 2 - mapWidth / 2 + 40;
  let startY = height - 100;

  let xGap = mapWidth / 5;
  let yGap = height / 7;


  for (let colon = 0; colon < 5; colon++) {

    for (let row = 0; row < MAPROW; row++) {
      let x = startX + colon * xGap;
      let y = startY - row * yGap;
      mapList[colon][row].push(x);
      mapList[colon][row].push(y);
    }
  }

  
  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < MAPROW; row++) {
      let path = [];

      if (row < MAPROW-1) {
        let possibleNextColons = [];

        possibleNextColons.push(colon);

        if (colon > 0) {
          possibleNextColons.push(colon - 1);
        }

        if (colon < 4) {
          possibleNextColons.push(colon + 1);
        }

        for (let i = 0; i < random(0.5,2); i++){
          let nextColon = random(possibleNextColons);
          let offset = nextColon - colon;

          path.push(offset);
        }
      }

      if (row === 0){
        continue;
      }
      else{
        let possibleLastColons = [];

        possibleLastColons.push(colon);

        if (colon > 0) {
          possibleLastColons.push(colon - 1);
        }

        if (colon < 4) {
          possibleLastColons.push(colon + 1);
        }

        for (i in possibleLastColons){
          if (!mapList[colon][row-1][3].includes(i)){
            mapList[colon][row][3] = false;
          }
        }
      }
    }
  }
  currentMapColon = -1;
  currentMapRow = -1;
}

function drawMap() {
  let cellSize = 24;

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  // draw paths 
  stroke(255);
  strokeWeight(2);

  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < MAPROW; row++) {
      let paths = mapList[colon][row][3];

      for (let i = 0; i < paths.length; i++) {
        let nextColon = colon + paths[i];
        let nextRow = row + 1;

        if (nextColon >= 0 && nextColon < 5 && nextRow >= 0 && nextRow < MAPROW) {
          line(
            mapList[colon][row][1] + cellSize / 2,
            mapList[colon][row][2] + cellSize / 2,
            mapList[nextColon][nextRow][1] + cellSize / 2,
            mapList[nextColon][nextRow][2] + cellSize / 2
          );
        }
      }
    }
  }

  // draw rooms
  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < MAPROW; row++) {
      let roomType = mapList[colon][row][0];
      let x = mapList[colon][row][1];
      let y = mapList[colon][row][2];

      if(row > 1){
       
        if (mapList[colon][row-1][3].length < 1){
          continue;
        }
      }

      noStroke();

      if (roomType === 'combat') {
        fill(200, 0, 0);
      }
      else if (roomType === 'rest') {
        fill(0, 200, 0);
      }
      else if (roomType === 'shop') {
        fill(0, 0, 200);
      }
      else if (roomType === 'elite') {
        fill(200, 0, 200);
      }
      else if (roomType === 'event') {
        fill(200, 200, 0);
      }

      rect(x, y, cellSize, cellSize);

      // clickable room highlight
      if (isMapRoomClickable(colon, row)) {
        noFill();
        stroke('gold');
        strokeWeight(3+sin(frameCount*0.05));
        rect(x - 3, y - 3, cellSize + 6, cellSize + 6);
      }

      // current player position highlight
      if (colon === currentMapColon && row === currentMapRow) {
        noFill();
        stroke(0);
        strokeWeight(3+sin(frameCount*0.05));
        rect(x - 6, y - 6, cellSize + 12, cellSize + 12);
      }

      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(7);
      text(roomType, x + cellSize / 2, y + cellSize / 2);
    }
  }

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text('Map: choose a connected room on the next floor', width / 2, 50);
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

function enterMapRoom(colon, row) {
  if (!isMapRoomClickable(colon, row)) {
    return;
  }

  currentMapColon = colon;
  currentMapRow = row;

  let roomType = mapList[colon][row][0];

  if (roomType === 'combat' || roomType === 'elite') {
    startCombat();
  }
  else if (roomType === 'rest') {
    gamemode = 'map';
  }
  else if (roomType === 'shop') {
    gamemode = 'map';
  }
  else if (roomType === 'event') {
    gamemode = 'map';
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

function drawRewardScreen() {
  background(60);

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  text('Choose Your Reward', width / 2, 100);

  for (let i = 0; i < rewardOptions.length; i++) {
    let reward = rewardOptions[i];

    let rewardWidth = 160;
    let rewardHeight = 220;
    let gap = 40;
    let startX = width / 2 - (rewardOptions.length * rewardWidth + (rewardOptions.length - 1) * gap) / 2;
    let x = startX + i * (rewardWidth + gap);
    let y = height / 2 - rewardHeight / 2;

    fill(220);
    stroke(0);
    strokeWeight(2);
    rect(x, y, rewardWidth, rewardHeight);

    fill(0);
    noStroke();
    textSize(18);

    if (reward.type === 'card') {
      let cardData = cardLibrary[reward.cardId];

      text(cardData.name, x + rewardWidth / 2, y + 40);
      text('Card', x + rewardWidth / 2, y + 75);
      text('Cost: ' + cardData.cost, x + rewardWidth / 2, y + 110);
      text(cardData.description, x + rewardWidth / 2, y + 150);
    }
    else if (reward.type === 'coin') {
      text('Coin', x + rewardWidth / 2, y + 60);
      text('+' + reward.amount, x + rewardWidth / 2, y + 110);
    }
    else if (reward.type === 'potion') {
      text(reward.name, x + rewardWidth / 2, y + 60);
      text('Potion', x + rewardWidth / 2, y + 100);
      text(reward.description, x + rewardWidth / 2, y + 145);
    }
  }
}




// ====================
// 8. MOUSE & KEY INTERACTIONS
// ====================

function mousePressed() {
  if (onMapSymbol()) {
    gamemode = 'map';
    return;
  }

  if (gamemode === 'reward') {
    let rewardIndex = getRewardIndexAtMouse();

    if (rewardIndex !== -1) {
      claimReward(rewardIndex);
    }

    return;
  }

  if (gamemode === 'map') {
    let clickedRoom = getMapRoomAtMouse();

    if (clickedRoom !== null) {
      enterMapRoom(clickedRoom.colon, clickedRoom.row);
    }

    return;
  }

  if (onDiscardPile()) {
    if (gamemode === 'combat') {
      gamemode = 'checkdiscardPile';
    } 
    else {
      gamemode = 'combat';
    }
    return;
  }

  if (onDrawPile()) {
    if (gamemode === 'combat') {
      gamemode = 'checkdrawPile';
    } 
    else {
      gamemode = 'combat';
    }
    return;
  }

  if (gamemode !== 'combat') {
    return;
  }

  if (ifChoossing) {
    let selectedIndex = getSelectedCardIndex();
    let target = getEnemyAtMouse();

    if (selectedIndex !== -1 && target) {
      let wasPlayed = playCard(selectedIndex, target);

      if (wasPlayed) {
        ifChoossing = false;
      }
      return;
    }

    for (let i = holdCards.length - 1; i >= 0; i--) {
      if (!holdCards[i].ifBeingChoosed && ifTouchingCard(holdCards[i])) {
        selectCard(i);
        return;
      }
    }

    clearSelectedCards();
    return;
  }

  for (let i = holdCards.length - 1; i >= 0; i--) {
    if (ifTouchingCard(holdCards[i])) {
      selectCard(i);
      return;
    }
  }
}



function mouseWheel(event) {
  if (gamemode === 'map' && !mapCellOverEdge()) {
    for (let colon = 0; colon < 5; colon++) {
      for (let row = 0; row < MAPROW; row++) {
        mapList[colon][row][2] += event.delta;
      }
    }
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

  if (key === 'm' || key === 'M') {
    if (gamemode === 'map') {
      gamemode = 'combat';
    }
    else {
      gamemode = 'map';
    }
  }

  if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key)) {
    let index = parseInt(key) - 1;

    if (gamemode === 'combat' && index >= 0 && index < holdCards.length) {
      selectCard(index);
    }
  }
}


// ====================
// 9. HELPER FUNCTIONS
// ====================

function clearSelectedCards() {
  for (let i = 0; i < holdCards.length; i++) {
    holdCards[i].ifBeingChoosed = false;
  }

  ifChoossing = false;
}

function getSelectedCardIndex() {
  for (let i = 0; i < holdCards.length; i++) {
    if (holdCards[i].ifBeingChoosed) {
      return i;
    }
  }

  return -1;
}

function selectCard(index) {
  clearSelectedCards();

  holdCards[index].ifBeingChoosed = true;
  holdCards[index].x = mouseX - holdCards[index].size / 2;
  holdCards[index].y = mouseY - holdCards[index].size * 1.5 / 2;
  ifChoossing = true;
}

function getEnemyAtMouse() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemyLeft = enemies[i].x - 40;
    let enemyRight = enemies[i].x + 40;
    let enemyTop = enemies[i].y - 40;
    let enemyBottom = enemies[i].y + 40;

    if (mouseX > enemyLeft && mouseX < enemyRight &&
        mouseY > enemyTop && mouseY < enemyBottom) {
      return enemies[i];
    }
  }

  return null;
}

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

function mapCellOverEdge() {
  return mapList[1][1][2] > height || mapList[mapList.length - 1][mapList[0].length - 1][2] < 100;
}

function getRewardIndexAtMouse() {
  for (let i = 0; i < rewardOptions.length; i++) {
    let rewardWidth = 160;
    let rewardHeight = 220;
    let gap = 40;
    let startX = width / 2 - (rewardOptions.length * rewardWidth + (rewardOptions.length - 1) * gap) / 2;
    let x = startX + i * (rewardWidth + gap);
    let y = height / 2 - rewardHeight / 2;

    if (mouseX > x && mouseX < x + rewardWidth &&
        mouseY > y && mouseY < y + rewardHeight) {
      return i;
    }
  }

  return -1;
}

function claimReward(index) {
  if (index < 0 || index >= rewardOptions.length) {
    return;
  }

  let reward = rewardOptions[index];

  if (reward.type === 'card') {
    deck.push(reward.cardId);
  }
  else if (reward.type === 'coin') {
    player.money += reward.amount;
  }
  else if (reward.type === 'potion') {
    potionBag.push(reward);
  }

  rewardOptions = [];
  gamemode = 'map';
}

function isMapRoomClickable(colon, row) {
  if (currentMapRow === -1) {
    return row === 0;
  }

  if (row !== currentMapRow + 1) {
    return false;
  }

  let currentPaths = mapList[currentMapColon][currentMapRow][3];

  for (let i = 0; i < currentPaths.length; i++) {
    let nextColon = currentMapColon + currentPaths[i];

    if (nextColon === colon) {
      return true;
    }
  }

  return false;
}

function getMapRoomAtMouse() {
  let cellSize = 24;

  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < MAPROW; row++) {
      let x = mapList[colon][row][1];
      let y = mapList[colon][row][2];

      if (mouseX > x && mouseX < x + cellSize &&
          mouseY > y && mouseY < y + cellSize) {
        return {
          colon: colon,
          row: row
        };
      }
    }
  }

  return null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setGolbalVariables();
}