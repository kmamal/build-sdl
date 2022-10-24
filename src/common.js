const Fs = require('fs')
const Path = require('path')
const Os = require('os')

const rootDir = Path.dirname(__dirname)
const sdlDir = Path.resolve(rootDir, 'SDL')
const sdlBuildDir = Path.resolve(sdlDir, 'build')
const sdlOutDir = Path.resolve(sdlDir, 'out')

const pkgFilePath = Path.resolve(rootDir, 'package.json')
const pkg = JSON.parse(Fs.readFileSync(pkgFilePath, 'utf8'))
const version = pkg.version.slice(0, pkg.version.indexOf('-'))
const [ , owner, repo ] = pkg.repository.url.match(/git@github.com:([^/]+)\/([^.]+).git/u)

const { platform } = process
const arch = Os.arch()

const assetName = `SDL2-v${version}-${platform}-${arch}.tar.gz`

module.exports = {
	platform,
	arch,
	version,
	rootDir,
	sdlDir,
	sdlBuildDir,
	sdlOutDir,
	owner,
	repo,
	assetName,
}
