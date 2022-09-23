type DTable = import('../dtable-react').DTable;

type DTableState = {
    scrollTop: number;
    scrollLeft: number;
    [prop: string]: unknown;
};

type DTableEventType = keyof HTMLElementEventMap;

type DTableEventListener<K extends DTableEventType = DTableEventType, T extends DTable = DTable> = (this: T, evt: HTMLElementEventMap[K]) => void | false;

type DTableLayout = {
    width: number;
    height: number;
    rowHeight: number;
    rowsHeight: number;
    rowsHeightTotal: number;
    allRows: RowInfo[];
    rows: RowInfo[];
    header: boolean | preact.ComponentChildren | ((layout: DTableLayout, state: DTableState) => (preact.ComponentChildren | {__html: string}));
    footer: boolean | preact.ComponentChildren | ((layout: DTableLayout, state: DTableState) => (preact.ComponentChildren | {__html: string}));
    headerHeight: number,
    footerHeight: number,
    colsMap: Record<string, ColInfo>;
    colsInfo: {
        fixedLeftCols: ColInfo[];
        fixedRightCols: ColInfo[];
        scrollCols: ColInfo[];
        flexLeftWidth: number;
        scrollWidth: number;
        flexRightWidth: number;
        scrollWidthTotal: number;
    };

    visibleRows: RowInfo[];
    scrollTop: number;
    scrollLeft: number;
};
