import { Application, Assets, Sprite, Texture } from 'pixi.js'
import './style.css'

const CANVAS_SIZE = 1024
const STICKER_COUNT = 1024
const STICKER_SCALE = 0.2

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

document.querySelector<HTMLDivElement>('#app')?.appendChild(app.canvas)

const textures = await Promise.all(
  stickerPaths.map((path) => Assets.load<Texture>(path)),
)

for (let index = 0; index < STICKER_COUNT; index += 1) {
  const texture = textures[Math.floor(Math.random() * textures.length)]
  const sticker = new Sprite(texture)

  sticker.anchor.set(0.5)
  sticker.scale.set(STICKER_SCALE)
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
