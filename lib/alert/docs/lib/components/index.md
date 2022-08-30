# 消息框

消息框能够轻松展示一些需要引起用户注意的内容。

## 基本用法

使用 `.alert` 类来获得消息框的外观和交互体验。

<Example class="space-y-4">
  <div class="alert">Hi! 这条消息可能需要你注意。</div>
  <div class="alert success">
    <i class="icon icon-check-circle alert-icon"></i> 一切已准备就绪。
  </div>
  <div class="alert warning-pale flex items-center">
    <i class="icon icon-warning-sign icon-2x alert-icon"></i>
    <div>
      <h4 class="font-bold text-lg">注意！</h4>
      <p>可能存在潜在风险。</p>
    </div>
  </div>
</Example>

```html
<div class="alert">Hi! 这条消息可能需要你注意。</div>
<div class="alert success">
  <i class="icon icon-check-circle alert-icon"></i> 一切已准备就绪。
</div>
<div class="alert warning-pale flex items-center">
  <i class="icon icon-warning-sign icon-2x alert-icon"></i>
  <div>
    <h4 class="font-bold text-lg">注意！</h4>
    <p>可能存在潜在风险。</p>
  </div>
</div>
```

也可以使用 `.alert` 提供的修饰类来展示同样的效果。<br/>
`.alert-icon` 表示左侧图标， `.alert-heading` 表示标题，`.alert-content` 表示内容。

<Example>
  <div class="alert success">
    <i class="icon icon-check-circle icon-2x alert-icon"></i>
    <div>
      <h4 class="alert-heading">太棒了！</h4>
      <p class="alert-content">一切已准备就绪。</p>
    </div>
  </div>
</Example>

```html
<div class="alert success">
  <i class="icon icon-check-circle icon-2x alert-icon"></i>
  <div>
    <h4 class="alert-heading">太棒了！</h4>
    <p class="alert-content">一切已准备就绪。</p>
  </div>
</div>
```

## 外观类型

配合丰富的 [CSS 工具类](/utilities/) 来实现不同消息框的外观。

### 不同主题

<Example class="space-y-4">
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
</Example>

```html
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

<Example class="space-y-4">
    <div class="alert primary-pale">准备开始</div>
    <div class="alert secondary-pale">请点击下一步</div>
    <div class="alert success-pale bd bd-success">太好了！一切已准备就绪。</div>
    <div class="alert warning-pale bd bd-warning">注意！看起来遇到一些问题。</div>
    <div class="alert danger-outline">确实遇到了问题，请立即处理吧。</div>
    <div class="alert important-outline">不要忘了勾选协议哦！</div>
    <div class="alert text-special">你可能还需要深入了解ZUI3。</div>
    <div class="alert text-dark">欢迎使用ZUI3。</div>
</Example>

```html
<div class="alert primary-pale">准备开始</div>
<div class="alert secondary-pale">请点击下一步</div>
<div class="alert success-pale bd bd-success">太好了！一切已准备就绪。</div>
<div class="alert warning-pale bd bd-warning">注意！看起来遇到一些问题。</div>
<div class="alert danger-outline">确实遇到了问题，请立即处理吧。</div>
<div class="alert important-outline">不要忘了勾选协议哦！</div>
<div class="alert text-special">你可能还需要深入了解ZUI3。</div>
<div class="alert text-dark">欢迎使用ZUI3。</div>
```

### 不同圆角

<Example class="space-y-4">
    <div class="alert primary rounded-none">准备开始。</div>
    <div class="alert secondary rounded-sm">请点击下一步。</div>
    <div class="alert success rounded">一切已准备就绪。</div>
    <div class="alert warning rounded-md">注意！看起来遇到一些问题。</div>
    <div class="alert danger rounded-lg">确实遇到了问题，请立即处理吧。</div>
    <div class="alert light rounded-xl">你可能需要了解一些内容。</div>
    <div class="alert important circle">欢迎使用ZUI3。</div>
</Example>

```html
<div class="alert primary rounded-none">准备开始。</div>
<div class="alert secondary rounded-sm">请点击下一步。</div>
<div class="alert success rounded">一切已准备就绪。</div>
<div class="alert warning rounded-md">注意！看起来遇到一些问题。</div>
<div class="alert danger rounded-lg">确实遇到了问题，请立即处理吧。</div>
<div class="alert light rounded-xl">你可能需要了解一些内容。</div>
<div class="alert important circle">欢迎使用ZUI3。</div>
```

## 与图标组合使用

<Example class="space-y-4">
    <div class="alert success">
      <i class="icon icon-check-circle alert-icon"></i> 一切已准备就绪。
    </div>
    <div class="alert danger">
      <i class="icon icon-remove-sign alert-icon"></i> 出现了一些错误。
    </div>
    <div class="alert warning-pale flex items-center">
      <i class="icon icon-warning-sign icon-2x alert-icon"></i>
      <div>
        <h4 class="font-bold text-lg">注意！</h4>
        <p>可能存在潜在风险。</p>
      </div>
    </div>
    <div class="alert light-pale flex items-center">
        <i class="icon icon-info-sign icon-2x alert-icon"></i>
        <div>
            <h4 class="font-bold text-lg">提示</h4>
            <p>你可能需要知道一些内容。</p>
        </div>
    </div>
</Example>

```html
<div class="alert success">
  <i class="icon icon-check-circle alert-icon"></i> 一切已准备就绪。
