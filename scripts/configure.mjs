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

if (platform === 'darwin') {
	const clangPath = path.join(sysSrcDir, 'build-scripts/clang-fat.sh')
	process.env.CC = `sh ${clangPath}`
}
await $`${posixSrcDir}/configure --prefix=${posixDistDir}`
