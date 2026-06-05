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

let globalSize = {};

const MAPROW = 30;
const MAPCOLON = 5;

let gamemode = 'combat';

let player = {
  hp: 80,
  maxHp: 80,
  energy: 3,
  maxEnergy: 3,
  block: 0,
  image: 'player.png',
  money: 0,
  buffs: [],
  poisonOnMap : {x : 0, y : 0, stacks : 0},
};

let enemies = [];
let damageTexts = [];

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
    rarity: 'original',
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
    rarity: 'original',
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
  poisonStab: {
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
  rummage: {
    name: 'Rummage',
    cost: 1,
    rarity: 'common',
    category: 'skill',
    description: 'Draw 2 cards from the deck.',
    effect: [
      { type: 'draw', value: 2 }
    ],
    image: 'rummage.png'
  }
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
  poison: {
    name: 'Poisoin',
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
  // name, kind (weak, strong, boss), hp, attack, image

  slime: {
    name: 'Slime',
    kind: 'weak',
    hp: 30,
    image: 'slime.png',
    intent: function() {
      let intentType = random(['attack', 'buff_self', 'buff_player']);
      if (intentType === 'attack') {
        this.intent = {attack: 6};
      }
      if (intentType === 'buff_self') {
        this.intent = {buff_self: {type: 'strength', stacks: 5}};
      }
    }
  },
  hardSlime: {
    name: 'Hard Slime',
    kind: 'weak',
    hp: 40,
    image: 'hard_slime.png',
    intent: function() {
      let intentType = random(['attack', 'buff_self', 'buff_player']);
      if (intentType === 'attack') {
        this.intent = {attack: 8};
      }
      if (intentType === 'buff_self') {
        this.intent = {buff_self: {type: 'strength', stacks: 5}};
      }
      if (intentType === 'buff_player') {
        this.intent = {buff_player: {type: 'strength', stacks: 5}};
      }
    }
  },
  giantSlime: {
    name: 'Giant Slime',
    kind: 'strong',
    hp: 60,
    attack: 12,
    image: 'giant_slime.png',
    intent: function() {
      let intentType = random(['attack', 'buff_self', 'buff_player']);
      if (intentType === 'attack') {
        this.intent = {attack: 12};
      }
      if (intentType === 'buff_self') {
        this.intent = {buff_self: {type: 'strength', stacks: 5}};
      }
      if (intentType === 'buff_player') {
        this.intent = {buff_player: {type: 'strength', stacks: 5}};
      }
    }
  },
  iceTree: {
    name: 'Ice Tree',
    kind: 'boss',
    hp: 100,
    attack: 15,
    image: 'ice_tree.png',
    intent: function() {
      let intentType = random(['attack', 'buff_self', 'buff_player']);
      if (intentType === 'attack') {
        this.intent = {attack: 15};
      }
      if (intentType === 'buff_self') {
        this.intent = {buff_self: {type: 'strength', stacks: 5}};
      }
      if (intentType === 'buff_player') {
        this.intent = {buff_player: {type: 'strength', stacks: 5}};
      }
    }
  }
};


// ====================
// 3. PRELOAD
// ====================

let images = {};

function preload() {
  images.mapSymbol = loadImage('assets/images/map_symbol.png');
  images.coinSymbol = loadImage('assets/images/coin_symbol.png');

  images.strength = loadImage('assets/images/strength_symbol.png');
  images.dexterity = loadImage('assets/images/dexterity.png');
  images.vulnerable = loadImage('assets/images/vulnerable.png');
  images.weak = loadImage('assets/images/weak.png');
  images.poison = loadImage('assets/images/poison.png');

  images.combat = loadImage('assets/images/combat.png');
  images.elite = loadImage('assets/images/elite.png');
  images.event = loadImage('assets/images/event.png');
  images.rest = loadImage('assets/images/rest.png');
  images.shop = loadImage('assets/images/shop.png');

  preloadCardImages();
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
    this.size = globalSize.cardWidth;
    this.reach = globalSize.cardReach;
    this.maxSize = globalSize.cardHoverWidth;
    this.minSize = globalSize.cardWidth;
    this.textSize = globalSize.cardTextSize;
  }

  updateResponsiveSize() {
    this.reach = globalSize.cardReach;
    this.maxSize = globalSize.cardHoverWidth;
    this.minSize = globalSize.cardWidth;
    this.textSize = globalSize.cardTextSize;
  }

  displayACard(index, x, y, ifChoossing = false) {
    this.updateResponsiveSize();

    let cardGap = globalSize.cardGap;
    let cardLayoutWidth = globalSize.cardWidth;
    let cardLayoutHeight = globalSize.cardHeight;
    let startX = (width - (holdCards.length * (cardLayoutWidth + cardGap) - cardGap)) / 2;

    if (!ifChoossing && !this.ifBeingChoosed) {
      this.x = startX + index * (cardLayoutWidth + cardGap);
      this.y = height - cardLayoutHeight - globalSize.cardBottomMargin;
    }
    else {
      this.x = x;
      this.y = y;
    }

    this.adjustSizeBasedOnMouse();
    
    fill(this.rarity === 'common' || this.rarity === 'original' ? 'gray' : this.rarity === 'rare' ? 'pink' : 'orange');
    stroke(this.ifBeingChoosed ? 'gold' : 'black');
    strokeWeight(this.ifBeingChoosed && this.ifCanBePlayed ? globalSize.selectedCardStrokeWeight : globalSize.normalStrokeWeight);

    rect(this.x, this.y, this.size, this.size * 1.5, globalSize.cardCornerRadius);
    noStroke();

    let costIconX = this.x + globalSize.commonTextSize * 0.75;
    let costIconY = this.y + globalSize.commonTextSize * 0.75;
    fill(255);
    circle(costIconX, costIconY, globalSize.commonTextSize);

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(this.textSize * 1.2);
    text(this.cost, costIconX, costIconY);

    textSize(this.textSize);
    text(this.name, this.x + this.size / 2, this.y + this.size * 0.18);
    textSize(globalSize.commonTextSize);
    text(this.category, this.x + this.size / 2, this.y + this.size * 0.64);
    textSize(this.textSize);
    text(this.description, this.x + this.size * 0.08, this.y + this.size * 0.86, this.size * 0.84, this.size * 0.5);
  }

  adjustSizeBasedOnMouse() {
    let distanceToMouse = dist(mouseX, mouseY, this.x + this.size / 2, this.y + this.size * 0.75);
    if (distanceToMouse < this.reach) {
      this.textSize = map(distanceToMouse, 0, this.reach, globalSize.commonTextSize * 1.2, globalSize.commonTextSize);
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
    this.kind = data.kind;
    this.hp = data.hp;
    this.maxHp = data.hp;
    this.intent = data.intent;
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

  startCombat('weak');
  setGolbalVariables();
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
    textSize(globalSize.commonTextSize);
    fill(255, 0, 0);
    text('Game Over', width / 2, height / 2);
  }
  else if (gamemode === 'reward') {
    presentGamemode = 'reward';
    ifIncombat = false;
    drawRewardScreen();
  }

  drawDamageNumber();
  drawTopBar();
}


// ====================
// 6. CORE GAMEPLAY
// ====================

function startCombat(combatType) {
  drawCardsPile = [];
  holdCards = [];
  foldCardsPile = [];

  for (let i = 0; i < deck.length; i++) {
    let card = new Card(deck[i]);
    drawCardsPile.push(card);
  }

  shuffle(drawCardsPile, true);

  enemies = [];
  if (combatType === 'weak') {
    let enemyChoice = Object.keys(enemyLibrary).filter(key => enemyLibrary[key].kind === 'weak');
    let enemyname = random(enemyChoice);  
    enemies.push(new Enemy(enemyname));
  }
  else if (combatType === 'strong') {
    let enemyChoice = Object.keys(enemyLibrary).filter(key => enemyLibrary[key].kind === 'strong');
    let enemyname = random(enemyChoice);
    enemies.push(new Enemy(enemyname));
  }

  player.energy = player.maxEnergy;
  player.block = 0;

  drawingCards(numberOfDrawing_round);

  gamemode = 'combat';
}

function drawRest() {
  imageMode(CENTER);
  image(images.restImage, width / 2, height / 2, globalSize.restImageSize, globalSize.restImageSize);
  player.hp = min(player.hp + floor(player.maxHp * 0.3), player.maxHp);
}

function drawShop() {
}

function drawEvent() {
}

function startTurn() {
  player.energy = player.maxEnergy;
  player.block = 0;
  drawingCards(numberOfDrawing_round);
}

function endTurn() {
  for (let i = holdCards.length - 1; i >= 0; i--) {
    foldingCards(i);
  }

  clearSelectedCards();

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
      displayDamageText(effect.value, target);
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
  let animationDuration = 200; // frames
  let startTime = frameCount;
  let damageText = {
    amount: amount,
    x: target.x,
    y: target.y,
    speed: random(3,4),
    angle: random(-PI / 6, PI / 6),
    alpha: 255,
    update: function() {
      let elapsed = frameCount - startTime;
      if (elapsed < animationDuration) {
        this.speed *= 0.95;
        this.x += this.speed * cos(this.angle);
        this.y -= this.speed * sin(this.angle);
        this.alpha = map(elapsed, 0, animationDuration, 255, 0);
      }
      else {
        this.alpha = 0;
      }
    },
    display: function() {
      if (this.alpha > 0) {
        fill(255, 0, 0, this.alpha);
        textAlign(CENTER, CENTER);
        textSize(globalSize.damageTextSize);
        text(this.amount, this.x, this.y);
      }
    }
  };
  damageTexts.push(damageText);
}



function enemyTurn() {
  if (enemies.length === 0) {
    return;
  }
  for (let i = 0; i < enemies.length; i++) { 
    let enemy = enemies[i];
    let intent = enemy.intent;
    if (intent.buff_self) {
      let existingBuff = enemy.buffs.find(buff => buff.type === intent.buff.type);
      if (existingBuff) {
        existingBuff.stacks += intent.buff.stacks;
      }
    } 
    if (intent.buff_player) {
      let existingBuff = player.buffs.find(buff => buff.type === intent.buff.type);
      if (existingBuff) {
        existingBuff.stacks += intent.buff.stacks;
      }
    }
    else if (intent.attack) {
      let damage = intent.attack;
      let block = player.block;
      if (block >= damage) {
        player.block -= damage;
        damage = 0;
      }
      else {
        damage -= player.block;
        player.block = 0;
      }

      player.hp -= damage;
      displayDamageText(damage, player);
    }
    if (player.hp < 0) {
      player.hp = 0;
    }
  }
}

function generateRewards() {
  rewardOptions = [];

  // card reward
  let cardIds = Object.keys(cardLibrary);
  let cardRarities = ['common', 'rare', 'legendary'];
  let rarityWeights = {
    common: 0.6,
    rare: 0.3,
    legendary: 0.1
  };

  let rarityPool = [];
  for (let rarity of cardRarities) {
    for (let i = 0; i < rarityWeights[rarity] * 100; i++) {
      rarityPool.push(rarity);
    }
  } 
  let selectedRarity = random(rarityPool);
  let filteredCardIds = cardIds.filter(id => cardLibrary[id].rarity === selectedRarity);
  let selectedCardId = random(filteredCardIds);
  rewardOptions.push({
    type: 'card',
    cardId: selectedCardId,
    name: cardLibrary[selectedCardId].name,
    description: cardLibrary[selectedCardId].description
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
    let x = enemies.length === 1 ? width * 0.75 : width * 0.75 + (i - (enemies.length - 1) / 2) * globalSize.enemyGap;
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
  textSize(globalSize.commonTextSize);
  if (getEnemyAtMouse()) {
    text(enemy.name, x, y + globalSize.entitySize * 0.7);
  }
}

function drawEnemyImage(index, x, y) {
  let enemy = enemies[index];
  push();
  fill(200, 100, 100);
  rect(enemy.x - globalSize.entitySize / 2, enemy.y - globalSize.entitySize / 2, globalSize.entitySize, globalSize.entitySize);
  // image(enemy.image, enemy.x, enemy.y);
  pop();
}

function drawEnemyIntent(index) {
  let enemy = enemies[index];
  if (enemy.intent.attack) {
    textSize(globalSize.commonTextSize);
    text("ATK: " + enemy.intent.attack, enemy.x, enemy.y - globalSize.entitySize * 0.75 + sin(frameCount * 0.06) * globalSize.floatDistance);
  }
  else if (enemy.intent.buff) {
    textSize(globalSize.commonTextSize);
    text("BUFF: " + enemy.intent.buff.type + " (" + enemy.intent.buff.stacks + ")", enemy.x, enemy.y - globalSize.entitySize * 0.75 + sin(frameCount * 0.06) * globalSize.floatDistance);
  }
}

function drawEnemyHP(index) {
  let enemy = enemies[index];
  let hpRatio = enemy.hp / enemy.maxHp;
  let hpBarWidth = min(width * 0.003 * enemy.maxHp, width * 0.2);
  let hpBarHeight = globalSize.hpBarHeight;
  let filledWidth = hpBarWidth * hpRatio;
  push();
  stroke(0);
  fill(255, 0, 0, 0);
  rect(enemy.x - hpBarWidth / 2, enemy.y + globalSize.entitySize * 0.75, hpBarWidth, hpBarHeight);
  fill(255, 0, 0);
  noStroke();
  rect(enemy.x - hpBarWidth / 2, enemy.y + globalSize.entitySize * 0.75, filledWidth, hpBarHeight);
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(globalSize.commonTextSize);
  text(`HP: ${enemy.hp} / ${enemy.maxHp}`, enemy.x, enemy.y + globalSize.entitySize * 0.75 + hpBarHeight / 2);
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
    let buffImage = images[buff.type];

    if (buffImage) {
      imageMode(CENTER);
      image(
        buffImage,
        target.x - globalSize.entitySize / 2 + i * globalSize.buffIconGap,
        target.y - globalSize.entitySize / 2,
        globalSize.buffIconSize,
        globalSize.buffIconSize
      );
    }
  }
}

function drawPlayer() {
  let playerX = width / 4;
  let playerY = height / 2;
  fill(100, 200, 100);
  rect(playerX - globalSize.entitySize / 2, playerY - globalSize.entitySize / 2, globalSize.entitySize, globalSize.entitySize);

  drawBuff(player);

  drawPlayerHP(playerX, playerY);
  changeOfPlayerHP();

  fill(255);
  textAlign(LEFT, TOP);
  textSize(globalSize.commonTextSize);
  text(`Block: ${player.block}`, globalSize.screenPadding, upperPartHeight + globalSize.lineGap * 3);

  drawEnergy();
}

function drawEnergy() {
  fill(255); 
  circle(globalSize.energyIconX, globalSize.energyIconY, globalSize.energyIconSize);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(globalSize.commonTextSize);
  text(`${player.energy} / ${player.maxEnergy}`, globalSize.energyIconX, globalSize.energyIconY);
} 

function drawPlayerHP(x, y) {
  let hpRatio = player.hp / player.maxHp;
  let hpBarWidth = globalSize.playerHpBarWidth;
  let hpBarHeight = globalSize.hpBarHeight;
  let filledWidth = hpBarWidth * hpRatio;
  push();
  stroke(0);
  fill(255, 0, 0, 0);
  rect(x - hpBarWidth / 2, y + globalSize.entitySize * 0.75, hpBarWidth, hpBarHeight);
  fill(255, 0, 0);
  noStroke();
  rect(x - hpBarWidth / 2, y + globalSize.entitySize * 0.75, filledWidth, hpBarHeight);
  fill(255);
  textAlign(CENTER,CENTER);
  textSize(globalSize.commonTextSize);
  text(`HP: ${player.hp} / ${player.maxHp}`, x, y + globalSize.entitySize * 0.75 + hpBarHeight / 2);
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

function drawDamageNumber() {
  for (let i = damageTexts.length - 1; i >= 0; i--) {
    damageTexts[i].update();
    damageTexts[i].display();
    if (damageTexts[i].alpha <= 0) {
      damageTexts.splice(i, 1);
    }
  }
}


function drawTopBar() {
  fill(150);
  rect(0, 0, width, globalSize.upperPartHeight);

  partOfText();

  imageMode(CENTER);
  image(images.mapSymbol, globalSize.mapIconX, globalSize.upperPartHeight / 2, globalSize.topIconSize * 2, globalSize.topIconSize * 2);
  image(images.coinSymbol, globalSize.coinIconX, globalSize.upperPartHeight / 2, globalSize.topIconSize, globalSize.topIconSize);  textAlign(LEFT, TOP);
  textSize(globalSize.commonTextSize);
  fill('gold');
  text(player.money, globalSize.moneyTextX, globalSize.topBarTextY);

  textAlign(RIGHT, TOP);
  text(deck.length, width - globalSize.screenPadding, globalSize.topBarTextY);
}

function partOfText() {
  fill(255);
  textSize(globalSize.commonTextSize);
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
      column.push([randomRoomType()]);
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
      if (row === 0) {
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
  strokeWeight(globalSize.normalStrokeWeight);

  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < MAPROW; row++) {
      let paths = mapList[colon][row][3];

      if (paths) {
        for (let i = 0; i < paths.length; i++) {
          let nextColon = colon + paths[i];
          let nextRow = row + 1;

          if (nextColon >= 0 && nextColon < 5 && nextRow >= 0 && nextRow < MAPROW) {
            if (mapList[nextColon][nextRow][3]) {
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
  }

  // draw rooms
  for (let colon = 0; colon < 5; colon++) {
    for (let row = 0; row < MAPROW; row++) {
      let roomType = mapList[colon][row][0];
      let x = mapList[colon][row][1];
      let y = mapList[colon][row][2];
      let paths = mapList[colon][row][3];

      if (paths) {
        if (row > 1) {
          if (!mapList[colon][row - 1][3] || mapList[colon][row - 1][3].length < 1) {
            continue;
          }
        }

        noStroke();

        let roomImage = images[roomType];

        if (roomImage) {
          imageMode(CORNER);
          image(roomImage, x, y, cellSize, cellSize);
        }

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
      }
    }
  }

  if (mapCellOverEdge()) {
    for (let colon = 0; colon < 5; colon++) {
      for (let row = 0; row < MAPROW; row++) {   
        if (mapList[4][4][2] < 100) {
          mapList[colon][row][2] += 3;
        }
        else {
          mapList[colon][row][2] -= 3;
        }
      }
    }
  }

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(globalSize.commonTextSize);
  text('Map: choose a connected room on the next floor', width / 2, upperPartHeight + globalSize.lineGap);
}

function displayDiscardPile() {
  let count = foldCardsPile.length;
  let rows = ceil(count / max(1, floor(mapWidth / globalSize.pileCardStepX)));

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  if (foldCardsPile.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(globalSize.commonTextSize);
    fill(255);
    text('No cards in the discard pile', width / 2, height / 2);
    return;
  }


  for (let i = rows; i >= 0; i--) {
    for (let j = 0; j < max(1, floor(mapWidth / globalSize.pileCardStepX)); j++) {
      let index = i * max(1, floor(mapWidth / globalSize.pileCardStepX)) + j;
      let x = globalSize.pilePadding + width / 2 - mapWidth / 2 + j * globalSize.pileCardStepX;
      let y = globalSize.pilePadding + i * globalSize.pileCardStepY;
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

  if (roomType === 'combat') {
    startCombat('weak');
  }
  else if (roomType === 'elite') {
    startCombat('strong');
  }
  else if (roomType === 'rest') {
    drawRest();
    gamemode = 'map';
  }
  else if (roomType === 'shop') {
    drawShop();
    gamemode = 'map';
  }
  else if (roomType === 'event') {
    drawEvent();
    gamemode = 'map';
  }
}

function displayDrawPile() {
  let count = drawCardsPile.length;
  let rows = ceil(count / max(1, floor(mapWidth / globalSize.pileCardStepX)));

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  if (drawCardsPile.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(globalSize.commonTextSize);
    fill(255);
    text('No cards in the draw pile', width / 2, height / 2);
    return;
  }

  for (let i = rows; i >= 0; i--) {
    for (let j = 0; j < max(1, floor(mapWidth / globalSize.pileCardStepX)); j++) {
      let index = i * max(1, floor(mapWidth / globalSize.pileCardStepX)) + j;
      let x = globalSize.pilePadding + width / 2 - mapWidth / 2 + j * globalSize.pileCardStepX;
      let y = globalSize.pilePadding + i * globalSize.pileCardStepY;

      if (index < drawCardsPile.length) {
        drawCardsPile[index].displayACard(index, x, y, true);
      }
    }
  }
}

function displayCardPile() {
  let count = deck.length;
  let rows = ceil(count / max(1, floor(mapWidth / globalSize.pileCardStepX)));

  fill(50, 150);
  rect(0, 0, width, height);

  fill(150);
  rect(width / 2 - mapWidth / 2, 0, mapWidth, height);

  if (deck.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(globalSize.commonTextSize);
    fill(255);
    text('No cards in the deck', width / 2, height / 2);
    return;
  }

  for (let i = rows; i >= 0; i--) {
    for (let j = 0; j < max(1, floor(mapWidth / globalSize.pileCardStepX)); j++) {
      let index = i * max(1, floor(mapWidth / globalSize.pileCardStepX)) + j;
      let x = globalSize.pilePadding + width / 2 - mapWidth / 2 + j * globalSize.pileCardStepX;
      let y = globalSize.pilePadding + i * globalSize.pileCardStepY;

      if (index < deck.length) {
        deck[index].displayACard(index, x, y, true);
      }
    }
  }

}

function drawRewardScreen() {
  background(60);

  textAlign(CENTER, CENTER);
  textSize(globalSize.commonTextSize);
  fill(255);
  text('Choose Your Reward', width / 2, height / 4);

  for (let i = 0; i < rewardOptions.length; i++) {
    let reward = rewardOptions[i];

    let rewardWidth = globalSize.rewardWidth;
    let rewardHeight = globalSize.rewardHeight;
    let gap = globalSize.rewardGap;
    let startX = width / 2 - (rewardOptions.length * rewardWidth + (rewardOptions.length - 1) * gap) / 2;
    let x = startX + i * (rewardWidth + gap);
    let y = height / 2 - rewardHeight / 2;

    fill(220);
    stroke(0);
    strokeWeight(globalSize.normalStrokeWeight);
    rect(x, y, rewardWidth, rewardHeight, globalSize.cardCornerRadius);

    fill(0);
    noStroke();
    textSize(globalSize.commonTextSize);

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

function drawSkipButton() {
  push();
  fill(180);
  stroke(0);
  strokeWeight(globalSize.normalStrokeWeight);
  rect(skipButtonX, skipButtonY, skipButtonWidth, skipButtonHeight, globalSize.buttonCornerRadius);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(globalSize.commonTextSize);
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
    if (gamemode !== 'map') {
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
        foldCardsPile[i].y -= event.delta;
      }
      for (let i = 0; i < drawCardsPile.length; i++) {
        drawCardsPile[i].y -= event.delta;
      }
    } 
    else {
      for (let i = 0; i < foldCardsPile.length; i++) {
        foldCardsPile[i].y += event.delta;
      }
      for (let i = 0; i < drawCardsPile.length; i++) {
        drawCardsPile[i].y += event.delta;
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

function randomRoomType() {
  let rand = random();
  if (rand < 0.4) {
    return 'combat';
  }
  else if (rand < 0.7) {
    return 'event';
  }
  else if (rand < 0.85) {
    return 'shop';
  }
  else if (rand < 0.95) {
    return 'elite';
  }
  else {
    return 'rest';
  }
}

function ifTouchingCard(card) {
  return mouseX > card.x &&
         mouseX < card.x + card.size &&
         mouseY > card.y &&
         mouseY < card.y + card.size * 1.5;
}

function onMapSymbol() {
  return mouseX > globalSize.mapIconX - globalSize.topIconSize / 2 &&
         mouseX < globalSize.mapIconX + globalSize.topIconSize / 2 &&
         mouseY > globalSize.upperPartHeight / 2 - globalSize.topIconSize / 2 &&
         mouseY < globalSize.upperPartHeight / 2 + globalSize.topIconSize / 2;
}

function onDiscardPile() {
  return mouseX > discardPilePositionX - globalSize.pileClickSize / 2 &&
         mouseX < discardPilePositionX + globalSize.pileClickSize / 2 &&
         mouseY > discardPilePositionY - globalSize.pileClickSize / 2 &&
         mouseY < discardPilePositionY + globalSize.pileClickSize / 2;
}

function onDrawPile() {
  return mouseX > drawPilePositionX - globalSize.pileClickSize / 2 &&
         mouseX < drawPilePositionX + globalSize.pileClickSize / 2 &&
         mouseY > drawPilePositionY - globalSize.pileClickSize / 2 &&
         mouseY < drawPilePositionY + globalSize.pileClickSize / 2;
}


function updateResponsiveUi() {
  let shortestSide = min(width, height);

  let upperPartHeight = height * 0.06;
  let battleAreaHeight = height - upperPartHeight;

  let handAreaWidth = width * 0.9;
  let handAreaHeight = battleAreaHeight * 0.28;

  let cardCount = max(holdCards.length, numberOfDrawing_round, 1);

  let cardHeightRatio = 1.5;
  let cardGapRatio = 0.12;

  let cardWidthFromScreenWidth = handAreaWidth / (cardCount + (cardCount - 1) * cardGapRatio);
  let cardWidthFromScreenHeight = handAreaHeight / cardHeightRatio;

  let cardWidth = min(cardWidthFromScreenWidth, cardWidthFromScreenHeight);
  let cardHeight = cardWidth * cardHeightRatio;
  let cardGap = cardWidth * cardGapRatio;

  let mapAreaWidth = width * 0.7;
  let mapRoomSize = min(mapAreaWidth / 7, (height - upperPartHeight) / 15);

  let entityAreaHeight = battleAreaHeight * 0.35;
  let entitySize = min(width * 0.1, entityAreaHeight * 0.5);
  

  globalSize = {


    cardWidth: cardWidth,
    cardHeight: cardHeight,
    cardGap: cardGap,
    cardHoverWidth: cardWidth * 1.25,
    cardReach: cardWidth * 1.8,
    cardTextSize: cardWidth * 0.12,
    cardTitleTextSize: cardWidth * 0.15,
    cardDescriptionTextSize: cardWidth * 0.105,
    cardIconSize: cardWidth * 0.22,
    cardCornerRadius: cardWidth * 0.08,
    cardBottomMargin: battleAreaHeight * 0.04,

    mapRoomSize: mapRoomSize,

    playerHpBarWidth: entitySize * 1.4,
    playerHpBarHeight: entitySize * 0.18,

    damageTextSize: entitySize * 0.5,

    upperPartHeight: upperPartHeight,
    mapWidth: mapAreaWidth,
    mapIconX: globalSize.screenPadding + globalSize.topIconSize / 2,
    moneyTextX: globalSize.screenPadding + globalSize.topIconSize * 2,
    topBarTextY: upperPartHeight / 2 - globalSize.commonTextSize / 2,
    coinIconX: globalSize.screenPadding + globalSize.topIconSize * 1.5,
    topIconSize: upperPartHeight * 0.7,


    entitySize: entitySize,
    enemyGap: width * 0.12,
    hpBarWidth: entitySize * 1.4,
    hpBarHeight: entitySize * 0.18,
    buffIconSize: entitySize * 0.22,
    buffIconGap: entitySize * 0.25,
    floatDistance: entitySize * 0.06,

    rewardWidth: width * 0.22,
    rewardHeight: battleAreaHeight * 0.32,
    rewardGap: width * 0.03,

    pileCardStepX: cardWidth + cardGap,
    pileCardStepY: cardHeight + cardGap,
    pilePadding: shortestSide * 0.02,
    pileClickSize: upperPartHeight,

    energyIconSize: entitySize * 0.65,
    energyIconX: width * 0.1,
    energyIconY: height * 0.65,

    screenPadding: shortestSide * 0.025,
    normalStrokeWeight: shortestSide * 0.003,
    selectedCardStrokeWeight: shortestSide * 0.007,
    buttonCornerRadius: shortestSide * 0.018,
    commonTextSize: shortestSide * 0.025,
    lineGap: shortestSide * 0.04
  };
}

function setGolbalVariables() {
  updateResponsiveUi();

  discardPilePositionX = width - globalSize.screenPadding / 4;
  discardPilePositionY = height - globalSize.screenPadding / 4;
  drawPilePositionX = globalSize.screenPadding / 4;
  drawPilePositionY = height - globalSize.screenPadding / 4;
  upperPartHeight = max(height * 0.05, globalSize.topIconSize + globalSize.topBarTextY * 2);
  mapWidth = width * 0.7;
  skipButtonWidth = width * 0.15;
  skipButtonHeight = height * 0.06;
  skipButtonX = width - skipButtonWidth - globalSize.screenPadding;
  skipButtonY = height - height * 0.4;
}

function mapCellOverEdge() {
  return mapList[1][1][2] < upperPartHeight + globalSize.screenPadding || mapList[mapList.length - 1][mapList[0].length - 1][2] > height;
}

function getRewardIndexAtMouse() {
  for (let i = 0; i < rewardOptions.length; i++) {
    let rewardWidth = globalSize.rewardWidth;
    let rewardHeight = globalSize.rewardHeight;
    let gap = globalSize.rewardGap;
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