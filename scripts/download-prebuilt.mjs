import Fs from 'node:fs'
import { Readable } from 'node:stream'
import { fetch } from 'undici'
import Tar from 'tar'
import { owner, repo, version, sdlOutDir, assetName } from '../src/index.js'

const url = `https://github.com/${owner}/${repo}/releases/download/v${version}/${assetName}`

console.log("fetch", url)
const response = await fetch(url, { follow: true })
if (response.status !== 200) {
	console.error(`bad status code: ${response.status}`)
	process.exit(1)
}

console.log("unpack to", sdlOutDir)
Fs.mkdirSync(sdlOutDir, { recursive: true })
const stream = Readable.fromWeb(response.body)
stream.pipe(Tar.x({ strip: 1, C: sdlOutDir }))
