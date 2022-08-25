# 消息框

## Alert

```html:example: gap-3
<div class="alert">Hi! 这条消息可能需要你注意。</div>
```

## Styles

```html:example: gap-3 space-y-4
<div class="alert primary">准备开始</div>
<div class="alert secondary">请点击下一步</div>
<div class="alert success">太好了！一切已准备就绪。</div>
<div class="alert warning">注意！看起来遇到一些问题。</div>
<div class="alert danger">确实遇到了问题，请立即处理吧。</div>
<div class="alert important">不要忘了勾选协议哦！</div>
<div class="alert special">你可能还需要深入了解ZUI3。</div>
<div class="alert white">ZUI3，开箱即用的组合式前端 UI 框架。</div>
<div class="alert lighter">采用基础 + 组件库模式，按需使用。</div>
<div class="alert light">丰富组件库，实现你的创意。</div>
<div class="alert gray">深色模式，自定义主题，定制打包。</div>
<div class="alert dark">ZUI3使用组件库来管理组件。</div>
<div class="alert darker">库中的每个组件可以被独立打包和使用。</div>
<div class="alert black">组件库采用 pnpm 的工作空间实现。</div>
<div class="alert inverse">每个组件作为一个单独的包进行管理。</div>
<div class="alert surface">组件名称只能以小写字母开头。</div>
<div class="alert canvas">使用起来更方便，更快捷。</div>
<div class="alert ghost">欢迎使用ZUI3。</div>
```

```html:example: gap-3 space-y-4
<div class="alert primary-pale">准备开始</div>
<div class="alert secondary-pale">请点击下一步</div>
<div class="alert success-pale">太好了！一切已准备就绪。</div>
<div class="alert warning-pale">注意！看起来遇到一些问题。</div>
<div class="alert danger-pale">确实遇到了问题，请立即处理吧。</div>
<div class="alert important-pale">不要忘了勾选协议哦！</div>
<div class="alert special-pale">你可能还需要深入了解ZUI3。</div>
<div class="alert lighter-pale">采用基础 + 组件库模式，按需使用。</div>
<div class="alert light-pale">丰富组件库，实现你的创意。</div>
<div class="alert gray-pale">深色模式，自定义主题，定制打包。</div>
<div class="alert dark-pale">欢迎使用ZUI3。</div>
```
## Radius

```html:example: gap-3 space-y-4
<div class="alert primary rounded-none">准备开始。</div>
<div class="alert secondary rounded-sm">请点击下一步。</div>
<div class="alert success rounded">一切已准备就绪。</div>
<div class="alert warning rounded-md">注意！看起来遇到一些问题。</div>
<div class="alert danger rounded-lg">确实遇到了问题，请立即处理吧。</div>
<div class="alert light rounded-xl">你可能需要了解一些内容。</div>
<div class="alert important circle">欢迎使用ZUI3。</div>

```

## with icons

```html:example: gap-3 space-y-4
<div class="alert success">
  <i class="icon icon-check-circle"></i> 一切已准备就绪。
</div>
<div class="alert danger">
  <i class="icon icon-remove-sign"></i> 出现了一些错误。
</div>
<div class="alert warning-pale">
  <i class="icon icon-warning-sign"></i> 注意！可能存在潜在风险。
</div>
<div class="alert light-pale">
  <i class="icon icon-info-sign"></i> 你可能需要知道一些内容。
</div>
```

## with links

```html:example: gap-3 space-y-4
<div class="alert success">
  <i class="icon icon-check-circle"></i> 一切已<a href="###" class="font-bold">准备就绪</a>。
</div>
<div class="alert danger">
  <i class="icon icon-remove-sign"></i> 出现了一些<a href="###" class="font-bold">错误</a>。
</div>
<div class="alert warning-pale">
  <i class="icon icon-warning-sign"></i> 注意！可能存在<a href="###" class="font-bold">潜在风险</a>。
</div>
<div class="alert light-pale">
  <i class="icon icon-info-sign"></i> 你可能需要知道<a href="###" class="font-bold">一些内容</a>。
</div>
```
