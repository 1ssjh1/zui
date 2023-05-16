import type {h as _h} from 'preact';
import type {ColSetting, ColInfo} from './col';
import type {CustomRenderResultList} from './common';
import type {RowInfo} from './row';

export type CellRenderCallback<C = ColSetting> = (
    result: CustomRenderResultList,
    data: {
        row: RowInfo,
        col: ColInfo<C>,
        value: unknown,
    },
    h: typeof _h,
) => CustomRenderResultList;

export type CellValueGetter = (row: RowInfo, col: ColInfo, originValue: unknown) => unknown;
