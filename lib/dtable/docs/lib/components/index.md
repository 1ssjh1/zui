# 数据表格

数据表格是一种展示二维数据的强大方式，相比较普通的[表格（`<table>`）组件](/lib/components/table/)，提供了更多的交互形式，并且拥有插件机制方便定制复杂交互的界面。

## 示例

### 基本功能

下面的示例中展示了数据表格的基本功能，包括：

* 在固定区域内展示数据，超出部分可以滚动查看；
* 滚动时固定两侧的列和表头；
* 根据设定的列宽显示列；
* 虚拟渲染（仅渲染可见范围内的单元格）；
* 根据列设置调整单元格对齐方式。

<Example>
  <div id="dtable-basic"></div>
</Example>

### 增强功能

下面的示例中展示了通过内置插件以及定制化选项实现的增强功能，包括：

* 在表头显示排序标记；
* 行选中交互；
* 多层级数据结构，支持展开折叠；
* 特殊交互和外观，包括：鼠标悬停效果、隔行变色、完整边框等；
* 丰富的单元格渲染格式，包括链接、头像、环形进度条，格式化文本和操作按钮等。

<Example>
  <div id="dtable-advanced"></div>
</Example>

## 使用

**1. 定义表格的列**

通过一个对象数组依次序定义数据表格中的所有列，每个对象定义一个列，通过对象上的 `name` 属性来区分不同的列。例如：

```js
const cols = [
    {name: 'id', title: 'ID', width: 60, fixed: 'left', sortType: 'down'},
    {name: 'project', title: '项目名称', width: 200, fixed: 'left'},
    {name: 'manager', title: '负责人', width: 60, flex: 1},
    {name: 'storyPoints', title: '需求规模', width: 80, align: 'center'},
    {name: 'executionCounts', title: '执行数', width: 70, align: 'center'},
    {name: 'investedDays', title: '已投入', width: 70, align: 'center'},
    {name: 'startDate', title: '开始日期', width: 90, align: 'center'},
    {name: 'finishDate', title: '完成日期', width: 90, align: 'center'},
    {name: 'progress', title: '进度', width: 65, align: 'center'},
    {name: 'actions', title: '操作', width: 100, sortType: false, fixed: 'right', onRenderCell: renderActions}, // renderActions 为单元格自定义渲染方法
]
```

