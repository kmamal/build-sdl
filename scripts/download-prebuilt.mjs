import { owner, repo, version, sdlOutDir, assetName } from '../src/common.js'

const url = `https://github.com/${owner}/${repo}/releases/download/v${version}/${assetName}`

echo("fetch", url)
const response = await fetch(url)
if (!response.ok) { throw new Error(`bad status code ${response.status}`) }

echo("unpack to", sdlOutDir)
await fs.mkdirp(sdlOutDir)
const tar = $`tar xz -C ${sdlOutDir} --strip=1`
response.body.pipe(tar.stdin)
await tar
