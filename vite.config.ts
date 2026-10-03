import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/pixijs_sticker_bomb/' : '/',
})