列的定义所有可用属性参见 [章节“列定义”](#列定义)。

**2. 定义行数据**

通过一个对象数组定义表格的每行要进行展示的数据，数据使用一个对象定义，必须包含 `id` 属性用于区分，并且通常包含列定义中的所有列名属性。例如：

```js
const data = [
    {id: 1, project: '禅道开源版', manager: '李明', storyPoints: 1024, executionCounts: 42, investedDays: 32, startDate: '2022-05-03', finishDate: '2022-09-20', progress: 55, actions: ['start', 'edit', 'close']},
    ...
]
```

**3. 定义用于展示数据表格的元素**

在页面上预先使用一个元素来展示数据表格，通常使用一个 `<div>`：

```html
<div id="myDtable"></div>
```

**4. 初始化数据表格组件**

创建一个 `zui.DTable` 实例来对数据表格组件进行初始化，初始化时需要依次指定用于展示数据表格的元素和初始化选项：

```js
const dtable = new zui.DTable(element, options);
// dtable 为数据表格组件实例，后续可以调用相关方法
```

**完整示例代码如下：**

```html
<div id="myDtable"></div>

<script>
// 获取一个 div 用于初始化数据表格
const element = document.getElementById('myDtable');

// 定义一个方法用于渲染操作列单元格内的操作按钮
const renderActions = (result, rowID, col, rowData) => {
    return [{
        html: rowData[col.name].map(action => {
            const actionNames = {start: '开始', close: '关闭', edit: '编辑'};
            return `<a href="#action=${action}">${actionNames[action] || action}</a>`;
        }).join(' '),
    }];
};

// 定义数据表格初始化选项
const options = {
    height: 400,
    width: '100%',
    cols: [
        {name: 'id', title: 'ID', width: 60, fixed: 'left'},
        {name: 'project', title: '项目名称', width: 200, fixed: 'left'},
        {name: 'manager', title: '负责人', width: 60, flex: 1},
        {name: 'storyPoints', title: '需求规模', width: 80, align: 'center'},
        {name: 'executionCounts', title: '执行数', width: 70, align: 'center'},
        {name: 'investedDays', title: '已投入', width: 70, align: 'center'},
        {name: 'startDate', title: '开始日期', width: 90, align: 'center'},
        {name: 'finishDate', title: '完成日期', width: 90, align: 'center'},
        {name: 'progress', title: '进度', width: 65, align: 'center'},
        {name: 'actions', title: '操作', width: 100, fixed: 'right', onRenderCell: renderActions}, // renderActions 为单元格自定义渲染方法
    ],
    data: [
        {id: 1, project: '禅道开源版', manager: '李明', storyPoints: 1024, executionCounts: 42, investedDays: 32, startDate: '2022-05-03', finishDate: '2022-09-20', progress: 55, actions: ['start', 'edit', 'close']},
        ...
    ],
    striped: false
};

// 初始化数据表格
const dtable = new zui.DTable(element, options);
</script>
```

## 布局

### 宽和高

通常选项 `width` 和 `height` 选项来指定表格的总体宽和高，除了指定数字来使用固定尺寸还可以使用如下几个特殊值：

| 宽或高的特殊值      | 定义  |
| ------------- | ----- |
| `'auto'`      | 只能作为高度值，最终高度为表头、表尾和所有行的高度相加，此时数据表格不会出现垂直滚动条 |
| `'100%'`      | 设置宽度或高度与父级容器的宽高一致 |
| `() => 'auto' \| number`      | 指定一个函数来在每次渲染时动态返回值 |
| `{min: number, max: number}`      | 仅高度可用，指定数据表格的最小和最大高度 |

默认情况下宽度为 `'100%'`，高度为 `'auto'`。

下面的示例中，表格的宽度为 `'100%'`，高度为 `{min: 200, max: 300}`。

<Example>
  <div id="dtable-layout-size"></div>
</Example>

### 响应式

通过选项 `responsive` 来让数据表格获得响应式特性：当数据表格所属的父级容器尺寸发生变化时，自动根据尺寸定义重新渲染。

<Example>
  <div id="dtable-responsive"></div>
</Example>

```js
new zui.DTable(element, {
    responsive: true,
    width: '100%',
    height: 'auto',
    cols: [...],
    data: [...],
});
```

::: tip 提示
当启用响应式特性时，确保宽度或高度使用了响应式的特殊值，例如 `'100%'` 或通过函数动态确定。
:::

### 列宽

列宽通常在每一列的定义对象上进行定义，可以通过如下几个属性控制：

| 列定义      | 定义  |
| ------------- | ----- |
| `width` | 通过数值精确指定列的宽度 |
| `minWidth` | 指定列的最小宽度 |
| `maxWidth` | 指定列的最大宽度 |
| `flex` | 指定列的宽度弹性系数，当有列宽需要动态确定时，弹性系数用于决定当前列可以分得的宽度比例，弹性系数值为 `2` 的列宽度通常为弹性系数值为 `1` 列的两倍，当需要平分宽度时，可以将值全部设置为 `1` |

除了单独指定每一列的宽度，还可以通过初始化选项全局指定默认的列宽属性：

| 选项名称      | 定义  |
| ------------- | ----- |
| `defaultColWidth` | 默认的列宽，当列定义没有指定时，使用此列宽 |
| `minColWidth` | 默认情况下列的最小宽度 |
| `maxColWidth` | 默认情况下列的最大宽度 |

<Example>
  <div id="dtable-flex"></div>
</Example>

```js
new zui.DTable(element, {
    width: '100%',
    height: 'auto',
    cols: [
        {name: 'id', title: 'ID', width: 60, fixed: 'left'},
        {name: 'project', title: '项目名称', flex: 3},
        {name: 'investedDays', title: '已投入', flex: 2, align: 'center'},
        {name: 'progress', title: '进度', flex: 1, align: 'center'},
    ],
    data: [...],
});
```

::: tip 提示
当为数据表格启用响应式特性时或自适应的宽度值（例如 `'100%'`）时，确保所有没有固定在两侧的列中至少有一列启用了弹性宽度（指定了列定义上的 `flex` 属性），否则可能在所有指定的列宽度总和少于数据表格整体宽度的情况下右侧会出现空白区域。
:::

### 固定两侧的列

通过为列定义设置 `fixed` 属性来将列固定显示，可选值包括 `'left'`（固定在左侧）和 `'right'` 固定在右侧。所有未被固定的列会在中间展示，当中间可用宽度不足时允许横向滚动查看。

<Example>
  <div id="dtable-cols-fixed"></div>
</Example>

```js
new zui.DTable(element, {
    width: '100%',
    height: 'auto',
    cols: [
        {name: 'id', title: 'ID', width: 60, fixed: 'left'},
        {name: 'project', title: '项目名称', minWidth: 300},
        {name: 'investedDays', title: '已投入', flex: 2, align: 'center'},
        {name: 'progress', title: '进度', flex: 1, align: 'center'},
        {name: 'actions', title: '操作', width: 120, fixed: 'right'},
    ],
    data: [...],
});
```

::: tip 提示
应该避免将所有列都被设置为固定在两侧，否则当数据表格总体宽度大于所有固定的列时，中间部分会出现空白。
:::

### 表头

**表头高度**

通过选项 `headerHeight` 来自定义表头高度，默认高度与行高 `rowHeight` 设置一致（行高默认值为 `35`）。

<Example>
  <div id="dtable-header-height"></div>
</Example>

```js
new zui.DTable(element, {
    headerHeight: 50,
    cols: [...],
    data: [...],
});
```

**隐藏表头**

通过设置选项 `header` 为 `false` 来隐藏表头展示。

<Example>
  <div id="dtable-header-hidden"></div>
</Example>

```js
new zui.DTable(element, {
    header: false,
    cols: [...],
    data: [...],
});
```

**定制表头背景色**

通过 CSS 变量 `--dtable-header-bg` 来设置表头背景色。

<Example>
  <div id="dtable-header-custom"></div>
</Example>

<style>
#dtable-header-custom {
  --dtable-header-bg: #ddeeff;
}
</style>

