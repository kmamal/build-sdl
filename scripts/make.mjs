import { sysBuildDir, sysDistDir, sharedLibExt } from './common.mjs'

cd(sysBuildDir)
await $`make -j$(nproc)`
await $`make install`

cd(sysDistDir)
await $`mv bin/* lib || true`
await $`find . -type f ! -name '*.h' -and ! -name '*${sharedLibExt}*' -exec rm -f {} +`
await $`mv include/SDL2/* include`
await $`find . -depth -type d -empty -delete`
