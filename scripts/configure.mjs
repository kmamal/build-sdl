import { sdlBuildDir, sdlOutDir } from '../src/common.js'

await Promise.all([
	fs.mkdirp(sdlBuildDir),
	fs.mkdirp(sdlOutDir),
])

cd(sdlBuildDir)
await $`make distclean || true`
await $`../configure --prefix=${sdlOutDir}`
