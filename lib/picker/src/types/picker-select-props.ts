import type {PickTriggerProps} from '@zui/pick';
import type {PickerState} from './picker-state';

export interface PickerSelectProps extends PickTriggerProps<PickerState> {
    placeholder?: string;
    multiple?: boolean | number;

    onSelect: (values: string | string[]) => void;
    onDeselect: (values: string | string[]) => void;
    onClear: () => void;
    onToggleValue: (value: string, toggle?: boolean) => void;
}
