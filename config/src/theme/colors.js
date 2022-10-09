const shades = require('tailwindcss/colors');

// 语义化调色板 - Semantic palettes
// ==================================

/** 主要：主题的、可链接、正常 */
const primary = shades.blue;

/** 次要：次级、常态的 */
const secondary = shades.sky;

/** 成功：完成、积极 */
const success = shades.green;

/** 关注：提示、重点 */
const warning = shades.amber;

/** 警告：提示、异常、警醒 */
const danger = shades.red;

/** 重要：优先 */
const important = shades.pink;

/** 特殊：触动、激情 */
const special = shades.purple;

/** 灰色 */
const gray = shades.slate;


// 特殊颜色 - Special Colors
// ======================

/** 继承 */
const inherit = shades.inherit;

/** 当前 */
const current = shades.current;

/** 透明 */
const transparent = shades.transparent;

/** 纯黑 */
const black = shades.black;

/** 纯白 */
const white = shades.white;


// UI 调色板 - UI palettes
// ======================

/** 画布（页面背景） */
const canvas = white;

/** 画布反色 */
const inverse = black;

/** 控件背景 */
const surface = gray[100];

/** 文本 */
const fore = gray[800];

/** 焦点 */
const focus = primary[300];

/** 链接 */
const link = primary[500];

/** 链接（hover） */
const linkHover = primary[600];

/** Border */
const border = gray[200];

module.exports = {
    gray,
    primary,
    secondary,
    success,
    warning,
    danger,
    important,
    special,

    inherit,
    transparent,
    current,
    black,
    white,

    canvas,
    inverse,
    surface,
    fore,
    focus,
    link,
    'link-hover': linkHover,
    border,
};
