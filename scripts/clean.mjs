import { rootDir, sdlDir } from '../src/common.js'

await Promise.all([
	fs.remove(path.resolve(rootDir, 'node_modules')),
	fs.remove(sdlDir),
])
