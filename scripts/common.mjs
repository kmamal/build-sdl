
cd(path.dirname(__dirname))
export const rootDir = (await $`pwd`).stdout.trim()

export const sdlDir = path.posix.resolve(rootDir, 'SDL')
export const sdlBuildDir = path.posix.join(sdlDir, 'build')
export const sdlOutDir = path.posix.join(sdlDir, 'out')

const pkg = await fs.readJson('package.json')
export const version = pkg.version.slice(0, pkg.version.indexOf('-'))
export const [ , owner, repo ] = pkg.repository.url.match(/git@github.com:([^/]+)\/([^.]+).git/u)

export const { platform } = process
export const arch = os.arch()

export const assetName = `SDL2-v${version}-${platform}-${arch}.tar.gz`
