#!/usr/bin/env node

import fs from 'node:fs'

const packagesDir = 'packages'
const packageFiles = ['package.json']

if (fs.existsSync(packagesDir)) {
	packageFiles.push(
		...fs
			.readdirSync(packagesDir)
			.map((dir) => `${packagesDir}/${dir}/package.json`)
			.filter((path) => fs.existsSync(path))
			.sort(),
	)
}

for (const packageFile of packageFiles) {
	const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf8'))

	console.log(`${packageJson.name} ${packageJson.version}`)
}
