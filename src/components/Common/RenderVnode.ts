// 通过这个组件可以自动解析传入的 Vnode

import { defineComponent } from 'vue'
const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [String, Object],
      require: true, //代表vNode属性必须有
    },
  },
  setup(props) {
    return () => props.vNode //代表返回一个 Vnode 节点
  },
})

export default RenderVnode

// 通俗易懂的解释一下，为什么使用虚拟DOM，还要写一个这个
// VNode（虚拟DOM）​ = 快递包裹里的物品清单
// 真实DOM​ = 实际的物品本身
// Vue的渲染系统​ = 快递公司的自动分拣系统
// RenderVnode组件​ = 专门的快递员

// 情况1：不需要 vnode
// <template>
//   <!-- Vue能直接处理普通内容 -->
//   <div>{{ message }}</div>          <!-- 文字 → Vue自动渲染 -->
//   <button @click="handleClick">按钮</button> <!-- 元素 → Vue自动渲染 -->
// </template>

// 情况2：使用 vnode
// 你的 Dropdown 组件接收的数据
// const menuOptions = [
//   {
//     label: h('span', [              // 这是一个复杂的VNode
//       h('i', { class: 'icon' }),    // 包含图标
//       ' 带图标的菜单'                // 和文字
//     ]),
//     key: 1
//   }
// ]

// <!-- 没有RenderVnode -->
// <template>
//   <li>{{ item.label }}</li>
//   <!-- 如果item.label是VNode，显示：[object Object] -->
// </template>

// <!-- 有RenderVnode -->
// <template>
//   <li>
//     <RenderVnode :vNode="item.label" />
//     <!-- 正确显示VNode内容：图标 + 文字 -->
//   </li>
// </template>
