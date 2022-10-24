import Fs from 'fs'
import { request } from 'undici'
import Tar from 'tar'
import { version, sdlDir } from '../src/index.js'

const url = `https://github.com/libsdl-org/SDL/archive/refs/tags/release-${version}.tar.gz`

console.log("fetch", url)
const response = await request(url, { maxRedirections: 5 })
if (response.statusCode !== 200) {
	console.error("bad status code", response.statusCode)
	process.exit(1)
}

console.log("unpack to", sdlDir)
Fs.mkdirSync(sdlDir, { recursive: true })
response.body.pipe(Tar.x({ strip: 1, C: sdlDir }))
