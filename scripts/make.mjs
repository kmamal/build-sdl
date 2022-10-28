import {
	platform,
	posixBuildDir, posixDistDir,
	sysSrcDir, sysBuildDir, sysDistDir,
} from './common.mjs'

await $`rm -rf ${posixDistDir}`
await $`mkdir -p ${posixDistDir}`

switch (platform) {
	case 'linux': {
		await $`cmake --build ${posixBuildDir} --config Release --parallel`
		await $`cmake --install ${posixBuildDir} --config Release`

		// cd(sysBuildDir)
		// await $`make -j$(nproc)`
		// await $`make install`
	} break

	case 'darwin': {
		await $`cmake --build ${posixBuildDir} --config Release --parallel`
		await $`cmake --install ${posixBuildDir} --config Release`
	} break

	case 'win32': {
		await $`cmake --build ${posixBuildDir} --config Release --parallel`
		await $`cmake --install ${posixBuildDir} --config Release`

		// await $`msbuild ${[
		// 	path.join(sysSrcDir, 'VisualC/SDL.sln'),
		// 	`/p:OutDir=${sysBuildDir}`,
		// 	'/m /p:BuildInParallel=true',
		// 	'/p:Platform=x64',
		// 	'/p:Configuration=Release',
		// ]}`
	} break

	default: {
		echo("unsupported platform", platform)
		process.exit(1)
	}
}

const pattern = {
	linux: [ '!', '-name', '*.so*' ],
	darwin: [ '!', '-name', '*.dylib' ],
	win32: [ '!', '-name', 'SDL2.dll', '-and', '!', '-name', 'SDL2.lib' ],
}[platform]

cd(sysDistDir)
await $`find . -type f ! -name '*.h' -and ${pattern} -exec rm -f {} +`
await Promise.all([
	$`mv bin/* lib || true`,
	$`mv include/SDL2/* include`,
])
await $`find . -depth -type d -empty -delete`
