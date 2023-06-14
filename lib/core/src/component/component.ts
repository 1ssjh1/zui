import {i18n} from '../i18n';
import {$, Element, Selector} from '../cash';
import type {ComponentEventArgs, ComponentEventName, ComponentOptions, ComponentEvents, ComponentEventsDefnition} from './types';

/**
 * The event callback for component.
 */
export type ComponentEventCallback<E extends ComponentEventsDefnition, O extends {}, N extends ComponentEventName<E>> = (event: N extends keyof HTMLElementEventMap ? HTMLElementEventMap[N] : Event, args: [Component<O, E>, ComponentEventArgs<E, N>]) => void | false;

/**
 * The component base class.
 */
export class Component<O extends {} = {}, E extends ComponentEventsDefnition = {}, U extends Element = Element> {
    /**
     * The default options.
     */
    static DEFAULT = {};

    /**
     * The component name.
     * It usually equals to the class name.
     * The name must be provided in subclass.
     */
    static NAME = this.name;

    /**
     * Whether the component supports multiple instances.
     */
    static MULTI_INSTANCE = false;

    /**
     * Component data key, like "zui.menu"
     */
    static get KEY(): `zui.${string}` {
        return `zui.${this.NAME}`;
    }

    /**
     * Component namespace, like ".zui.menu"
     */
    static get NAMESPACE(): `.${string}.zui` {
        return `.${this.NAME}.zui`;
    }

    static get DATA_KEY(): `data-zui-${string}` {
        return `data-zui-${this.NAME}`;
    }

    /**
     * Access to static properties via this.constructor.
     *
     * @see https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146
     */
    declare ['constructor']: typeof Component<O, E, U>;

    /**
     * Store the component options.
     */
    #options?: ComponentOptions<O>;

    /**
     * Store the component element.
     */
    #element?: U;

    /**
     * The component global ID.
     */
    #gid: number;

    /**
     * The component key.
     */
    #key: string | number;

