const config = {
  snackSize: 15,
  snackHeadColor: '#000',
  snackBodyColor: '#9d65c9',
  snackColorStyle: 2,
  snackSpeed: 5,
  foodSize: 10,
  foodColor: '#5d54a4',
  foodColorStyle: 0,

  randomScale: 100,

  margin: 15,
  fps: 60,
  strokeWidth: 2,
  strokeColor: '#000',
}

const snackFood = [
  {
    x: 300,
    y: 300,
  },
]
const gameState = {
  paused: false,
  clock: 0,
  gameOver: false,
  score: 0,
  frameNo: 1,
  refreshRate: 0,
}

let snackState = []

const gameHTML = document.getElementById('gameBackground')
const scoreHTML = document.getElementById('score')
const fpsHTML = document.getElementById('fps')
const ctx = gameHTML.getContext('2d')
const dpi = window.devicePixelRatio

const fix_dpi = () => {
  const style_height = +getComputedStyle(gameHTML)
    .getPropertyValue('height')
    .slice(0, -2)
  const style_width = +getComputedStyle(gameHTML)
    .getPropertyValue('width')
    .slice(0, -2)

  gameHTML.setAttribute('height', style_height * dpi)
  gameHTML.setAttribute('width', style_width * dpi)
}

const draw = {
  drawBox: (x, y, size, colorStyle, fillColor) => {
    ctx.beginPath()
    ctx.rect(x, y, size, size)
    if (colorStyle === 1) {
      ctx.fillStyle = fillColor
      ctx.fill()
    } else if (colorStyle === 2) {
      ctx.lineWidth = config.strokeWidth
      ctx.strokeStyle = config.strokeColor
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.lineWidth = config.strokeWidth
      ctx.strokeStyle = fillColor
      ctx.stroke()
    }
  },

  clearScreen: () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  },
}

fix_dpi()

const snackPrinter = () => {
  for (let i = snackState.length - 1; i >= 0; i--) {
    draw.drawBox(
      snackState[i].position.x,
      snackState[i].position.y,
      snackState[i].snackSize,
      snackState[i].snackColorStyle,
      snackState[i].snackColor
    )
  }
}

const scorePrinter = () => {
  scoreHTML.innerHTML = 'Score : ' + gameState.score
}

document.onkeypress = (e) => {
  e.key === 'w' || e.key === 'W'
    ? snackState[0].position.angle !== (Math.PI / 2) * 3
      ? (snackState[0].position.angle = (Math.PI / 2) * 1)
      : ''
    : ''
  e.key === 's' || e.key === 'S'
    ? snackState[0].position.angle !== Math.PI / 2
      ? (snackState[0].position.angle = (Math.PI / 2) * 3)
      : ''
    : ''
  e.key === 'a' || e.key === 'A'
    ? snackState[0].position.angle !== 0
      ? (snackState[0].position.angle = (Math.PI / 2) * 2)
      : ''
    : ''
  e.key === 'd' || e.key === 'D'
    ? snackState[0].position.angle !== Math.PI
      ? (snackState[0].position.angle = (Math.PI / 2) * 0)
      : ''
    : ''
  e.key === 'p' || e.key === 'P' ? pause() : ''
}

