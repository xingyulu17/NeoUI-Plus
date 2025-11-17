<template>
  <div
    class="vk-collapse-item"
    :class="{
      'is-disabled': disabled,
    }"
  >
    <!-- 展示标题 -->
    <div
      class="vk-collapse-item__header"
      :class="{
        'is-disabled': disabled,
        'is-active': isActive,
      }"
      :id="`item-header-${name}`"
      @click="handleClick(name)"
    >
      <!-- {{ title }} 这个是具名插槽的默认值    没有使用具名插槽的，则展示默认值！！ -->
      <slot name="title"> {{ title }}</slot>
      <Icon icon="angle-right" class="header-angle"></Icon>
    </div>
    <!-- 展示内容 -->
    <Transition name="slide" v-on="transitionEvents">
      <div class="vk-collapse-item__wrapper" v-show="isActive">
        <div class="vk-collapse-item__content" :id="`item-content-${name}`">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
/// <reference types="d:/Code/NeoUI-Plus/NeoUI-Plus/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import type { CollapseItemProps } from './CollapseTypes'
import { collapseContextKey } from './CollapseTypes'
import Icon from '../Icon/Icon.vue'
import type { NameType } from './CollapseTypes'
import { inject, computed } from 'vue'
// 获取上边的 Dom 元素，才能获得它身上的 disabled 属性    也是获得src\App.vue 传递过来的Item标签身上的属性
const props = defineProps<CollapseItemProps>()

defineOptions({
  name: 'VkCollapseItem',
})

// 接收 Collapse 传递过来的两个东西
const collapseContext = inject(collapseContextKey)
// 控制内容是否展示   计算传递过来的数组里是不是包含当前的名字           这里是计算出来的，而不是简单的 const isActive = ref(false)  点击的时候再简单的取反，
const isActive = computed(() => collapseContext?.activeNames.value.includes(props.name))

// 点击的回调函数
function handleClick(name: NameType) {
  if (props.disabled) return
  // 把点击的名字传给 父组件Collapse的handleItemClick函数，让他去处理
  // 其实就是统一在父组件Collapse那边处理
  collapseContext?.handleItemClick(name)
}

// 设置内容展开关闭的过度效果的    是为了给 Transition 绑定一些事件，实现JS的一些逻辑
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    el.style.height = '0px'
    el.style.overflow = 'hidden'
  },
  enter(el) {
    el.style.height = `${el.scrollHeight}px`
  },
  afterEnter(el) {
    el.style.height = ''
    el.style.overflow = ''
  },
  beforeLeave(el) {
    el.style.height = `${el.scrollHeight}px`
    el.style.overflow = 'hidden'
  },
  leave(el) {
    el.style.height = '0px'
  },
  afterLeave(el) {
    el.style.height = ''
    el.style.overflow = ''
  },
}
</script>

<style></style>
