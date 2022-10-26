import {
	sysRootDir,
	posixSrcDir,
	posixBuildDir,
	posixDistDir,
	posixPublishDir,
} from './common.mjs'

const dirs = [
	posixSrcDir,
	posixBuildDir,
	posixDistDir,
	posixPublishDir,
]

cd(sysRootDir)
await $`rm -rf node_modules ${dirs}`
