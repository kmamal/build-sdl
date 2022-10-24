import { execSync } from 'node:child_process'
import { rootDir, sdlDir } from '../src/index.js'

execSync(`rm -rf node_modules ${sdlDir}`, { cwd: rootDir, stdio: 'inherit' })