```css
#myDtable {
  --dtable-header-bg: #ddeeff;
}
```

### 行高

通过选项 `rowHeight` 来设置行高，默认高度为 `35`。

<Example>
  <div id="dtable-row-height"></div>
</Example>

```js
new zui.DTable(element, {
    rowHeight: 50,
    cols: [...],
    data: [...],
});
```

::: tip 提示
为了提升在虚拟渲染时的效率，目前所有行高必须一致。可以通过插件机制实现动态行高。
:::

## 外观

### 排序标记

在不启用插件的情况下，数据表格不支持对数据进行排序等交互，但支持根据列的设定在表头上显示排序标记。要启用排序标记可以通过列定义对象上的 `sortType` 属性来实现，可以使用如下值：

| `sortType` 值      | 定义  |
| ------------- | ----- |
| `false`      | 不显示排序标记 |
| `true`      | 显示排序标记，但此列尚未启用排序 |
| `up`      | 显示按升序排序标记 |
| `down`      | 显示降升序排序标记 |

<Example>
  <div id="dtable-sort-type"></div>
</Example>

```js
new zui.DTable(element, {
    cols: [
        {name: 'id', title: 'ID', width: 60, fixed: 'left', sortType: 'up'},
        {name: 'project', title: '项目名称', flex: 3, fixed: false, sortType: false},
        {name: 'investedDays', title: '已投入', flex: 2, align: 'center', sortType: false},
        {name: 'progress', title: '进度', flex: 1, align: 'center', sortType: false},
    ],
    data: [...],
});
```

### 鼠标悬停效果

数据表格支持通过选项分别对行、列和单元格启用鼠标悬停效果。相关选项如下：

