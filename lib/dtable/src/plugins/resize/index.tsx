import {clamp} from '../../helpers/clamp';
import {definePlugin} from '../../helpers/shared-plugins';
import './style.css';

export interface DTableResizeTypes extends DTablePluginTypes {
    options: Partial<{
        colResize: boolean | ((this: DTableResize, colName: ColName) => boolean);
        onColResize: (this: DTableResize, colName: ColName, width: number) => void;
    }>,
    state: {
        colResizing?: {colName: ColName, startX: number, startSize: number}
        colsSizes: Record<ColName, number>;
    },
    data: {
        colResizingRaf?: number;
    }
}

export type DTableResize = DTableWithPlugin<DTableResizeTypes>;

function updateColSize(table: DTableResize, event: MouseEvent, finish?: boolean): void {
    const {colResizing} = table.state;
    if (!colResizing) {
        return;
    }
    const delta = Math.round(event.clientX - colResizing.startX);
    if (!delta && !finish) {
        return;
    }
    const state: Partial<DTableResize['state']> = {};
    if (finish) {
        state.colResizing = undefined;
    }
    const {colsSizes} = table.state;
    const {colName} = colResizing;
    colsSizes[colResizing.colName] = colResizing.startSize + delta;
    state.colsSizes = {...colsSizes};
    table.update({dirtyType: 'layout', state}, finish ? () => {
        const col = table.getColInfo(colName);
        if (col) {
            table.options.onColResize?.call(table, colName, clamp(col.width + colsSizes[colName], col.setting.minWidth, col.setting.maxWidth));
        }
    } : undefined);
    event.stopPropagation();
    event.preventDefault();
}

function tryUpdateColSize(table: DTableResize, event: MouseEvent, finish?: boolean): void {
    if (table.data.colResizingRaf) {
        cancelAnimationFrame(table.data.colResizingRaf);
        table.data.colResizingRaf = undefined;
    }
    if (finish) {
        updateColSize(table, event, finish);
    } else {
        table.data.colResizingRaf = requestAnimationFrame(() => {
            updateColSize(table, event);
            table.data.colResizingRaf = undefined;
        });
    }
}

export const resize: DTablePlugin<DTableResizeTypes> = {
    name: 'resize',
    defaultOptions: {
        colResize: true,
    },
    when: options => !!options.colResize,
    state() {
        return {colsSizes: {}};
    },
    events: {
        mousedown(event) {
            const splitter = (event.target as HTMLElement).closest('.dtable-col-splitter');
            if (!splitter) {
                return;
            }
            const colName = splitter.closest<HTMLElement>('.dtable-cell')?.dataset.col;
            if (!colName) {
                return;
            }
            this.setState({
                colResizing: {
                    colName: colName,
                    startSize: this.state.colsSizes[colName] ?? 0,
                    startX: event.clientX,
                },
            });
            event.stopPropagation();
            return false;
        },
        dblclick(event) {
            const splitter = (event.target as HTMLElement).closest('.dtable-col-splitter');
            if (!splitter) {
                return;
            }
            const colName = splitter.closest<HTMLElement>('.dtable-cell')?.dataset.col;
            if (!colName) {
                return;
            }
            const {colsSizes} = this.state;
            if (colsSizes[colName]) {
                delete colsSizes[colName];
                this.update({dirtyType: 'layout', state: {
                    colResizing: undefined,
                    colsSizes: {...colsSizes},
                }}, () => {
                    this.options.onColResize?.call(this, colName, 0);
                });
            }
        },
        document_mousemove(event) {
            if (!this.state.colResizing) {
                return;
            }
            tryUpdateColSize(this, event as MouseEvent);
            return false;
        },
        document_mouseup(event) {
            if (!this.state.colResizing) {
                return;
            }
            tryUpdateColSize(this, event as MouseEvent, true);
            return false;
        },
    },
    onRenderHeaderCell(result, {col}) {
        const {colResize: colResizeCallback} = this.options;
        if (!col.flex && (typeof colResizeCallback !== 'function' || colResizeCallback.call(this, col.name) !== false)) {
            result.push({
                className: 'has-col-splitter',
                children: <div className="dtable-col-splitter no-cell-event"></div>,
                outer: true,
            });
            if (this.state.colResizing?.colName === col.name) {
                result.push({
                    className: 'has-col-resizing',
                    outer: true,
                });
            }
        }
        return result;
    },
    onAddCol(col) {
        const sizeChange = this.state.colsSizes[col.name];
        if (typeof sizeChange === 'number') {
            col.width = clamp(col.width + sizeChange, col.setting.minWidth, col.setting.maxWidth);
        }
    },
    onRender() {
        if (this.state.colResizing) {
            return {className: 'has-col-resizing'};
        }
    },
};

export default definePlugin(resize);
