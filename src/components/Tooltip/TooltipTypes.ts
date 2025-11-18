// Placement 是封装的方位   就是展开的内容放置在哪里
import type { Placement } from '@popperjs/core'
// Options 是支持 popper 参数
import type { Options } from '@popperjs/core'

export interface TooltipProps {
  content?: string
  trigger?: 'hover' | 'click'
  placement?: Placement
  manual?: boolean // 是否启动手动触发
  // Partial 表示 Options类型的所有属性都变为可选的
  // Options：来自 @popperjs/core的类型，包含 Popper.js 的所有配置选项
  // 引入第三方库的时候可以通过Options让用户自己把属性传进去！！！
  popperOptions?: Partial<Options> //popperOptions：属性名，用于接收 Popper.js 的配置选项
  transition?: string //添加动画效果
  openDelay?: number //打开内容区域的延迟时间
  closeDelay?: number // 隐藏内容区域的延迟时间
}

// 点击事件
export interface TooltipEmits {
  (e: 'visible-change', value: boolean): void
  (e: 'click-outside', value: boolean): void
}

// 启用手动触发事件时候  暴露出去的两个函数 show  hide
export interface TooltipInstance {
  show: () => void
  hide: () => void
}
