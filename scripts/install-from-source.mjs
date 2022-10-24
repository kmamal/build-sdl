import { execSync } from 'node:child_process'

execSync('npm run download-src', { stdio: 'inherit' })
execSync('npm run configure', { stdio: 'inherit' })
execSync('npm run rebuild', { stdio: 'inherit' })