</div>
<div class="alert danger">
  <i class="icon icon-remove-sign alert-icon"></i> 出现了一些错误。
</div>
<div class="alert warning-pale flex items-center">
  <i class="icon icon-warning-sign icon-2x alert-icon"></i>
  <div>
    <h4 class="font-bold text-lg">注意！</h4>
    <p>可能存在潜在风险。</p>
  </div>
</div>
<div class="alert light-pale flex items-center">
    <i class="icon icon-info-sign icon-2x alert-icon"></i>
    <div>
        <h4 class="font-bold text-lg">提示</h4>
        <p>你可能需要知道一些内容。</p>
    </div>
</div>
```

## 消息框内包含链接

<Example class="space-y-4">
    <div class="alert success">
      <i class="icon icon-check-circle alert-icon"></i> 一切已<a href="###" class="font-bold">准备就绪</a>。
    </div>
    <div class="alert danger">
      <i class="icon icon-remove-sign alert-icon"></i> 出现了一些<a href="###" class="font-bold">错误</a>。
    </div>
    <div class="alert warning-pale">
      <i class="icon icon-warning-sign alert-icon"></i> 注意！可能存在<a href="###" class="font-bold">潜在风险</a>。
    </div>
    <div class="alert light-pale">
      <i class="icon icon-info-sign alert-icon"></i> 你可能需要知道<a href="###" class="font-bold">一些内容</a>。
    </div>
</Example>

```html
<div class="alert success">
  <i class="icon icon-check-circle alert-icon"></i> 一切已<a class="font-bold">准备就绪</a>。
</div>
<div class="alert danger">
  <i class="icon icon-remove-sign alert-icon"></i> 出现了一些<a class="font-bold">错误</a>。
</div>
<div class="alert warning-pale">
  <i class="icon icon-warning-sign alert-icon"></i> 注意！可能存在<a class="font-bold">潜在风险</a>。
</div>
<div class="alert light-pale">
  <i class="icon icon-info-sign alert-icon"></i> 你可能需要知道<a class="font-bold">一些内容</a>。
</div>
```

## 右上角包含关闭按钮

<Example>
  <div class="alert warning-pale">
    <i class="icon icon-remove-sign alert-icon-close"></i>
    <p>右上角有关闭按钮</p>
  </div>
</Example>

```html
<div class="alert warning-pale">
  <i class="icon icon-remove-sign alert-icon-close"></i>
  <p>右上角有关闭按钮</p>
</div>
```

## CSS 类

消息框提供了如下 CSS 类：

| 类             | 类型     | 作用               |
| -------------- |:--------:| ------------------ |
| `alert`        | 实体类   | 元素作为消息框组件 |
| `alert-icon`   | 实体类   | 元素作为消息框内左侧图标 |
| `alert-heading`| 实体类   | 元素作为消息框内标题 |
| `alert-content`| 实体类   | 元素作为消息框内容 |


## CSS 变量

消息框提供了如下 CSS 变量：

| 变量名称             | 变量含义           |
| ---------------------|--------------------|
| `--alert-radius`     | 消息框圆角         |
| `--alert-bg`         | 消息框默认背景色   |
| `--alert-text-color` | 消息框默认文字颜色 |