const snackMover = () => {
  // debugger;
  if (gameState.refreshRate >= config.fps / config.snackSpeed) {
    for (let i = snackState.length - 1; i >= 0; i--) {
      snackState[i].position.x +=
        config.snackSize * Math.round(Math.cos(snackState[i].position.angle))
      snackState[i].position.y -=
        config.snackSize * Math.round(Math.sin(snackState[i].position.angle))
      if (snackState[i].position.x > ctx.canvas.width) {
        snackState[i].position.x = config.snackSize / 2
      }
      if (snackState[i].position.x < 0) {
        snackState[i].position.x = ctx.canvas.width - config.snackSize / 2
      }
      if (snackState[i].position.y > ctx.canvas.height) {
        snackState[i].position.y = config.snackSize / 2
      }
      if (snackState[i].position.y < 0) {
        snackState[i].position.y = ctx.canvas.height - config.snackSize / 2
      }
      if (i) {
        snackState[i].position.angle = snackState[i - 1].position.angle
      }
    }
  }
}
const collision = (head, food) => {
  if (
    Math.abs(head.position.x - food.x) <
      config.snackSize / 2 + config.foodSize / 2 &&
    Math.abs(head.position.y - food.y) <
      config.snackSize / 2 + config.foodSize / 2
  ) {
    snackFood[0].x = Math.random() * (ctx.canvas.width - config.foodSize)
    snackFood[0].y = Math.random() * (ctx.canvas.height - config.foodSize)
    bodygenerator(snackState)
    ++gameState.score
  }
}
const bodygenerator = (arr) => {
  // console.log(snackState.length - 1);
  arr.push({
    position: {
      x:
        arr[arr.length - 1].position.x -
        config.snackSize * Math.cos(arr[arr.length - 1].position.angle),
      y:
        arr[arr.length - 1].position.y +
        config.snackSize * Math.sin(arr[arr.length - 1].position.angle),
      angle: arr[arr.length - 1].position.angle,
    },
    snackSize: config.snackSize,
    snackColorStyle: config.snackColorStyle,
    snackColor: config.snackBodyColor,
  })
}

const gameOver = (arr) => {
  for (i = 1; i < arr.length; i++) {
    if (
      Math.abs(arr[0].position.x - arr[i].position.x) < config.snackSize &&
      Math.abs(arr[0].position.y - arr[i].position.y) < config.snackSize
    ) {
      const x = confirm('gameover')
      if (x === true) {
        init()
      }
    }
  }
}

const pause = () => {
  if (!gameState.paused) {
    clearInterval(gameState.clock)
    gameState.paused = true
  } else {
    clearInterval(gameState.clock)
    clock()
    gameState.paused = false
  }
}

const mainGame = () => {
  gameOver(snackState)
  snackMover()
  collision(snackState[0], snackFood[0])

  // printing
  draw.clearScreen()
  draw.drawBox(snackFood[0].x, snackFood[0].y, config.foodSize)
  snackPrinter()
  scorePrinter()
}

//clock
const clock = () => {
  gameState.clock = setInterval(() => {
    const t = new Date().getTime()
    mainGame()
    gameState.frameNo++
    if (gameState.frameNo > config.fps) {
      gameState.frameNo = 1
    }
    gameState.refreshRate++
    if (gameState.refreshRate > config.fps / config.snackSpeed) {
      gameState.refreshRate = 0
    }
    const delay = new Date().getTime() - t
    fpsHTML.innerHTML = `FPS: ${(1000 / (delay + 1000 / config.fps)).toFixed(
      2
    )}`
  }, 1000 / config.fps)
}

const init = () => {
  clearInterval(gameState.clock)
  clock()
  gameState.score = 0
  snackState = [
    {
      position: {
        x: 50,
        y: 60,
        angle: (Math.PI / 2) * 0,
      },
      snackSize: config.snackSize,
      snackColorStyle: config.snackColorStyle,
      snackColor: config.snackHeadColor,
    },
    {
      position: {
        x: 50 - config.snackSize,
        y: 60,
        angle: (Math.PI / 2) * 0,
      },
      snackSize: config.snackSize,
      snackColorStyle: config.snackColorStyle,
      snackColor: config.snackBodyColor,
    },
    {
      position: {
        x: 50 - config.snackSize * 2,
        y: 60,
        angle: (Math.PI / 2) * 0,
      },
      snackSize: config.snackSize,
      snackColorStyle: config.snackColorStyle,
      snackColor: config.snackBodyColor,
    },
    {
      position: {
        x: 50 - config.snackSize * 3,
        y: 60,
        angle: (Math.PI / 2) * 0,
      },
      snackSize: config.snackSize,
      snackColorStyle: config.snackColorStyle,
      snackColor: config.snackBodyColor,
    },
    {
      position: {
        x: 50 - config.snackSize * 4,
        y: 60,
        angle: (Math.PI / 2) * 0,
      },
      snackSize: config.snackSize,
      snackColorStyle: config.snackColorStyle,
      snackColor: config.snackBodyColor,
    },
  ]
}

init()
