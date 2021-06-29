  
kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0.2, 0.28, 0.36, 1],
})

const MOVE_SPEED = 120
const JUMP_FORCE = 250
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
let isJumping = true
let currentLevel = 0
let amountLevels = 1
let currentMoney = 0
let secret1 = false
let secret2 = false
let secret3 = false
const FALL_DEATH = 800

loadRoot('https://raw.githubusercontent.com/Elandlord/kaboom-game/main/assets/')
loadSprite('eric', 'characters/character_0001.png')
loadSprite('grass-block-mid', 'tileset/tile_0002.png')
loadSprite('dirt-mid', 'tileset/tile_0006.png')
loadSprite('cactus', 'tileset/tile_0127.png')

loadSprite('blue-enemy', 'characters/character_0016.png')

scene('start', () => {
  add([
    text('Squash all the bugs within the time limit! Press space to start.'), 
    origin('center'), 
    pos(width()/2, height()/ 2)
  ])
  
  keyPress('space', () => {
    go('game', { level: currentLevel, money: currentMoney});
  })
})

scene('game', ({level, money}) => {
  layers(['background', 'objects', 'ui'], 'obj')

  const maps = [
    [
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      'xxx       xxxxxxxx          x',
      'xx        xxxxxxxx          x',
      'x     xxxxxxxxxxxx          x',
      'x                           x',
      'x                           x',
      'xxxxxxxxxxxxx      xxxxxxxxxx',
      'xxxxxxxxxxx                  ',
      '                             ',
      '                             ',
      '                             ',
      'x                           x',
      'x         z              z  x',
      '=============================',
    ],
    [
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      '                             ',
      'x                           x',
      'x  z                      z x',
      '=============================',
    ],
  ]

  const levelCfg = {
    width: 18,
    height: 18,
    '=': [sprite('grass-block-mid'), solid()],
    'c': [sprite('cactus')],
    'x': [sprite('dirt-mid'), solid()],
    'z': [sprite('blue-enemy'), solid(), body(), 'dangerous'],
  }

  const gameLevel = addLevel(maps[level], levelCfg)

  const moneyLabel = add([
    text(`Money: ${currentMoney}`),
    origin('topleft'),
    layer('ui'),
    {
      value: currentMoney,
    }
  ])

  const player = add([
    sprite('eric'), 
    solid(),
    pos(150, 50),
    body(),
    origin('bot')
  ])

  player.collides('dangerous', (object) => {
    if (!isJumping) {
      go('lose', { money: currentMoney})
    }
    
    destroy(object)
    // TODO: play a sound
    currentMoney += 20
    moneyLabel.value += currentMoney
    moneyLabel.text = `Money: ${currentMoney}`
	});

  action('dangerous', (obj) => {
    let enemySpeed = 20

    if (player.pos.x >= obj.pos.x) {
      obj.move(enemySpeed, 0)
    }

    if (player.pos.x <= obj.pos.x) {
      obj.move(-enemySpeed, 0)
    }

  })

  keyDown('left', () => {
      player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
      player.move(MOVE_SPEED, 0)
  })

  player.action(() => {
      camPos(player.pos)

      if (player.grounded()) {
        isJumping = false
      }

      if (player.pos.y >= FALL_DEATH) {
        go('lose', { money: currentMoney})
      }

      if (get("dangerous").length <= 0) {
        go('store', { money: currentMoney})
      }
  })

  keyPress('space', () => {
      if (player.grounded()) {
        isJumping = true
        player.jump(CURRENT_JUMP_FORCE)
      }
  })

  keyDown("up", () => {
		camScale(camScale().add(vec2(dt())));
	});

	keyDown("down", () => {
		camScale(camScale().sub(vec2(dt())));
	});
})

scene('store', ({ money }) => {
  const moneyLabel = add([
    text(`Money: ${currentMoney}`),
    origin('topleft'),
    layer('ui'),
    {
      value: currentMoney,
    }
  ])

  const buySecret1Text = add([
    text('Secret 1 (costs 20)'),
    pos(25, 25)
  ])

  const secretButton1 = add([
    // width, height
    rect(100, 25),
    pos(25, 50),
    color(0, 0, 0),
  ]);

  secretButton1.clicks(() => {
    if (currentMoney >= 20) {
      currentMoney -= 20
      moneyLabel.text = `Money: ${currentMoney}`
      secret1 = true
      return
    }

    alert('You do not have enough money to buy this secret!')
  })

  buySecret1Text.action(() => {
    if (secret1) {
      destroy(buySecret1Text)
    }
  })

  secretButton1.action(() => {
    if (secret1) {
      destroy(secretButton1)
      add([
        text('1. Eric knows PHP (Laravel), CSS (SASS, Tailwind)'),
        pos(25, 25),
      ])
      add([
        text('JavaScript (Vue, Angular) and some C#, Java, Go and Python!'),
        pos(25, 40),
      ])
    }
  })  

  const buySecret2Text = add([
    text('Secret 2 (costs 40)'),
    pos(25, 100)
  ])

  const secretButton2 = add([
    // width, height
    rect(100, 25),
    pos(25, 120),
    color(0, 0, 0),
  ]);

  secretButton2.clicks(() => {
    if (currentMoney >= 40) {
      currentMoney -= 40
      moneyLabel.text = `Money: ${currentMoney}`
      secret2 = true
      return
    }

    alert('You do not have enough money to buy this secret!')
  })

  buySecret2Text.action(() => {
    if (secret2) {
      destroy(buySecret2Text)
    }
  })

  secretButton2.action(() => {
    if (secret2) {
      destroy(secretButton2)
      add([
        text('2. Has experience with building APIs and working in a team.'),
        pos(25, 100),
      ])
      add([
        text('Take a look at Certscanner.com, Reviseme.nl and others.'),
        pos(25, 120),
      ])
    }
  })  

  const continueButton = add([
    // width, height
    rect(100, 25),
    pos(25, 200),
    color(0, 0, 0),
  ]);



  continueButton.clicks(() => {
    currentLevel += 1

    if (currentLevel > amountLevels) {
      go('win', {money: currentMoney})
      return
    }

    go('game', {level: currentLevel, money: currentMoney})
  })
})

scene('lose', ({ money }) => {
  add([
    text(`Game over! Money: ${money}`, 32), 
    origin('center'), 
    pos(width()/2, height()/ 2)
  ])
})

scene('win', ({ money }) => {
  add([
    text(`Winner! Money: ${money}`, 32), 
    origin('center'), 
    pos(width()/2, height()/ 2)
  ])
})

start('start')