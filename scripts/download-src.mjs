import { version, posixSrcDir } from './common.mjs'

const url = `https://github.com/libsdl-org/SDL/archive/refs/tags/release-${version}.tar.gz`

echo("fetch", url)
$.verbose = false
const response = await fetch(url)
if (!response.ok) { throw new Error(`bad status code ${response.status}`) }
$.verbose = true

echo("unpack to", posixSrcDir)
await $`rm -rf ${posixSrcDir}`
await $`mkdir -p ${posixSrcDir}`
const tar = $`tar xz -C ${posixSrcDir} --strip=1`
response.body.pipe(tar.stdin)
await tar