| 选项      | 定义  |
| ------------- | ----- |
| `rowHover`      | 如果设置为 `true`，则对鼠标下的整行启用鼠标悬停效果，默认为 `true` |
| `colHover`      | 如果设置为 `true`，则对鼠标下的整列启用鼠标悬停效果，使用特殊值 `'header'` 可以让整列悬停效果仅在表头上触发，默认为 `false` |
| `cellHover`      | 如果设置为 `true`，则对鼠标下的单元格启用鼠标悬停效果，默认为 `false` |

<Example>
  <div id="dtable-hover-effection"></div>
</Example>

```js
new zui.DTable(element, {
    rowHover: true,
    colHover: true,
    cellHover: true,
    cols: [...],
    data: [...],
});
```

::: tip 提示
在启用列鼠标悬停效果时，如果希望单独去掉某一列的鼠标悬停效果，可以在此列定义对象上设置 `colHover` 属性为 `false`。
:::

**定制鼠标悬停背景色**

通过 CSS 变量 `--dtable-hover-bg` 来设置鼠标悬停背景色。

<Example>
  <div id="dtable-hover-effection-custom"></div>
</Example>

<style>
#dtable-hover-effection-custom {
  --dtable-hover-bg: rgba(255, 0, 255, .1);
}
</style>

```css
#myDtable {
  --dtable-hover-bg: rgba(255, 0, 255, .1);
}
```

### 隔行变色

通过设置选项 `striped` 为 `true` 来启用表格隔行变色效果。

<Example>
  <div id="dtable-striped"></div>
</Example>

```js
new zui.DTable(element, {
    striped: true,
    cols: [...],
    data: [...],
});
```

**定制隔行背景色**

通过 CSS 变量 `--dtable-striped-bg` 来设置鼠标悬停背景色。

<Example>
  <div id="dtable-striped-custom"></div>
</Example>

<style>
#dtable-striped-custom {
  --dtable-striped-bg: #ddeeff;
}
</style>

```css
#myDtable {
  --dtable-striped-bg: #ddeeff;
}
```

### 完整边框

通过设置选项 `bordered` 为 `true` 来启用完整边框外观。

<Example>
  <div id="dtable-bordered"></div>
</Example>

```js
new zui.DTable(element, {
    bordered: true,
    cols: [...],
    data: [...],
});
```

**定制边框颜色**

通过 CSS 变量 `--dtable-border-color` 来设置边框颜色。

<Example>
  <div id="dtable-bordered-custom"></div>
</Example>

<style>
#dtable-bordered-custom {
  --dtable-border-color: #333;
}
</style>

```css
#myDtable {
  --dtable-border-color: #333;
}
```

### 滚动条

数据表格在可用区域内无法显示完整内容时允许通过滚动条滚动查看。滚动条由[自定义滚动条](/js/ui/scrollbar/)组件实现。可以通过如下选项来设置滚动条外观：

| 选项      | 定义  |
| ------------- | ----- |
| `scrollbarHover`      | 如果设置为 `true`，则只在鼠标悬停到表格区域时显示滚动条，否则只要有滚动条会固定显示，默认为 `true` |
| `scrollbarSize`      | 设置滚动条的大小，决定水平滚动条的高度和垂直滚动条的宽度，默认为 `10` |
| `horzScrollbarPos`      | 设置水平滚动条显示位置，可以为 `outside`（显示在表格底部外侧）和 `inside`（显示在表格底部内侧），默认为 `outside` |

<Example>
  <div id="dtable-scrollbar"></div>
</Example>

```js
new zui.DTable(element, {
    scrollbarHover: true,
    scrollbarSize: 15,
    horzScrollbarPos: 'inside',
    cols: [...],
    data: [...],
});
```

**设置滚动条样式**

可以通过设置 CSS 变量来个性化设置滚动条的外观，详情参见[自定义滚动条](/js/ui/scrollbar/)组件文档。

<Example>
  <div id="dtable-scrollbar-custom"></div>
</Example>

