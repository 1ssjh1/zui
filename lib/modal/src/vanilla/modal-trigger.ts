import {ComponentBase} from '@zui/com-helpers/src/helpers/vanilla-component';
import type {ModalOptions, ModalTriggerOptions} from '../types';
import {Modal} from './modal';
import {ModalBase} from './modal-base';

export class ModalTrigger extends ComponentBase<ModalTriggerOptions> {
    static NAME = 'ModalTrigger';

    static EVENTS = true;

    static TOGGLE_SELECTOR = '[data-toggle="modal"]';

    #modal?: ModalBase;

    get modal() {
        return this.#modal;
    }

    get container() {
        const {container} = this.options;
        if (typeof container === 'string') {
            return document.querySelector(container) as HTMLElement;
        }
        if (container instanceof HTMLElement) {
            return container;
        }
        return document.body;
    }

    show() {
        const modal = this.#initModal();
        return modal.show();
    }

    hide() {
        this.#modal?.hide();
    }

    #getBuilderOptions(): ModalOptions {
        const {
            container,
            ...others
        } = this.options;
        const builderOptions = others as ModalOptions;
        const href = this.element.getAttribute('href') || '';
        if (!builderOptions.type) {
            if ((builderOptions.target || href[0] === '#')) {
                builderOptions.type = 'static';
            } else {
                builderOptions.type = builderOptions.type || ((builderOptions.url || href) ? 'ajax' : 'custom');
            }
        }
        if (!builderOptions.url && (builderOptions.type === 'iframe' || builderOptions.type === 'ajax') && href[0] !== '#') {
            builderOptions.url = href;
        }

        return builderOptions;
    }

    #initModal() {
        const options = this.#getBuilderOptions();
        let modal = this.#modal;
        if (modal) {
            modal.setOptions(options);
        } else if (options.type === 'static') {
            modal = new ModalBase(this.#getStaticModalElement(), options);
            this.#modal = modal;
        } else {
            modal = new Modal(this.container, options);
            this.#modal = modal;
        }
        return modal;
    }

    #getStaticModalElement() {
        let selector = this.options.target as (string | undefined);
        if (!selector) {
            const {element} = this;
            if (element.tagName === 'A') {
                const href = element.getAttribute('href');
                if (href?.startsWith('#')) {
                    selector = href;
                }
            }
        }
        return this.container.querySelector<HTMLElement>(selector || '.modal') as HTMLElement;
    }
}

window.addEventListener('click', (event: MouseEvent) => {
    const element = event.target as HTMLElement;
    const toggleBtn = element.closest?.<HTMLElement>(ModalTrigger.TOGGLE_SELECTOR);
    if (toggleBtn) {
        const modalTrigger = ModalTrigger.ensure(toggleBtn) as ModalTrigger;
        if (modalTrigger) {
            modalTrigger.show();
        }
    }
});
