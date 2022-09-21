import {classes} from '@zui/browser-helpers/src/classes';
import {definePlugin} from '../../helpers/shared-plugins';
import './style.css';

export type DTableColIndex       = number;
export type DTableRowIndex       = number;
export type DTableColSelection   = `C${DTableColIndex}`;
export type DTableRowSelection   = `R${DTableRowIndex}`;
export type DTableCellSelection  = `${DTableColSelection}${DTableRowSelection}`;
export type DTableSelection      = DTableColSelection | DTableRowSelection | DTableCellSelection;
export type DTableRangeSelection = `${DTableSelection}:${DTableSelection}`;
export type DTableSelections     = (DTableSelection | DTableRangeSelection)[];
export type DTableCellPos        = [col: DTableColIndex, row: DTableRowIndex];

type DTableSelectableTypes = {
    options: Partial<{
        selectable: boolean | ((col: DTableColIndex, row: DTableRowIndex) => boolean);
        onSelectCells: (this: DTableSelectable, cells: DTableCellPos[]) => void;
    }>,
    state: {
        selectedMap: Map<DTableColIndex, Set<DTableRowIndex>>;
        selectingMap: Map<DTableColIndex, Set<DTableRowIndex>>;
    };
    col: Partial<{
        selectable: boolean | ((row: DTableRowIndex) => boolean);
    }>;
    data: {
        selectingStart?: DTableCellPos;
    },
    methods: {
        selectCells: typeof selectCells;
        selectingCells: typeof selectingCells;
        deselectCells: typeof deselectCells;
        isCellSelected: typeof isCellSelected;
        isCellSelecting: typeof isCellSelecting;
        getSelectedCells: typeof getSelectedCells;
        selectAllCells: typeof selectAllCells;
        deselectAllCells: typeof deselectAllCells;
        getSelectedCellsSize: typeof getSelectedCellsSize;
        selectOutsideClick?: (event: MouseEvent) => void;
    };
};

type DTableSelectable = DTableWithPlugin<DTableSelectableTypes>;

const REG_CELL = /C(\d+)R(\d+)/i;
const REG_SELECTION = /(?:C(\d+))?(?:R(\d+))?/i;

function parseCell(cellSelection: DTableCellSelection): DTableCellPos | undefined {
    const result = REG_CELL.exec(cellSelection);
    if (!result || result.length < 3) {
        return;
    }
    const [, col, row] = result;
    return [+col, +row];
}

function parseSelectionCell(selection: DTableSelection): DTableCellPos | undefined {
    const result = REG_SELECTION.exec(selection);
    if (!result) {
        return;
    }
    const [, colStr = -1, rowStr = -1] = result;
    const col = +colStr;
    const row = +rowStr;
    return [col, row];
}

function parseSelection(this: DTableSelectable, selections: DTableSelection): DTableCellPos[] {
    const cells: DTableCellPos[] = [];
    const selection = parseSelectionCell(selections);
    if (!selection) {
        return cells;
    }
    const [col, row] = selection;
    if (col >= 0) {
        if (row >= 0) {
            cells.push([col, row]);
        } else {
            const rowsCount = this.layout.rows.length;
            for (let i = 0; i < rowsCount; i++) {
                cells.push([col, i]);
            }
        }
    } else if (row >= 0) {
        const {colsInfo} = this.layout;
        const colsCount = colsInfo.fixedLeftCols.length + colsInfo.scrollCols.length + colsInfo.fixedRightCols.length;
        for (let i = 0; i < colsCount; i++) {
            cells.push([i, row]);
        }
    }
    return cells;
}

function parseRange(this: DTableSelectable, range: DTableRangeSelection): DTableCellPos[] {
    const [start, end] = range.split(':') as [DTableSelection, DTableSelection];
    if (!start) {
        if (!end) {
            return [];
        } else {
            return parseSelection.call(this, end);
        }
    } else if (!end) {
        return parseSelection.call(this, start);
    }
    const startPos = parseSelectionCell(start);
    const endPos = parseSelectionCell(end);
    if (!startPos || !endPos) {
        return [];
    }
    const colStart = Math.min(startPos[0], endPos[0]);
    const colEnd = Math.max(startPos[0], endPos[0]);
    const rowStart = Math.min(startPos[1], endPos[1]);
    const rowEnd = Math.max(startPos[1], endPos[1]);
    const cells: DTableCellPos[] = [];
    for (let col = colStart; col <= colEnd; col++) {
        if (rowStart < 0 || rowEnd < 0) {
            const rowsCount = this.layout.rows.length;
            for (let i = 0; i < rowsCount; i++) {
                cells.push([col, i]);
            }
        } else {
            for (let row = rowStart; row <= rowEnd; row++) {
                cells.push([col, row]);
            }
        }
    }
    return cells;
}

