import { execSync } from 'node:child_process'
import { sdlBuildDir, sdlOutDir } from '../src/index.js'

process.chdir(sdlBuildDir)
execSync('make -j$(nproc)', { stdio: 'inherit' })
execSync('make install', { stdio: 'inherit' })

process.chdir(sdlOutDir)
execSync(`find . -type f ! -name '*.h' -and ! -name '*.so*' -exec rm -f {} +`, { stdio: 'inherit' })
execSync('mv include/SDL2/* include', { stdio: 'inherit' })
execSync(`find . -depth -type d -empty -delete`, { stdio: 'inherit' })
