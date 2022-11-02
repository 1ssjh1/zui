import type {ComponentChildren, ComponentType, JSX} from 'preact';
import type {ClassNameLike} from '@zui/browser-helpers/src/classes';
import {ActionMenuItemKey} from './action-menu-item-key';

export interface ActionBasicProps {
    rootClass?: ClassNameLike;
    rootAttrs?: JSX.HTMLAttributes<HTMLLIElement>;
    rootStyle?: JSX.CSSProperties;
    rootChildren?: ComponentChildren | (() => ComponentChildren);
    component?: string | ComponentType;
    key?: ActionMenuItemKey;
    type?: string;
    attrs?: JSX.HTMLAttributes<HTMLLIElement>;
    className?: ClassNameLike;
    style?: JSX.CSSProperties;
    children?: ComponentChildren | (() => ComponentChildren);
    onClick?: JSX.MouseEventHandler<HTMLAnchorElement>;
}
