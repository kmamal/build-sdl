
$.verbose = false

export const sysRootDir = path.dirname(__dirname)
export const sysSdlDir = path.posix.join(sysRootDir, 'SDL')
export const sysSdlBuildDir = path.posix.join(sysSdlDir, 'build')
export const sysSdlOutDir = path.posix.join(sysSdlDir, 'out')

cd(sysRootDir)

export const posixRootDir = (await $`pwd`).stdout.trim()
export const posixSdlDir = path.posix.join(posixRootDir, 'SDL')
export const posixSdlBuildDir = path.posix.join(posixSdlDir, 'build')
export const posixSdlOutDir = path.posix.join(posixSdlDir, 'out')

const pkg = await fs.readJson('package.json')
export const version = pkg.version.slice(0, pkg.version.indexOf('-'))
export const [ , owner, repo ] = pkg.repository.url.match(/git@github.com:([^/]+)\/([^.]+).git/u)

export const { platform } = process
export const arch = os.arch()
export const assetName = `SDL2-v${version}-${platform}-${arch}.tar.gz`
export const sharedLibExt = {
	linux: '.so',
	darwin: '.dylib',
	win32: '.dll',
}[platform]

$.verbose = true
