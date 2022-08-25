# 换行方式

添加`flex-*`设置弹性布局下子元素的换行方式

<script setup>
  const arrayWrap = [
    'flex-wrap',
    'flex-wrap-reverse',
    'flex-nowrap'
  ]
</script>

<Example>
  <template v-for="item in arrayWrap">
    <div :class="item" class="flex gap-3 mt-3" >
      <div v-for="index in 10" class="bg-primary w-24 h-16">
        <div class="mt-5 text-canvas text-center">{{index}}</div>
      </div>
    </div>
    <div class="text-center">{{item}}</div>
  </template>
</Example>

```html
  <div class="flex flex-wrap ...">
    ...
  </div>
```
