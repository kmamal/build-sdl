import { execSync } from 'node:child_process'

execSync('npm run clean', { stdio: 'inherit' })
execSync('FROM_SOURCE=1 npm install', { stdio: 'inherit' })
execSync('npm run upload-prebuilt', { stdio: 'inherit' })
