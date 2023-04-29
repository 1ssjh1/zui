import glob from 'fast-glob';
import fs from 'fs-extra';
import Path from 'path';
import {red, yellow, underline} from 'colorette';
import {DefaultTheme} from 'vitepress';
import zuiLib from '../public/zui-libs';

const themeConfig: DefaultTheme.Config = {
    logo: '/favicon.svg',
    nav: createNav(),
    socialLinks: [
        {icon: 'github', link: 'https://github.com/easysoft/zui'}
    ],
    footer: {
        message: 'MIT License (MIT)',
        copyright: 'Copyright (C) 2022 cnezsoft.com',
    },
    lastUpdatedText: '上次更新',
    outlineTitle: '本页目录',
    docFooter: {
        prev: '上一篇',
        next: '下一篇'
    },
    sidebar: createSidebar()
};


function createNav() {
    return [
        {text: '指引',        link: '/guide/',     activeMatch: '/guide/'},
        {text: 'CSS 工具类',  link: '/utilities/', activeMatch: '/utilities/'},
        {text: '组件',        link: '/lib/',       activeMatch: '/lib/'},
        {text: '主题',        link: '/themes/',    activeMatch: '/themes/'},
    ];
}

function initSidebars(): Record<string, {text: string, section?: string, items?: {text?: string, link: string}[], collapsed?: boolean}[]> {
    return {
        '/guide/': [
            {text: '开始', section: 'start'},
            {text: '设计理念', section: 'concepts'},
            {text: '配置', section: 'config', collapsed: true},
            {text: '定制', section: 'customize'},
            {text: '贡献', section: 'contributes'},
            {text: '关于', section: 'about'}
        ],
        '/utilities/': [
            {text: '外观', section: 'style', collapsed: false},
            {text: '背景', section: 'backgrounds', collapsed: true},
            {text: '边框', section: 'borders', collapsed: true},
            {text: '布局', section: 'layout', collapsed: true},
            {text: 'Flex', section: 'flex', collapsed: true},
            {text: '间距', section: 'spacing', collapsed: true},
            {text: '尺寸', section: 'sizing', collapsed: true},
            {text: '排版', section: 'typography', collapsed: true},
            {text: '效果', section: 'effects', collapsed: true},
            {text: '交互', section: 'interactivity', collapsed: true},
        ],
        '/lib/': [
            {text: '布局', section: 'layout', collapsed: false},
            {text: '内容', section: 'content', collapsed: false},
            {text: '图标', section: 'icons', collapsed: false},
            {text: '表单', section: 'forms', collapsed: false},
            {text: '组件', section: 'components', collapsed: false},
            {text: 'JS 工具', section: 'helpers', collapsed: false},
        ],
        '/themes/': [
            {text: '官方主题', section: 'official-themes'},
            {text: '社区主题', section: 'community-themes'},
            {text: '主题制作', section: 'create-theme'},
        ]
    }
}

function updateSections(files: string[], sidebars: ReturnType<typeof initSidebars>, docsPath: string, libName?: string) {
    if (!files.length) {
        return;
    }
    files.forEach(file => {
        const [sidebarName, sectionName, ...restPath] = file.split(Path.sep);
        const sidebar = sidebars[`/${sidebarName}/`];
        if (!sidebar) {
            console.log(` ${red('ERROR')} cannot find sidebar named ${yellow(sidebarName)} in file ${underline(Path.join(docsPath, file))}.`);
            return;
        }
        const section = sidebar.find(item => item.section === sectionName);
        if (!section) {
            console.log(` ${red('ERROR')} cannot find section named ${yellow(sectionName)} in sidebar ${yellow(sidebarName)} by file ${underline(Path.join(docsPath, file))}.`);
            return;
        }
        if (!section.items) {
            section.items = [];
        }
        const link = `/${sidebarName}/${sectionName}/${libName ? `${libName}/` : ''}${restPath.join('/')}`;
        const markdown = fs.readFileSync(Path.join(docsPath, file), 'utf8');
        const title = markdown.match(/# (.*)/)?.[1];
        section.items.push({
            text: title, link
        });
    });
}

function createSidebar() {
    const sidebars = initSidebars();
    const docsPath = Path.join(process.cwd(), 'docs');
    const files = glob.sync(`*/*/**/*.md`, {onlyFiles: true, cwd: docsPath});
    updateSections(files, sidebars, docsPath);

    zuiLib.forEach(lib => {
        const libDocsPath = Path.join(lib.zui.path, 'docs');
        const files = glob.sync(`*/*/**/*.md`, {onlyFiles: true, cwd: libDocsPath});
        updateSections(files, sidebars, libDocsPath, lib.zui.name);
    });
    Object.values(sidebars).forEach(sidebar => {
        sidebar.forEach(section => {
            if (!section.items) {
                section.items = [];
            }
            delete section.section;
        });
    });
    return sidebars;
}

export default themeConfig;