function parseSelections(this: DTableSelectable, selections: DTableSelections): DTableCellPos[] {
    return selections.reduce<DTableCellPos[]>((cells, selection) => {
        if (selection.includes(':')) {
            cells.push(...parseRange.call(this, selection as DTableRangeSelection));
        } else {
            cells.push(...parseSelection.call(this, selection as DTableSelection));
        }
        return cells;
    }, []);
}

function stringifySelection(start: DTableCellPos, end?: DTableCellPos): DTableSelection | DTableRangeSelection | '' {
    const [col, row] = start;
    const parts: string[] = [];
    if (col >= 0) {
        parts.push(`C${col}`);
    }
    if (row >= 0) {
        parts.push(`R${row}`);
    }
    if (end) {
        const endSelection = stringifySelection(end);
        if (endSelection) {
            parts.push(':', endSelection);
        }
    }
    return parts.join('') as DTableSelection | DTableRangeSelection;
}

function selectCells(this: DTableSelectable, selections: DTableSelection | DTableRangeSelection | DTableSelections, options: {clearBefore?: boolean, deselect?: boolean, selecting?: boolean, callback?: (this: DTableSelectable, cells: DTableCellPos[]) => void} = {}): DTableCellPos[] {
    if (!Array.isArray(selections)) {
        selections = [selections];
    }
    const cells = parseSelections.call(this, selections);
    const {clearBefore = true, deselect, selecting, callback} = options;
    const {selectingMap, selectedMap} = this.state;
    const map = selecting ? selectingMap : selectedMap;
    const checkSelectable = typeof this.options.selectable === 'function' ? this.options.selectable : false;

    selectingMap.clear();
    if (clearBefore) {
        selectedMap.clear();
    }

    if (deselect) {
        cells.forEach(([col, row]) => {
            if (checkSelectable && !checkSelectable(col, row)) {
                return;
            }
            const set = map.get(col);
            if (set) {
                set.delete(row);
                if (!set.size) {
                    map.delete(col);
                }
            }
        });
    } else {
        cells.forEach(([col, row]) => {
            if (checkSelectable && !checkSelectable(col, row)) {
                return;
            }
            const set = map.get(col);
            if (set) {
                set.add(row);
            } else {
                map.set(col, new Set([row]));
            }
        });
    }

    this.forceUpdate(() => {
        callback?.call(this, cells);
        this.options.onSelectCells?.call(this, cells);
    });
    return cells;
}

function selectingCells(this: DTableSelectable, selections: DTableSelection | DTableRangeSelection | DTableSelections, options?: {clearBefore?: boolean, deselect?: boolean, selecting?: boolean, callback?: (this: DTableSelectable, cells: DTableCellPos[]) => void}): DTableCellPos[] {
    return selectCells.call(this, selections, {...options, selecting: true});
}

function deselectCells(this: DTableSelectable, selections: DTableSelection | DTableRangeSelection | DTableSelections, options: {clearBefore?: boolean, selecting?: boolean, callback?: (this: DTableSelectable, cells: DTableCellPos[]) => void}): DTableCellPos[] {
    return selectCells.call(this, selections, {...options, deselect: true});
}

function selectAllCells(this: DTableSelectable): void {
    const {colsInfo} = this.layout;
    const colsCount = colsInfo.fixedLeftCols.length + colsInfo.scrollCols.length + colsInfo.fixedRightCols.length;
    const rowsCount = this.layout.rows.length;
    const {selectedMap} = this.state;
    for (let col = 0; col < colsCount; col++) {
        let set = selectedMap.get(col);
        if (!set) {
            set = new Set();
            selectedMap.set(col, set);
        }
        for (let row = 0; row < rowsCount; row++) {
            set.add(row);
        }
    }
    this.forceUpdate();
}

function deselectAllCells(this: DTableSelectable): void {
    this.state.selectedMap.clear();
    this.forceUpdate();
}

function isCellSelected(this: DTableSelectable, cell: DTableCellSelection | DTableCellPos): boolean {
    const pos = typeof cell === 'string' ? parseCell(cell) : cell;
    if (!pos) {
        return false;
    }
    return this.state.selectedMap.get(pos[0])?.has(pos[1]) ?? false;
}

