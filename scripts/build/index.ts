import Path from 'path';
import fs from 'fs-extra';
import minimist from 'minimist';
import {mergeConfig} from 'vite';
import {bold, blue, gray, yellow, cyan, green} from 'colorette';
import {createBuildConfig, prepareBuildFiles, createViteConfig} from './config';
import {exec} from '../utilities/exec';

const argv = minimist(process.argv.slice(2));

let viteConfig = {};
const viteFile = argv.viteFile ?? argv.V;
if (viteFile) {
    try {
        const extraViteConfig = await import(viteFile);
        viteConfig = mergeConfig(viteConfig, extraViteConfig);
    } catch (error) {
        throw new Error(`ZUI build: Cannot load extra config file from "${viteFile}".`);
    }
}

const buildConfig = await createBuildConfig({
    libs: argv.lib ?? argv.l ?? argv.config ?? argv.c ?? argv._.join(' '),
    name: argv.name ?? argv.n,
    version: argv.version ?? argv.v,
    exts: argv.exts ?? argv.e,
    exports: argv.exports ?? argv.E,
});

console.log(cyan(`building ${bold(blue(buildConfig.name))} with ${buildConfig.libs.length} libs...`));
for (const lib of buildConfig.libs) {
    console.log(blue('*'), lib.name.padEnd(23), gray(lib.version.padEnd(8)), gray(lib.zui.type.padEnd(12)), lib.zui.sourceType !== 'build-in' ? yellow(lib.zui.extsName ?? lib.zui.sourceType) : '');
}
console.log();

const buildDir = Path.resolve(process.cwd(), 'build');
await fs.emptyDir(buildDir);
await prepareBuildFiles(buildConfig, buildDir);

let configFileSavePath = argv.S || argv.saveConfig;
if (configFileSavePath) {
    if (typeof configFileSavePath !== 'string') {
        configFileSavePath = Path.resolve(buildDir, 'build-config.json');
    }
    if (!Path.isAbsolute(configFileSavePath)) {
        configFileSavePath = Path.resolve(process.cwd(), configFileSavePath);
    }
    await fs.outputJSON(configFileSavePath, buildConfig, {spaces: 4});
    console.log(`Build config saved to ${configFileSavePath}`);
}

viteConfig = mergeConfig(viteConfig, createViteConfig(buildConfig, {buildDir, outDir: argv.outDir ?? argv.o}));
const viteConfigFile = Path.resolve(buildDir, 'vite.config.json');
await fs.outputJSON(viteConfigFile, viteConfig, {spaces: 4});

/** Include tailwind config */
const tailwindConfigs = buildConfig.libs.reduce<string[]>((list, lib) => {
    if (lib.zui.tailwindConfigPath) {
        list.push(lib.zui.tailwindConfigPath);
    }
    return list;
}, []);
let tailwindConfigsPath = '';
if (tailwindConfigs.length) {
    tailwindConfigsPath = Path.resolve(buildDir, 'tailwind.cjs');
    const tailwindConfigsFileContent = [
        'module.exports = [',
        tailwindConfigs.map(x => `    require(${JSON.stringify(x)}),`).join('\n'),
        '];'
    ].join('\n');
    await fs.writeFile(tailwindConfigsPath, tailwindConfigsFileContent);

    console.log(cyan('tailwind configs...'));
    tailwindConfigs.forEach(tailwindFile => {
        console.log(green('+'), Path.relative(process.cwd(), tailwindFile));
    });
    console.log();
}

if (!argv.s && !argv.skipBuild) {
    await exec('pnpm', ['i'], {cwd: buildDir});

    const buildArgs = ['run', 'build:vite', '--', `--config=${viteConfigFile}`];
    if (argv.cssnano) {
        buildArgs.push('--cssnano');
    }
    if (argv.rem2px) {
        buildArgs.push('--rem2px');
    }

    if (argv.noPreflightStyle) {
        buildArgs.push('--noPreflightStyle');
    }
    if (tailwindConfigsPath) {
        buildArgs.push(`--tailwind=${tailwindConfigsPath}`);
    }
    await exec('pnpm', buildArgs);
}
