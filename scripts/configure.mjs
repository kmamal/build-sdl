import { platform, arch, posixSdlBuildDir, posixSdlOutDir, sysSdlBuildDir } from './common.mjs'

await Promise.all([
	$`mkdir -p ${posixSdlBuildDir}`,
	$`mkdir -p ${posixSdlOutDir}`,
])

cd(sysSdlBuildDir)
await $`make distclean || true`

if (platform === 'darwin') {
	if (process.env.M1) {
		process.env.CFLAGS = `${process.env.CFLAGS ?? ''} -arch arm64 -mmacosx-version-min=11.0 -I/usr/local/include`.trim()
		process.env.CLANG_LINK_ARM64 = `${process.env.LDFLAGS ?? ''} -mmacosx-version-min=11.0`.trim()
	} else {
		process.env.CFLAGS = `${process.env.CFLAGS ?? ''} -arch x86_64 -mmacosx-version-min=10.9 -DMAC_OS_X_VERSION_MIN_REQUIRED=1070 -I/usr/local/include`.trim()
		process.env.LDFLAGS = `${process.env.LDFLAGS ?? ''} -mmacosx-version-min=10.9`.trim()
	}
}
await $`../configure --prefix=${posixSdlOutDir}`
