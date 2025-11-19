<template>
  <div class="vk-dropdown">
    <!-- 二次开发Tooltip，要支持Tooltip的所有参数 -->
    <!--  @visible-change="visibleChange" 应该是自定义事件 -->
    <!-- 为什么要给 Tooltip 绑定 ref="tooltipRef"  ，是因为他身上有两个方法，要继续向上暴露，但是要先拿到DOM组件，所以绑定ref -->
    <Tooltip
      :trigger="trigger"
      :placement="placement"
      :popper-options="popperOptions"
      :open-delay="openDelay"
      :close-delay="closeDelay"
      :manual="manual"
      @visible-change="visibleChange"
      ref="tooltipRef"
    >
      <slot></slot>
      <!-- 展示区域的内容 -->
      <template #content>
        <ul class="vk-dropdown__menu">
          <!--但是因为可能会有  divided?: boolean //是否边框线 属性   所以会有两个li  要用空节点包裹一下-->
          <!-- template可以创建空节点  在空节点上遍历menuOptions数组 -->
          <!-- menuOptions可以直接使用是因为它通过 defineProps从父组件传递过来 在 Vue 3 的 <script setup>语法中，模板里可以直接使用 props 名称而不需要加 props.前缀 -->
          <template v-for="item in menuOptions" :key="item.key">
            <!-- 加边框线  作用：创建一个专门的分割线元素，样式：通常是一个细线或间距，作为视觉分隔符-->
            <li v-if="item.divided" role="separator" class="divided-placeholder"></li>
            <!-- 第二个 Li 要动态添加类名  还添加item.divided类：作用：菜单项本身，但可能有额外的样式调整，样式：可能在分割线后调整间距、边框等 -->
            <!-- 第二个li绑定点击事件，知道点击的是哪个，返回给调用 Dropdown 的父组件 -->
            <li
              class="vk-dropdown__item"
              @click="itemClick(item)"
              :class="{ 'is-disabled': item.disabled, 'is-divided': item.divided }"
              :id="`dropdown-item-${item.key}`"
            >
              <RenderVnode :v-node="item.label"></RenderVnode>
              <!-- label是简单的String时：{{ item.label }}  如果是虚拟DOM，就要用上一行方法 -->
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
import type { DropdownProps, DropdownEmits, DropdownInstance, MenuOption } from './DropdownTypes'
import Tooltip from '../Tooltip/Tooltip.vue' //在 Tooltip上二次开发
import RenderVnode from '../Common/RenderVnode'
import type { TooltipInstance } from '../Tooltip/TooltipTypes'
import { ref } from 'vue'

// 是因为 Tooltip 身上有两个方法
// tooltipRef.value?.show 就能拿到 Tooltip 身上的两个方法
const tooltipRef = ref<TooltipInstance | null>(null)

defineOptions({
  name: 'VkDropdown',
})

// 添加了 props 定义：需要接收调用 Dropdown组件传递过来的 menuOptions
// 这个必须要用 因为他会接收调用 Dropdown组件传递过来的，绑在父组件身上的一些属性
const props = withDefaults(defineProps<DropdownProps>(), {
  hideAfterClick: true, //给hideAfterClick加默认值，默认点击选项是要关闭的
})

// 而vue3是自动解包的，所以就可以在本vue文件中直接使用
const emits = defineEmits<DropdownEmits>()

// visibleChange用于在 Dropdown 组件内部处理 Tooltip 的可见性变化，并将这个变化通知给父组件
// e: boolean：参数，表示 Tooltip 的显示/隐藏状态（true=显示，false=隐藏）
// 当 Tooltip 组件的显示状态发生变化时，会触发 visible-change事件  继续网上传，传递给调用Dropdown组件的那个组件
const visibleChange = (e: boolean) => {
  emits('visible-change', e)
}

// li 的点击事件   注意传递过来的是MenuOption类型
const itemClick = (e: MenuOption) => {
  // console.log('点击了菜单项:', e.label)
  // console.log('hideAfterClick 值:', props.hideAfterClick)
  // console.log('tooltipRef 值:', tooltipRef.value)
  if (e.disabled) return
  // 发送点击了 e           让调用 Dropdown 的父组件知道点击了哪个选项
  emits('select', e)
  if (props.hideAfterClick) {
    // console.log('执行隐藏操作')
    tooltipRef.value?.hide()
  }
}
// 再将 Tooltip 身上的两个方法继续向上暴露！！
defineExpose<DropdownInstance>({
  // 这里是用到了闭包，什么是闭包？？？为什么要用闭包？
  // 优势：​ 函数在被调用时才访问 tooltipRef.value，此时组件已经挂载，tooltipRef已经有值。
  // 不用闭包的话，可能是null
  show: () => tooltipRef.value?.show(),
  hide: () => tooltipRef.value?.hide(),
})
</script>
<style></style>

<!-- 1 为什么需要visibleChange告诉父组件
 厨房（父组件）：需要知道顾客的点餐状态         父组件就是使用 Dropdown 的那个组件
服务员（Dropdown组件）：负责接收顾客点餐
菜单本（Tooltip组件）：展示给顾客看的菜单

父组件收到的是一个 布尔值（boolean），表示下拉菜单的显示或隐藏状态。
-->

<!-- 2 那Tooltip是怎么知道是true 还是 False，visibleChange这个事件是怎么触发的

// Tooltip 内部维护自己的显示状态
Tooltip也是用过 emits 把状态传递给了调用 Tooltip 的父组件Dropdown这里
即：emits('visible-change', true) // 触发事件，传递 true
-->

<!-- 3 为什么要给 Tooltip 绑定 ref="tooltipRef"  ，
 是因为他身上有两个方法，要继续向上暴露，但是要先拿到DOM组件，所以绑定ref -->

<!--4 VNode节点是什么？
  （Virtual Node，虚拟节点）  VNode 就是 JavaScript 对象，用来描述真实 DOM 元素应该长什么样。
  真实 DOM ：<div class="title" id="app">Hello World</div>
  对应的 VNode（JavaScript 对象）：
{
  tag: 'div',
  props: { class: 'title', id: 'app' },
  children: 'Hello World'
}
  -->

<!--5 闭包的执行流程
   // 父组件调用
dropdownRef.value.show()
// 实际执行流程：
1. 父组件：dropdownRef.value.show()
2. → 执行闭包函数：() => tooltipRef.value?.show()
3. → 访问当前作用域的 tooltipRef（此时组件已挂载，有值）
4. → 调用实际的 tooltipRef.value.show() -->

<!-- 为什么这里必须用闭包？
时机问题：defineExpose执行时组件可能还没挂载，tooltipRef.value是 null
延迟访问：闭包让函数在被调用时才访问 tooltipRef.value，此时组件已挂载
动态绑定：确保总是访问最新的 tooltipRef.value -->
