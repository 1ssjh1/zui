import {Component, createRef, h as _h} from 'preact';
import {nanoid} from 'nanoid';
import {classes} from '@zui/browser-helpers/src/classes';
import {Scrollbar} from '@zui/scrollbar/src/components/scrollbar';
import {clamp} from './helpers/clamp';
import {Header} from './components/header';
import {Rows} from './components/rows';
import {addPlugin, initPlugins, removePlugin} from './helpers/shared-plugins';
import {getDefaultOptions} from './helpers/default-options';
import './vars.css';
import './style.css';

import type {ComponentChildren, JSX} from 'preact';

export class DTable extends Component<DTableOptions, DTableState> {
    static addPlugin = addPlugin;

    static removePlugin = removePlugin;

    ref = createRef<HTMLDivElement>();

    #rafId = 0;

    #id: string;

    #needRender = false;

    #options?: DTableOptions;

    #allPlugins: readonly DTablePlugin[];

    #plugins: DTablePlugin[] = [];

    #layout?: DTableLayout;

    #events: Map<DTableEventType, DTableEventListener[]> = new Map();

    #data: Record<string, unknown> = {};

    #rob?: ResizeObserver;

    constructor(props: DTableOptions) {
        super(props);

        this.#id = props.id ?? `dtable-${nanoid(10)}`;
        this.state = {scrollTop: 0, scrollLeft: 0};

        this.#allPlugins = Object.freeze(initPlugins(props.plugins));
        this.#allPlugins.forEach(plugin => {
            const {methods, data, state} = plugin;
            if (methods) {
                Object.entries(methods).forEach(([methodName, method]) => {
                    if (typeof method === 'function') {
                        Object.assign(this, {[methodName]: method.bind(this)});
                    }
                });
            }
            if (data) {
                Object.assign(this.#data, data.call(this));
            }
            if (state) {
                Object.assign(this.state, state.call(this));
            }

            plugin.onCreate?.call(this, plugin);
        });
    }

    get options() {
        return this.#layout?.options || this.#options || getDefaultOptions() as DTableOptions;
    }

    get plugins() {
        return this.#plugins;
    }

    get layout(): DTableLayout {
        return this.#layout as DTableLayout;
    }

    get id() {
        return this.#id;
    }

    get data() {
        return this.#data;
    }

    get parent() {
        return this.props.parent ?? this.ref.current?.parentElement;
    }

    componentWillReceiveProps(): void {
        this.#options = undefined;
    }

    componentDidMount() {
        if (this.#needRender) {
            this.forceUpdate();
        } else {
            this.#afterRender();
        }

        this.#plugins.forEach(plugin => {
            const {events} = plugin;
            if (!events) {
                return;
            }
            Object.entries(events).forEach(([eventType, callback]) => {
                this.on(eventType as DTableEventType, callback as DTableEventListener);
            });
        });

        this.on('click', this.#handleClick as DTableEventListener);

        if (this.options.responsive) {
            if (typeof ResizeObserver !== 'undefined') {
                const {parent} = this;
                if (parent) {
                    const rob = new ResizeObserver(this.updateLayout);
                    rob.observe(parent);
                    this.#rob = rob;
                }
            } else {
                this.on('window_resize', this.updateLayout);
            }
        }

        this.#plugins.forEach(plugin => {
            plugin.onMounted?.call(this);
        });
    }

    componentDidUpdate() {
        if (this.#needRender) {
            this.#afterRender();
        } else {
            this.#plugins.forEach(plugin => {
                plugin.onUpdated?.call(this);
            });
        }
    }

    componentWillUnmount() {
        this.#rob?.disconnect();

        const {current} = this.ref;
        if (current) {
            for (const event of this.#events.keys()) {
                if (event.startsWith('window_')) {
                    window.removeEventListener(event.replace('window_', ''), this.#handleWindowEvent);
                } else if (event.startsWith('document_')) {
                    document.removeEventListener(event.replace('document_', ''), this.#handleDocumentEvent);
                }  else {
                    current.removeEventListener(event, this.#handleEvent);
                }
            }
        }

        this.#plugins.forEach(plugin => {
            plugin.onUnmounted?.call(this);
        });

        this.#allPlugins.forEach(plugin => {
            plugin.onDestory?.call(this);
        });

        this.#data = {};
        this.#events.clear();
    }

    on(event: DTableEventType, callback: DTableEventListener) {
        const eventCallbacks = this.#events.get(event);
        if (eventCallbacks) {
            eventCallbacks.push(callback);
        } else {
            this.#events.set(event, [callback]);
            if (event.startsWith('window_')) {
                window.addEventListener(event.replace('window_', ''), this.#handleWindowEvent);
            } else if (event.startsWith('document_')) {
                document.addEventListener(event.replace('document_', ''), this.#handleDocumentEvent);
            } else {
                this.ref.current?.addEventListener(event, this.#handleEvent);
            }
        }
    }

    off(event: DTableEventType, callback: DTableEventListener) {
        const eventCallbacks = this.#events.get(event);
        if (!eventCallbacks) {
            return;
        }
        const index = eventCallbacks.indexOf(callback);
        if (index >= 0) {
            eventCallbacks.splice(index, 1);
        }
        if (!eventCallbacks.length) {
            this.#events.delete(event);
            if (event.startsWith('window_')) {
                window.removeEventListener(event.replace('window_', ''), this.#handleWindowEvent);
            } else if (event.startsWith('document_')) {
                document.removeEventListener(event.replace('document_', ''), this.#handleDocumentEvent);
            } else {
                this.ref.current?.removeEventListener(event, this.#handleEvent);
            }
        }
    }

    scrollLeft(scrollLeft: number) {
        const {scrollWidth, scrollColsWidth} = this.layout.colsInfo;
        scrollLeft = Math.max(0, Math.min(scrollLeft, scrollColsWidth - scrollWidth));
        this.setState({scrollLeft}, () => {
            this.options.onScroll?.call(this, scrollLeft, 'horz');
        });
    }

    scrollTop(scrollTop: number) {
        const {rowsHeight, rowsHeightTotal} = this.layout;
        scrollTop = Math.max(0, Math.min(scrollTop, rowsHeightTotal - rowsHeight));
        this.setState({scrollTop}, () => {
            this.options.onScroll?.call(this, scrollTop, 'vert');
        });
    }

    getColInfo(colNameOrIndex: string | number | ColInfo): ColInfo | undefined {
        if (typeof colNameOrIndex === 'object') {
            return colNameOrIndex;
        }
        const {colsMap, colsList} = this.layout;
        if (typeof colNameOrIndex === 'number') {
            return colsList[colNameOrIndex];
        }
        return colsMap[colNameOrIndex];
    }

    getRowInfo(idOrIndex: string | number | RowInfo): RowInfo | undefined {
        if (typeof idOrIndex === 'object') {
            return idOrIndex;
        }
        if (idOrIndex === -1 || idOrIndex === 'HEADER') {
            return {id: 'HEADER', index: -1, top: 0};
        }
        const {rows, rowsMap} = this.layout;
        if (typeof idOrIndex === 'number') {
            return rows[idOrIndex];
        }
        return rowsMap[idOrIndex];
    }

    getCellValue(row: RowInfo | string | number, col: ColInfo | string | number): unknown {
        const rowInfo = typeof row === 'object' ? row : this.getRowInfo(row);
        if (!rowInfo) {
            return;
        }
        const colInfo = typeof col === 'object' ? col : this.getColInfo(col);
        if (!colInfo) {
            return;
        }
        let originValue = rowInfo.id === 'HEADER' ? (colInfo.setting.title ?? colInfo.setting.name) : rowInfo.data?.[colInfo.name];
        const {cellValueGetter} = this.options;
        if (cellValueGetter) {
            originValue = cellValueGetter.call(this, rowInfo, colInfo, originValue);
        }
        return originValue;
    }

    getRowInfoByIndex(index: number): RowInfo | undefined {
        return this.layout.rows[index];
    }

    update(options: {dirtyType?: 'options' | 'layout', state?: Partial<DTableState>} = {}, callback?: () => void) {
        const {dirtyType, state} = options;
        if (dirtyType === 'layout') {
            this.#layout = undefined;
        } else if (dirtyType === 'options') {
            this.#layout = undefined;
            this.#options = undefined;
        }
        if (state) {
            this.setState({...state}, callback);
        } else {
            this.forceUpdate(callback);
        }
    }

    getPointerInfo(event: Event) {
        const target = event.target as HTMLElement;
        if (!target || target.closest('.no-cell-event')) {
            return;
        }
        const cellElement = target.closest<HTMLElement>('.dtable-cell');
        if (!cellElement) {
            return;
        }
        const rowElement = cellElement.closest<HTMLElement>('.dtable-row');
        if (!rowElement) {
            return;
        }
        const colName = cellElement?.getAttribute('data-col');
        const rowID = rowElement?.getAttribute('data-id');
        if (typeof colName !== 'string' || typeof rowID !== 'string') {
            return;
        }
        return {
            cellElement,
            rowElement,
            colName,
            rowID,
            target,
        };
    }

    updateLayout = () => {
        if (this.#rafId) {
            cancelAnimationFrame(this.#rafId);
        }
        this.#rafId = requestAnimationFrame(() => {
            this.#layout = undefined;
            this.forceUpdate();
            this.#rafId = 0;
        });
    };

    #handleEvent = (event: Event, type?: DTableEventType) => {
        type = type || event.type as DTableEventType;
        const callbacks = this.#events.get(type);
        if (!callbacks?.length) {
            return;
        }
        for (const callback of callbacks) {
            const result = callback.call(this, event);
            if (result === false) {
                event.stopPropagation();
                break;
            }
        }
    };

    #handleWindowEvent = (event: Event) => {
        this.#handleEvent(event, `window_${event.type}` as DTableEventType);
    };

    #handleDocumentEvent = (event: Event) => {
        this.#handleEvent(event, `document_${event.type}` as DTableEventType);
    };

    #renderHeader(layout: DTableLayout) {
        const {header, colsInfo, headerHeight} = layout;
        if (!header) {
            return null;
        }
        if (header === true) {
            return (
                <Header
                    scrollLeft={this.state.scrollLeft}
                    height={headerHeight}
                    onRenderCell={this.#handleRenderCell}
                    onRenderRow={this.#handleRenderHeaderRow}
                    {...colsInfo}
                />
            );
        }
        let content: ComponentChildren;
        let html: {__html: string} | undefined;
        if (typeof header === 'function') {
            const headerContent: ComponentChildren | {__html: string} = header(layout, this.state);
            if (typeof headerContent === 'object' && headerContent && '__html' in headerContent) {
                html = headerContent;
            } else {
                content = headerContent;
            }
        } else {
            content = header;
        }

        return (
            <div
                className='dtable-header'
                style={{height: headerHeight}}
                dangerouslySetInnerHTML={html}
            >
                {content}
            </div>
        );
    }

    #renderRows(layout: DTableLayout) {
        const {headerHeight, rowsHeight, visibleRows, rowHeight, colsInfo} = layout;
        return (
            <Rows
                top={headerHeight}
                height={rowsHeight}
                rows={visibleRows}
                rowHeight={rowHeight}
                scrollLeft={this.state.scrollLeft}
                onRenderCell={this.#handleRenderCell}
                onRenderRow={this.#handleRenderRow}
                {...colsInfo}
            />
        );
    }

    #renderFooter(layout: DTableLayout) {
        const {footer, footerHeight} = layout;
        if (!footer) {
            return null;
        }
        let content: ComponentChildren;
        let html: {__html: string} | undefined;
        if (typeof footer === 'function') {
            const footerContent: ComponentChildren | {__html: string} = footer(layout, this.state);
            if (typeof footerContent === 'object' && footerContent && '__html' in footerContent) {
                html = footerContent;
            } else {
                content = footerContent;
            }
        } else {
            content = footer;
        }
        return (
            <div
                className='dtable-footer'
                style={{height: footerHeight}}
                dangerouslySetInnerHTML={html}
            >
                {content}
            </div>
        );
    }

    #renderScrollBars(layout: DTableLayout) {
        const scrollbars = [];
        const {scrollLeft, colsInfo, scrollTop, rowsHeight, rowsHeightTotal} = layout;
        const {scrollColsWidth, scrollWidth} = colsInfo;
        const {scrollbarSize = 12, horzScrollbarPos} = this.options;
        if (scrollColsWidth > scrollWidth) {
            scrollbars.push(
                <Scrollbar
                    key='horz'
                    type='horz'
                    scrollPos={scrollLeft}
                    scrollSize={scrollColsWidth}
                    clientSize={scrollWidth}
                    onScroll={this.#handleScroll}
                    left={colsInfo.fixedLeftWidth}
                    bottom={horzScrollbarPos === 'inside' ? 0 : (-scrollbarSize)}
                    size={scrollbarSize}
                    wheelContainer={this.ref}
                />,
            );
        }
        if (rowsHeightTotal > rowsHeight) {
            scrollbars.push(
                <Scrollbar
                    key='vert'
                    type='vert'
                    scrollPos={scrollTop}
                    scrollSize={rowsHeightTotal}
                    clientSize={rowsHeight}
                    onScroll={this.#handleScroll}
                    right={0}
                    size={scrollbarSize}
                    top={layout.headerHeight}
                    wheelContainer={this.ref}
                />,
            );
        }
        return scrollbars.length ? scrollbars : null;
    }

    #afterRender() {
        this.#needRender = false;
        this.options.afterRender?.call(this);
        this.#plugins.forEach(plugin => plugin.afterRender?.call(this));
    }

    #handleRenderRow = (data: {props: RowProps, row: RowInfo}, h: typeof _h): Partial<RowProps | (RowProps & JSX.HTMLAttributes<HTMLElement>)> | void => {
        if (this.options.onRenderRow) {
            const result = this.options.onRenderRow.call(this, data, h);
            if (result) {
                Object.assign(data.props, result);
            }
        }

        this.#plugins.forEach(plugin => {
            if (plugin.onRenderRow) {
                const result = plugin.onRenderRow.call(this, data, h);
                if (result) {
                    Object.assign(data.props, result);
                }
            }
        });
        return data.props;
    };

    #handleRenderHeaderRow = (data: {props: RowProps}, h: typeof _h): RowProps => {
        if (this.options.onRenderHeaderRow) {
            data.props = this.options.onRenderHeaderRow.call(this, data, h);
        }

        this.#plugins.forEach(plugin => {
            if (plugin.onRenderHeaderRow) {
                data.props = plugin.onRenderHeaderRow.call(this, data, h);
            }
        });
        return data.props;
    };

    #handleRenderCell = (result: CustomRenderResult, data: {row: RowInfo, col: ColInfo}, h: typeof _h) : CustomRenderResult => {
        const {row, col} = data;
        result[0] = this.getCellValue(row, col) as ComponentChildren;
        const renderCallbackName = row.id === 'HEADER' ? 'onRenderHeaderCell' : 'onRenderCell';
        if (col.setting[renderCallbackName]) {
            result = (col.setting[renderCallbackName] as CellRenderCallback).call(this, result, data, h);
        }
        if (this.options[renderCallbackName]) {
            result = (this.options[renderCallbackName] as CellRenderCallback).call(this, result, data, h);
        }
        this.#plugins.forEach(plugin => {
            if (plugin[renderCallbackName]) {
                result = (plugin[renderCallbackName] as CellRenderCallback).call(this, result, data, h);
            }
        });
        return result;
    };

    #handleScroll = (scrollOffset: number, type: 'horz' | 'vert') => {
        if (type === 'horz') {
            this.scrollLeft(scrollOffset);
        } else {
            this.scrollTop(scrollOffset);
        }
    };

    #handleClick = (event: MouseEvent) => {
        const pointerInfo = this.getPointerInfo(event);
        if (!pointerInfo) {
            return;
        }
        const {rowID, colName, cellElement} = pointerInfo;
        if (rowID === 'HEADER') {
            if (cellElement) {
                this.options.onHeaderCellClick?.call(this, event, {colName, element: cellElement});
                this.#plugins.forEach(plugin => {
                    plugin.onHeaderCellClick?.call(this, event, {colName, element: cellElement});
                });
            }
        } else {
            const {rowElement} = pointerInfo;
            const rowInfo = this.layout.visibleRows.find(row => row.id === rowID);
            if (cellElement) {
                if (this.options.onCellClick?.call(this, event, {colName, rowID, rowInfo, element: cellElement, rowElement}) === true) {
                    return;
                }
                for (const plugin of this.#plugins) {
                    if (plugin.onCellClick?.call(this, event, {colName, rowID, rowInfo, element: cellElement, rowElement}) === true) {
                        return;
                    }
                }
            }
            if (this.options.onRowClick?.call(this, event, {rowID, rowInfo, element: rowElement}) === true) {
                return;
            }

            for (const plugin of this.#plugins) {
                if (plugin.onRowClick?.call(this, event, {rowID, rowInfo, element: rowElement}) === true) {
                    return;
                }
            }
        }
    };

    #initOptions(): boolean {
        if (this.#options) {
            return false;
        }

        const defaultOptions = getDefaultOptions();
        const options = {...defaultOptions, ...this.#allPlugins.reduce((currentOptions, plugin) => {
            const {defaultOptions: pluginOptions} = plugin;
            if (pluginOptions) {
                Object.assign(currentOptions, pluginOptions);
            }
            return currentOptions;
        }, {}), ...this.props} as DTableOptions;

        this.#options = options;
        this.#plugins = this.#allPlugins.reduce<DTablePlugin[]>((list, plugin) => {
            const {when, options: optionsModifier} = plugin;
            if (!when || when(options)) {
                list.push(plugin);
                if (optionsModifier) {
                    Object.assign(options, typeof optionsModifier === 'function' ? optionsModifier.call(this, options) : optionsModifier);
                }
            }
            return list;
        }, []);

        return true;
    }

    #initLayout() {
        const {plugins} = this;

        let options = this.#options as DTableOptions;
        plugins.forEach(plugin => {
            const newOptions = plugin.beforeLayout?.call(this, options);
            if (newOptions) {
                options = {...options, ...newOptions};
            }
        });

        /* Init cols */
        const {defaultColWidth, minColWidth, maxColWidth} = options;
        const fixedLeftCols: ColInfo[] = [];
        const fixedRightCols: ColInfo[] = [];
        const scrollCols: ColInfo[] = [];
        const colsMap: Record<string, ColInfo> = {};
        const colsList: ColInfo[] = [];
        const flexCols: ColInfo[] = [];
        let fixedLeftWidth = 0;
        let fixedRightWidth = 0;
        let scrollColsWidth = 0;
        options.cols.forEach((colSetting) => {
            if (colSetting.hidden) {
                return;
            }
            const {
                name,
                type = '',
                fixed = false,
                flex = false,
                width = defaultColWidth,
                minWidth = minColWidth,
                maxWidth = maxColWidth,
                ...otherColSetting
            } = colSetting;
            const colWidth = clamp(width, minWidth, maxWidth);
            const colInfo: ColInfo = {
                name,
                type,
                setting: {
                    name,
                    type,
                    fixed,
                    flex,
                    width,
                    minWidth,
                    maxWidth,
                    ...otherColSetting,
                },
                flex: fixed ? 0 : (flex === true ? 1 : (typeof flex === 'number' ? flex : 0)),
                left: 0,
                width: colWidth,
                realWidth: 0,
                visible: true,
                index: colsList.length,
            };

            plugins.forEach(plugin => {
                const colTypeInfo = plugin.colTypes?.[type];
                if (colTypeInfo) {
                    const newColSetting = typeof colTypeInfo === 'function' ? colTypeInfo(colInfo) : colTypeInfo;
                    if (newColSetting) {
                        Object.assign(colInfo.setting, newColSetting);
                    }
                }

                plugin.onAddCol?.call(this, colInfo);
            });

            colInfo.realWidth = colInfo.realWidth || colInfo.width;
            if (fixed === 'left') {
                colInfo.left = fixedLeftWidth;
                fixedLeftWidth += colInfo.width;
                fixedLeftCols.push(colInfo);
            } else if (fixed === 'right') {
                colInfo.left = fixedRightWidth;
                fixedRightWidth += colInfo.width;
                fixedRightCols.push(colInfo);
            } else {
                colInfo.left = scrollColsWidth;
                scrollColsWidth += colInfo.width;
                scrollCols.push(colInfo);
            }

            if (colInfo.flex) {
                flexCols.push(colInfo);
            }

            colsList.push(colInfo);
            colsMap[colInfo.name] = colInfo;
        });

        let widthSetting = options.width;
        let width = 0;
        const actualWidth = fixedLeftWidth + scrollColsWidth + fixedRightWidth;
        if (typeof widthSetting === 'function') {
            widthSetting = widthSetting.call(this, actualWidth);
        }
        if (widthSetting === 'auto') {
            width = actualWidth;
        } else if (widthSetting === '100%') {
            const {parent: parentElement} = this;
            if (parentElement) {
                width = parentElement.clientWidth;
            } else {
                width = 0;
                this.#needRender = true;
                return;
            }
        } else {
            width = widthSetting ?? 0;
        }

        const {data, rowKey = 'id', rowHeight} = options;
        const allRows: RowInfo[] = [];
        const addRowItem = (id: string, index: number, item?: RowData) => {
            const row: RowInfo = {data: item ?? {[rowKey]: id}, id, index: allRows.length, top: 0};
            if (!item) {
                row.lazy = true;
            }
            allRows.push(row);

            if (options.onAddRow?.call(this, row, index) === false) {
                return;
            }
            for (const plugin of plugins) {
                if (plugin.onAddRow?.call(this, row, index) === false) {
                    return;
                }
            }
        };

        if (typeof data === 'number') {
            for (let i = 0; i < data; i++) {
                addRowItem(`${i}`, i);
            }
        } else if (Array.isArray(data)) {
            data.forEach((item, index) => {
                if (typeof item === 'object') {
                    addRowItem(`${item[rowKey] ?? ''}`, index, item);
                } else {
                    addRowItem(`${item ?? ''}`, index);
                }
            });
        }

        /* Add rows */
        let rows = allRows;
        const rowsMap: Record<RowID, RowInfo> = {};
        if (options.onAddRows) {
            const newRows = options.onAddRows.call(this, rows);
            if (newRows) {
                rows = newRows;
            }
        }
        for (const plugin of plugins) {
            const newRows = plugin.onAddRows?.call(this, rows);
            if (newRows) {
                rows = newRows;
            }
        }
        rows.forEach((row, index) => {
            rowsMap[row.id] = row;
            row.index = index;
        });

        const {header, footer} = options;
        const headerHeight = header ? (options.headerHeight || rowHeight) : 0;
        const footerHeight = footer ? (options.footerHeight || rowHeight) : 0;
        let heightSetting = options.height;
        let height = 0;

        const rowsHeightTotal = rows.length * rowHeight;
        const actualHeight = headerHeight + footerHeight + rowsHeightTotal;
        if (typeof heightSetting === 'function') {
            heightSetting = heightSetting.call(this, actualHeight);
        }
        if (heightSetting === 'auto') {
            height = actualHeight;
        } else if (typeof heightSetting === 'object') {
            height = Math.min(heightSetting.max, Math.max(heightSetting.min, actualHeight));
        } else if (heightSetting === '100%') {
            const {parent: parentElement} = this;
            if (parentElement) {
                height = parentElement.clientHeight;
            } else {
                height = 0;
                this.#needRender = true;
                return;
            }
        } else {
            height = heightSetting as number;
        }

        const rowsHeight = height - headerHeight - footerHeight;
        const scrollWidth = width - fixedLeftWidth - fixedRightWidth;

        const layout = {
            options,
            allRows,
            width,
            height,
            rows,
            rowsMap,
            rowHeight,
            rowsHeight,
            rowsHeightTotal,
            header,
            footer,
            headerHeight,
            footerHeight,
            colsMap,
            colsList,
            flexCols,
            colsInfo: {
                fixedLeftCols,
                fixedRightCols,
                scrollCols,
                fixedLeftWidth,
                scrollWidth,
                scrollColsWidth,
                fixedRightWidth,
            },
        } as DTableLayout;

        const newLayout = options.onLayout?.call(this, layout);
        if (newLayout) {
            Object.assign(layout, newLayout);
        }

        plugins.forEach(plugin => {
            if (plugin.onLayout) {
                const newPluginLayout = plugin.onLayout.call(this, layout);
                if (newPluginLayout) {
                    Object.assign(layout, newPluginLayout);
                }
            }
        });

        this.#layout = layout;
    }

    #getLayout(): DTableLayout | undefined {
        if (this.#initOptions() || !this.#layout) {
            this.#initLayout();
        }

        const {layout} = this;
        if (!layout) {
            return;
        }
        let {scrollLeft} = this.state;
        const {flexCols, colsInfo: {scrollCols, scrollWidth, scrollColsWidth}} = layout;

        if (flexCols.length) {
            const extraWidth = scrollWidth - scrollColsWidth;
            if (extraWidth > 0) {
                const totalFlex = flexCols.reduce((total, col) => total + col.flex, 0);
                let totalFlexWidth = 0;
                flexCols.forEach(col => {
                    const flexWidth = Math.min(extraWidth - totalFlexWidth, Math.ceil(extraWidth * (col.flex / totalFlex)));
                    col.realWidth = flexWidth + col.width;
                    totalFlexWidth += col.realWidth;
                });
            } else {
                flexCols.forEach(col => {
                    col.realWidth = col.width;
                });
            }
        }
        scrollLeft = Math.min(Math.max(0, scrollColsWidth - scrollWidth), scrollLeft);
        let colRealLeft = 0;
        scrollCols.forEach(col => {
            col.left = colRealLeft;
            colRealLeft += col.realWidth;
            col.visible = (col.left + col.realWidth) >= scrollLeft && col.left <= (scrollLeft + scrollWidth);
        });

        const {rowsHeightTotal, rowsHeight, rows, rowHeight} = layout;
        const scrollTop = Math.min(Math.max(0, rowsHeightTotal - rowsHeight), this.state.scrollTop);
        const startRowIndex = Math.floor(scrollTop / rowHeight);
        const scrollBottom = scrollTop + rowsHeight;
        const endRowIndex = Math.min(rows.length, Math.ceil(scrollBottom / rowHeight));
        const visibleRows: RowInfo[] = [];
        const {rowDataGetter} = this.options;
        for (let i = startRowIndex; i < endRowIndex; i++) {
            const row = rows[i];
            row.top = row.index * rowHeight - scrollTop;

            if (row.lazy) {
                if (rowDataGetter) {
                    row.data = rowDataGetter([row.id])[0];
                    row.lazy = false;
                }
            }

            visibleRows.push(row);
        }

        layout.visibleRows = visibleRows;
        layout.scrollTop = scrollTop;
        layout.scrollLeft = scrollLeft;

        return layout;
    }

    render() {
        const layout = this.#getLayout();
        const {className, rowHover, colHover, cellHover, bordered, striped, scrollbarHover} = this.options;
        const style = {width: layout?.width, height: layout?.height};
        const classNames: ClassNameLike = ['dtable', className, {
            'dtable-hover-row': rowHover,
            'dtable-hover-col': colHover,
            'dtable-hover-cell': cellHover,
            'dtable-bordered': bordered,
            'dtable-striped': striped,
            'dtable-scrolled-down': (layout?.scrollTop ?? 0) > 0,
            'scrollbar-hover': scrollbarHover,
        }];
        const children: ComponentChildren[] = [];
        if (layout) {
            this.#plugins.forEach(plugin => {
                const result = plugin.onRender?.call(this, layout);
                if (!result) {
                    return;
                }
                if (result.style) {
                    Object.assign(style, result.style);
                }
                if (result.className) {
                    classNames.push(result.className);
                }
                if (result.children) {
                    children.push(result.children);
                }
            });
        }

        return (
            <div
                id={this.#id}
                className={classes(classNames)}
                style={style}
                ref={this.ref}
            >
                {layout && this.#renderHeader(layout)}
                {layout && this.#renderRows(layout)}
                {layout && this.#renderFooter(layout)}
                {layout && this.#renderScrollBars(layout)}
            </div>
        );
    }
}
