import {definePlugin} from '../../helpers/shared-plugins';

type DTableColHoverTypes = {
    options: Partial<{
        colHover: boolean | 'header';
    }>,
};

type DTableColHover = DTableWithPlugin<DTableColHoverTypes>;

function applyColHover(table: DTableColHover, hoverCol?: string | false) {
    if (hoverCol !== undefined) {
        table.setCache('hoverCol', hoverCol);
    } else {
        hoverCol = table.getCache('hoverCol');
    }
    const {current} = table.ref;
    if (!current) {
        return;
    }
    const hoverClass = 'dtable-col-hover';
    current.querySelectorAll(`.${hoverClass}`).forEach(col => col.classList.remove(hoverClass));
    if (typeof hoverCol === 'string' && hoverCol.length) {
        current.querySelectorAll(`.dtable-cell[data-col="${hoverCol}"]`).forEach(x => x.classList.add(hoverClass));
    }
}

export const colHover: DTablePlugin<DTableColHoverTypes> = {
    name: 'col-hover',
    defaultOptions: {
        colHover: false,
    },
    events: {
        mouseover(event: Event) {
            const {colHover: hover} = this.options;
            if (!hover) {
                return;
            }

            const cellElement = (event.target as HTMLElement)?.closest<HTMLElement>('.dtable-cell');
            if (!cellElement) {
                return;
            }
            if (hover === 'header' && !cellElement.closest('.dtable-header')) {
                return;
            }
            const colName = cellElement?.getAttribute('data-col') ?? false;
            applyColHover(this, colName);
        },
        mouseleave() {
            applyColHover(this, false);
        },
    },
};

export default definePlugin(colHover, {buildIn: true});
