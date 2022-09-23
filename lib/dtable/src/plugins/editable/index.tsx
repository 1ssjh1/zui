import {createRef, RefObject} from 'preact';
import {definePlugin} from '../../helpers/shared-plugins';
import './style.css';

export interface DTableEditableTypes extends DTablePluginTypes {
    options: Partial<{
        editable: boolean | ((rowID: string, colName: string) => boolean);
        headerEditable: boolean;
        onEditCell?: (this: DTableEditable, changeInfo: {rowID: string, colName: string, value: unknown, oldValue: unknown}) => false | void;
        onEditChange?: (this: DTableEditable, changes: DTableEditChanges) => false | void;
        selectAllOnFocus?: boolean;
    }>;
    state: {
        editingCell?: {rowID: string, colName: string};
        editingChanges: DTableEditChanges;
    };
    data: {
        editingInputRef: RefObject<HTMLInputElement>;
        needAutoFocus?: boolean;
    },
    methods: {
        editCell(this: DTableEditable, cell?: {rowID: string, colName: string}): void;
        isCellEditing: (this: DTableEditable, rowID: string, colName: string) => boolean;
        handleEditingInputChange: (this: DTableEditable, event: Event) => void;
        handleEditingInputBlur: (this: DTableEditable, event: Event) => void;
        handleEditingKeyDown: (this: DTableEditable, event: KeyboardEvent) => void;
        renderEditableCell: NonNullable<typeof editable['onRenderCell']>;
        getEditedCellValue(this: DTableEditable, rowID: string, colName: string): unknown;
        commitEditChanges(this: DTableEditable, changes: DTableEditChanges): void;
    }
}

export type DTableEditChanges = Record<RowID, RowData>;

type DTableEditable = DTableWithPlugin<DTableEditableTypes>;

export const editable: DTablePlugin<DTableEditableTypes> = {
    name: 'editable',
    defaultOptions: {
        editable: true,
        selectAllOnFocus: true,
    },
    when: options => !!options.editable,
    events: {
        dblclick(event) {
            this.editCell(this.getPointerInfo(event));
        },
    },
    data() {
        return {editingInputRef: createRef<HTMLInputElement>()};
    },
    state() {
        return {editingChanges: {}};
    },
    methods: {
        isCellEditing(rowID, colName) {
            const {editingCell} = this.state;
            return !!editingCell && editingCell.rowID === rowID && editingCell.colName === colName;
        },
        editCell(cell) {
            const {editable: checkEditable, headerEditable} = this.options;
            if (cell && ((typeof checkEditable === 'function' && !checkEditable(cell.rowID, cell.colName)) || (!headerEditable && cell.rowID === 'HEADER'))) {
                cell = undefined;
            }
            this.data.editingInputRef.current = null;
            this.data.needAutoFocus = true;
            this.setState({editingCell: cell});
        },
        getEditedCellValue(rowID, colName) {
            const rowChangedData = this.state.editingChanges[rowID];
            if (rowChangedData && colName in rowChangedData) {
                return rowChangedData[colName];
            }
            return this.getCellValue(rowID, colName);
        },
        handleEditingInputChange() {
            const newValue = this.data.editingInputRef.current?.value;
            const {editingCell} = this.state;
            if (typeof newValue !== 'string' || !editingCell) {
                return;
            }
            const {rowID, colName} = editingCell;
            const oldValue = this.getEditedCellValue(rowID, colName);
            if (oldValue === newValue) {
                return;
            }
            if (this.options.onEditCell?.call(this, {
                rowID,
                colName,
                value: newValue,
                oldValue,
            }) === false) {
                return;
            }
            this.commitEditChanges({[rowID]: {[colName]: newValue}});
        },
        commitEditChanges(changes: DTableEditChanges, options?: {skipTriggerUpdate?: boolean}) {
            if (this.options.onEditChange?.call(this, changes) === false) {
                return;
            }
            const {editingChanges} = this.state;
            Object.entries(changes).forEach(([rowID, data]) => {
                const oldData = editingChanges[rowID];
                if (oldData) {
                    if (data === null) {
                        delete editingChanges[rowID];
                    } else {
                        Object.assign(oldData, data);
                    }
                } else {
                    editingChanges[rowID] = data;
                }
            });
            if (!options?.skipTriggerUpdate) {
                this.forceUpdate();
            }
        },
        handleEditingInputBlur() {
            this.editCell();
        },
        handleEditingKeyDown(event) {
            if (event.key === 'Enter') {
                this.data.editingInputRef.current?.blur();
            } else if (event.key === 'Esc') {
                this.editCell();
            }
        },
        renderEditableCell(result, {col, row}) {
            const {id: rowID} = row;
            if (this.isCellEditing(rowID, col.name)) {
                const cellValue = `${this.getEditedCellValue(rowID, col.name) ?? ''}`;
                const editingBox = (
                    <input
                        ref={this.data.editingInputRef}
                        class="dtable-editing-input"
                        type="text"
                        defaultValue={cellValue}
                        style={{textAlign: col.setting.align}}
                        onChange={this.handleEditingInputChange}
                        onBlur={this.handleEditingInputBlur}
                        onKeyDown={this.handleEditingKeyDown}
                    />
                );
                return [{
                    outer: true,
                    className: 'is-editing',
                    children: editingBox,
                }];
            } else {
                const editedData = this.state.editingChanges[rowID];
                if (editedData && col.name in editedData) {
                    result[0] = editedData[col.name] as preact.ComponentChild;
                }
            }
            return result;
        },
    },
    onUpdated() {
        const input = this.data.editingInputRef.current;
        if (input && this.data.needAutoFocus) {
            this.data.needAutoFocus = false;
            input.focus();
            if (this.options.selectAllOnFocus) {
                input.select();
            }
        }
    },
    onRender() {
        return {
            className: {
                'dtable-editable': this.options.editable,
                'dtable-editing': this.state.editingCell,
            },
        };
    },
    onRenderCell(...args) {
        return this.renderEditableCell(...args);
    },
    onRenderHeaderCell(...args) {
        return this.renderEditableCell(...args);
    },
};

const plugin = definePlugin(editable);

export default plugin;
