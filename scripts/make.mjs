import Fs from 'node:fs'
import Path from 'node:path'
import { execSync } from 'node:child_process'
import C from './util/common.js'

console.log("build in", C.dir.build)
const parallelFlag = process.env.BUILD_SDL_PARALLEL ? '--parallel' : ''
execSync(`cmake --build "${C.dir.build}" --config Release ${parallelFlag}`, {
	stdio: 'inherit',
})

console.log("install to", C.dir.dist)
await Fs.promises.rm(C.dir.dist, { recursive: true }).catch(() => {})
await Fs.promises.mkdir(C.dir.dist, { recursive: true })
execSync(`cmake --install "${C.dir.build}" --config Release`, {
	stdio: 'inherit',
})

// Delete files we won't need
{
	const platformFilter = {
		linux: (name) => name.includes('.so'),
		darwin: (name) => name.endsWith('.dylib'),
		win32: (name) => name === 'SDL2.dll' || name === 'SDL2.lib',
	}[C.platform]

	const recurse = async (dirPath) => {
		const files = await Fs.promises.readdir(dirPath)

		await Promise.all(files.map(async (name) => {
			const childPath = Path.join(dirPath, name)
			const stats = await Fs.promises.stat(childPath)
			if (stats.isDirectory()) {
				await recurse(childPath)
				return
			}

			if (name.endsWith('.h') || platformFilter(name)) { return }

			await Fs.promises.rm(childPath)
		}))
	}
	await recurse(C.dir.dist)
}

// Move the .dll to the /lib folder
const move = async (src, dst) => {
	await Fs.promises.copyFile(src, dst)
	await Fs.promises.rm(src)
}

if (C.platform === 'win32') {
	move(
		Path.join(C.dir.dist, 'bin/SDL2.dll'),
		Path.join(C.dir.dist, 'lib/SDL2.dll'),
	)
}

// Move the headers to the root of /include
{
	const shallowDir = Path.join(C.dir.dist, 'include')
	const deepDir = Path.join(shallowDir, 'SDL2')
	const headers = await Fs.promises.readdir(deepDir)
	await Promise.all(headers.map(async (name) => {
		await move(
			Path.join(deepDir, name),
			Path.join(shallowDir, name),
		)
	}))
}

// Delete all empty dirs
{
	const recurse = async (dirPath) => {
		const files1 = await Fs.promises.readdir(dirPath)
		await Promise.all(files1.map(async (name) => {
			const childPath = Path.join(dirPath, name)
			const stats = await Fs.promises.stat(childPath)
			if (stats.isDirectory()) { await recurse(childPath) }
		}))

		const files2 = await Fs.promises.readdir(dirPath)
		if (files2.length === 0) {
			await Fs.promises.rm(dirPath, { recursive: true })
		}
	}
	await recurse(C.dir.dist)
}

// Strip binaries on linux
if (C.platform === 'linux') {
	const libDir = Path.join(C.dir.dist, 'lib')
	const libraries = await Fs.promises.readdir(libDir)
	execSync(`strip -s ${Path.join(libDir, libraries[0])}`)
}
