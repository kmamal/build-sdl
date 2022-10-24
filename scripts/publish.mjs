import { execSync } from 'node:child_process'

execSync('npm run clean', { stdio: 'inherit' })
execSync('npm install', {
	env: {
		...process.env,
		FROM_SOURCE: 1,
	},
	stdio: 'inherit',
})
execSync('npm run upload-prebuilt', { stdio: 'inherit' })
