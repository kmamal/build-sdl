import {
	platform,
	sysSrcDir, sysBuildDir, sysDistDir,
} from './common.mjs'

switch (platform) {
	case 'linux': {
		cd(sysBuildDir)
		await $`make -j$(nproc)`
		await $`make install`
	} break

	case 'darwin': {
		await $`cmake --build ${sysBuildDir} --config Release --parallel`
		await $`cmake --install ${sysBuildDir} --config Release`
	} break

	case 'win32': {
		await $`cmake --build ${sysBuildDir} --config Release --parallel`
		await $`cmake --install ${sysBuildDir} --config Release`

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
	linux: `! -name '*.so*'`,
	darwin: `! -name '*.dylib'`,
	win32: `! -name '*.dll' -and ! -name '*.lib'`,
}[platform]

cd(sysDistDir)
await $`find . -type f ! -name '*.h' -and ${pattern} -exec rm -f {} +`
await Promise.all([
	$`mv bin/* lib || true`,
	$`mv include/SDL2/* include`,
])
await $`find . -depth -type d -empty -delete`
