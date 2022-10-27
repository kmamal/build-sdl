import {
	platform, targetArch,
	posixSrcDir, posixBuildDir, posixDistDir,
	sysBuildDir,
} from './common.mjs'

await Promise.all([
	$`mkdir -p ${posixBuildDir}`,
	$`mkdir -p ${posixDistDir}`,
])

cd(sysBuildDir)
await $`make distclean || true`

const crossCompileFlag = process.env.CROSS_COMPILE_ARCH
	? `-DCMAKE_OSX_ARCHITECTURES="${process.env.CROSS_COMPILE_ARCH}"`
	: ''

if (platform === 'darwin') {
	if (targetArch === 'arm64') {
		process.env.CFLAGS = '-mmacosx-version-min=11.0'
		process.env.LDFLAGS = '-mmacosx-version-min=11.0'
	} else {
		process.env.CFLAGS = [
			'-mmacosx-version-min=10.9',
			'-DMAC_OS_X_VERSION_MIN_REQUIRED=1070',
		].join(' ')
		process.env.LDFLAGS = '-mmacosx-version-min=10.9'
	}
}

await $`cmake ${[
	posixSrcDir,
	'-DCMAKE_BUILD_TYPE=Release',
	`-DCMAKE_INSTALL_PREFIX:PATH=${posixDistDir}`,
	crossCompileFlag,
]}`
