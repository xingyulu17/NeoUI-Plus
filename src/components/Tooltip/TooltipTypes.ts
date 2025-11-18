import type { Placement } from '@popperjs/core'
// Placement 是封装的方位   就是展开的内容放置在哪里
export interface TooltipProps {
  content?: string
  trigger?: 'hover' | 'click'
  placement?: Placement
  manual?: boolean // 是否启动手动触发
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
