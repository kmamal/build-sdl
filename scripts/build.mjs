import { execSync } from 'node:child_process'

try {
	execSync('npm run fetch-prebuilt', { stdio: 'inherit' })
	process.exit()
} catch (error) {}

execSync('npm run fetch-src', { stdio: 'inherit' })
execSync('npm run configure', { stdio: 'inherit' })
execSync('npm run rebuild', { stdio: 'inherit' })
