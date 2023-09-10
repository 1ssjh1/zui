import 'zui-dev';
import '@zui/icons';
import '@zui/button';
import '@zui/btn-group';
import '@zui/menu';
import '@zui/dropdown';
import {Toolbar} from './src/main';

onPageUpdate(() => {
    const toolbar = new Toolbar('#toolbar', {
        items: [
            {text: '首页', icon: 'icon-home', active: true},
            {text: '动态'},
            {text: '论坛'},
            {type: 'divider'},
            {text: '博客', icon: 'icon-rss'},
            {text: '关注我们', icon: 'icon-group'},
            {type: 'dropdown', text: '导入', icon: 'icon-upload-alt', items: [
                {text: '导入文件'},
                {text: '导入目录'},
            ]},
            {type: 'space', flex: 1},
            {
                type: 'btnGroup',
                items: [
                    {text: '登录', icon: 'icon-user'},
                    {text: '注册', icon: 'icon-lock'},
                ],
            },
        ],
        onClickItem: (info) => {
            console.log('> toolbar.onClickItem', info);
        },
    });
    console.log('> toolbar', toolbar);

    const dropdownToolbar = new Toolbar('#dropdownToolbar', {
        items: [
            {text: '首页', icon: 'icon-home', active: true},
            {
                type: 'dropdown',
                icon: 'icon-rss',
                dropdown: {
                    items: [
                        {text: '查看'},
                        {text: '订阅'},
                        {text: '取消订阅'},
                    ],
                },
            },
            {type: 'divider'},
            {
                type: 'dropdown',
                text: '关于我们',
                icon: 'icon-group',
                dropdown: {
                    items: [
                        {text: '关于'},
                        {text: '我们是谁'},
                    ],
                },
            },
        ],
        onClickItem: (info) => {
            console.log('> dropdownToolbar.onClickItem', info);
        },
    });
    console.log('> dropdownToolbar', dropdownToolbar);

    const iconToolbar = new Toolbar('#iconToolbar', {
        items: [
            {icon: 'icon-home', active: true},
            {type: 'divider'},
            {icon: 'icon-rss'},
            {icon: 'icon-group'},
        ],
        onClickItem: (info) => {
            console.log('> iconToolbar.onClickItem', info);
        },
    });
    console.log('> iconToolbar', iconToolbar);
});
