// ===========================================================
// 1. GLOBAL VARIABLES
// ===========================================================



let numberOfDrawing_round = 5;


let mapList = [];
let currentMapColon = -1;
let currentMapRow = -1;
let ifChoossing = false;
let ifIncombat = false;
let presentGamemode = 'combat';


let discardPilePositionX;
let discardPilePositionY;
let drawPilePositionX;
let drawPilePositionY;
let upperPartHeight;
let mapWidth;
let skipButtonX;
let skipButtonY;
let skipButtonWidth;
let skipButtonHeight;

let screenScale = 1;
let aspectRatio = 16 / 9;
let cardUi = {};

const MAPROW = 30;
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
    kind: 'weak',
    hp: 30,
    attack: 6,
    image: 'slime.png',
  },
  giantSlime: {
    name: 'Giant Slime',
    kind: 'strong',
    hp: 60,
    attack: 12,
    image: 'giant_slime.png',
  },
  iceTree: {
    name: 'Ice Tree',
    kind: 'boss',
    hp: 100,
    attack: 15,
    image: 'ice_tree.png',
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
    this.size = cardUi.cardMinSize;
    this.reach = cardUi.cardReach;
    this.maxSize = cardUi.cardMaxSize;
    this.minSize = cardUi.cardMinSize;
    this.textSize = cardUi.cardTextSize;
  }

  updateResponsiveSize() {
    this.reach = cardUi.cardReach;
    this.maxSize = cardUi.cardMaxSize;
    this.minSize = cardUi.cardMinSize;
    this.textSize = cardUi.cardTextSize;
  }

  displayACard(index, x, y, ifChoossing = false) {
    this.updateResponsiveSize();

    let cardGap = cardUi.cardGap;
    let cardLayoutSize = cardUi.cardMinSize;
    let startX = (width - (holdCards.length * (cardLayoutSize + cardGap) - cardGap)) / 2;

    if (!ifChoossing && !this.ifBeingChoosed) {
      this.x = startX + index * (cardLayoutSize + cardGap);
      this.y = height - cardLayoutSize * 1.5 - cardUi.cardBottomMargin;
    }
    else {
      this.x = x;
      this.y = y;
    }

    this.adjustSizeBasedOnMouse();
    
    fill(this.rarity === 'common' ? 'gray' : this.rarity === 'rare' ? 'pink' : 'orange');
    stroke(this.ifBeingChoosed ? 'gold' : 'black');
    strokeWeight(this.ifBeingChoosed && this.ifCanBePlayed ? cardUi.selectedCardStrokeWeight : cardUi.normalStrokeWeight);

    rect(this.x, this.y, this.size, this.size * 1.5, cardUi.cardCornerRadius);
    noStroke();

    let costIconX = this.x + cardUi.cardIconSize * 0.75;
    let costIconY = this.y + cardUi.cardIconSize * 0.75;
    fill(255);
    circle(costIconX, costIconY, cardUi.cardIconSize);

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(cardUi.cardTextSize);
    text(this.cost, costIconX, costIconY);

    textSize(cardUi.cardTitleTextSize);
    text(this.name, this.x + this.size / 2, this.y + this.size * 0.18);
    textSize(cardUi.cardTextSize);
    text(this.rarity, this.x + this.size / 2, this.y + this.size * 0.42);
    text(this.category, this.x + this.size / 2, this.y + this.size * 0.64);
    textSize(cardUi.cardDescriptionTextSize);
    text(this.description, this.x + this.size * 0.08, this.y + this.size * 0.86, this.size * 0.84, this.size * 0.5);
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
  createMap();

  deck = starterDeck.slice();

  startCombat();
}

