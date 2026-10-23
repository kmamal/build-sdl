import Fs from 'node:fs'
import Path from 'node:path'
import C from './util/common.js'

const patches = [
	[
		'add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")',
		'add_compile_options("$<$<COMPILE_LANG_AND_ID:C,MSVC>:/utf-8>")',
	],
	[
		'add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")',
		'add_compile_options("$<$<COMPILE_LANG_AND_ID:CXX,MSVC>:/utf-8>")',
	],
	[
		'sdl_compile_options(PRIVATE "/forceInterlockedFunctions-")',
		'sdl_compile_options(PRIVATE "$<$<COMPILE_LANGUAGE:C,CXX>:/forceInterlockedFunctions->")',
	],
]

const path = Path.join(C.dir.sdl, 'CMakeLists.txt')
console.log("patch", path)

let text = await Fs.promises.readFile(path, 'utf8')
for (const [ from, to ] of patches) {
	if (!text.includes(from)) { throw new Error(`patch not applicable: ${from}`) }
	text = text.replace(from, to)
}
await Fs.promises.writeFile(path, text)
