import { owner, repo, version, posixSdlOutDir, assetName } from './common.mjs'

const url = `https://github.com/${owner}/${repo}/releases/download/v${version}/${assetName}`

echo("fetch", url)
$.verbose = false
const response = await fetch(url)
if (!response.ok) { throw new Error(`bad status code ${response.status}`) }
$.verbose = true

echo("unpack to", posixSdlOutDir)
await $`mkdir -p ${posixSdlOutDir}`
const tar = $`tar xz -C ${posixSdlOutDir} --strip=1`
response.body.pipe(tar.stdin)
await tar
