# 表单控件

## 单行输入框 `<input>`

```html:example
<input type="text" class="form-control" placeholder="输入一些文本" />
```

## 选择框 `<select>`

```html:example
<select data-placeholder="选择一个宠物..." class="form-control">
  <option value=""></option>
  <option value="cat">小猫</option>
  <option value="fish">金鱼</option>
  <option value="dragon">龙</option>
  <option value="mammoth">猛犸</option>
  <option value="gollum">咕噜</option>
</select>
```

```html:example
<select data-placeholder="选择一些爱吃的水果..." class="form-control" multiple>
  <option value="strawberries">草莓</option>
  <option value="apple">苹果</option>
  <option value="orange">橙子</option>
  <option value="cherry">樱桃</option>
  <option value="banana">香蕉</option>
  <option value="figs">无花果</option>
</select>
```

## 多行文本框 `<textarea>`

```html:example
<textarea rows="5" class="form-control" placeholder="输入一些文本" >
Hello, world!
</textarea>
```

## 文件 `<input>`

```html:example
<input type="file" class="form-control" />
```

## 被禁用

```html:example:flex gap-4
<input type="text" class="form-control" disabled placeholder="输入一些文本" />
<select data-placeholder="选择一个宠物..." class="form-control" disabled>
  <option value="cat">小猫</option>
  <option value="fish">金鱼</option>
  <option value="dragon">龙</option>
  <option value="mammoth">猛犸</option>
  <option value="gollum">咕噜</option>
</select>
<textarea rows="5" class="form-control" disabled placeholder="输入一些文本" >
Hello, world!
</textarea>
```


## 特殊状态

```html:example:flex gap-4
<div class="has-error"><input type="text" class="form-control" placeholder="输入一些文本" /></div>
<div class="has-warning"><input type="text" class="form-control" placeholder="输入一些文本" /></div>
<div class="has-success"><input type="text" class="form-control" placeholder="输入一些文本" /></div>
```

```html:example:flex gap-4
<div class="has-error flex-auto">
  <select data-placeholder="选择一个宠物..." class="form-control">
    <option value="cat">小猫</option>
    <option value="fish">金鱼</option>
    <option value="dragon">龙</option>
    <option value="mammoth">猛犸</option>
    <option value="gollum">咕噜</option>
  </select>
</div>
<div class="has-warning flex-auto">
  <select data-placeholder="选择一个宠物..." class="form-control">
    <option value="cat">小猫</option>
    <option value="fish">金鱼</option>
    <option value="dragon">龙</option>
    <option value="mammoth">猛犸</option>
    <option value="gollum">咕噜</option>
  </select>
</div>
<div class="has-success flex-auto">
  <select data-placeholder="选择一个宠物..." class="form-control">
    <option value="cat">小猫</option>
    <option value="fish">金鱼</option>
    <option value="dragon">龙</option>
    <option value="mammoth">猛犸</option>
    <option value="gollum">咕噜</option>
  </select>
</div>
```

```html:example:flex gap-4
<div class="has-error flex-auto">
  <select data-placeholder="选择一个宠物..." class="form-control" multiple>
    <option value="cat">小猫</option>
    <option value="fish">金鱼</option>
    <option value="dragon">龙</option>
    <option value="mammoth">猛犸</option>
    <option value="gollum">咕噜</option>
  </select>
</div>
<div class="has-warning flex-auto">
  <select data-placeholder="选择一个宠物..." class="form-control" multiple>
    <option value="cat">小猫</option>
    <option value="fish">金鱼</option>
    <option value="dragon">龙</option>
    <option value="mammoth">猛犸</option>
    <option value="gollum">咕噜</option>
  </select>
</div>
<div class="has-success flex-auto">
  <select data-placeholder="选择一个宠物..." class="form-control" multiple>
    <option value="cat">小猫</option>
    <option value="fish">金鱼</option>
    <option value="dragon">龙</option>
    <option value="mammoth">猛犸</option>
    <option value="gollum">咕噜</option>
  </select>
</div>
```

```html:example:flex gap-4
<div class="has-error flex-auto">
  <textarea rows="5" class="form-control" placeholder="输入一些文本" >
    Hello, world!
  </textarea>
</div>
<div class="has-warning flex-auto">
  <textarea rows="5" class="form-control" placeholder="输入一些文本" >
    Hello, world!
  </textarea>
</div>
<div class="has-success flex-auto">
  <textarea rows="5" class="form-control" placeholder="输入一些文本" >
    Hello, world!
  </textarea>
</div>
```