<style>
#dtable-scrollbar-custom {
  --scrollbar-opacity:   1;
  --scrollbar-bg:        var(--color-primary-400);
  --scrollbar-shadow:    inset 0 0 0 1px rgba(var(--color-inverse-rgb), .05);
  --scrollbar-bar-bg:    var(--color-primary-900);
  --scrollbar-hover-bg:  var(--color-primary-800);
  --scrollbar-drag-bg:   var(--color-secondary-800);
  --scrollbar-radius:    9999px;
  --scrollbar-duration:  1s;
}
</style>

```css
#myDtable {
  --scrollbar-opacity:   1;
  --scrollbar-bg:        var(--color-primary-400);
  --scrollbar-shadow:    inset 0 0 0 1px rgba(var(--color-inverse-rgb), .05);
  --scrollbar-bar-bg:    var(--color-primary-900);
  --scrollbar-hover-bg:  var(--color-primary-800);
  --scrollbar-drag-bg:   var(--color-secondary-800);
  --scrollbar-radius:    9999px;
  --scrollbar-duration:  1s;
}
```

### 单元格样式

在列定义对象上允许通过如下属性设置单元格样式：

| 属性      | 定义  |
| ------------- | ----- |
| `align`      | 设置该列上所有单元格的内容对齐方式，允许的值包括：`'left'`（左侧对齐）、 `'center'`（居中对齐） 和 `'right'`（右侧对齐） |
| `style`      | 通过一个 CSS 样式属性对象设置表头单元格的样式 |
| `cellStyle`  | 通过一个 CSS 样式属性对象设置该列单元格的样式 |

<Example>
  <div id="dtable-cell-style"></div>
</Example>

```js
new zui.DTable(element, {
    cols: [
        {name: 'id', title: 'ID', width: 60, fixed: 'left', sortType: 'down', style: {color: 'var(--color-danger-500)'}},
        {name: 'project', title: '项目名称', flex: 3, fixed: false, cellStyle: {fontWeight: 'bold', color: 'var(--color-primary-500)'}},
        {name: 'progress', title: '进度', flex: 1, align: 'center'},
        {name: 'actions', title: '操作', flex: 2, align: 'center', cellStyle: {justifyContent: 'end'}},
    ],
    data: [...],
});
```

## 行选中交互

数据表格的行选中交互由内置插件 `checkable` 提供，要启用该插件需要通过选项 `plugins` 添加插件使用声明：

```js
new zui.DTable(element, {
  plugins: ['checkable'],
  ...
});
```

启用 `checkable` 插件之后，可以额外使用如下初始化选项：

| 选项      | 定义  |
| ------------- | ----- |
| `checkable`      | 如果为 `true` 则启用行选中交互，默认为 `true` |
| `checkOnClickRow` | 如果为 `true` 则点击行时切换该行的选中状态，否则只能通过点击复选框实现切换 |
| `onCheckChange`  | 指定一个回调函数在行选中状态变更时执行 |

要为列添加切换选中复选框，可以在此列定义对象上设置 `checkbox` 属性为 `true`。

<Example>
  <div id="dtable-checkable"></div>
</Example>

```js
new zui.DTable(element, {
    plugins: ['checkable'],
    checkOnClickRow: true,
    cols: [
        {name: 'id', title: 'ID', width: 60, fixed: 'left', sortType: 'down', checkbox: true},
        ...
    ],
    data: [...],
    onCheckChange: (changes) => {
        console.log('选中状态变更', changes);
    }
});
```

## 多层级数据结构

多层级数据结构支持和交互实现由内置插件 `nested` 提供，要启用该插件需要通过选项 `plugins` 添加插件使用声明：

```js
new zui.DTable(element, {
  plugins: ['nested'],
  ...
});
```

启用 `nested` 插件之后，可以额外使用如下初始化选项：

| 选项      | 定义  |
| ------------- | ----- |
| `nested`      | 如果为 `true` 则启用多层级数据结构支持，默认为 `true` |
| `nestedParentKey` | 设置行数据对象上用于标记当前行所属父级行 ID 的属性名，默认为 `'parent'` |
| `asParentKey` | 设置行数据对象上用于标记当前行为父级行的属性名，默认为 `'asParent'` |
| `nestedIndent` | 设置层级之间的缩进大小，默认为 `12` |
| `onRenderNestedToggle` | 设置渲染层级展开折叠切换按钮时的回调函数，可以通过此回调函数自定义渲染切换按钮 |
| `onNestedChange`  | 指定一个回调函数在层级展开折叠状态变更时执行 |