function draw() {
  background(100);

  if (gamemode === 'combat') {
    presentGamemode = 'combat';
    ifIncombat = true;
    drawCombatScene();
  } 
  else if (gamemode === 'map') {
    drawMap();
  } 
  else if (gamemode === 'checkdiscardPile') {
    presentGamemode = 'checkdiscardPile';
    displayDiscardPile();
  } 
  else if (gamemode === 'checkdrawPile') {
    displayDrawPile();
    presentGamemode = 'checkdrawPile';
  }
  else if (gamemode === 'PlayerDefeated') {
    textAlign(CENTER, CENTER);
    textSize(cardUi.rewardTitleTextSize);
    fill(255, 0, 0);
    text('Game Over', width / 2, height / 2);
  }
  else if (gamemode === 'reward') {
    presentGamemode = 'reward';
    ifIncombat = false;
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
  enemies.push(new Enemy('giantSlime'));
  enemies.push(new Enemy('iceTree'));

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

function skipButton() {
  drawSkipButton();
}
// ====================
// 7. RENDER FUNCTIONS
// ====================

function drawCombatScene() {
  drawPlayer();
  drawEnemies();
  drawHand();
  checkIfCombatEnded();
  skipButton();
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
    let x = enemies.length === 1 ? width * 0.75 : width * 0.75 + (i - (enemies.length - 1) / 2) * cardUi.enemyGap;
    let y = height / 2;
    drawEnemyImage(i,x,y);
    drawEnemyName(i,x,y);
    drawEnemyIntent(i,x,y);
    drawEnemyHP(i,x,y);
    checkIfEnemyDefeated(i,x,y);
  }
}

function drawEnemyName(index, x, y) {
  let enemy = enemies[index];
  textAlign(CENTER, TOP);
  textSize(cardUi.entityTextSize);
  if (getEnemyAtMouse()) {
    text(enemy.name, x, y + cardUi.entitySize * 0.7);
  }
}

function drawEnemyImage(index, x, y) {
  let enemy = enemies[index];
  push();
  fill(200, 100, 100);
  rect(enemy.x - cardUi.entitySize / 2, enemy.y - cardUi.entitySize / 2, cardUi.entitySize, cardUi.entitySize);
  // image(enemy.image, enemy.x, enemy.y);
  pop();
}

function drawEnemyIntent(index) {
  let enemy = enemies[index];
  if (enemy.intent === 'attack') {
    textSize(cardUi.entityTextSize);
    text("ATK: " + enemy.attack, enemy.x, enemy.y - cardUi.entitySize * 0.75 + sin(frameCount * 0.06) * cardUi.floatDistance);
  }
  else if (enemy.intent === '') {
  }
}

function drawEnemyHP(index) {
  let enemy = enemies[index];
  let hpRatio = enemy.hp / enemy.maxHp;
  let hpBarWidth = min(width * 0.003 * enemy.maxHp, width * 0.2);
  let hpBarHeight = cardUi.hpBarHeight;
  let filledWidth = hpBarWidth * hpRatio;
  push();
  stroke(0);
  fill(255, 0, 0, 0);
  rect(enemy.x - hpBarWidth / 2, enemy.y + cardUi.entitySize * 0.75, hpBarWidth, hpBarHeight);
  fill(255, 0, 0);
  noStroke();
  rect(enemy.x - hpBarWidth / 2, enemy.y + cardUi.entitySize * 0.75, filledWidth, hpBarHeight);
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(cardUi.hpTextSize);
  text("HP: " + enemy.hp, enemy.x, enemy.y + cardUi.entitySize * 0.75 + hpBarHeight / 2);
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
    image(loadImage(buffLibrary[buff.type].image), target.x - cardUi.entitySize / 2 + i * cardUi.buffIconGap, target.y - cardUi.entitySize / 2, cardUi.buffIconSize, cardUi.buffIconSize);
  }
}

function drawPlayer() {
  let playerX = width / 4;
  let playerY = height / 2;
  fill(100, 200, 100);
  rect(playerX - cardUi.entitySize / 2, playerY - cardUi.entitySize / 2, cardUi.entitySize, cardUi.entitySize);

  drawBuff(player);

  drawPlayerHP(playerX, playerY);
  changeOfPlayerHP();

  fill(255);
  textAlign(LEFT, TOP);
  textSize(cardUi.statusTextSize);
  text("Player HP: " + player.hp + "/" + player.maxHp, cardUi.screenPadding, upperPartHeight + cardUi.lineGap);
  text("Energy: " + player.energy, cardUi.screenPadding, upperPartHeight + cardUi.lineGap * 2);
  text("Block: " + player.block, cardUi.screenPadding, upperPartHeight + cardUi.lineGap * 3);

  
}

