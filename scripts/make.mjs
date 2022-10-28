import { sysBuildDir, sysDistDir, sharedLibExt } from './common.mjs'

cd(sysBuildDir)
await $`cmake --build . --config Release --parallel`
await $`cmake --install . --config Release`

cd(sysDistDir)
await $`mv bin/* lib || true`
await $`find . -type f ! -name '*.h' -and ! -name '*${sharedLibExt}*' -exec rm -f {} +`
await $`mv include/SDL2/* include`
await $`find . -depth -type d -empty -delete`
