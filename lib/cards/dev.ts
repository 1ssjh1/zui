import 'preact/debug';
import 'zui-dev';
import '@zui/label';
import '@zui/icons';
import {CardList} from './src/main';

onPageLoad(() => {
    const cards = new CardList('#cards', {
        items: [
            {
                header: '提示',
                title: '15.5 看板持续迭代',
                prefix: '迭代',
                prefixClass: 'text-sm text-gray',
                icon: 'flag',
                surfix: '迭代',
                surfixClass: 'label rounded-full size-sm',
                subtitle: {component: 'span', className: 'text-gray', children: '这是副标题'},
                content: '主要内容',
                footer: '自定义内容',
            },
        ],
    });
});
