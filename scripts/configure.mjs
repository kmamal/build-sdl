import Fs from 'node:fs'
import { execSync } from 'node:child_process'
import C from './util/common.js'

console.log("configure build in", C.dir.build)

await Fs.promises.rm(C.dir.build, { recursive: true }).catch(() => {})
await Fs.promises.mkdir(C.dir.build, { recursive: true })

let crossCompileFlag
if (C.platform === 'darwin') {
	crossCompileFlag = process.env.CROSS_COMPILE_ARCH
		? `-DCMAKE_OSX_ARCHITECTURES="${process.env.CROSS_COMPILE_ARCH}"`
		: ''

	if (C.targetArch === 'arm64') {
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

execSync(`cmake ${[
	'-S',
	`"${C.dir.src}"`,
	'-B',
	`"${C.dir.build}"`,
	`-DCMAKE_INSTALL_PREFIX:PATH="${C.dir.dist}"`,
	'-DCMAKE_BUILD_TYPE=Release',
	'-DSDL_TESTS=OFF',
	'-DSDL_INSTALL_TESTS=OFF',
	crossCompileFlag,
].filter(Boolean).join(' ')}`, {
	stdio: 'inherit',
})
