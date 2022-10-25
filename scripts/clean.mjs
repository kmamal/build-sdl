import { posixSdlDir } from './common.mjs'

await Promise.all([
	$`rm -rf node_modules`,
	$`rm -rf ${posixSdlDir}`,
])
