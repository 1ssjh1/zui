import {classes} from '@zui/browser-helpers/src/classes';
import {ColInfo} from '../../types/col-info';
import {CustomRenderResult} from '../../types/custom-render-result';
import {DTablePlugin, DTableWithPlugin} from '../../types/plugin';
import {RowInfo} from '../../types/row-info';
import {RowProps} from '../../types/row-props';
import {definePlugin} from '../../helpers/shared-plugins';
import {RowID} from '../../types/row-data';
import './style.css';

type DTableCheckable = DTableWithPlugin<DTableCheckableOptions, DTableCheckableState> & DTableCheckableMethods;

function toggleCheckRows(this: DTableCheckable, rowID: RowID | (RowID)[], checked?: boolean): Record<RowID, boolean> {
    const checkedRows = this.state.checkedRows;
    const changes: Record<RowID, boolean> = {};
    const toggleRow = (id: RowID, toggle: boolean) => {
        const oldChecked = !!checkedRows[id];
        if (oldChecked === toggle) {
            return;
        }
        if (toggle) {
            checkedRows[id] = true;
        } else {
            delete checkedRows[id];
        }
        changes[id] = toggle;
    };
    if (rowID === 'HEADER') {
        if (checked === undefined) {
            checked = !isAllRowChecked.call(this);
        }
        this.layout?.allRows.forEach(({id}) => {
            toggleRow(id, !!checked);
        });
    } else {
        const ids = Array.isArray(rowID) ? rowID : [rowID];
        ids.forEach(id => {
            toggleRow(id, checked ?? !checkedRows[id]);
        });
    }
    if (Object.keys(changes).length) {
        this.setState({checkedRows: {...checkedRows}}, () => {
            this.options.onCheckChange?.call(this, changes);
        });
    }

    return changes;
}

function isRowChecked(this: DTableCheckable, rowID: RowID): boolean {
    return this.state.checkedRows[rowID] ?? false;
}

function isAllRowChecked(this: DTableCheckable): boolean {
    return this.getChecks().length === this.layout?.allRows.length;
}

function getChecks(this: DTableCheckable): RowID[] {
    return Object.keys(this.state.checkedRows);
}

export interface DTableCheckableOptions {
    checkable?: boolean;
    checkOnClickRow?: boolean;
    onCheckChange?: (changes: Record<RowID, boolean>) => void;
}

export interface DTableCheckableState {
    checkedRows: Record<string, true>;
}

export interface DTableCheckableColSetting {
    checkbox?: boolean;
}

export interface DTableCheckableMethods {
    toggleCheckRows: typeof toggleCheckRows;
    isRowChecked:    typeof isRowChecked;
    isAllRowChecked: typeof isAllRowChecked;
    getChecks:       typeof getChecks;
}

export const checkable: DTablePlugin<DTableCheckableOptions, DTableCheckableState, DTableCheckableColSetting, DTableCheckableMethods> = {
    name: 'checkable',
    defaultOptions: {checkable: true},
    when: options => !!options.checkable,
    onCreate() {
        this.state.checkedRows = {};
        this.toggleCheckRows = toggleCheckRows.bind(this);
        this.isRowChecked =    isRowChecked.bind(this);
        this.isAllRowChecked = isAllRowChecked.bind(this);
        this.getChecks =       getChecks.bind(this);
    },
    onRenderCell(result: CustomRenderResult, rowID: RowID, col: ColInfo): CustomRenderResult {
        if (col.setting.checkbox) {
            const checked = this.isRowChecked(rowID);
            const checkbox = (
                <input type="checkbox" checked={checked} />
            );
            result.unshift(checkbox);
            result.push({className: 'has-checkbox'});
        }
        return result;
    },
    onRenderHeaderCell(result: CustomRenderResult, rowID: RowID, col: ColInfo) {
        if (col.setting.checkbox) {
            const checked = this.isAllRowChecked();
            const checkbox = (
                <input type="checkbox" checked={checked} />
            );
            result.unshift(checkbox);
            result.push({className: 'has-checkbox'});
        }
        return result;
    },
    onRenderRow(rowProps: RowProps, rowInfo: RowInfo): RowProps {
        if (this.isRowChecked(rowInfo.id)) {
            rowProps.className = classes(rowProps.className, 'is-checked');
        }
        return rowProps;
    },
    onHeaderCellClick(event) {
        const target = event.target as HTMLElement;
        if (!target) {
            return;
        }
        const checkbox = target.closest<HTMLInputElement>('input[type="checkbox"]');
        if (checkbox) {
            this.toggleCheckRows('HEADER', checkbox.checked);
        }
    },
    onRowClick(event, {rowID}) {
        const target = event.target as HTMLElement;
        if (!target) {
            return;
        }
        const checkbox = target.closest<HTMLInputElement>('input[type="checkbox"]');
        if (checkbox || this.options.checkOnClickRow) {
            this.toggleCheckRows(rowID);
        }
    },
};

export default definePlugin<DTableCheckableOptions, DTableCheckableState, DTableCheckableColSetting, DTableCheckableMethods>(checkable);