    /**
     * The component constructor.
     *
     * @param options The component initial options.
     */
    constructor(element: Selector, options?: Partial<ComponentOptions<O>>) {
        const {KEY, DATA_KEY, DEFAULT, MULTI_INSTANCE} = this.constructor;
        const $element = $(element);
        if ($element.data(KEY) && !MULTI_INSTANCE) {
            throw new Error('[ZUI] The component has been initialized on element.');
        }

        const gid = $.guid++;
        this.#gid = gid;
        this.#element = $element[0] as U;

        $element.on('DOMNodeRemovedFromDocument', () => {
            this.destroy();
        });

        this.#options = {...DEFAULT, ...$element.dataset()} as ComponentOptions<O>;
        this.setOptions(options);
        this.#key = this.options.key ?? `__${gid}`;

        $element.data(KEY, this).attr(DATA_KEY, `${gid}`);
        if (MULTI_INSTANCE) {
            const dataName = `${KEY}:ALL`;
            let instanceMap = $element.data(dataName);
            if (!instanceMap) {
                instanceMap = new Map();
                $element.data(dataName, instanceMap);
            }
            instanceMap.set(this.#key, this);
        }

        this.init();
        requestAnimationFrame(() => {
            this.emit('inited', this.options);
            this.afterInit();
        });
    }

    /**
     * Get the component element.
     */
    get element() {
        return this.#element!;
    }

    get key() {
        return this.#key;
    }

    /**
     * Get the component options.
     */
    get options() {
        return this.#options!;
    }

    /**
     * Get the component global id.
     */
    get gid() {
        return this.#gid;
    }

    /**
     * Get the component element as a jQuery like object.
     */
    get $element() {
        return $(this.element);
    }

    /**
     * Initialize the component.
     */
    init() {}

    /**
     * Do something after the component initialized.
     */
    afterInit() {}

    /**
     * Render the component.
     *
     * @param options The component options to override before render.
     */
    render(options?: Partial<ComponentOptions<O>>) {
        this.setOptions(options);
    }

    /**
     * Destroy the component.
     */
    destroy() {
        const {NAMESPACE, KEY, DATA_KEY, MULTI_INSTANCE} = this.constructor;
        this.$element
            .off(NAMESPACE)
            .removeData(KEY)
            .attr(DATA_KEY, null);

        if (MULTI_INSTANCE) {
            const map = this.$element.data(`${KEY}:ALL`) as Map<string | number, Component<O, E>>;
            if (map) {
                map.delete(this.#key);
            }
        }

        this.#options = undefined;
        this.#element = undefined;

        (this.emit as ((event: string, ...args: unknown[]) => void))('destroyed');
    }

    /**
     * Set the component options.
     *
     * @param options  The component options to set.
     * @returns The component options.
     */
    setOptions(options?: Partial<ComponentOptions<O>>) {
        if (options) {
            $.extend(this.#options, options);
        }
        return this.#options;
    }

    /**
     * Emit a component event.
     * @param event  The event name.
     * @param args   The event arguments.
     */
    emit<N extends ComponentEventName<E>>(event: N, ...args: ComponentEventArgs<E, N>): Event {
        const eventObject = $.Event(this.constructor.wrapEventNames(event));
        this.$element.trigger(eventObject, [this, ...args]);
        return eventObject as unknown as Event;
    }

    /**
     * Listen to a component event.
     *
     * @param event     The event name.
     * @param callback  The event callback.
     */
    on<N extends ComponentEventName<E>>(event: N, callback: ComponentEventCallback<E, O, N>) {
        this.$element.on(this.constructor.wrapEventNames(event), callback);
    }

    /**
     * Listen to a component event.
     *
     * @param event     The event name.
     * @param callback  The event callback.
     */
    one<N extends ComponentEventName<E>>(event: N, callback: ComponentEventCallback<E, O, N>) {
        this.$element.one(this.constructor.wrapEventNames(event), callback);
    }

    /**
     * Stop listening to a component event.
     * @param event     The event name.
     * @param callback  The event callback.
     */
    off<N extends ComponentEventName<E>>(event: N, callback?: ComponentEventCallback<E, O, N>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.$element.off(this.constructor.wrapEventNames(event), callback as any);
    }

    /**
     * Get the i18n text.
     *
     * @param key           The i18n key.
     * @param defaultValue  The default value if the key is not found.
     */
    i18n(key: string, defaultValue?: string): string;

    /**
     * Get the i18n text.
     *
     * @param key          The i18n key.
     * @param args         The i18n arguments.
     * @param defaultValue The default value if the key is not found.
     */
    i18n(key: string, args?: (string | number)[] | Record<string, string | number>, defaultValue?: string): string;

    /**
     * Get the i18n text.
     *
     * @param key          The i18n key.
     * @param args         The i18n arguments or the default value.
     * @param defaultValue The default value if the key is not found.
     * @returns            The i18n text.
     */
    i18n(key: string, args?: string | (string | number)[] | Record<string, string | number>, defaultValue?: string): string {
        return i18n(this.options.i18n, key, args, defaultValue, this.options.lang, this.constructor.NAME) ?? i18n(this.options.i18n, key, args, defaultValue, this.options.lang) ?? `{i18n:${key}}`;
    }

    /**
     * Wrap event names with component namespace.
     *
     * @param names The event names.
     * @returns     The wrapped event names.
     */
    private static wrapEventNames(names: string): string {
        return names.split(' ').map(name => name.includes('.') ? name : `${name}${this.NAMESPACE}`).join(' ');
    }

    /**
     * Get the component instance of the given element.
     *
     * @param this     Current component constructor.
     * @param selector The component element selector.
     * @returns        The component instance.
     */
    static get<O extends {}, E extends ComponentEvents, U extends Element, T extends typeof Component<O, E, U>>(this: T, selector: Selector, key?: string | number): InstanceType<T> | undefined {
        const $element = $(selector);
        if (this.MULTI_INSTANCE && key !== undefined) {
            const instanceMap = $element.data(`${this.KEY}:ALL`);
            if (instanceMap) {
                return instanceMap.get(key);
            }
            return;
        }
        return $element.data(this.KEY);
    }

    /**
     * Ensure the component instance of the given element.
     *
     * @param this      Current component constructor.
     * @param selector  The component element selector.
     * @param options   The component options.
     * @returns         The component instance.
     */
    static ensure<O extends {}, E extends ComponentEvents, U extends Element, T extends typeof Component<O, E, U>>(this: T, selector: Selector, options?: Partial<ComponentOptions<O>>): InstanceType<T> {
        const instance = this.get(selector, options?.key);
        if (instance) {
            if (options) {
                instance.setOptions(options);
            }
            return instance;
        }
        return new this(selector, options) as InstanceType<T>;
    }

    /**
     * Get all component instances.
     *
     * @param this     Current component constructor.
     * @param selector The component element selector.
     * @returns        All component instances.
     */
    static getAll<O extends {}, E extends ComponentEvents, U extends Element, T extends typeof Component<O, E, U>>(this: T, selector?: Selector): InstanceType<T>[] {
        const {MULTI_INSTANCE, DATA_KEY} = this;
        const list: InstanceType<T>[] = [];
        $(selector || document)
            .find(`[${DATA_KEY}]`)
            .each((_, element) => {
                if (MULTI_INSTANCE) {
                    const instanceMap = $(element).data(`${this.KEY}:ALL`);
                    if (instanceMap) {
                        list.push(...instanceMap.values());
                    } else {
                        list.push($(element).data(this.KEY));
                    }
                }
            });
        return list;
    }

    /**
     * Query the component instance.
     *
     * @param this     Current component constructor.
     * @param selector The component element selector.
     * @returns        The component instance.
     */
    static query<O extends {}, E extends ComponentEvents, U extends Element, T extends typeof Component<O, E, U>>(this: T, selector?: Selector, key?: string | number): InstanceType<T> | undefined {
        if (selector === undefined) {
            return this.getAll().sort((a, b) => a.gid - b.gid)[0];
        }
        return this.get($(selector).closest(`[${this.DATA_KEY}]`), key);
    }

    /**
     * Create cash fn.method for current component.
     *
     * @param name The method name.
     */
    static defineFn(name?: string) {
        $.fn.extend({
            [name || this.NAME.replace(/(^[A-Z]+)/, (match) => {
                return match.toLowerCase();
            })](options: Partial<ComponentOptions<{}>> | string, ...args: unknown[]) {
                return this.each((_: number, element: Element) => {
                    const component = this.ensure(element, typeof options === 'object' ? options : undefined);
                    if (typeof options === 'string') {
                        component[options]?.(...args);
                    }
                });
            },
        });
    }
}
