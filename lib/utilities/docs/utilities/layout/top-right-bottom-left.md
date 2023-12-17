# 上下左右

## 定义

用于控制定位元素的位置的工具类。

<Example padding="p-0" class="overflow-auto" style="max-height: 300px">
  <table class="table">
    <thead class="sticky top-0">
      <tr>
        <th>工具类</th>
        <th>属性</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in locationList">
        <td class="font-mono">{{item.name}}</td>
        <td><code>{{item.desc}}</code></td>
      </tr>
    </tbody>
   </table>
</Example>

## 效果展示

::: tabs
== 示例

<Example class="flex gap-4 flex-wrap">
  <div class="relative h-24 w-24 bg-surface">
    <div class="absolute inset-0 w-12 bg-secondary flex justify-center items-center rounded text-white">1</div>
  </div>
  <div class="relative h-24 w-24 bg-surface">
    <div class="absolute inset-x-0 top-0 h-12 bg-secondary flex justify-center items-center rounded text-white">2</div>
  </div>
  <div class="relative h-24 w-24 bg-surface">
    <div class="absolute inset-x-0 bottom-0 h-12 bg-secondary flex justify-center items-center rounded text-white">3</div>
  </div>
  <div class="relative h-24 w-24 bg-surface">
    <div class="absolute inset-y-0 right-0 w-12 bg-secondary flex justify-center items-center rounded text-white">4</div>
  </div>
</Example>

== HTML

```html
<div class="relative ...">
  <div class="absolute inset-0 ...">1</div>
</div>
<div class="relative ...">
  <div class="absolute inset-x-0 top-0 ...">2</div>
</div>
<div class="relative ...">
  <div class="absolute inset-x-0 bottom-0 ...">3</div>
</div>
<div class="relative ...">
  <div class="absolute inset-y-0 right-0 ...">4</div>
</div>
```

:::

::: tabs
== 示例

<Example class="-inline-grid gap-4 -grid-cols-2">
  <div class="relative h-24 w-24 bg-surface">
    <div class="absolute left-0 top-0 w-12 h-12 bg-secondary flex justify-center items-center rounded text-white">5</div>
  </div>
  <div class="relative h-24 w-24 bg-surface">
    <div class="absolute right-0 top-0 w-12 h-12 bg-secondary flex justify-center items-center rounded text-white">6</div>
  </div>
  <div class="relative h-24 w-24 bg-surface">
    <div class="absolute left-0 bottom-0 w-12 h-12 bg-secondary flex justify-center items-center rounded text-white">7</div>
  </div>
  <div class="relative h-24 w-24 bg-surface">
    <div class="absolute right-0 bottom-0 w-12 h-12 bg-secondary flex justify-center items-center rounded text-white">8</div>
  </div>
</Example>

== HTML

```html
<div class="relative ...">
  <div class="absolute left-0 top-0 ...">5</div>
</div>
<div class="relative ...">
  <div class="absolute right-0 top-0 ...">6</div>
</div>
<div class="relative ...">
  <div class="absolute left-0 bottom-0 ...">7</div>
</div>
<div class="relative ...">
  <div class="absolute right-0 bottom-0 ...">8</div>
</div>
```

:::

<script setup>
const locationList = [
    {name: 'inset-0', desc: 'top: 0px; right: 0px; bottom: 0px; left: 0px;'},
    {name: 'inset-auto', desc: 'top: auto; right: auto; bottom: auto; left: auto;'},
    {name: 'inset-x-0', desc: 'left: 0px; right: 0px;'},
    {name: 'inset-y-0', desc: 'top: 0px; bottom: 0px;'},
    {name: 'top-0', desc: 'top: 0px;'},
    {name: 'right-0', desc: 'right: 0px;'},
    {name: 'bottom-0', desc: 'bottom: 0px;'},
    {name: 'left-0', desc: 'left: 0px;'},
    {name: 'top-px', desc: 'top: 1px;'},
    {name: 'right-px', desc: 'right: 1px;'},
    {name: 'bottom-px', desc: 'bottom: 1px;'},
    {name: 'left-px', desc: 'left: 1px;'},
    {name: 'top-0.5', desc: 'top: 2px;'},
    {name: 'right-0.5', desc: 'right: 2px;'},
    {name: 'bottom-0.5', desc: 'bottom: 2px;'},
    {name: 'left-0.5', desc: 'left: 2px;'},
    {name: 'top-1', desc: 'top: 4px;'},
    {name: 'right-1', desc: 'right: 4px;'},
    {name: 'bottom-1', desc: 'bottom: 4px;'},
    {name: 'left-1', desc: 'left: 4px;'},
    {name: 'top-1.5', desc: 'top: 6px;'},
    {name: 'right-1.5', desc: 'right: 6px;'},
    {name: 'bottom-1.5', desc: 'bottom: 6px;'},
    {name: 'left-1.5', desc: 'left: 6px;'},
    {name: 'top-2', desc: 'top: 8px;'},
    {name: 'right-2', desc: 'right: 8px;'},
    {name: 'bottom-2', desc: 'bottom: 8px;'},
    {name: 'left-2', desc: 'left: 8px;'},
    {name: 'top-full', desc: 'top: 100%;'},
    {name: 'right-full', desc: 'right: 100%;'},
    {name: 'bottom-full', desc: 'bottom: 100%;'},
    {name: 'left-full', desc: 'left: 100%;'},
    {name: 'top-auto', desc: 'top: auto;'},
    {name: 'right-auto', desc: 'right: auto;'},
    {name: 'bottom-auto', desc: 'bottom: auto;'},
    {name: 'left-auto', desc: 'left: auto;'},
];
</script>