function drawPlayerHP(x, y) {
  let hpRatio = player.hp / player.maxHp;
  let hpBarWidth = cardUi.playerHpBarWidth;
  let hpBarHeight = cardUi.hpBarHeight;
  let filledWidth = hpBarWidth * hpRatio;
  push();
  stroke(0);
  fill(255, 0, 0, 0);
  rect(x - hpBarWidth / 2, y + cardUi.entitySize * 0.75, hpBarWidth, hpBarHeight);
  fill(255, 0, 0);
  noStroke();
  rect(x - hpBarWidth / 2, y + cardUi.entitySize * 0.75, filledWidth, hpBarHeight);
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(cardUi.hpTextSize);
  text("HP: " + player.hp, x, y + cardUi.entitySize * 0.75 + hpBarHeight / 2);
  pop();
}

function changeOfPlayerHP() {
  
}

function checkIfCombatEnded() {
  if (player.hp <= 0) {
    gamemode = 'PlayerDefeated';
  }
  else if (enemies.length === 0) {
    gamemode = 'reward';
    generateRewards();
  }
}


function drawTopBar() {
  fill(150);
  rect(0, 0, width, upperPartHeight);

  partOfText();

  imageMode(CENTER);
  image(map_symbol, cardUi.mapIconX, upperPartHeight / 2, cardUi.topIconSize, cardUi.topIconSize);


  image(coin_symbol, cardUi.coinIconX, upperPartHeight / 2, cardUi.coinIconSize, cardUi.coinIconSize);
  textAlign(LEFT, TOP);
  textSize(cardUi.topBarTextSize);
  fill('gold');
  text(player.money, cardUi.moneyTextX, cardUi.topBarTextY);

  textAlign(RIGHT, TOP);
  text(deck.length, width - cardUi.screenPadding, cardUi.topBarTextY);
}

function partOfText() {
  fill(255);
  textSize(cardUi.topBarTextSize);
  textAlign(LEFT, BOTTOM);
  text(`Draw Pile: ${drawCardsPile.length}`, drawPilePositionX, drawPilePositionY);

  textAlign(RIGHT, BOTTOM);
  text(`Discard Pile: ${foldCardsPile.length}`, discardPilePositionX, discardPilePositionY);
}

