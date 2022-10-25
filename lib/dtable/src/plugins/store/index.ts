import {Store} from '@zui/store/src/store';
import {definePlugin} from '../../helpers/shared-plugins';

import type {DTablePluginTypes, DTableWithPlugin, DTablePlugin} from '../../types/plugin';

export interface DTableStoreTypes extends DTablePluginTypes {
    options: Partial<{
        store: boolean;
    }>;
    data: {
        store: Store;
    },
}

export type DTableStore = DTableWithPlugin<DTableStoreTypes>;

export const store: DTablePlugin<DTableStoreTypes> = {
    name: 'store',
    defaultOptions: {
        store: true,
    },
    when: options => !!options.store,
    data() {
        return {store: new Store(this.id)};
    },
};

const plugin = definePlugin(store);

export default plugin;
