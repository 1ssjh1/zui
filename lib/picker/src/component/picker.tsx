import {ComponentType, RefObject, RenderableProps, createRef} from 'preact';
import {$, delay, fetchData} from '@zui/core';
import {Pick, PickTrigger} from '@zui/pick/src/components';
import {PickTriggerProps} from '@zui/pick/src/types';
import {PickerItemBasic, PickerItemOptions, PickerMenuProps, PickerOptions, PickerSelectProps, PickerState} from '../types';
import '@zui/form-control/src/style/index.css';
import '../style';
import {PickerMultiSelect} from './picker-multi-select';
import {PickerSingleSelect} from './picker-single-select';
import {PickerMenu} from './picker-menu';

type PickerTrigger = PickTrigger<PickerState, PickerSelectProps>;

function getValueMap(items: PickerItemOptions[], userMap?: Map<string, PickerItemOptions>): Map<string, PickerItemOptions> {
    return items.reduce<Map<string, PickerItemOptions>>((map, item) => {
        if (Array.isArray(item.items)) {
            getValueMap(item.items as PickerItemOptions[], map);
        }
        map.set(item.value, item);
        return map;
    }, userMap || new Map());
}

export class Picker<S extends PickerState = PickerState, O extends PickerOptions<S> = PickerOptions<S>> extends Pick<S, O> {
    static defaultProps = {
        ...Pick.defaultProps,
        className: 'picker',
        valueSplitter: ',',
        limitValueInList: true,
        search: true,
        emptyValue: '',
    };

    static Pop = PickerMenu as typeof Pick.Pop;

    protected _itemsCacheInfo?: {search?: string, value?: string, items?: PickerOptions['items']};

    protected _abort?: AbortController;

    protected _updateTimer = 0;

    protected _emptyValueSet: Set<string>;

    protected _trigger = createRef<PickerTrigger>();

    constructor(props: O) {
        super(props);
        $.extend(this.state, {
            loading: false,
            search: '',
            items: props.items,
            selections: [],
        });

        const {valueSplitter = ',', emptyValue = ''} = this.props;
        this._emptyValueSet = new Set(emptyValue.split(valueSplitter));
        this.setValue = this.setValue.bind(this);

        const {items} = this.state;
        if (Array.isArray(items) && items.length) {
            items.forEach(item => item.value = String(item.value)); // Fix item value could be non-string.
            if (props.limitValueInList) {
                const valueMap = getValueMap(items);
                (this.state as PickerState).value = this.valueList.filter(x => valueMap.has(x)).join(props.valueSplitter);
            }
            if (!this.valueList.length && props.required && !props.multiple) {
                (this.state as PickerState).value = items[0].value ?? '';
            }
        }
    }

    get value() {
        return this.state.value;
    }

    get valueList(): string[] {
        return this.formatValueList(this.state.value);
    }

    get firstEmptyValue() {
        return this._emptyValueSet.values().next().value as string;
    }

    isEmptyValue = (value: string) => {
        return this._emptyValueSet.has(value);
    };

    toggleValue = (value: string, toggle?: boolean) => {
        if (!this.props.multiple) {
            if (toggle || value !== this.value) {
                return this.setValue(value);
            }
            return this.setValue();
        }
        const {valueList} = this;
        const oldIndex = valueList.indexOf(value);
        if (toggle === (oldIndex >= 0)) {
            return;
        }
        if (oldIndex > -1) {
            valueList.splice(oldIndex, 1);
        } else {
            valueList.push(value);
        }
        return this.setValue(valueList);
    };

    deselect = (values: string | string[]) => {
        const {valueList} = this;
        const deselectedSet = new Set(this.formatValueList(values));
        const newValueList = valueList.filter(x => !deselectedSet.has(x));
        this.setValue(newValueList);
    };

    clear = () => {
        this.setValue();
    };

    select = (values: string | string[]) => {
        const valueList = this.formatValueList(values);
        const newValueList = this.props.multiple ? [...this.valueList, ...valueList] : valueList[0];
        return this.setValue(newValueList);
    };

    isSelected = (value: string) => {
        return this.valueList.includes(value);
    };

    async load(): Promise<PickerItemOptions[]> {
        let abort = this._abort;
        if (abort) {
            abort.abort();
        }
        abort = new AbortController();
        this._abort = abort;

        const {items: itemsSetting = [], searchDelay} = this.props;
        const {search} = this.state;
        let items: PickerItemOptions[] = [];
        if (!Array.isArray(itemsSetting)) {
            await delay(searchDelay || 500);
            if (this._abort !== abort) {
                return items;
            }
            items = await fetchData(itemsSetting, [this, search], {signal: abort.signal});
            if (this._abort !== abort) {
                return items;
            }
        } else if (search.length) {
            const searchKeys = $.unique(search.toLowerCase().split(' ').filter(x => x.length)) as string[];
            items = itemsSetting;
            if (searchKeys.length) {
                items = itemsSetting.reduce<PickerItemOptions[]>((list, item) => {
                    const {
                        value = '',
                        keys = '',
                        text,
                    } = item as PickerItemOptions;

                    if (searchKeys.every(searchKey => value.toLowerCase().includes(searchKey) || keys.toLowerCase().includes(searchKey) || (typeof text === 'string' && text.toLowerCase().includes(searchKey)))) {
                        list.push(item);
                    }
                    return list;
                }, []);
            }
        } else {
            items = itemsSetting;
        }

        this._abort = undefined;
        return items;
    }

