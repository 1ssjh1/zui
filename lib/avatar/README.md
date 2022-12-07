# Avatar 头像

## 头像组件

```html:example: -flex -gap-3
<div id="avatar1"></div>
<div id="avatar2"></div>
<div id="avatar3"></div>
<div id="avatar4" data-src="@/assets/avatar.png"></div>
<div id="avatar5" data-src="@/assets/avatar.png"></div>
<div id="avatar6" data-src="@/assets/avatar.png"></div>
```

```js
new Avatar('#avatar1', {
    text: "User",
    code: 12,
    circle: true,
});
new Avatar('#avatar2', {
    text: "李",
    size: 20,
    circle: true,
});
new Avatar('#avatar3', {
    text: "韩梅梅",
    size: 20,
    circle: true,
});
new Avatar('#avatar4', {});
new Avatar('#avatar5', {
    rounded: 'lg',
});
new Avatar('#avatar6', {
    rounded: "lg",
    size: "lg",
});
```

## Avatar

```html:example: -flex -gap-3
<div class="avatar"><img src="@/assets/avatar.png"></div>
```

## Rounded

```html:example: -flex -gap-3
<div class="avatar circle"><img src="@/assets/avatar.png"></div>
```

## Outline

```html:example: -flex -gap-3
<div class="avatar circle primary-outline">孙</div>
<div class="avatar circle secondary-outline">李</div>
<div class="avatar circle success-outline">周</div>
<div class="avatar circle danger-outline">吴</div>
<div class="avatar circle important-outline">郑</div>
<div class="avatar circle special-outline">王</div>
```

## Icon/Text Avatar

```html:example: -flex -gap-3 -items-end
<div class="avatar primary">Icon</div>
<div class="avatar circle primary">Icon</div>
<div class="avatar primary"><span>王</span></div>
<div class="avatar circle primary"><span>王</span></div>
```

## Sizes

```html:example: -flex -gap-3 -items-end
<div class="avatar size-xl"><img src="@/assets/avatar-1.png"></div>
<div class="avatar size-lg"><img src="@/assets/avatar-2.png"></div>
<div class="avatar"><img src="@/assets/avatar-3.png"></div>
<div class="avatar size-sm"><img src="@/assets/avatar-4.png"></div>
<div class="avatar size-xs"><img src="@/assets/avatar-5.png"></div>
```

## Styles

```html:example: -flex -gap-3
<div class="avatar primary">Icon</div>
<div class="avatar secondary">Icon</div>
<div class="avatar success">Icon</div>
<div class="avatar warning">Icon</div>
<div class="avatar danger">Icon</div>
<div class="avatar lighter">Icon</div>
<div class="avatar light">Icon</div>
<div class="avatar gray">Icon</div>
<div class="avatar dark">Icon</div>
<div class="avatar darker">Icon</div>
<div class="avatar black">Icon</div>
<div class="avatar inverse">Icon</div>
<div class="avatar surface">Icon</div>
```

## Radius

```html:example: -flex -gap-3
<div class="avatar rounded-none"><img src="@/assets/avatar-5.png"></div>
<div class="avatar rounded-xs"><img src="@/assets/avatar-6.png"></div>
<div class="avatar rounded-sm"><img src="@/assets/avatar-6.png"></div>
<div class="avatar rounded"><img src="@/assets/avatar-8.png"></div>
<div class="avatar rounded-lg"><img src="@/assets/avatar-9.png"></div>
<div class="avatar rounded-xl"><img src="@/assets/avatar-10.png"></div>
<div class="avatar circle"><img src="@/assets/avatar.png"></div>
```

## 其他说明

* 头像例子由 [`vue-color-avatar`](https://github.com/Codennnn/vue-color-avatar) 生成。
