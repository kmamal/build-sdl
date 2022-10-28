import {
	posixSrcDir, posixBuildDir, posixDistDir, posixPublishDir,
} from './common.mjs'

await $`rm -rf ${[
	posixSrcDir,
	posixBuildDir,
	posixDistDir,
	posixPublishDir,
]}`

await $`npm run download-src`
await $`npm run configure`
await $`npm run make`
