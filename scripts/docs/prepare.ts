import path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';
import {exec} from '../utilities/exec';
import {getLibList} from '../libs/query';
import {syncLibDocs, emptySidebarLibDocs} from './sync';

const argv = minimist(process.argv.slice(2));
const docsDir = path.resolve(process.cwd(), 'docs/_');
const docsPublicDir = path.join(docsDir, 'public');

await fs.emptyDir(docsPublicDir);

if (argv.build !== 'no') {
    await exec('pnpm', ['build', '--', '--outDir=docs/_/public/zui']);
}

await fs.copyFile(path.resolve(process.cwd(), './favicon.svg'), path.resolve(docsPublicDir, './favicon.svg'));

const libs = await getLibList();

await fs.outputJSON(path.resolve(docsPublicDir, './zui-libs.json'), libs, {spaces: 4});
await fs.outputFile(path.resolve(docsPublicDir, './zui-libs.js'), `export default ${JSON.stringify(libs, null, 4)};`);

if (argv.copy) {
    await emptySidebarLibDocs();
    for (const lib of libs) {
        await syncLibDocs(lib);
    }
}
