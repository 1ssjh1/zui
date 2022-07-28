# 下拉菜单

将动作或菜单折叠到下拉菜单中。

## 基本用法

点击按钮，展开更多操作。如需默认展开，可在`.dropdown`类上添加`.open`类

<Example class="flex gap-4">
  <div class="dropdown open">
    <button class="btn" type="button" data-toggle="dropdown">菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
  </div>
</Example>

```html
<div class="dropdown open">
    <button class="btn" type="button" data-toggle="dropdown">菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
</div>
```

## 鼠标悬停展开菜单

添加类名`.dropdown-hover`实现鼠标悬停展开菜单

<Example class="flex gap-4">
  <div class="dropdown dropdown-hover">
    <button class="btn" type="button" data-toggle="dropdown">鼠标悬停展开菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
  </div>
</Example>

```html
<div class="dropdown dropdown-hover">
    <button class="btn" type="button" data-toggle="dropdown">鼠标悬停展开菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
</div>
```

## 浮动方向

为`.dropdown` 类添加 `.-up` 类时下拉菜单在触发元素上方弹出。
为 `.dorpdown-menu` 类添加` .-right` 类可以使得下拉菜单的右侧与触发元素的右侧对齐。

<Example class="flex gap-4">
  <div class="dropdown -up">
    <button class="btn" type="button" data-toggle="dropdown">上方左侧对齐 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
  </div>

  <div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">下方左侧对齐 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
  </div>

  <div class="dropdown -up -right">
    <button class="btn" type="button"
        data-toggle="dropdown">上方右侧对齐 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
  </div>

  <div class="dropdown -right">
    <button class="btn" type="button"
        data-toggle="dropdown">下方右侧对齐 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
  </div>
</Example>

```html
<div class="dropdown -up">
    <button class="btn" type="button" data-toggle="dropdown">上方左侧对齐 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
</div>

<div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">下方左侧对齐 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
</div>

<div class="dropdown -up -right">
    <button class="btn" type="button"
        data-toggle="dropdown">上方右侧对齐 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
</div>

<div class="dropdown -right">
    <button class="btn" type="button"
        data-toggle="dropdown">下方右侧对齐 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li><a href="###">更多操作</a></li>
    </ul>
</div>
```

## 多级子菜单

在` .dropdown-menu` 内的` <li> `内包含另一个` .dropdown-menu` 从而实现多级子菜单。包含子菜单的 `<li>` 需要添加额外的类` .dropdown-submenu`。
一般情况下子菜单会在菜单项的右侧显示，但也可以为作为子菜单的` .dropdown-menu` 类添加` .-left` 类来使得子菜单在左侧显示

<Example class="flex gap-4">
  <div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li class="dropdown-submenu">
            <a href="###">打开</a>
            <ul class="dropdown-menu">
                <li><a href="###">运行</a></li>
                <li><a href="###">在终端中打开</a></li>
                <li><a href="###">在编辑器中打开</a></li>
            </ul>
        </li>
        <li class="dropdown-submenu">
            <a href="###">一组操作</a>
            <ul class="dropdown-menu">
                <li class="dropdown-submenu">
                    <a href="###">修改</a>
                    <ul class="dropdown-menu">
                        <li><a href="###">修改标题</a></li>
                        <li><a href="###">更新内容</a></li>
                        <li><a href="###">转移</a></li>
                    </ul>
                </li>
                <li class="dropdown-submenu">
                    <a href="###">删除</a>
                    <ul class="dropdown-menu">
                        <li><a href="###">移动到回收站</a></li>
                        <li><a href="###">直接删除</a></li>
                    </ul>
                </li>
                <li><a href="###">撤销</a></li>
            </ul>
        </li>
        <li class="dropdown-submenu">
            <a href="###">另一组操作</a>
            <ul class="dropdown-menu">
                <li><a href="###">评审</a></li>
                <li><a href="###">计划</a></li>
                <li><a href="###">关闭</a></li>
            </ul>
        </li>
        <li class="dropdown-submenu">
            <a href="###">在左侧显示</a>
            <ul class="dropdown-menu -left">
                <li><a href="###">复制</a></li>
                <li><a href="###">粘贴</a></li>
                <li><a href="###">剪切</a></li>
            </ul>
        </li>
    </ul>
  </div>
