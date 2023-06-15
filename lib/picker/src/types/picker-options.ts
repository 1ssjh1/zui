import type {ComponentType, JSX} from 'preact';
import type {ClassNameLike} from '@zui/core';
import type {PickerItemOptions} from './picker-item-options';
import type {PickerMenuDirection} from './picker-menu-direction';
import type {PickerLangData} from './picker-lang-data';
import type {PickerSelectProps} from './picker-select-props';
import type {PickerMenuProps} from './picker-menu-props';

export type PickerOptions = {
    className?: ClassNameLike;
    style?: JSX.CSSProperties;
    container?: string | HTMLElement;
    afterRender?: (info: {firstRender: boolean}) => void;
    beforeDestroy?: () => void;

    Select?: ComponentType<PickerSelectProps>;
    Menu?: ComponentType<PickerMenuProps>;

    name?: string;
    disabled?: boolean;
    multiple?: boolean | number;
    optional?: boolean;
    defaultValue?: string | string[];
    placeholder?: string;
    valueSplitter?: string;
    items: PickerItemOptions[] | (() => (Promise<PickerItemOptions[]> | PickerItemOptions[]));
    hotkey?: boolean;
    search?: boolean | number;
    searchDelay?: number;
    searchHint?: string;
    onChange?: (value: string | undefined | string[]) => void;
    onDeselect?: (value: string, item: PickerItemOptions) => false | void;
    onSelect?: (value: string, item: PickerItemOptions) => false | void;
    onFocus?: () => void;
    onNoResults?: (search: string) => string | void;

    lang?: PickerLangData;

    /** Menu width */
    menuWidth: number | 'auto' | '100%';
    menuMaxHeight?: number;
    menuMaxWidth?: number; // Only for width = 'auto'
    menuMinWidth?: number; // Only for width = 'auto'
    menuDirection?: PickerMenuDirection;
    menuClass?: ClassNameLike;
    menuStyle?: JSX.CSSProperties;
    menuItemHeight?: number;
    menuCheckbox?: boolean;
    onMenuShow?: () => void;
    onMenuShown?: () => void;
    onMenuHide?: () => void;
    onMenuHidden?: () => void;
};
