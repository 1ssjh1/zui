import {ComponentType, h as _h, JSX} from 'preact';
import {DTableLayout} from './layout';
import {DTableOptions} from './options';
import {ColInfo} from './col-info';
import {DTable} from '../dtable-react';
import {RowInfo} from './row-info';
import {RowProps} from './row-props';
import {CustomRenderResult} from './custom-render-result';
import {RowData, RowID} from './row-data';
import {DTableState} from './state';
import {ColSetting} from './col-setting';

export type PluginColSetting<C> = ColSetting & C;

export type PluginColInfo<C> = ColInfo<PluginColSetting<C>>;

export type ColSettingModifier<C> = (col: PluginColSetting<C>) => Partial<PluginColSetting<C>> | void;

export type DTableWithPlugin<O = {}, S = {}, C = {}> = DTable & {
    state: S & DTableState;
    options: O & DTableOptions;
    getColInfo: (name: string) => ColInfo<ColSetting & C> | undefined;
};

export interface DTablePlugin<O = {}, S = {}, C = {}, T = {}, PluginTable = DTableWithPlugin<O, S, C> & T, Options = DTableOptions<PluginColSetting<C>> & O> {
    name: string;
    when?: (options: Options) => boolean,
    onCreate?: (this: PluginTable, plugin: this) => void;
    onMounted?: (this: PluginTable) => void;
    onUnmounted?: (this: PluginTable) => void;
    defaultOptions?: Partial<Options>;
    options?: ((options: Options) => Partial<Options>);
    colTypes?: Record<string, Partial<PluginColSetting<C>> | ColSettingModifier<C>>;
    onAddCol?: (this: PluginTable, col: PluginColInfo<C>) => void;
    beforeLayout?: (this: PluginTable, options: Options) => (Options | void);
    onLayout?: (this: PluginTable, layout: DTableLayout) => (DTableLayout | void);
    onRenderHeaderCell?: (this: PluginTable, result: CustomRenderResult, data: {rowID: RowID, col: PluginColInfo<C>}, h: typeof _h) => CustomRenderResult;
    onRenderCell?: (this: PluginTable, result: CustomRenderResult, data: {rowID: RowID, col: PluginColInfo<C>, rowData?: RowData}, h: typeof _h) => CustomRenderResult;
    onRenderRow?: (this: PluginTable, data: {props: RowProps, row: RowInfo}, h: typeof _h) => Partial<RowProps | (RowProps & JSX.HTMLAttributes<HTMLElement>)> | void;
    onRenderHeaderRow?: (this: PluginTable, data: {props: RowProps}, h: typeof _h) => RowProps;
    afterRender?: (this: PluginTable) => void;
    onRowClick?: (this: PluginTable, event: MouseEvent, data: {rowID: string, rowInfo?: RowInfo, element: HTMLElement, cellElement?: HTMLElement}) => void | true;
    onCellClick?: (this: PluginTable, event: MouseEvent, data: {rowID: string, colName: string, rowInfo?: RowInfo, element: HTMLElement, rowElement: HTMLElement}) => void | true;
    onHeaderCellClick?: (this: PluginTable, event: MouseEvent, data: {colName: string, element: HTMLElement}) => void;
    onAddRow?: (this: PluginTable, row: RowInfo, index: number) => void | false;
    onAddRows?: (this: PluginTable, rows: RowInfo[]) => RowInfo[] | void;
    plugins?: string[]
}

export interface DTablePluginComsumer<O = {}> {
    plugin: DTablePlugin<O>,
    (options?: DTableOptions & O): DTablePlugin<O>;
}
