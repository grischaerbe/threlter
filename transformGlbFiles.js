import { execSync } from 'child_process'
import { renameSync } from 'fs'
import { globSync } from 'glob'
import { join } from 'path'

const glbFiles = globSync('./src/**/*.glb', { ignore: 'node_modules/**', absolute: true })

for (const glbFile of glbFiles) {
	console.log(`Transforming ${glbFile}...`)
	const dir = glbFile.split('/').slice(0, -1).join('/')
	const out = execSync(`cd ${dir} && npx @threlte/gltf@next ${glbFile} -u -i -t -s`)
	console.log(out.toString())
}

const newGlbFiles = globSync('./src/**/*.glb', { ignore: 'node_modules/**', absolute: true })

for (const glbFile of newGlbFiles) {
	const fileName = glbFile.split('/').pop()
	const targetDir = './static'
	renameSync(glbFile, join(targetDir, fileName))
}
