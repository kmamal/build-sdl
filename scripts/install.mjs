
if (!process.env.FROM_SOURCE) {
	try {
		await $`npm run download-prebuilt`
		process.exit()
	} catch (error) {}
} else {
	echo("build from source")
}

await $`npm run install-from-source`
