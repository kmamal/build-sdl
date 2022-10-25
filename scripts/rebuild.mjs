import { sysSdlBuildDir, sysSdlOutDir, sharedLibExt } from './common.mjs'

cd(sysSdlBuildDir)
await $`make -j$(nproc)`
await $`make install`

cd(sysSdlOutDir)
await $`find . -type f ! -name '*.h' -and ! -name '*${sharedLibExt}*' -exec rm -f {} +`
await $`mv include/SDL2/* include`
await $`find . -depth -type d -empty -delete`
