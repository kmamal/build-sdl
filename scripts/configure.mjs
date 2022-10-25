import { sdlBuildDir, sdlOutDir } from './common.mjs'

await Promise.all([
	$`mkdir -p ${sdlBuildDir}`,
	$`mkdir -p ${sdlOutDir}`,
])

cd(sdlBuildDir)
await $`make distclean || true`
await $`../configure --prefix=${sdlOutDir}`
