import { platform, arch, posixSdlBuildDir, posixSdlOutDir, sysSdlBuildDir } from './common.mjs'

await Promise.all([
	$`mkdir -p ${posixSdlBuildDir}`,
	$`mkdir -p ${posixSdlOutDir}`,
])

cd(sysSdlBuildDir)
await $`make distclean || true`

if (platform === 'darwin') {
	if (process.env.M1) {
		process.env.CFLAGS = `-arch ${arch} -mmacosx-version-min=10.9 -DMAC_OS_X_VERSION_MIN_REQUIRED=1070 -I/usr/local/include`
		process.env.LDFLAGS = '-mmacosx-version-min=10.9'
	} else {
		process.env.CFLAGS = '-arch arm64 -mmacosx-version-min=11.0 -I/usr/local/include'
		process.env.CLANG_LINK_ARM64 = '-mmacosx-version-min=11.0'
	}
}
await $`../configure --prefix=${posixSdlOutDir}`
