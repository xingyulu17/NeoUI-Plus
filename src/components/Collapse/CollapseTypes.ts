import type { Ref, InjectionKey } from 'vue'
export type NameType = string | number

export interface CollapseItemProps {
  name: NameType
  title?: string
  disabled?: boolean
}

// 这是父组件Collapse向子组件CollapseItem提供的两个东西    一个是维护包含所有需要展开内容的名字的数组，一个是点击某个标题时候的响应函数
export interface CollapseContext {
  activeNames: Ref<NameType[]>
  handleItemClick: (name: NameType) => void
}
// 就是创建并导出一把带类型的、全局唯一的钥匙，专门用来打开 provide/inject 这道门。
export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContextKey')
// 这里使用 Symbol 创建唯一键是 TypeScript 类型安全和工程化的要求：
// 避免命名冲突：大型项目中可能有多个 provide/inject 对，Symbol 保证键的唯一性
// 类型安全：InjectionKey<T>提供完整的类型推断，在 inject 时能获得准确的类型提示
// 工程规范：这是 Vue 3 官方推荐的 provide/inject 模式

// 5-4
// 因为 v-model 有 modelValue 属性          accordion：控制手风琴的效果的
export interface CollapseProps {
  modelValue: NameType[]
  accordion?: boolean
}

//  v-model还有对应的事件   就是属性+事件实现了：双向绑定
export interface CollapseEmits {
  // 规范了事件即函数的约束规则
  (e: 'update:modelValue', values: NameType[]): void
  (e: 'change', values: NameType[]): void
}
