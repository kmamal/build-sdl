import Fs from 'node:fs'
import { once } from 'node:events'
import C from './util/common.js'
import { fetch } from './util/fetch.js'
import Tar from 'tar'

const url = `https://github.com/libsdl-org/SDL/archive/refs/tags/release-${C.version}.tar.gz`

console.log("fetch", url)
const response = await fetch(url)

console.log("unpack to", C.dir.src)
await Fs.promises.rm(C.dir.src, { recursive: true }).catch(() => {})
await Fs.promises.mkdir(C.dir.src, { recursive: true })
const tar = Tar.extract({ gzip: true, strip: 1, C: C.dir.src })
response.stream().pipe(tar)
await once(tar, 'finish')
