import {ComponentChildren, Component, h as _h, createRef} from 'preact';
import {ClassNameLike, classes} from '@zui/browser-helpers/src/classes';
import {MenuItem, MenuItemProps} from './menu-item';
import {MenuDivider, MenuDividerProps} from './menu-divider';
import {MenuHeading, MenuHeadingProps} from './menu-heading';
import '@zui/css-icons/src/icons/caret.css';
import '../style/vars.css';
import '../style/menu.css';

export type MenuItemType = 'item' | 'heading' | 'divider';

export type MenuItemOptions = MenuItemProps & {type?: 'item', key?: string | number, items?: MenuListItem[]};

export type MenuHeadingOptions = MenuHeadingProps & {type: 'heading', key?: string | number};

export type MenuDividerOptions = MenuDividerProps & {type: 'divider', key?: string | number};

export type MenuListItem = MenuItemOptions | MenuHeadingOptions | MenuDividerOptions;

export type MenuProps = {
    className?: ClassNameLike;
    items?: MenuListItem[] | (() => MenuListItem[]);
    hasIcons?: boolean;
    children?: ComponentChildren;
    subMenuTrigger?: 'click' | 'hover';
    onClickItem?: (item: MenuItemOptions, index: number, event: MouseEvent) => void;
    onRenderSubMenu?: (item: MenuItemOptions, h: typeof _h) => ComponentChildren;
    onRenderItem?: (menu: Menu, item: MenuListItem, index: number, h: typeof _h) => Partial<MenuListItem> | undefined;
    afterRender?: (menu: Menu) => void;
    beforeDestroy?: (menu: Menu) => void;
};

export type MenuState = {
    shownSubs: Record<string, boolean>;
};

export class Menu extends Component<MenuProps, MenuState> {
    state: MenuState = {shownSubs: {}};

    #ref = createRef<HTMLMenuElement>();

    get $(): HTMLMenuElement | null {
        return this.#ref.current;
    }

    componentDidMount() {
        this.props.afterRender?.(this);
    }

    componentDidUpdate(): void {
        this.props.afterRender?.(this);
    }

    componentWillUnmount(): void {
        this.props.beforeDestroy?.(this);
    }

    toggleSubMenu(key: string | number, toggle?: boolean): void {
        const {shownSubs} = this.state;
        if (toggle === undefined) {
            toggle = !shownSubs[key];
        }
        if (toggle) {
            shownSubs[key] = true;
        } else {
            delete shownSubs[key];
        }
        this.setState({shownSubs: {...shownSubs}});
    }

    clearAllSubMenu() {
        this.setState({shownSubs: {}});
    }

    isSubMenuShow(key: string | number) {
        return this.state.shownSubs[key];
    }

    #handleItemClick(item: MenuItemOptions, index: number, onClick: ((event: MouseEvent) => void) | undefined, event: MouseEvent) {
        if (onClick) {
            onClick.call(event.target, event);
        }
        const {onClickItem} = this.props;
        if (onClickItem) {
            onClickItem(item, index, event);
        }
        if (this.props.subMenuTrigger === 'click' && item.items) {
            this.toggleSubMenu(item.key ?? index, true);
            event.stopPropagation();
            event.preventDefault();
        }
    }

    #renderSubMenu = (item: MenuItemOptions) => {
        const {onRenderSubMenu} = this.props;
        if (onRenderSubMenu) {
            return onRenderSubMenu(item, _h);
        }
        const {afterRender, onClickItem, subMenuTrigger, onRenderItem} = this.props;
        return (
            <Menu
                className="menu-sub"
                items={item.items}
                onRenderSubMenu={this.#renderSubMenu}
                afterRender={afterRender}
                onClickItem={onClickItem}
                onRenderItem={onRenderItem}
                subMenuTrigger={subMenuTrigger}
            />
        );
    };

    #handleItemMouseEnter = (key: string | number, event: MouseEvent) => {
        if (this.props.subMenuTrigger === 'hover') {
            this.toggleSubMenu(key, true);
            event.preventDefault();
        }
    };

    #handleItemMouseLeave = (key: string | number, event: MouseEvent) => {
        if (this.props.subMenuTrigger === 'hover') {
            this.toggleSubMenu(key, false);
            event.preventDefault();
        }
    };

    render() {
        const {
            className,
            items,
            hasIcons,
            children,
            onClickItem,
            subMenuTrigger,
            onRenderItem,
            onRenderSubMenu,
            afterRender,
            beforeDestroy,
            ...others
        } = this.props;

        const itemList = typeof items === 'function' ? items() : items;
        return (
            <menu class={classes(
                'menu',
                className,
                (hasIcons ?? itemList?.some(item => 'icon' in item)) ? 'has-icons' : '',
            )} {...others} ref={this.#ref}>
                {itemList?.map((item, index) => {
                    const listItem = {type: 'item', key: index, ...item} as MenuListItem;
                    if (onRenderItem) {
                        const newProps = onRenderItem(this, listItem, index, _h);
                        if (newProps) {
                            Object.assign(listItem, newProps);
                        }
                    }
                    const {key = index, type = 'item', ...props} = listItem;
                    if (type === 'heading') {
                        return <MenuHeading {...props} key={key} />;
                    }
                    if (type === 'divider') {
                        return <MenuDivider {...props} key={key} />;
                    }
                    const {onClick, items: subItems, ...otherOptions} = props as MenuItemOptions;
                    const itemProps: MenuItemOptions = {
                        ...otherOptions,
                        key,
                        onClick: this.#handleItemClick.bind(this, listItem as MenuItemOptions, index, onClick as ((event: MouseEvent) => void)),
                    };
                    const isSubMenuShown = subItems && this.state.shownSubs[key];
                    if (subItems) {
                        itemProps.rootClass = classes(itemProps.rootClass, 'has-sub', isSubMenuShown ? 'has-sub-shown' : '');
                        if (subMenuTrigger === 'hover') {
                            itemProps.rootProps = {
                                ...itemProps.rootProps,
                                onMouseEnter: this.#handleItemMouseEnter.bind(this, key),
                                onMouseLeave: this.#handleItemMouseLeave.bind(this, key),
                            };
                        }
                    }
                    return (
                        <MenuItem {...itemProps}>
                            {isSubMenuShown && this.#renderSubMenu(listItem as MenuItemOptions)}
                        </MenuItem>
                    );
                })}
                {children}
            </menu>
        );
    }
}
