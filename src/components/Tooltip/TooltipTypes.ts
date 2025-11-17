import type { Placement } from '@popperjs/core'
// Placement 是封装的方位   就是展开的内容放置在哪里
export interface TooltipProps {
  content?: string
  trigger?: 'hover' | 'click'
  placement?: Placement
}

// 点击事件
export interface TooltipEmits {
  (e: 'visible-change', value: boolean): void
  (e: 'click-outside', value: boolean): void
}

export interface TooltipInstance {
  show: () => void
  hide: () => void
}
