import { platform, posixSdlBuildDir, posixSdlOutDir, sysSdlBuildDir } from './common.mjs'

await Promise.all([
	$`mkdir -p ${posixSdlBuildDir}`,
	$`mkdir -p ${posixSdlOutDir}`,
])

cd(sysSdlBuildDir)
await $`make distclean || true`

if (platform === 'darwin') { process.env.CC = 'sh clang-fat.sh' }
await $`../configure --prefix=${posixSdlOutDir}`
