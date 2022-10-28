import {
	platform, targetArch,
	posixBuildDir, posixDistDir,
	sysSrcDir, sysBuildDir, sysDistDir,
} from './common.mjs'

await $`rm -rf ${posixBuildDir}`
await $`mkdir -p ${posixBuildDir}`

switch (platform) {
	case 'linux': {
		cd(sysBuildDir)
		await $`../configure --prefix=${posixDistDir}`
	} break

	case 'darwin': {
		const crossCompileFlag = process.env.CROSS_COMPILE_ARCH
			? `-DCMAKE_OSX_ARCHITECTURES="${process.env.CROSS_COMPILE_ARCH}"`
			: ''

		if (targetArch === 'arm64') {
			process.env.CFLAGS = '-mmacosx-version-min=11.0'
			process.env.LDFLAGS = '-mmacosx-version-min=11.0'
		} else {
			process.env.CFLAGS = [
				'-mmacosx-version-min=10.9',
				'-DMAC_OS_X_VERSION_MIN_REQUIRED=1070',
			].join(' ')
			process.env.LDFLAGS = '-mmacosx-version-min=10.9'
		}

		await $`cmake ${[
			'-S',
			sysSrcDir,
			'-B',
			sysBuildDir,
			`-DCMAKE_INSTALL_PREFIX:PATH=${sysDistDir}`,
			'-DCMAKE_BUILD_TYPE=Release',
			'-DSDL_TESTS=OFF',
			'-DSDL_INSTALL_TESTS=OFF',
			crossCompileFlag,
		]}`
	} break

	case 'win32': {
		await fs.writeFile(path.join(sysBuildDir, 'CMakeLists.txt'), [
			'cmake_minimum_required(VERSION 3.0)',
			'project(sdl_user)',
			`add_subdirectory(${sysSrcDir} SDL)`,
		].join('\n'))

		await $`cmake ${[
			'-S',
			sysBuildDir,
			'-B',
			sysBuildDir,
			`-DCMAKE_INSTALL_PREFIX:PATH=${sysDistDir}`,
			'-DCMAKE_BUILD_TYPE=Release',
			'-DSDL_TESTS=OFF',
			'-DSDL_INSTALL_TESTS=OFF',
		]}`
	} break

	default: {
		echo("unsupported platform", platform)
		process.exit(1)
	}
}
