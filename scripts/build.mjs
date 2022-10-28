import { posixSrcDir, posixBuildDir, posixDistDir } from './common.mjs'

await $`rm -rf ${[
	posixSrcDir,
	posixBuildDir,
	posixDistDir,
]}`

await $`npm run download-src`
await $`npm run configure`
await $`npm run make`