</Example>

```html
<div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li class="dropdown-submenu">
            <a href="###">打开</a>
            <ul class="dropdown-menu">
                <li><a href="###">运行</a></li>
                <li><a href="###">在终端中打开</a></li>
                <li><a href="###">在编辑器中打开</a></li>
            </ul>
        </li>
        <li class="dropdown-submenu">
            <a href="###">一组操作</a>
            <ul class="dropdown-menu">
                <li class="dropdown-submenu">
                    <a href="###">修改</a>
                    <ul class="dropdown-menu">
                        <li><a href="###">修改标题</a></li>
                        <li><a href="###">更新内容</a></li>
                        <li><a href="###">转移</a></li>
                    </ul>
                </li>
                <li class="dropdown-submenu">
                    <a href="###">删除</a>
                    <ul class="dropdown-menu">
                        <li><a href="###">移动到回收站</a></li>
                        <li><a href="###">直接删除</a></li>
                    </ul>
                </li>
                <li><a href="###">撤销</a></li>
            </ul>
        </li>
        <li class="dropdown-submenu">
            <a href="###">另一组操作</a>
            <ul class="dropdown-menu">
                <li><a href="###">评审</a></li>
                <li><a href="###">计划</a></li>
                <li><a href="###">关闭</a></li>
            </ul>
        </li>
        <li class="dropdown-submenu">
            <a href="###">在左侧显示</a>
            <ul class="dropdown-menu -left">
                <li><a href="###">复制</a></li>
                <li><a href="###">粘贴</a></li>
                <li><a href="###">剪切</a></li>
            </ul>
        </li>
    </ul>
</div>
```

## 自定义菜单

通常情况下下拉菜单列表使用` <ul>` 元素，你也可以替换为其他元素或内容

<Example class="flex gap-4">
  <div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">自定义下拉菜单 <span class="caret"></span></button>
    <div class="dropdown-menu dropdown-menu-table">
        <p class="px-3">自定义内容</p>
    </div>
  </div>
</Example>

```html
<div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">自定义下拉菜单 <span class="caret"></span></button>
    <div class="dropdown-menu dropdown-menu-table">
        <p class="px-3">自定义内容</p>
    </div>
</div>
```

## 禁用的菜单项

为菜单项` <li> `添加` .-disabled` 类即可获得禁用外观。

<Example class="flex gap-4">
  <div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li class="-disabled"><a href="###">被禁用的操作</a></li>
    </ul>
  </div>
</Example>

```html
<div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="###">操作</a></li>
        <li class="-disabled"><a href="###">被禁用的操作</a></li>
    </ul>
</div>
```

## 标题和分割线

在 `.dropdown-menu` 内使用 `.dropdown-header `来显示标题，使用 `.divider` 来显示分割线。

<Example class="flex gap-4">
  <div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li class="dropdown-header">下拉菜单标题</li>
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li class="divider"></li>
        <li class="dropdown-header">更多操作</li>
        <li><a href="###">修改</a></li>
    </ul>
  </div>
</Example>

```html
<div class="dropdown">
    <button class="btn" type="button"
        data-toggle="dropdown">菜单按钮 <span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li class="dropdown-header">下拉菜单标题</li>
        <li><a href="###">操作</a></li>
        <li><a href="###">另一个操作</a></li>
        <li class="divider"></li>
        <li class="dropdown-header">更多操作</li>
        <li><a href="###">修改</a></li>
    </ul>
</div>
```

## CSS 类

按钮提供了如下 CSS 类：

| 类        | 类型           | 作用  |
| -------------|:-------------:| ----- |
| `dropdown`         | 实体类 | 元素作为下拉菜单组件 |
| `caret`            | 实体类 | 元素作为下拉菜单icon图标 |
| `-up`              | 修饰类 | 下拉框浮动方向为上方 |
| `-right`           | 修饰类 |   下拉框展开后右侧对齐 |
| `dropdown-menu`    | 实体类 | 元素作为下拉菜单列表 |
| `-left`            | 下拉菜单列表修饰类|   子菜单左侧显示 |
| `dropdown-submenu` | 实体类 | 元素作为下拉菜单子菜单列表 |
| `-disabled`        | li修饰类 | 列表项禁用 |