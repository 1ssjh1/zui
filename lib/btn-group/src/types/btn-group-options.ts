import type {JSX, ComponentChildren, h as _h, VNode} from 'preact';
import type {ClassNameLike} from '@zui/core';
import type {ButtonProps} from '@zui/button';
import type {BtnProps} from './btn-props';

export type BtnGroupItemRender = ((item: BtnProps, h: typeof _h) => VNode | Partial<BtnProps>);

export interface BtnGroupOptions {
    className?: ClassNameLike;
    style?: JSX.CSSProperties;
    items?: BtnProps[] | (() => BtnProps[]);
    size?: 'xs' | 'sm' | 'lg' | 'xl';
    type?: string;
    btnProps?: Partial<ButtonProps>;
    children?: ComponentChildren;
    itemRender?: BtnGroupItemRender,
    onClickItem?: (info: {item: BtnProps, index: number, event: MouseEvent}) => void;
    beforeRender?: (options: BtnProps) => (Partial<Omit<BtnProps, 'onClickItem' | 'beforeRender' | 'beforeDestroy' | 'afterRender'>> | undefined);
    afterRender?: (info: {firstRender: boolean}) => void;
    beforeDestroy?: () => void;
}
