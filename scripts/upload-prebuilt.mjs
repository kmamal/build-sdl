import { owner, repo, version, sdlDir, sdlOutDir, assetName } from '../src/common.js'

const commonHeaders = {
	Accept: 'application/vnd.github+json',
	Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
}

let response

$.verbose = false

getRelease: {
	echo("get release", version)

	response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/releases/tags/v${version}`,
		{ headers: commonHeaders },
	)

	if (response.ok) {
		echo("release exists", version)
		break getRelease
	}

	echo("bad status code", response.status)
	echo("create release", version)

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
	if (!response.ok) { throw new Error(`bad status code ${response.status}`) }
}
const releaseId = (await response.json()).id

cd(sdlDir)
echo("create archive", assetName)

const assetFile = path.join(sdlDir, assetName)
await $`tar czf ${assetFile} ${path.relative(sdlDir, sdlOutDir)}`
const buffer = await fs.readFile(assetFile)

response = await fetch(
	`https://api.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets`,
	{ headers: commonHeaders },
)
if (!response.ok) { throw new Error(`bad status code ${response.status}`) }

const list = await response.json()
const asset = list.find((x) => x.name === assetName)
if (asset) {
	echo("delete asset", assetName)
	response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/releases/assets/${asset.id}`,
		{
			headers: commonHeaders,
			method: 'DELETE',
		},
	)
	if (!response.ok) { throw new Error(`bad status code ${response.status}`) }
}

echo("upload", assetName)
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
if (!response.ok) { throw new Error(`bad status code ${response.status}`) }
