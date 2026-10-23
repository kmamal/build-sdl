import Fs from 'node:fs'
import { execSync } from 'node:child_process'
import C from './util/common.js'

console.log("configure build in", C.dir.build)

await Fs.promises.rm(C.dir.build, { recursive: true }).catch(() => {})
await Fs.promises.mkdir(C.dir.build, { recursive: true })

let CFLAGS
let LDFLAGS
let crossCompileFlag
let libcFlag
if (C.platform === 'darwin') {
	let arch = process.env.CROSS_COMPILE_ARCH ?? C.arch
	if (arch === 'x64') { arch = 'x86_64' }

	crossCompileFlag = `-DCMAKE_OSX_ARCHITECTURES="${arch}"`

	if (C.targetArch === 'arm64') {
		CFLAGS = '-mmacosx-version-min=11.0'
		LDFLAGS = '-mmacosx-version-min=11.0'
	}
	else {
		CFLAGS = '-mmacosx-version-min=10.9'
		LDFLAGS = '-mmacosx-version-min=10.9'
	}
}
else if (C.platform === 'win32') {
	libcFlag = '-DSDL_LIBC=OFF'
}

execSync(`cmake ${[
	'-S',
	`"${C.dir.sdl}"`,
	'-B',
	`"${C.dir.build}"`,
	`-DCMAKE_INSTALL_PREFIX:PATH="${C.dir.dist}"`,
	'-DCMAKE_BUILD_TYPE=Release',
	'-DSDL_TESTS=OFF',
	'-DSDL_INSTALL_TESTS=OFF',
	crossCompileFlag,
	libcFlag,
].filter(Boolean).join(' ')}`, {
	stdio: 'inherit',
	env: {
		...process.env,
		CFLAGS,
		LDFLAGS,
	},
})
