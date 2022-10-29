const Fs = require('node:fs')
const Path = require('node:path')

const dir = {}
dir.root = Path.resolve(__dirname, '../..')
dir.src = Path.join(dir.root, 'src')
dir.build = Path.join(dir.root, 'build')
dir.dist = Path.join(dir.root, 'dist')
dir.publish = Path.join(dir.root, 'publish')

const makePosixPath = (path) => path
	.replace(/^([A-Z]):\\/u, (_, letter) => `/${letter.toLowerCase()}/`)
	.replaceAll(/\\/ug, '/')

dir.posix = {}
dir.posix.root = makePosixPath(dir.root)
dir.posix.src = makePosixPath(dir.src)
dir.posix.build = makePosixPath(dir.build)
dir.posix.dist = makePosixPath(dir.dist)
dir.posix.publish = makePosixPath(dir.publish)

const pkgPath = Path.join(dir.root, 'package.json')
const pkg = JSON.parse(Fs.readFileSync(pkgPath).toString())
const version = pkg.version.slice(0, pkg.version.indexOf('-'))
const [ , owner, repo ] = pkg.repository.url.match(/([^/:]+)\/([^/]+).git$/u)

console.log({ 'process.env.CROSS_COMPILE_ARCH': process.env.CROSS_COMPILE_ARCH })

const { platform, arch } = process
const targetArch = process.env.CROSS_COMPILE_ARCH || arch
const assetName = `SDL-v${version}-${platform}-${targetArch}.tar.gz`

module.exports = {
	dir,
	makePosixPath,
	version,
	owner,
	repo,
	platform,
	arch,
	targetArch,
	assetName,
}
