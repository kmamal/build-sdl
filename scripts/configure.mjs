import { posixSdlBuildDir, posixSdlOutDir, sysSdlBuildDir } from './common.mjs'

await Promise.all([
	$`mkdir -p ${posixSdlBuildDir}`,
	$`mkdir -p ${posixSdlOutDir}`,
])

cd(sysSdlBuildDir)
await $`make distclean || true`
await $`../configure --prefix=${posixSdlOutDir}`