function createMap() {
  // [kind][x][y][path]

  

  // I PROMISE TO REMEMBER TO LOG OUT OF MY COMPUTER WHEN I FINISH MY CLASSES.
  // OTHERWISE, PEOPLE COULD TOTALLY MESS WITH MY PROJECT(S)
  // THAT WOULD REALLY SUCK

  // YES I DO


  mapList = [];
  for (let col = 0; col < 5; col++) {
    let column = [];
    for (let row = 0; row < MAPROW; row++) {
      let roomType = random(['combat', 'rest', 'shop', 'elite', 'event']);
      column.push([roomType]);
    }
    mapList.push(column);
  }

  let startX = width / 2 - mapWidth / 2 + 40;
  let startY = height - 100;
  let xGap = mapWidth / 5;
  let yGap = height / 7;

  // 1. Assign X and Y coordinates
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row < MAPROW; row++) {
      let x = startX + col * xGap;
      let y = startY - row * yGap;
      mapList[col][row].push(x);
      mapList[col][row].push(y);
    }
  }

  // 2. Generate forward paths
  for (let row = 0; row < MAPROW; row++) {
    for (let col = 0; col < 5; col++) {
      let path = [];

      if (row < MAPROW - 1) {
        let possibleNextCols = [col];
        if (col > 0) {
          possibleNextCols.push(col - 1);
        }
        if (col < 4) {
          possibleNextCols.push(col + 1);
        }

        // FIX: Calculate the number of paths once (1 or 2 paths)
        let numPaths = Math.floor(random(1, 3)); 
        
        for (let i = 0; i < numPaths; i++) {
          let nextCol = random(possibleNextCols);
          let offset = nextCol - col;
          path.push(offset);
        }
        
        // Remove duplicates if the same path was rolled twice
        if (path.length > 1 && path[0] === path[1]) {
          path.splice(1);
        }
        
        mapList[col][row][3] = path;
      }
    }
  }
  // 3. Backward validation (mark unreachable nodes)
  for (let row = 0; row < MAPROW-1; row++) {
    for (let col = 0; col < 5; col++) {
      if (row === 0){
        continue;
      }  // First row is always accessible

      let possibleLastCols = [col];
      if (col > 0) {
        possibleLastCols.push(col - 1);
      }
      if (col < 4) {
        possibleLastCols.push(col + 1);
      }

      let isReachable = false;

      // FIX: Use 'of' to get the actual array values, not string indices
      for (let lastCol of possibleLastCols) {
        // Calculate the offset the parent node WOULD have taken to reach us
        let neededOffset = col - lastCol; 
        let parentPaths = mapList[lastCol][row - 1][3];

        if (parentPaths && parentPaths.includes(neededOffset)) {
          isReachable = true;
          break; // We only need one path to reach us to be valid
        }
      }

      // If no node from the previous row links to this node, mark it false
      if (!isReachable) {
        mapList[col][row][3] = false; 
      }
    }
  }


  currentMapColon = -1;
  currentMapRow = -1;
}

function drawMap() {
  let cellSize = min(mapWidth / 7, height / 15);

  // background
  fill(50, 150);
  rect(0, 0, width, height);

  // map background
  fill(150);
  rect(width / 2 - mapWidth / 2, upperPartHeight, mapWidth, height - upperPartHeight);

  // draw paths 
  stroke(255);
  strokeWeight(cardUi.normalStrokeWeight);

  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < MAPROW; row++) {
      let paths = mapList[colon][row][3];
      if (paths){
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
  }

  // draw rooms
  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < MAPROW; row++) {
      let roomType = mapList[colon][row][0];
      let x = mapList[colon][row][1];
      let y = mapList[colon][row][2];
      let paths = mapList[colon][row][3];
      if (paths){
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
        textSize(cardUi.mapRoomTextSize);
        text(roomType, x + cellSize / 2, y + cellSize / 2);
      }
    }
  }

  if (mapCellOverEdge()){
    for (let colon = 0; colon < 5; colon++) {
      for (let row = 0; row < MAPROW; row++) {   
        if (mapList[4][4][2] < 100){
          mapList[colon][row][2] += 3;
        }
        else{
          mapList[colon][row][2] -= 3;
        }
      }
    }
  }

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(cardUi.mapTitleTextSize);
  text('Map: choose a connected room on the next floor', width / 2, upperPartHeight / 2);
}

