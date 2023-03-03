import {Component} from 'preact';
import {classes} from '@zui/browser-helpers/src/classes';
import type {JSXInternal} from 'preact/src/jsx';

type TabsProp = {
    activeKey?: string | number;
    animated?: boolean;
    items: Array<{
        key: number | string;
        label: string;
        content: string | JSXInternal.Element;
        isElm?: boolean;
    }>;
    className?: string;
    contentClass?: string;
};

type TabsState = {
    activeKey: number | string;
};

export default class Tabs extends Component<TabsProp, TabsState> {
    constructor(props: TabsProp) {
        super(props);

        this.state = {
            activeKey: props.activeKey ?? props.items[0].key,
        };
    }

    handleChange = (key: string | number) => {
        this.setState({activeKey: key});
    };

    render() {
        const {items, className, contentClass} = this.props;
        const {activeKey} = this.state;

        return (
            <div className={classes('zui-tabs', className)}>
                <ul className="-flex -items-center">
                    {
                        items.map(({key, label}) => (
                            <li key={key} className={classes('-flex -items-center -gap-3', {active: activeKey === key})}>
                                <a className="-flex -h-8 -items-center -justify-center -gap-1 -px-4 -text-inherit" onClick={() => this.handleChange(key)}>{label}</a>
                            </li>
                        ))
                    }
                </ul>
                {
                    items.map(x => {
                        const {key, content, isElm} = x;
                        if (isElm) {
                            return <div
                                key={key}
                                dangerouslySetInnerHTML={{__html: content as string}}
                                className={classes('-px-3', '-py-2', {'-hidden': activeKey !== key})}
                            ></div>;
                        }

                        return <div key={key} className={classes(contentClass, {'-hidden': activeKey !== key})}>{content}</div>;
                    })
                }
            </div>
        );
    }
}
