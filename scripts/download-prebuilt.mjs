import Fs from 'node:fs'
import { request } from 'undici'
import Tar from 'tar'
import { owner, repo, version, sdlOutDir, assetName } from '../src/index.js'

const url = `https://github.com/${owner}/${repo}/releases/download/v${version}/${assetName}`

console.log("fetch", url)
const response = await request(url, { maxRedirections: 5 })
if (response.statusCode !== 200) {
	console.error("bad status code", response.statusCode)
	process.exit(1)
}

console.log("unpack to", sdlOutDir)
Fs.mkdirSync(sdlOutDir, { recursive: true })
response.body.pipe(Tar.x({ strip: 1, C: sdlOutDir }))
