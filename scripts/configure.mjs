import Fs from 'node:fs'
import { execSync } from 'node:child_process'
import { sdlBuildDir, sdlOutDir } from '../src/index.js'

await Promise.all([
	Fs.promises.mkdir(sdlBuildDir, { recursive: true }),
	Fs.promises.mkdir(sdlOutDir, { recursive: true }),
])
process.chdir(sdlBuildDir)

try { execSync('make distclean', { stdio: 'inherit' }) } catch (error) {}
execSync(`../configure --prefix=${sdlOutDir}`, { stdio: 'inherit' })
