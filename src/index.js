const Fs = require('fs')
const Path = require('path')
const Os = require('os')

const rootDir = Path.dirname(__dirname)
const sdlDir = Path.join(rootDir, 'SDL')
const sdlBuildDir = Path.join(sdlDir, 'build')
const sdlOutDir = Path.join(sdlDir, 'out')

const pkgFilePath = Path.resolve(rootDir, 'package.json')
const pkg = JSON.parse(Fs.readFileSync(pkgFilePath, 'utf8'))
const version = pkg.version

const { platform } = process
const arch = Os.arch()

module.exports = {
	platform,
	arch,
	version,
	sdlBuildDir,
	sdlOutDir,
}
