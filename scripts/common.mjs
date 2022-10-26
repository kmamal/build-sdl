
export const sysRootDir = path.dirname(__dirname)
export const sysSrcDir = path.join(sysRootDir, 'src')
export const sysBuildDir = path.join(sysRootDir, 'build')
export const sysDistDir = path.join(sysRootDir, 'dist')
export const sysPublishDir = path.join(sysRootDir, 'publish')

export const posixRootDir = await within(async () => {
	$.verbose = false
	cd(sysRootDir)
	const { stdout } = await $`pwd`
	$.verbose = true
	return stdout.trim()
})
export const posixSrcDir = path.posix.join(posixRootDir, 'src')
export const posixBuildDir = path.posix.join(posixRootDir, 'build')
export const posixDistDir = path.posix.join(posixRootDir, 'dist')
export const posixPublishDir = path.posix.join(posixRootDir, 'publish')

const pkg = await fs.readJson(path.join(sysRootDir, 'package.json'))
export const version = pkg.version.slice(0, pkg.version.indexOf('-'))
export const [ , owner, repo ] = pkg.repository.url.match(/^git@github.com:([^/]+)\/([^.]+).git$/u)

export const { platform } = process
export const arch = os.arch()
export const targetArch = platform === 'darwin' ? 'x64_arm64' : arch
export const assetName = `SDL-v${version}-${platform}-${targetArch}.tar.gz`
export const sharedLibExt = {
	linux: '.so',
	darwin: '.dylib',
	win32: '.dll',
}[platform]
