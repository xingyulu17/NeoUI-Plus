import type { VNode } from 'vue'
import type { TooltipProps } from '../Tooltip/TooltipTypes' //是在Tooltip组件上进行的二次开发

// 继承自Tooltip中的TooltipProps
export interface DropdownProps extends TooltipProps {
  menuOptions: MenuOption[] //然后还有一个自己独特的数组    是一个MenuOption类型的数组
  // 就是它的每一个选项都是一个 MenuOption 类型的元素
  hideAfterClick?: boolean //点击某一个选项之后，是否要关闭菜单
}

// 包含自己独特的属性
export interface MenuOption {
  // VNode:是为了展示复杂结构的内容（这个在Collapse组件是通过语义化标签实现的，但Dropdown想通过JavaScript数据结构实现）
  label: string | VNode //展开的内容区域上的文本   label可能是虚拟DOM！！！（就是会包含html标签）
  key: string | number //会同时展开一系列选项 所以要设置不一样的 key  每个选项对应的唯一标识符
  disabled?: boolean //是否禁用
  divided?: boolean //是否边框线
}

// 事件
export interface DropdownEmits {
  // visible-change 通知父组件是否展示              这里规定了visible-change就是接受一个布尔类型的参数
  (e: 'visible-change', value: boolean): void
  // select，传入的是一个MenuOption，代表选择的是哪个选项
  (e: 'select', value: MenuOption): void
}

// 是会暴露出去的方法的接口         是因为Tooltip 身上就有这两个方法，那么就要继续向上（向调用Dropdown的组件暴露）
export interface DropdownInstance {
  show: () => void
  hide: () => void
}