function displayDiscardPile() {
  let count = foldCardsPile.length;
  let rows = ceil(count / max(1, floor(mapWidth / cardUi.pileCardStepX)));

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  if (foldCardsPile.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(cardUi.messageTextSize);
    fill(255);
    text('No cards in the discard pile', width / 2, height / 2);
    return;
  }


  for (let i = rows; i >= 0; i--) {
    for (let j = 0; j < max(1, floor(mapWidth / cardUi.pileCardStepX)); j++) {
      let index = i * max(1, floor(mapWidth / cardUi.pileCardStepX)) + j;
      let x = cardUi.pilePadding + width / 2 - mapWidth / 2 + j * cardUi.pileCardStepX;
      let y = cardUi.pilePadding + i * cardUi.pileCardStepY;
      if (index < foldCardsPile.length) {
        foldCardsPile[index].displayACard(index, x, y, true);
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
  let rows = ceil(count / max(1, floor(mapWidth / cardUi.pileCardStepX)));

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  if (drawCardsPile.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(cardUi.messageTextSize);
    fill(255);
    text('No cards in the draw pile', width / 2, height / 2);
    return;
  }

  for (let i = rows; i >= 0; i--) {
    for (let j = 0; j < max(1, floor(mapWidth / cardUi.pileCardStepX)); j++) {
      let index = i * max(1, floor(mapWidth / cardUi.pileCardStepX)) + j;
      let x = cardUi.pilePadding + width / 2 - mapWidth / 2 + j * cardUi.pileCardStepX;
      let y = cardUi.pilePadding + i * cardUi.pileCardStepY;

      if (index < drawCardsPile.length) {
        drawCardsPile[index].displayACard(index, x, y, true);
      }
    }
  }
}

function displayCardPile() {
  let count = deck.length;
  let rows = ceil(count / max(1, floor(mapWidth / cardUi.pileCardStepX)));

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  if (deck.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(cardUi.messageTextSize);
    fill(255);
    text('No cards in the deck', width / 2, height / 2);
    return;
  }

  for (let i = rows; i >= 0; i--) {
    for (let j = 0; j < max(1, floor(mapWidth / cardUi.pileCardStepX)); j++) {
      let index = i * max(1, floor(mapWidth / cardUi.pileCardStepX)) + j;
      let x = cardUi.pilePadding + width / 2 - mapWidth / 2 + j * cardUi.pileCardStepX;
      let y = cardUi.pilePadding + i * cardUi.pileCardStepY;

      if (index < deck.length) {
        deck[index].displayACard(index, x, y, true);
      }
    }
  }

}

function drawRewardScreen() {
  background(60);

  textAlign(CENTER, CENTER);
  textSize(cardUi.rewardTitleTextSize);
  fill(255);
  text('Choose Your Reward', width / 2, height / 4);

  for (let i = 0; i < rewardOptions.length; i++) {
    let reward = rewardOptions[i];

    let rewardWidth = cardUi.rewardWidth;
    let rewardHeight = cardUi.rewardHeight;
    let gap = cardUi.rewardGap;
    let startX = width / 2 - (rewardOptions.length * rewardWidth + (rewardOptions.length - 1) * gap) / 2;
    let x = startX + i * (rewardWidth + gap);
    let y = height / 2 - rewardHeight / 2;

    fill(220);
    stroke(0);
    strokeWeight(cardUi.normalStrokeWeight);
    rect(x, y, rewardWidth, rewardHeight, cardUi.cardCornerRadius);

    fill(0);
    noStroke();
    textSize(cardUi.rewardTextSize);

    if (reward.type === 'card') {
      let cardData = cardLibrary[reward.cardId];

      text(cardData.name, x + rewardWidth / 2, y + rewardHeight * 0.18);
      text('Card', x + rewardWidth / 2, y + rewardHeight * 0.34);
      text('Cost: ' + cardData.cost, x + rewardWidth / 2, y + rewardHeight * 0.5);
      text(cardData.description, x + rewardWidth * 0.1, y + rewardHeight * 0.62, rewardWidth * 0.8, rewardHeight * 0.25);
    }
    else if (reward.type === 'coin') {
      text('Coin', x + rewardWidth / 2, y + rewardHeight * 0.3);
      text('+' + reward.amount, x + rewardWidth / 2, y + rewardHeight * 0.5);
    }
    else if (reward.type === 'potion') {
      text(reward.name, x + rewardWidth / 2, y + rewardHeight * 0.28);
      text('Potion', x + rewardWidth / 2, y + rewardHeight * 0.45);
      text(reward.description, x + rewardWidth * 0.1, y + rewardHeight * 0.58, rewardWidth * 0.8, rewardHeight * 0.25);
    }
  }
}

function drawSkipButton(){
  push();
  fill(180);
  stroke(0);
  strokeWeight(cardUi.normalStrokeWeight);
  rect(skipButtonX, skipButtonY, skipButtonWidth, skipButtonHeight, cardUi.buttonCornerRadius);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(cardUi.buttonTextSize);
  text('Skip (E)', skipButtonX + skipButtonWidth / 2, skipButtonY + skipButtonHeight / 2);
  pop();
}


// ====================
// 8. MOUSE & KEY INTERACTIONS
// ====================

function mousePressed() {
  if (onSkipButton()) {
    if (gamemode === 'combat') {
      endTurn();
      return;
    }
    if (gamemode === 'reward') {
      gamemode = 'map';
      return;
    }
  }

  if (onMapSymbol()) {
    if (gamemode !== 'map'){
      gamemode = 'map';
      return;
    }
    else {
      gamemode = presentGamemode;
      return;
    }
  }

  if (gamemode === 'reward') {
    let rewardIndex = getRewardIndexAtMouse();

    if (rewardIndex !== -1) {
      claimReward(rewardIndex);
    }

    return;
  }

  if (gamemode === 'map' && !ifIncombat) {
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
        foldCardsPile[i].y -= cardUi.lineGap;
      }
      for (let i = 0; i < drawCardsPile.length; i++) {
        drawCardsPile[i].y -= cardUi.lineGap;
      }
    } 
    else {
      for (let i = 0; i < foldCardsPile.length; i++) {
        foldCardsPile[i].y += cardUi.lineGap;
      }
      for (let i = 0; i < drawCardsPile.length; i++) {
        drawCardsPile[i].y += cardUi.lineGap;
      }
    }
  }
}

function keyPressed() {
  if (key === 'e' || key === 'E') {
    if (gamemode === 'combat') {
      endTurn();
    }
    if (gamemode === 'reward') {
      gamemode = 'map';
    }
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
  return mouseX > cardUi.mapIconX - cardUi.topIconSize / 2 &&
         mouseX < cardUi.mapIconX + cardUi.topIconSize / 2 &&
         mouseY > upperPartHeight / 2 - cardUi.topIconSize / 2 &&
         mouseY < upperPartHeight / 2 + cardUi.topIconSize / 2;
}

function onDiscardPile() {
  return mouseX > discardPilePositionX - cardUi.pileClickSize / 2 &&
         mouseX < discardPilePositionX + cardUi.pileClickSize / 2 &&
         mouseY > discardPilePositionY - cardUi.pileClickSize / 2 &&
         mouseY < discardPilePositionY + cardUi.pileClickSize / 2;
}

function onDrawPile() {
  return mouseX > drawPilePositionX - cardUi.pileClickSize / 2 &&
         mouseX < drawPilePositionX + cardUi.pileClickSize / 2 &&
         mouseY > drawPilePositionY - cardUi.pileClickSize / 2 &&
         mouseY < drawPilePositionY + cardUi.pileClickSize / 2;
}

function getScaledSize(baseValue, minValue, maxValue) {
  return constrain(baseValue * screenScale, minValue, maxValue);
}

function updateResponsiveUi() {
  let baseWidth = 1280;
  let baseHeight = 720;

  aspectRatio = width / height;

  if (aspectRatio > 2.1) {
    screenScale = height / baseHeight;
  }
  else if (aspectRatio < 0.65) {
    screenScale = width / baseWidth;
  }
  else {
    screenScale = min(width / baseWidth, height / baseHeight);
  }

  screenScale = constrain(screenScale, 0.55, 1.8);

  let cardMinSize = getScaledSize(105, 58, 155);
  let cardMaxSize = getScaledSize(145, 78, 220);
  let rewardWidth = min(width * 0.26, getScaledSize(260, 150, 390));
  let rewardHeight = min(height * 0.38, getScaledSize(260, 175, 360));

  cardUi = {
    cardMinSize: cardMinSize,
    cardMaxSize: cardMaxSize,
    cardReach: getScaledSize(230, 125, 380),
    cardGap: getScaledSize(12, 6, 24),
    cardBottomMargin: getScaledSize(42, 22, 90),
    cardCornerRadius: getScaledSize(8, 4, 18),
    cardTitleTextSize: getScaledSize(15, 9, 24),
    cardTextSize: getScaledSize(13, 8, 21),
    cardDescriptionTextSize: getScaledSize(11, 7, 18),
    cardIconSize: getScaledSize(26, 14, 44),

    topBarTextSize: getScaledSize(17, 10, 28),
    topIconSize: getScaledSize(38, 22, 58),
    coinIconSize: getScaledSize(22, 14, 36),
    mapIconX: getScaledSize(50, 34, 80),
    coinIconX: getScaledSize(105, 70, 150),
    moneyTextX: getScaledSize(125, 86, 180),
    topBarTextY: getScaledSize(5, 3, 12),

    entitySize: getScaledSize(80, 48, 135),
    enemyGap: getScaledSize(150, 80, 260),
    entityTextSize: getScaledSize(18, 10, 30),
    statusTextSize: getScaledSize(18, 10, 30),
    hpTextSize: getScaledSize(15, 9, 25),
    hpBarHeight: getScaledSize(20, 10, 34),
    playerHpBarWidth: getScaledSize(100, 60, 180),
    buffIconSize: getScaledSize(15, 9, 28),
    buffIconGap: getScaledSize(20, 12, 36),
    floatDistance: getScaledSize(3, 2, 7),

    mapRoomTextSize: getScaledSize(12, 7, 20),
    mapTitleTextSize: getScaledSize(20, 11, 34),
    messageTextSize: getScaledSize(22, 12, 36),

    rewardWidth: rewardWidth,
    rewardHeight: rewardHeight,
    rewardGap: getScaledSize(45, 18, 80),
    rewardTitleTextSize: getScaledSize(32, 18, 54),
    rewardTextSize: getScaledSize(18, 10, 30),

    pileCardStepX: cardMinSize + getScaledSize(16, 8, 28),
    pileCardStepY: cardMinSize * 1.5 + getScaledSize(20, 10, 36),
    pilePadding: getScaledSize(14, 8, 26),
    pileClickSize: getScaledSize(42, 24, 72),

    screenPadding: getScaledSize(40, 20, 70),
    lineGap: getScaledSize(30, 18, 50),
    normalStrokeWeight: getScaledSize(2, 1, 5),
    selectedCardStrokeWeight: getScaledSize(5, 3, 9),
    buttonCornerRadius: getScaledSize(10, 5, 20),
    buttonTextSize: getScaledSize(20, 11, 34),
  };
}

function setGolbalVariables() {
  updateResponsiveUi();

  discardPilePositionX = width - cardUi.screenPadding / 4;
  discardPilePositionY = height - cardUi.screenPadding / 4;
  drawPilePositionX = cardUi.screenPadding / 4;
  drawPilePositionY = height - cardUi.screenPadding / 4;
  upperPartHeight = max(height * 0.05, cardUi.topIconSize + cardUi.topBarTextY * 2);
  mapWidth = width * 0.7;
  skipButtonWidth = getScaledSize(190, 100, 310);
  skipButtonHeight = getScaledSize(70, 42, 120);
  skipButtonX = width - skipButtonWidth - cardUi.screenPadding;
  skipButtonY = height - height * 0.4;
}

function mapCellOverEdge() {
  return mapList[1][1][2] < upperPartHeight + cardUi.screenPadding || mapList[mapList.length - 1][mapList[0].length - 1][2] > height;
}

function getRewardIndexAtMouse() {
  for (let i = 0; i < rewardOptions.length; i++) {
    let rewardWidth = cardUi.rewardWidth;
    let rewardHeight = cardUi.rewardHeight;
    let gap = cardUi.rewardGap;
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
  let cellSize = min(mapWidth / 7, height / 15);

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

function onSkipButton() {
  return mouseX > skipButtonX && mouseX < skipButtonX + skipButtonWidth &&
         mouseY > skipButtonY && mouseY < skipButtonY + skipButtonHeight;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setGolbalVariables();
}