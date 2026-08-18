const Fs = require('fs')
const Path = require('path')

const dir = {}
dir.root = Path.resolve(__dirname, '../..')
dir.sdl = Path.join(dir.root, 'sdl')
dir.build = Path.join(dir.root, 'build')
dir.dist = Path.join(dir.root, 'dist')
dir.publish = Path.join(dir.root, 'publish')

const pkgPath = Path.join(dir.root, 'package.json')
const pkg = JSON.parse(Fs.readFileSync(pkgPath).toString())
// The package version is the upstream version plus a "-N" packaging suffix
const hyphenIndex = pkg.version.indexOf('-')
const version = hyphenIndex === -1 ? pkg.version : pkg.version.slice(0, hyphenIndex)
const [ , owner, repo ] = pkg.repository.url.match(/([^/:]+)\/([^/]+).git$/u)

const { platform, arch } = process
const targetArch = process.env.CROSS_COMPILE_ARCH || arch
const assetName = `SDL-v${version}-${platform}-${targetArch}.tar.gz`

module.exports = {
	dir,
	version,
	isPrerelease: false,
	owner,
	repo,
	platform,
	arch,
	targetArch,
	assetName,
}
