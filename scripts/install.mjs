import { execSync } from 'node:child_process'

if (!process.env.FROM_SOURCE) {
	try {
		execSync('npm run download-prebuilt', { stdio: 'inherit' })
		process.exit()
	} catch (error) {}
} else {
	console.log("building from source")
}

execSync('npm run install-from-source', { stdio: 'inherit' })
