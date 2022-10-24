import { version, sdlDir } from '../src/common.js'

const url = `https://github.com/libsdl-org/SDL/archive/refs/tags/release-${version}.tar.gz`

echo("fetch", url)
const response = await fetch(url)
if (!response.ok) { throw new Error(`bad status code ${response.status}`) }

echo("unpack to", sdlDir)
await fs.mkdirp(sdlDir)
const tar = $`tar xz -C ${sdlDir} --strip=1`
response.body.pipe(tar.stdin)
await tar
