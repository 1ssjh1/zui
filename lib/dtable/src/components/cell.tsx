import {ComponentChildren} from 'preact';
import {JSX} from 'preact/jsx-runtime';
import {classes, ClassNameLike} from '@zui/browser-helpers/src/classes';
import {ColInfo} from '../types/col-info';

export interface CellProps {
    col: ColInfo,
    className?: ClassNameLike,
    height?: number,
    style?: JSX.CSSProperties,
    html?: {__html: string},
    children?: ComponentChildren,
}

export function Cell({col, className, height, style, children, html, ...others}: CellProps) {
    const finalStyle = {
        left: col.left,
        width: col.realWidth,
        height,
        ...style,
        ...col.cellStyle,
    };
    if (col.align) {
        finalStyle.textAlign = col.align;
    }
    return (
        <div
            className={classes('dtable-cell', col.className, className)}
            style={finalStyle}
            {...others}
            data-col={col.name}
            dangerouslySetInnerHTML={html}
        >
            {children}
        </div>
    );
}
