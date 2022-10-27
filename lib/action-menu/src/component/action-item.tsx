import {classes} from '@zui/browser-helpers/src/classes';
import {Attributes, ComponentType, h as _h} from 'preact';
import {ActionItem as ActionItemProps} from '../types/action-item';

export function ActionItem({
    // type,
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
}: ActionItemProps) {
    const finalChildren = [
        typeof icon === 'string' ? <i class={`icon ${icon}`} /> : icon,
        <span className="text">{text}</span>,
        children,
        typeof trailingIcon === 'string' ? <i class={`icon ${trailingIcon}`} /> : trailingIcon,
    ];
    return _h(component as ComponentType, {
        className: classes(className, {disabled, active}),
        title: hint,
        [component === 'a' ? 'href' : 'data-url']: url,
        [component === 'a' ? 'target' : 'data-target']: target,
        ...attrs,
    } as Attributes, ...finalChildren);
}
