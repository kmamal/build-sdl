import {
	platform,
	posixSrcDir,
	posixBuildDir,
	posixDistDir,
	sysSrcDir,
	sysBuildDir,
} from './common.mjs'

await Promise.all([
	$`mkdir -p ${posixBuildDir}`,
	$`mkdir -p ${posixDistDir}`,
])

cd(sysBuildDir)
await $`make distclean || true`

let hostFlag = ''
if (platform === 'darwin') {
	// const clangPath = path.join(sysSrcDir, 'build-scripts/clang-fat.sh')
	// process.env.CC = `sh ${clangPath}`

	if (process.env.CROSS_COMPILE_M1) {
		hostFlag = '--host=aarch64-apple-darwin'
		process.env.CFLAGS = '-mmacosx-version-min=11.0' // -I/usr/local/include
		process.env.LDFLAGS = '-mmacosx-version-min=11.0'
	} else {
		process.env.CFLAGS = '-mmacosx-version-min=10.9 -DMAC_OS_X_VERSION_MIN_REQUIRED=1070' // -I/usr/local/include
		process.env.LDFLAGS = '-mmacosx-version-min=10.9'
	}
}

await $`${posixSrcDir}/configure ${hostFlag} --prefix=${posixDistDir}`
