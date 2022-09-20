type DTablePluginLike = string | DTablePlugin | DTablePluginComsumer;

type DTablePluginTypes = {
    state?: {},
    options?: {},
    props?: {},
    col?: {},
};

type DTableWithPluginColSetting<T extends DTablePluginTypes = {}> = ColSetting<T['col']>;

type DTableWithPluginState<T extends DTablePluginTypes = {}> = DTableState & T['state'];

type DTableWithPluginOptions<T extends DTablePluginTypes = {}> = DTableOptions<DTableWithPluginColSetting<T>> & T['options'];

type DTableWithPluginColInfo<T extends DTablePluginTypes = {}> = ColInfo<DTableWithPluginColSetting<T>>;

type PluginColSettingModifier<T extends DTablePluginTypes = {}> = (col: DTableWithPluginColSetting<T>) => Partial<DTableWithPluginColSetting<T>> | undefined;

type DTableWithPlugin<T extends DTablePluginTypes = {}> = DTable & {
    state: DTableWithPluginState<T>;
    options: DTableWithPluginOptions<T>;
    getColInfo: (name: string) => DTableWithPluginCol<T> | undefined;
} & T['props'];

type DTablePlugin<T extends DTablePluginTypes = DTablePluginTypes, PluginTable = DTableWithPlugin<T>, Options = DTableWithPluginOptions<T>, PluginColSetting = DTableWithPluginColSetting<T>, PluginColInfo = DTableWithPluginColInfo<T>> = {
    name: string;
} & Partial<{
    when: (options: Options) => boolean,
    onCreate: (this: PluginTable, plugin: this) => void;
    onMounted: (this: PluginTable) => void;
    onUnmounted: (this: PluginTable) => void;
    defaultOptions: Partial<Options>;
    options: ((options: Options) => Partial<Options>);
    colTypes: Record<string, Partial<PluginColSetting> | PluginColSettingModifier<T>>;
    events: Partial<Record<DTableEventType, DTableEventListener<Event, PluginTable>>>;
    onAddCol: (this: PluginTable, col: PluginColInfo) => void;
    beforeLayout: (this: PluginTable, options: Options) => (Partial<Options> | void);
    onLayout: (this: PluginTable, layout: DTableLayout) => (DTableLayout | void);
    onRenderHeaderCell: (this: PluginTable, result: CustomRenderResult, data: {rowID: RowID, col: PluginColInfo}, h: typeof preact.h) => CustomRenderResult;
    onRenderCell: (this: PluginTable, result: CustomRenderResult, data: {rowID: RowID, col: PluginColInfo, rowData?: RowData}, h: typeof preact.h) => CustomRenderResult;
    onRenderRow: (this: PluginTable, data: {props: RowProps, row: RowInfo}, h: typeof preact.h) => Partial<RowProps | (RowProps & preact.JSX.HTMLAttributes<HTMLElement>)> | void;
    onRenderHeaderRow: (this: PluginTable, data: {props: RowProps}, h: typeof preact.h) => RowProps;
    afterRender: (this: PluginTable) => void;
    onRowClick: (this: PluginTable, event: MouseEvent, data: {rowID: string, rowInfo?: RowInfo, element: HTMLElement, cellElement?: HTMLElement}) => void | true;
    onCellClick: (this: PluginTable, event: MouseEvent, data: {rowID: string, colName: string, rowInfo?: RowInfo, element: HTMLElement, rowElement: HTMLElement}) => void | true;
    onHeaderCellClick: (this: PluginTable, event: MouseEvent, data: {colName: string, element: HTMLElement}) => void;
    onAddRow: (this: PluginTable, row: RowInfo, index: number) => void | false;
    onAddRows: (this: PluginTable, rows: RowInfo[]) => RowInfo[] | void;
    plugins: DTablePluginLike[];
}>;

interface DTablePluginComsumer<T extends DTablePluginTypes = {}> {
    plugin: DTablePlugin<T>,
    (options?: DTableWithPluginOptions<T>): DTablePlugin<T>;
}

interface DTablePluginDefineOptions {
    override?: boolean;
    buildIn?: boolean;
}