要为列添加折叠展开操作按钮和应用层级缩进，可以在此列定义对象上设置 `nestedToggle` 属性为 `true`。

<Example>
  <div id="dtable-nested"></div>
</Example>

```js
new zui.DTable(element, {
    plugins: ['nested'],
    cols: [
        ...
        {name: 'project', title: '项目名称', flex: 3, fixed: false, nestedToggle: true},
        ...
    ],
    data: [...],
    onNestedChange: (changes) => {
        console.log('折叠展开状态变更了', changes);
    }
});
```

## 自定义渲染

数据表格支持如下选项来对行和单元格的渲染进行定制：

| 选项      | 定义  |
| ------------- | ----- |
| `onRenderCell`      | 渲染每行上的单元格时的回调函数 |
| `onRenderHeaderCell` | 渲染表头上的单元格时的回调函数 |

以上选项的详细用法参见[选项](#选项)章节。

针对每个特定的列，可以在列定义对象上通过如下属性自定义渲染：

| 属性      | 定义  |
| ------------- | ----- |
| `onRenderCell`      | 渲染此列上的单元格时的回调函数 |

下面的例子中通过 `onRenderCell` 对“操作”列上进行了自定渲染，以通过图标按钮的形式显示操作：

<Example>
  <div id="dtable-render-cell"></div>
</Example>

```js
new zui.DTable(element, {
    cols: [...],
    data: [...],
    onRenderCell(result, _rowID, col, rowData) {
        if (col.name === 'actions') {
            return [{
                html: rowData[col.name].map(action => {
                    if (action === 'start') {
                        return `<a href="#action=${action}" title="开始" class="btn square primary-pale size-sm"><i class="icon icon-play"></i></a>`;
                    }
                    if (action === 'edit') {
                        return `<a href="#action=${action}" title="编辑" class="btn square primary-pale size-sm"><i class="icon icon-pencil"></i></a>`;
                    }
                    if (action === 'close') {
                        return `<a href="#action=${action}" title="编辑" class="btn square primary-pale size-sm"><i class="icon icon-off"></i></a>`;
                    }
                    return `<a href="#action=${action}">${action}</a>`;
                }).join(' '),
            }];
        }
        return result;
    },
});
```

## 单元格类型

单元格类型需要在列定义对象通过 `type` 属性指定，不同的列可以设置为相同的类型，可以通过自定义渲染方式以及插件机制对特定类型的单元进行自定义。

**预置的单元格类型**

内置插件 `rich` 预置了一些单元格类型，通过指定类型可以为单元格应用丰富的格式，目前支持如下类型：

| 单元格类型      | 定义  |
| ------------- | ----- |
| `html`      | 将单元格内容作为 HTML 渲染 |
| `format`      | 将单元格内容通过预设格式化方式输出 |
| `link` | 将单元格内容渲染为可点击的链接 |
| `avatar` | 在单元格内显示用户头像 |
| `progress` | 在单元格内显示为环形进度条 |
| `actionButtons` | 在单元格内显示操作按钮 |
| `label` | 将单元格内容显示为标签 |

## 插件机制

数据表格支持插件机制，通过插件可以对数据表格的功能进行增强，目前内置了如下插件：

| 插件名称      | 定义  |
| ------------- | ----- |
| `checkable`      | 支持行选中 |
| `nested` | 支持层级数据结构 |
| `rich` | 支持预设单元格类型 |

通过选项 `plugins` 来指定要启用的插件，例如：

```js
new zui.DTable({
    plugins: ['checkable', 'nested', 'rich']
    ...,
});
```

可以通过 `zui.DTable.definePlugin(pluginSetting)` 方法来定义新的插件，参数 `pluginSetting` 为插件定义对象，详细定义参考[插件定义](#插件定义)。

## CSS 变量

| 变量      | 定义  | 默认值 |
| ------------- | ----- | ----- |
| `--dtable-striped-bg` | 隔行背景色 | `var(--color-gray-100)` |
| `--dtable-hover-bg` | 鼠标悬停背景色 | `rgba(var(--color-gray-500-rgb), .1)` |
| `--dtable-header-bg` | 表头背景色 | `var(--color-surface)` |
| `--dtable-border-color` | 边框颜色 | `var(--color-border)` |
| `--dtable-sorter-size` | 排序标记大小 | `0.3125rem`

## API

### 初始化选项

```ts
interface DTableOptions {
    id?: string;
    lang?: string;
    i18n?: Record<string, Record<string, string | object>>;
    className?: ClassNameLike,
    parent?: HTMLElement,
    plugins?: DTablePluginLike[];

    cols: ColSetting[];
    data: (RowData | string)[] | number;
    rowDataGetter?: (ids: string[]) => RowData[],
    cellValueGetter?: CellValueGetter,
    rowKey?: string;

    rowHover?: boolean;
    colHover?: boolean | 'header';
    cellHover?: boolean;
    bordered?: boolean;
    striped?: boolean;

    width: number | '100%' | 'auto' | ((this: DTable, actualWidth: number) => number | 'auto');
    height: number | '100%' | 'auto' | {min: number, max: number} | ((this: DTable, actualHeight: number) => number | 'auto' | {min: number, max: number});
    rowHeight: number;
    defaultColWidth: number;
    minColWidth: number;
    maxColWidth: number;
    header?: boolean | CustomRenderResultList<[layout: DTableLayout], DTable> | CustomRenderResultGenerator<[layout: DTableLayout], DTable> | CustomRenderResultItem;
    footer?: boolean | CustomRenderResultList<[layout: DTableLayout], DTable> | ((this: DTable, layout: DTableLayout) => CustomRenderResultList<[layout: DTableLayout], DTable>);
    headerHeight: number;
    footerHeight: number;
    responsive: boolean;
    scrollbarHover: boolean;
    scrollbarSize?: number;
    horzScrollbarPos?: 'inside' | 'outside';

    onLayout?: (this: DTable, layout: DTableLayout) => (DTableLayout | undefined);
    onScroll?: (this: DTable, scrollInfo: {scrollTop?: number, scrollLeft?: number}) => void;
    onRenderCell?: CellRenderCallback;
    onRenderHeaderCell?: CellRenderCallback;
    afterRender?: (this: DTable) => void;
    onRowClick?: (this: DTable, event: MouseEvent, data: {rowID: string, rowInfo?: RowInfo, element: HTMLElement, cellElement?: HTMLElement}) => void | true;
    onCellClick?: (this: DTable, event: MouseEvent, data: {rowID: string, colName: string, rowInfo?: RowInfo, element: HTMLElement}) => void | true;
    onHeaderCellClick?: (this: DTable, event: MouseEvent, data: {colName: string, element: HTMLElement}) => void;
    onAddRow?: (this: DTable, row: RowInfo, index: number) => void | false;
    onAddRows?: (this: DTable, rows: RowInfo[]) => RowInfo[] | void;
}
```

### 列定义

```ts
interface ColSetting {
    name: ColName;
    title?: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    flex?: ColFlex;
    fixed?: ColFixedSide;
    border?: 'left' | 'right' | boolean;
    align?: 'left' | 'center' | 'right';
    data?: Record<string, unknown>;
    style?: preact.JSX.CSSProperties;
    cellStyle?: preact.JSX.CSSProperties;
    className?: ClassNameLike;
    type?: string;
    hidden?: boolean;
    colHover?: boolean;
    onRenderCell?: CellRenderCallback<ColSetting>;
}

type ColName = string;

type ColFlexGrow = number;

type ColFlex = ColFlexGrow | boolean;

type ColFixedSide = 'left' | 'right' | false;
```

### 行数据定义

```ts
type RowID = string;

type RowPropName = string;

type RowPropValue = unknown;

type RowData = Record<RowPropName, RowPropValue>;
```

### 插件定义

```ts
type DTablePlugin<T extends DTablePluginTypes = DTablePluginTypes, D extends DTablePluginTypes[] = [], PluginTable = DTableWithPlugin<T, D>, Options = DTableWithPluginOptions<T, D>, PluginColSetting = DTableWithPluginColSetting<T, D>, PluginColInfo = DTableWithPluginColInfo<T, D>> = {
    name: DTablePluginName;
} & Partial<{
    when: (options: Options) => boolean,
    defaultOptions: Partial<Options>;
    colTypes: Record<string, Partial<PluginColSetting> | PluginColSettingModifier<T, D>>;
    events: DTablePluginEvents<T, D> | ((this: PluginTable) => DTablePluginEvents<T, D>);
    methods: Readonly<T['methods']>,
    i18n?: Record<string, Record<string, string | object>>;
    data: (this: PluginTable) => {} & T['data'],
    state: (this: PluginTable) => {} & T['state'],
    options: (this: PluginTable, options: Options) => Partial<Options>;
    footer: Record<string, CustomRenderResultGenerator<[layout: DTableLayout], PluginTable> | CustomRenderResultItem>;
    onCreate: (this: PluginTable, plugin: DTablePlugin<T, D>) => void;
    onMounted: (this: PluginTable) => void;
    onUpdated: (this: PluginTable) => void;
    onUnmounted: (this: PluginTable) => void;
    onDestory: (this: PluginTable) => void;
    onAddCol: (this: PluginTable, col: PluginColInfo) => void;
    beforeLayout: (this: PluginTable, options: Options) => (Partial<Options> | void);
    onLayout: (this: PluginTable, layout: DTableLayout) => (DTableLayout | void);
    onRenderHeaderCell: (this: PluginTable, result: CustomRenderResultList, data: {row: RowInfo, col: PluginColInfo, value?: unknown}, h: typeof preact.h) => CustomRenderResultList;
    onRenderCell: (this: PluginTable, result: CustomRenderResultList, data: {row: RowInfo, col: PluginColInfo, value?: unknown}, h: typeof preact.h) => CustomRenderResultList;
    onRender: (this: PluginTable, layout: DTableLayout) => CustomRenderResultItem | void;
    afterRender: (this: PluginTable) => void;
    onRowClick: (this: PluginTable, event: MouseEvent, data: {rowID: string, rowInfo?: RowInfo, element: HTMLElement, cellElement?: HTMLElement}) => void | true;
    onCellClick: (this: PluginTable, event: MouseEvent, data: {rowID: string, colName: string, rowInfo?: RowInfo, element: HTMLElement}) => void | true;
    onHeaderCellClick: (this: PluginTable, event: MouseEvent, data: {colName: string, element: HTMLElement}) => void;
    onAddRow: (this: PluginTable, row: RowInfo, index: number) => void | false;
    onAddRows: (this: PluginTable, rows: RowInfo[]) => RowInfo[] | void;
    plugins: (DTablePluginLike | DTablePlugin<T, D>)[];
}>;
```
### 方法

```ts
interface DTable {
  options: DTableOptions<ColSetting>;

  plugins: DTablePlugin[];

  layout: DTableLayout;

  id: string;

  data: Record<string, unknown>;

  parent: HTMLElement;

  scroll(info: {scrollLeft?: number, scrollTop?: number, offsetLeft?: number, offsetTop?: number, to?: 'up' | 'down' | 'end' | 'home' | 'left' | 'right' | 'left-begin' | 'right-end'}, callback?: (this: DTable, result: boolean) => void): boolean;

  getColInfo(colNameOrIndex?: ColInfoLike): ColInfo | undefined;

  getRowInfo(idOrIndex?: RowInfoLike): RowInfo | undefined;

  getCellValue(row: RowInfo | string | number, col: ColInfo | string | number): unknown;

  getRowInfoByIndex(index: number): RowInfo | undefined;

  getPointerInfo(event: Event): DTablePointerInfo | undefined;

  update(options: {dirtyType?: 'options' | 'layout', state?: Partial<DTableState>} | (() => void) = {}, callback?: () => void);

  updateLayout(): void;

  render(): void;
}
```

<script>
import index from './index.js';
export default index;
</script>
