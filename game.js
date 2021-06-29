  
kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0.2, 0.28, 0.36, 1],
})

const MOVE_SPEED = 120
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
let isJumping = true
const FALL_DEATH = 800

loadRoot('https://raw.githubusercontent.com/Elandlord/kaboom-game/main/assets/')
loadSprite('eric', 'characters/character_0001.png')
loadSprite('grass-block-mid', 'tileset/tile_0002.png')
loadSprite('dirt-mid', 'tileset/tile_0006.png')
loadSprite('cactus', 'tileset/tile_0127.png')

loadSprite('blue-enemy', 'characters/character_0016.png')

scene("start", () => {
  add([
    text("Squash all the bugs within the time limit! Press space to start."), 
    origin('center'), 
    pos(width()/2, height()/ 2)
  ])
  
  keyPress("space", () => {
    go("game", { level: 0, money: 0});
})
})

scene("game", ({level, money}) => {
  layers(['background', 'objects', 'ui'], 'obj')

  const maps = [
    [
      'xxxxxxxxxxxxxxxxxx           ',
      'xxx          xxxxx           ',
      'xx        xxxxxxxx           ',
      'x     xxxxxxxxxxxx           ',
      'x                            ',
      'x                            ',
      'xxxxxxxxxxxxx                ',
      'xxxxxxxxxxx                  ',
      '                             ',
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
      'x         z              z  x',
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
    text("Money:" + money),
    origin("topleft"),
    layer('ui'),
    {
      value: money,
    }
  ])

  const player = add([
    sprite('eric'), solid(),
    pos(150, 50),
    body(),
    origin('bot')
  ])

  action('dangerous', (obj) => {
    let ENEMY_SPEED = 20;

    if(!obj.collides()) {
      obj.move(-ENEMY_SPEED, 0)
    }
  })

  keyDown('left', () => {
      player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
      player.move(MOVE_SPEED, 0)
  })

  player.on("grounded", () => {
    camShake(0.1)
  })

  player.action(() => {
    camPos(player.pos)
    if (player.pos.y >= FALL_DEATH) {
      go('lose', { money: moneyLabel.value})
    }
  })

  player.action(() => {
    if(player.grounded()) {
      isJumping = false
    }
  })

  keyPress('space', () => {
    if (player.grounded()) {
      isJumping = true
      player.jump(CURRENT_JUMP_FORCE)
    }
  })
})

scene('lose', ({ money }) => {
  add([
    text("Game over! Money:" + money, 32), 
    origin('center'), 
    pos(width()/2, height()/ 2)
  ])
})

start("start")