
await import('./clean.mjs')
process.env.BUILD_SDL_FROM_SOURCE = 1
await import('./install.mjs')
await import('./upload-release.mjs')
