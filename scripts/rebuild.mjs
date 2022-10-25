import { sdlBuildDir, sdlOutDir } from './common.mjs'

cd(sdlBuildDir)
await $`make -j$(nproc)`
await $`make install`

cd(sdlOutDir)
await $`find . -type f ! -name '*.h' -and ! -name '*.so*' -exec rm -f {} +`
await $`mv include/SDL2/* include`
await $`find . -depth -type d -empty -delete`