function isCellSelecting(this: DTableSelectable, cell: DTableCellSelection | DTableCellPos): boolean {
    const pos = typeof cell === 'string' ? parseCell(cell) : cell;
    if (!pos) {
        return false;
    }
    return this.state.selectingMap.get(pos[0])?.has(pos[1]) ?? false;
}

function getSelectedCells(this: DTableSelectable): DTableCellPos[] {
    const cells: DTableCellPos[] = [];
    for (const [col, rows] of this.state.selectedMap.entries()) {
        for (const row of rows) {
            cells.push([col, row]);
        }
    }
    return cells;
}

function hasCellSelectInRow(table: DTableSelectable, rowIndex: number): boolean {
    for (const [, rows] of table.state.selectedMap.entries()) {
        if (rows.has(rowIndex)) {
            return true;
        }
    }
    for (const [, rows] of table.state.selectingMap.entries()) {
        if (rows.has(rowIndex)) {
            return true;
        }
    }
    return false;
}

function getSelectedCellsSize(this: DTableSelectable): number {
    let size = 0;
    for (const set of this.state.selectedMap.values()) {
        size += set.size;
    }
    return size;
}

export function getMousePos(table: DTable, event: Event, options?: {ignoreHeaderCell?: boolean}): DTableCellPos | undefined {
    const pointerInfo = table.getPointerInfo(event);
    if (!pointerInfo || pointerInfo.target.closest('input,textarea,[contenteditable]')) {
        return;
    }
    const {rowID, colName} = pointerInfo;
    const colIndex = table.getColInfo(colName)?.index ?? -1;
    if (colIndex < 0) {
        return;
    }
    const isHeaderRow = rowID === 'HEADER';
    if (isHeaderRow && options?.ignoreHeaderCell) {
        return;
    }
    const rowIndex = isHeaderRow ? (-1) : table.getRowInfo(rowID)?.index ?? -1;
    return [colIndex, rowIndex];
}

export const selectable: DTablePlugin<DTableSelectableTypes> = {
    name: 'selectable',
    defaultOptions: {selectable: true},
    when: options => !!options.selectable,
    state: {
        selectedMap: new Map(),
        selectingMap: new Map(),
    },
    methods: {
        selectCells,
        selectingCells,
        deselectCells,
        isCellSelected,
        isCellSelecting,
        getSelectedCells,
        selectAllCells,
        deselectAllCells,
        getSelectedCellsSize,
    },
    events: {
        mousedown(event) {
            const pos = getMousePos(this, event);
            this.data.selectingStart = pos;
            if (pos) {
                event.stopPropagation();
            }
        },
        mousemove(event) {
            const {selectingStart} = this.data;
            if (!selectingStart) {
                return;
            }
            const pos = getMousePos(this, event);
            if (pos) {
                const selection = stringifySelection(selectingStart, pos);
                if (selection) {
                    this.selectingCells(selection);
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },
        mouseup(event) {
            const {selectingStart} = this.data;
            if (!selectingStart) {
                return;
            }
            this.data.selectingStart = undefined;
            const pos = getMousePos(this, event);
            if (pos) {
                const selection = stringifySelection(selectingStart, pos);
                if (selection) {
                    this.selectCells(selection);
                    event.stopPropagation();
                }
            }
        },
    },
    onMounted() {
        this.selectOutsideClick = (event) => {
            const target = event.target as HTMLElement;
            if (!target) {
                return;
            }
            if (!target.closest(`#${this.id}`)) {
                this.deselectAllCells();
            }
        };
        document.addEventListener('click', this.selectOutsideClick);
    },
    onUnmounted() {
        if (this.selectOutsideClick) {
            document.removeEventListener('click', this.selectOutsideClick);
        }
    },
    onRender() {
        if (this.options.selectable) {
            return {className: 'dtable-selectable'};
        }
    },
    onRenderRow({props, row}) {
        if (hasCellSelectInRow(this, row.index)) {
            return  {className: classes(props.className, 'has-cell-select')};
        }
    },
    onRenderCell(result, {row, col}) {
        const rowInfo = this.getRowInfo(row.id);
        if (!rowInfo) {
            return result;
        }
        if (this.isCellSelecting([col.index, rowInfo.index])) {
            result.push({outer: true, className: 'is-select is-selecting'});
        } else if (this.isCellSelected([col.index, rowInfo.index])) {
            result.push({outer: true, className: 'is-select is-selected'});
        }
        return result;
    },
    onHeaderCellClick(_, {colName}) {
        const colInfo = this.getColInfo(colName);
        if (colInfo) {
            this.selectCells(`C${colInfo.index}`);
        }
    },
};

export default definePlugin(selectable);
