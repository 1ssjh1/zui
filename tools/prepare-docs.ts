import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';
import {getBuildInLibs} from './buildin-libs.js';
import {exec} from './exec.js';

const argv = minimist(process.argv.slice(3));

await fs.emptyDir(path.resolve(process.cwd(), './docs/assets'));

await exec('pnpm', ['build', '--', '--outDir=docs/assets/zui']);

await fs.copyFile(path.resolve(process.cwd(), './favicon.svg'), path.resolve(process.cwd(), './docs/assets/favicon.svg'));

const buildInLibs = await getBuildInLibs({readNameFromDoc: true});

await fs.outputJSON(path.resolve(process.cwd(), './docs/assets/zui-lib.json'), Array.from(buildInLibs.values()), {spaces: 4});
await fs.outputFile(path.resolve(process.cwd(), './docs/assets/zui-lib.js'), `export default ${JSON.stringify(Array.from(buildInLibs.values()), null, 4)};`);

if (argv.copy) {
    for (const lib of buildInLibs.values()) {
        const originLibDocsDir = path.resolve(process.cwd(), './lib/', lib.shortName, 'docs');
        const originLibDocsDirExists = await fs.pathExists(originLibDocsDir);
        if (!originLibDocsDirExists) {
            continue;
        }

        const libDocsDir = path.resolve(process.cwd(), './docs/lib', lib.shortName);
        await fs.copy(originLibDocsDir, libDocsDir);
    }
}
