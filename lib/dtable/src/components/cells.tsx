import {classes} from '@zui/browser-helpers/src/classes';
import {Cell} from './cell';

type CellsProps = {
    row: RowInfo;
    cols: ColInfo[];
} & Partial<{
    className: ClassNameLike;
    left: number;
    top: number;
    width: number;
    height: number;
    CellComponent: preact.ComponentType<CellProps>;
    onRenderCell: CellRenderCallback;
}>;

export function Cells({row, className, top = 0, left = 0, width, height, cols, CellComponent = Cell, onRenderCell}: CellsProps) {
    return (
        <div className={classes('dtable-cells', className)} style={{top, left, width, height}}>
            {
                cols.map(col => {
                    if (!col.visible) {
                        return null;
                    }
                    return (
                        <CellComponent
                            key={col.name}
                            col={col}
                            row={row}
                            onRenderCell={onRenderCell}
                        />
                    );
                })
            }
        </div>
    );
}
