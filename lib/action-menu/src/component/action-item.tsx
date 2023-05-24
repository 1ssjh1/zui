import {Attributes, ComponentType, h as _h} from 'preact';
import {classes} from '@zui/browser-helpers/src/classes';
import {renderIcon} from '@zui/com-helpers/src/helpers/render-icon';
import {ActionItemProps} from '../types/action-item-props';

export function ActionItem({
    component = 'a',
    className,
    children,
    attrs,
    url,
    disabled,
    active,
    icon,
    text,
    target,
    trailingIcon,
    hint,
    onClick,
    ...others
}: ActionItemProps) {
    const finalChildren = [
        renderIcon(icon),
        <span className="text">{text}</span>,
        typeof children === 'function' ? children() : children,
        renderIcon(trailingIcon),
    ];
    return _h(component as ComponentType, {
        className: classes(className, {disabled, active}),
        title: hint,
        [component === 'a' ? 'href' : 'data-url']: url,
        [component === 'a' ? 'target' : 'data-target']: target,
        onClick,
        ...others,
        ...attrs,
    } as Attributes, ...finalChildren);
}
