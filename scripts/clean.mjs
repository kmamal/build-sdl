import {
	sysRootDir,
	posixSrcDir,
	posixBuildDir,
	posixDistDir,
	posixPublishDir,
} from './common.mjs'

cd(sysRootDir)
await $`rm -rf ${[
	'node_modules',
	posixSrcDir,
	posixBuildDir,
	posixDistDir,
	posixPublishDir,
]}`