    changeState(state: Partial<S> | ((prevState: Readonly<S>) => Partial<S>), callback?: (() => void) | undefined): Promise<S> {
        return super.changeState((prevState) => {
            const newState = typeof state === 'function' ? state(prevState) : state;
            if ((newState.value !== undefined && newState.value !== prevState.value) || (newState.items && newState.items !== prevState.items)) {
                const items = newState.items || prevState.items;
                const map = getValueMap(items);
                newState.selections = this.formatValueList(newState.value ?? prevState.value).reduce<PickerItemBasic[]>((list, value) => {
                    if (!this.isEmptyValue(value)) {
                        list.push(map.get(value) || {value, text: value});
                    }
                    return list;
                }, []);
            }
            return newState;
        }, callback);
    }

    async update(force?: boolean) {
        const {state, props} = this;
        const cache = this._itemsCacheInfo || {};
        const newState: Partial<S> = {};
        this._itemsCacheInfo = cache;
        if (force || cache.search !== state.search || props.items !== cache.items) {
            const loadItems = await this.load();
            newState.items = loadItems.filter(x => {
                x.value = String(x.value);
                if (this.isEmptyValue(x.value)) {
                    return false;
                }
                return true;
            });
            newState.loading = false;
            cache.items = props.items;
            cache.search = state.search;
        }
        if (force || cache.value !== state.value) {
            cache.value = state.value;
        }
        const newItems = newState.items;
        if (props.required && !props.multiple && this.isEmptyValue(this.state.value) && Array.isArray(newItems) && newItems.length) {
            newState.value = newItems[0].value;
        }
        if (Object.keys(newState).length) {
            await this.changeState(newState);
        }
    }

    async tryUpdate() {
        if (this._updateTimer) {
            clearTimeout(this._updateTimer);
        }
        this._updateTimer = window.setTimeout(() => {
            this._updateTimer = 0;
            this.update();
        }, 50);
    }

    componentDidUpdate(previousProps: Readonly<O>, previousState: Readonly<S>): void {
        super.componentDidUpdate(previousProps, previousState);
        this.tryUpdate();
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.tryUpdate();
    }

    componentWillUnmount(): void {
        this._abort?.abort();
        this._abort = undefined;
        this._itemsCacheInfo = undefined;
        clearTimeout(this._updateTimer);
        super.componentWillUnmount();
    }

    protected _getTriggerProps(props: RenderableProps<O>, state: Readonly<S>): PickerSelectProps & {ref: RefObject<PickerTrigger>} {
        return {
            ...super._getTriggerProps(props, state),
            ref: this._trigger,
            multiple: props.multiple,
            placeholder: props.placeholder,
            search: props.search,
            searchHint: props.searchHint,
            disabled: props.disabled,
            clearable: !!this.valueList.length && !props.required,
            valueList: this.valueList,
            emptyValue: this.firstEmptyValue,
            onDeselect: this.deselect,
            onSelect: this.select,
            onClear: this.clear,
            onToggleValue: this.toggleValue,
            onSetValue: this.setValue,
        };
    }

    protected _getPopProps(props: RenderableProps<O>, state: Readonly<S>): PickerMenuProps {
        return {
            ...super._getPopProps(props, state),
            menu: props.checkbox ? $.extend({checkbox: props.checkbox}, props.menu) : props.menu,
            multiple: props.multiple,
            search: props.search,
            searchHint: props.searchHint,
            onDeselect: this.deselect,
            onSelect: this.select,
            onClear: this.clear,
            onToggleValue: this.toggleValue,
            onSetValue: this.setValue,
        };
    }

    protected _getTrigger(props: RenderableProps<O>): ComponentType<PickTriggerProps<S>> {
        return props.Trigger || (props.multiple ? PickerMultiSelect : PickerSingleSelect) as unknown as ComponentType<PickTriggerProps<S>>;
    }

    formatValueList(value: string | string[]): string[] {
        let list: string[] = [];
        if (typeof value === 'string' && value.length) {
            list = $.unique(value.split(this.props.valueSplitter ?? ',')) as string[];
        } else if (Array.isArray(value)) {
            list = $.unique(value) as string[];
        }
        return list.filter(x => !this.isEmptyValue(x));
    }

    formatValue(value: string | string[]): string {
        const list = this.formatValueList(value);
        return list.length ? list.join(this.props.valueSplitter ?? ',') : this.firstEmptyValue;
    }

    setValue(value: unknown = [], silent?: boolean) {
        if (this.props.disabled) {
            return;
        }
        if (!Array.isArray(value) && typeof value !== 'string') {
            value = value !== null ? String(value) : this.firstEmptyValue;
        }
        let valueList = this.formatValueList(value as string | string[]);
        if (valueList.length) {
            const {items, limitValueInList} = this.props;
            if (limitValueInList) {
                const valueMap = getValueMap((Array.isArray(items) ? items : this.state.items) as PickerItemOptions[]);
                valueList = valueList.filter(x => valueMap.has(x));
            }
        }
        const stateValue = this.formatValue(valueList);
        if (silent) {
            const trigger = this._trigger.current;
            if (trigger) {
                trigger._skipTriggerChange = stateValue;
            }
        }
        return this.changeState({value: stateValue});
    }
}
