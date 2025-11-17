export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ButtonSize = 'large' | 'small'
export type NativeType = 'button' | 'submit' | 'reset'

export interface ButtonProps {
  type?: ButtonType //决定按钮的「视觉风格」——颜色、背景、边框。不传时一般 fallback 到 'default'（灰框白底）。
  size?: ButtonSize //控制按钮整体尺寸（高、内边距、字号）。不传则走全局默认尺寸（多为 'medium'）。
  plain?: boolean // 是否「镂空」样式：有边框但背景透明，鼠标移上去才填充颜色。是否「镂空」样式：有边框但背景透明，鼠标移上去才填充颜色。
  round?: boolean //是否「圆角」：左右两侧完全圆弧。与 circle 互斥，通常用于文字较长的按钮。
  circle?: boolean //是否「圆形」：宽高相等且 50% 圆角，一般只放图标。
  disabled?: boolean //禁用态：置灰、不可点击、不触发 click 事件、aria-disabled=true。
  nativeType?: NativeType //对应原生 <button type="...">，决定表单内的默认行为。不传默认是 'button'
  autofocus?: boolean //是否页面加载后自动聚焦到该按钮（等价于原生 autofocus 属性）。
  icon?: string
  loading?: boolean
}

export interface ButtonInstance {
  ref: HTMLButtonElement
}
