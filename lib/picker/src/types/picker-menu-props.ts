import type {MenuOptions} from '@zui/menu/src/types';
import type {PickPopProps} from '@zui/pick';
import type {PickerState} from './picker-state';

export interface PickerMenuProps extends PickPopProps<PickerState> {
    multiple?: boolean | number;
    menu?: MenuOptions;
    search?: boolean | number;
    searchHint?: string;

    onSelect: (values: string | string[]) => void;
    onDeselect: (values: string | string[]) => void;
    onClear: () => void;
    onToggleValue: (value: string, toggle?: boolean) => void;
    onSetValue: (value: string | string[], silent?: boolean) => void;
}
