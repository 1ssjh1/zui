import type {ComponentChildren, VNode, JSX, ComponentType} from 'preact';
import type {ClassNameLike} from '@zui/core';

export interface PickerItemBasic {
    value: string;
    keys?: string;
    text?: ComponentChildren;
    disabled?: boolean;
}

export interface PickerItemOptions extends PickerItemBasic {
    rootClass?: ClassNameLike;
    rootAttrs?: JSX.HTMLAttributes<HTMLLIElement>;
    rootStyle?: JSX.CSSProperties;
    rootChildren?: ComponentChildren | (() => ComponentChildren);
    component?: string | ComponentType;
    className?: ClassNameLike;
    icon?: string | VNode;
    trailingIcon?: string | VNode;
    hint?: string;
    attrs?: JSX.HTMLAttributes<HTMLLIElement>;
    style?: JSX.CSSProperties;
    children?: ComponentChildren | (() => ComponentChildren);
}
