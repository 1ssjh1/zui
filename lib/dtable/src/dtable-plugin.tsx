import {createRef, render} from 'preact';
import {DTableOptions} from './types/options';
import {DTable, getDefaultOptions} from './dtable';

export class DTablePlugin {
    element: HTMLElement;

    options: DTableOptions;

    ref = createRef();

    constructor(element: HTMLElement, options?: Partial<DTableOptions>) {
        this.element = element;
        this.options = {...getDefaultOptions(), ...options};
        if (this.options.cols.length) {
            this.render();
        }
    }

    render(options?: Partial<DTableOptions>) {
        this.options = Object.assign(this.options, options);
        render((
            <DTable ref={this.ref} {...this.options} />
        ), this.element);
    }
}
