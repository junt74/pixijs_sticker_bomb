import { Application, Assets, ColorMatrixFilter, Sprite, Texture } from 'pixi.js'
import './style.css'

const CANVAS_SIZE = 1024
const DEFAULT_STICKER_COUNT = 1024
const DEFAULT_STICKER_SCALE = 0.2

const stickerPaths = [
  'img/stickers/bttrider.png',
  'img/stickers/galaxy_force.png',
  'img/stickers/gamest.png',
  'img/stickers/garosupe.png',
  'img/stickers/jsr.png',
  'img/stickers/keibunsha.png',
  'img/stickers/okd_killer.png',
  'img/stickers/outrun.png',
  'img/stickers/sorcerian.png',
].map((path) => `${import.meta.env.BASE_URL}${path}`) as string[]

const app = new Application()

await app.init({
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
  background: '#ffffff',
  antialias: true,
  resolution: 1,
})

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('App root was not found.')
}

const controls = document.createElement('div')
controls.className = 'controls'

const countLabel = document.createElement('label')
countLabel.className = 'scale-control'
countLabel.textContent = '枚数'

const countInput = document.createElement('input')
countInput.type = 'number'
countInput.min = '1'
countInput.max = '4096'
countInput.step = '1'
countInput.value = String(DEFAULT_STICKER_COUNT)
countInput.setAttribute('aria-label', 'ステッカーの枚数')
countLabel.append(countInput)

const scaleLabel = document.createElement('label')
scaleLabel.className = 'scale-control'
scaleLabel.textContent = 'スケール'

const scaleInput = document.createElement('input')
scaleInput.type = 'number'
scaleInput.min = '0.01'
scaleInput.max = '2'
scaleInput.step = '0.01'
scaleInput.value = String(DEFAULT_STICKER_SCALE)
scaleInput.setAttribute('aria-label', 'ステッカーのスケール')
scaleLabel.append(scaleInput)

const rearrangeButton = document.createElement('button')
rearrangeButton.type = 'button'
rearrangeButton.textContent = '再配置'

const monochromeButton = document.createElement('button')
monochromeButton.type = 'button'
monochromeButton.textContent = 'モノクロ: オフ'
monochromeButton.setAttribute('aria-pressed', 'false')

const downloadButton = document.createElement('button')
downloadButton.type = 'button'
downloadButton.textContent = '画像をダウンロード'

controls.append(countLabel, scaleLabel, rearrangeButton, monochromeButton, downloadButton)
root.append(controls, app.canvas)

const textures = await Promise.all(
  stickerPaths.map((path) => Assets.load<Texture>(path)),
)

const monochromeFilter = new ColorMatrixFilter()
monochromeFilter.desaturate()

let stickerCount = DEFAULT_STICKER_COUNT
let stickerScale = DEFAULT_STICKER_SCALE

function placeStickers() {
  app.stage.removeChildren()

  for (let index = 0; index < stickerCount; index += 1) {
    const texture = textures[Math.floor(Math.random() * textures.length)]
    const sticker = new Sprite(texture)

    sticker.anchor.set(0.5)
    sticker.scale.set(stickerScale)
    sticker.rotation = Math.random() * Math.PI * 2

    // 回転後も中心がキャンバス内に収まる範囲で配置する。
    const radius = Math.min(
      CANVAS_SIZE / 2,
      Math.hypot(sticker.width, sticker.height) / 2,
    )

    sticker.position.set(
      radius + Math.random() * (CANVAS_SIZE - radius * 2),
      radius + Math.random() * (CANVAS_SIZE - radius * 2),
    )

    app.stage.addChild(sticker)
  }
}

function updateCount() {
  const count = countInput.valueAsNumber

  if (!Number.isInteger(count) || count < 1) {
    countInput.value = String(stickerCount)
    return
  }

  stickerCount = count
  placeStickers()
}

function updateScale() {
  const scale = scaleInput.valueAsNumber

  if (!Number.isFinite(scale) || scale <= 0) {
    scaleInput.value = String(stickerScale)
    return
  }

  stickerScale = scale
  placeStickers()
}

function downloadCanvas() {
  app.canvas.toBlob((blob) => {
    if (!blob) {
      return
    }

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'sticker-bomb.png'
    link.click()
    URL.revokeObjectURL(link.href)
  }, 'image/png')
}

let monochrome = false

placeStickers()

countInput.addEventListener('change', updateCount)
countInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    countInput.blur()
  }
})
scaleInput.addEventListener('change', updateScale
scaleInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    scaleInput.blur()
  }
})
rearrangeButton.addEventListener('click', placeStickers)

monochromeButton.addEventListener('click', () => {
  monochrome = !monochrome
  app.stage.filters = monochrome ? [monochromeFilter] : []
  monochromeButton.textContent = `モノクロ: ${monochrome ? 'オン' : 'オフ'}`
  monochromeButton.setAttribute('aria-pressed', String(monochrome))
})

downloadButton.addEventListener('click', downloadCanvas)
