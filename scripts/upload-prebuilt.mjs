import Fs from 'fs'
import Path from 'path'
import { fetch } from 'undici'
import Tar from 'tar'
import { owner, repo, version, sdlDir, sdlOutDir, assetName } from '../src/index.js'

const commonHeaders = {
	Accept: 'application/vnd.github+json',
	Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
}

let response

const assertStatus = (status) => {
	if (response.status !== status) {
		console.log('bad status code', response.status)
		process.exit(1)
	}
}

getRelease: {
	console.log("get release", version)

	response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/releases/tags/v${version}`,
		{ headers: commonHeaders },
	)

	if (response.status === 200) {
		console.log("release exists", version)
		break getRelease
	}

	console.log(`bad status code: ${response.status}`)
	console.log("create release", version)

	response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/releases`,
		{
			headers: commonHeaders,
			method: 'POST',
			body: JSON.stringify({
				tag_name: `v${version}`, // eslint-disable-line camelcase
				name: `v${version}`,
			}),
		},
	)
	assertStatus(201)
}
const releaseId = (await response.json()).id

process.chdir(sdlDir)
console.log("create archive", assetName)

const assetFile = Path.join(sdlDir, assetName)
await Tar.c(
	{ gzip: true, file: assetFile },
	[ Path.relative(sdlDir, sdlOutDir) ],
)
const buffer = Fs.readFileSync(assetFile)

response = await fetch(
	`https://api.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets`,
	{ headers: commonHeaders },
)
assertStatus(200)

const list = await response.json()
const asset = list.find((x) => x.name === assetName)
if (asset) {
	console.log("delete asset", assetName)
	response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/releases/assets/${asset.id}`,
		{
			headers: commonHeaders,
			method: 'DELETE',
		},
	)
	assertStatus(204)
}

console.log("upload", assetName)
response = await fetch(
	`https://uploads.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets?name=${assetName}`,
	{
		headers: {
			...commonHeaders,
			'Content-Type': 'application/gzip',
			'Content-Length': buffer.length,
		},
		method: 'POST',
		body: buffer,
	},
)
assertStatus(201)
