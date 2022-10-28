import {
	platform, targetArch,
	posixSrcDir, posixBuildDir, posixDistDir,
	sysBuildDir,
} from './common.mjs'

switch (platform) {
	case 'linux': {
		await $`rm -rf ${[
			posixBuildDir,
			posixDistDir,
		]}`
		await $`mkdir -p ${posixBuildDir}`
		cd(sysBuildDir)
		await $`../configure`
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

		cd(sysBuildDir)
		await $`cmake ${[
			posixSrcDir,
			'-DCMAKE_BUILD_TYPE=Release',
			`-DCMAKE_INSTALL_PREFIX:PATH=${posixDistDir}`,
			'-DSDL_TESTS=OFF',
			'-DSDL_INSTALL_TESTS=OFF',
			crossCompileFlag,
		]}`
	} break

	case 'win32': {
		// Empty
	} break

	default: {
		echo("unsupported platform", platform)
		process.exit(1)
	}
}
