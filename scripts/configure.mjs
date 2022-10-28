import {
	platform, targetArch,
	posixSrcDir, posixBuildDir, posixDistDir,
	sysBuildDir,
} from './common.mjs'

await $`rm -rf ${posixBuildDir}`
await $`mkdir -p ${posixBuildDir}`

switch (platform) {
	case 'linux': {
		cd(sysBuildDir)
		await $`${path.join(posixSrcDir, 'configure')} --prefix=${posixDistDir}`
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
			posixSrcDir,
			'-B',
			posixBuildDir,
			`-DCMAKE_INSTALL_PREFIX:PATH=${posixDistDir}`,
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
			`add_subdirectory(${posixSrcDir} SDL)`,
		].join('\n'))

		await $`cmake ${[
			'-S',
			posixBuildDir,
			'-B',
			posixBuildDir,
			`-DCMAKE_INSTALL_PREFIX:PATH=${posixDistDir}`,
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
