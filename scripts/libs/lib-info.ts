import {Contributes} from './lib-contributes';
import {LibType} from './lib-type';

export type LibSourceType = 'npm' | 'exts' | 'build-in' | 'local';

export type LibBuildInfo = {
    prebuild?: boolean | string,
    defaultExport?: string,
};

export interface ZuiLibInfo {
    sourceType: LibSourceType;
    name: string;               // 'avatar',
    type: LibType;
    displayName: string;
    moduleName?: string;        // 'avatar'
    contributes?: Partial<Contributes>;
    path: string;               // 'libs/avatar',
    extsName?: string;          // 'zentao
    order: number;              // 0
    publicPath?: string | false;
    workspace?: boolean;
    packageJsonPath?: string;
    tailwindConfigPath?: string;
    prebuild?: boolean | string,
    defaultExport?: string,
    replace?: string;
    notReady?: boolean;         // current lib is not ready
    wip?: boolean;              // current lib is work in progress
    separately?: boolean;       // current lib is usually used separately
}

export interface LibInfo {
    name: string;                     // '@zui/avatar',
    version: string;                  // '0.0.1',
    zui: ZuiLibInfo;
    main?: string;                    // 'src/main.ts',
    browser?: string;                 // 'src/main.ts',
    module?: string;                  // 'src/main.ts',
    exports?: Record<string, string>; // {"./jquery": "./src/main-jquery.ts"}
    description?: string;             // '头像',
    browserslist?: string;            // '',
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    files?: string[];                 // [ 'src/main.ts', 'src/main.spec.ts' ],
}
