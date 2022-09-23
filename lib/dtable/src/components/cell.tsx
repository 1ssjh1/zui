import {h as _h} from 'preact';
import {classes} from '@zui/browser-helpers/src/classes';

import type {ComponentChildren, JSX} from 'preact';

export type CellProps = {
    col: ColInfo;
    row: RowInfo;
} & Partial<{
    height: number;
    className: ClassNameLike;
    style: JSX.CSSProperties;
    outerClass: ClassNameLike;
    outerStyle: JSX.CSSProperties;
    children: ComponentChildren;
    onRenderCell: CellRenderCallback;
}>;

export function Cell({col, className, height, row, onRenderCell, style: styleFromParent, outerStyle: outerStyleFromParent, children: childrenFromParent, outerClass, ...others}: CellProps) {
    const outerStyle = {
        left: col.left,
        width: col.realWidth,
        height,
        ...outerStyleFromParent,
    };
    const {align, border} = col.setting;
    const contentStyle = {
        justifyContent: align ? (align === 'left' ? 'start' : (align === 'right' ? 'end' : align)) : undefined,
        ...col.setting.cellStyle,
        ...styleFromParent,
    };
    const outerClassName: ClassNameLike[] = ['dtable-cell', outerClass, col.setting.className, {
        'has-border-left': border === true || border === 'left',
        'has-border-right': border === true || border === 'right',
    }];
    const contentClassName: ClassNameLike[] = ['dtable-cell-content', className];

    const defaultResult: CustomRenderResult = [childrenFromParent ?? row.data?.[col.name] ?? ''];
    const result: CustomRenderResult = onRenderCell ? onRenderCell(defaultResult, {row, col}, _h) : defaultResult;

    const outerChildren: ComponentChildren[] = [];
    const contentChildren: ComponentChildren[] = [];
    const outerAttrs: JSX.HTMLAttributes<HTMLDivElement> = {};
    const contentAttrs: JSX.HTMLAttributes<HTMLDivElement> = {};
    result?.forEach(item => {
        if (typeof item === 'object' && item && ('html' in item || 'className' in item || 'style' in item || 'attrs' in item)) {
            const children = item.outer ? outerChildren : contentChildren;
            if (item.html) {
                children.push(<div className={classes('dtable-cell-html', item.className)} style={item.style} dangerouslySetInnerHTML={{__html: item.html}} {...(item.attrs ?? {})}></div>);
            } else {
                if (item.style) {
                    Object.assign(item.outer ? outerStyle : contentStyle, item.style);
                }
                if (item.className) {
                    (item.outer ? outerClassName : contentClassName).push(item.className);
                }
                if (item.children) {
                    children.push(item.children);
                }
                if (item.attrs) {
                    Object.assign(item.outer ? outerAttrs : contentAttrs, item.attrs);
                }
            }
        } else {
            contentChildren.push(item);
        }
    });

    return (
        <div
            className={classes(outerClassName)}
            style={outerStyle}
            data-col={col.name}
            {...others}
            {...outerAttrs}
        >
            {
                contentChildren.length > 0 && (<div className={classes(contentClassName)} style={contentStyle} {...contentAttrs}>
                    {contentChildren}
                </div>)
            }
            {outerChildren}
        </div>
    );
}
