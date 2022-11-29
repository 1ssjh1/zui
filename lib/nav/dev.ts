import 'zui-dev';
import '@zui/icons';
import '@zui/button';
import '@zui/btn-group';
import '@zui/dropdown';
import {Nav} from './src/main-vanilla';

onPageUpdate(() => {
    const nav = new Nav('#nav', {
        items: [
            {text: '首页', icon: 'icon-home', active: true},
            {text: '动态'},
            {text: '论坛'},
            {type: 'divider'},
            {text: '博客', icon: 'icon-rss'},
            {text: '关注我们', icon: 'icon-group'},
        ],
        onClickItem: (info) => {
            console.log('> nav.onClickItem', info);
        },
    });
    console.log('> nav', nav);
});
