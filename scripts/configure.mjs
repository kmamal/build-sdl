import { platform, posixSdlDir, posixSdlBuildDir, posixSdlOutDir, sysSdlBuildDir } from './common.mjs'

await Promise.all([
	$`mkdir -p ${posixSdlBuildDir}`,
	$`mkdir -p ${posixSdlOutDir}`,
])

cd(sysSdlBuildDir)
await $`make distclean || true`

if (platform === 'darwin') {
	const clangPath = path.join(posixSdlDir, 'build-scripts/clang-fat.sh')
	process.env.CC = `sh ${clangPath}`
}
await $`../configure --prefix=${posixSdlOutDir}`
