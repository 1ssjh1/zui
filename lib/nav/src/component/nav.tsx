import {ActionMenu} from '@zui/action-menu/src/component/action-menu';
import {ActionBasicProps} from '@zui/action-menu/src/types/action-basic-props';
import '@zui/css-icons/src/icons/caret.css';
import {classes} from '@zui/browser-helpers/src/classes';
import type {NavOptions} from '../types/nav-options';
import type {NavItemOptions} from '../types/nav-item-options';
import '../style/index.css';

export class Nav<T extends ActionBasicProps = NavItemOptions> extends ActionMenu<T, NavOptions<T>> {
    beforeRender() {
        const options = super.beforeRender();
        return options;
    }
}
