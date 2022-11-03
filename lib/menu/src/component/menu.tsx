import {ComponentChildren} from 'preact';
import {classes} from '@zui/browser-helpers/src/classes';
import {ActionMenuNested} from '@zui/action-menu/src/component/action-menu-nested';
import '@zui/css-icons/src/icons/caret.css';
import type {ActionMenuItemOptions, ActionItemProps} from '@zui/action-menu/src/types';
import type {MenuOptions, MenuItemOptions} from '../types';
import '../style/index.css';

export class Menu<T extends ActionMenuItemOptions = MenuItemOptions> extends ActionMenuNested<T, MenuOptions<T>> {
    get nestedTrigger() {
        return this.props.nestedTrigger || 'click';
    }

    get menuName() {
        return 'menu-nested';
    }

    beforeRender() {
        const options = super.beforeRender();
        let {hasIcons} = options;

        if (hasIcons === undefined) {
            hasIcons = options.items.some(x => (x as ActionItemProps).icon);
        }
        options.className = classes(options.className, this.menuName, {
            'has-icons': hasIcons,
            'has-nested-items': options.items.some(x => this.isNestedItem(x)),
        });
        return options;
    }

    renderToggleIcon(show: boolean): ComponentChildren | void {
        return <span class={`${this.name}-toggle-icon caret-${show ? 'down' : 'right'}`} />;
    }
}
