import {classes} from '@zui/browser-helpers/src/classes';
import {Cell} from './cell';
import {Cells} from './cells';

export function Row({
    rowID,
    className,
    top,
    height,
    fixedLeftCols,
    fixedRightCols,
    scrollCols,
    flexLeftWidth,
    scrollWidth,
    scrollWidthTotal,
    flexRightWidth,
    scrollLeft,
    CellComponent = Cell,
    onRenderCell,
    data,
    style,
    ...others
}: RowProps) {
    let flexLeftView = null;
    if (fixedLeftCols?.length) {
        flexLeftView = (
            <Cells
                className="dtable-fixed-left"
                cols={fixedLeftCols}
                width={flexLeftWidth}
                rowID={rowID}
                CellComponent={CellComponent}
                onRenderCell={onRenderCell}
                data={data}
            />
        );
    }

    let scrollableView = null;
    if (scrollCols?.length) {
        scrollableView = (
            <Cells
                className="dtable-flexable"
                cols={scrollCols}
                left={flexLeftWidth - scrollLeft}
                width={scrollWidthTotal}
                rowID={rowID}
                CellComponent={CellComponent}
                onRenderCell={onRenderCell}
                data={data}
            />
        );
    }

    let flexRightView = null;
    if (fixedRightCols?.length) {
        flexRightView = (
            <Cells
                className="dtable-fixed-right"
                cols={fixedRightCols}
                left={flexLeftWidth + scrollWidth}
                width={flexRightWidth}
                rowID={rowID}
                CellComponent={CellComponent}
                onRenderCell={onRenderCell}
                data={data}
            />
        );
    }

    const finalStyle = {top, height, lineHeight: `${height - 2}px`, ...style};

    return (
        <div
            className={classes('dtable-row', className)}
            style={finalStyle}
            data-id={rowID}
            {...others}
        >
            {flexLeftView}
            {scrollableView}
            {flexRightView}
        </div>
    );
}
