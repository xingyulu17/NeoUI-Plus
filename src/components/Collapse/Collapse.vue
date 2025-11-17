<template>
  <div class="vk-collapse">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { NameType, CollapseProps, CollapseEmits } from './CollapseTypes'
import { collapseContextKey } from './CollapseTypes'
import { provide, ref, watch } from 'vue'

defineOptions({
  name: 'VkCollapse',
})

// 是应该接收CollapseProps，才能取到它里边的属性吗？
const props = defineProps<CollapseProps>()
const emits = defineEmits<CollapseEmits>()

// 维护所有被点击 需要展开具体内容的 div 的名字
// 注意这里写的是存放 NameType[] NameType这个类型的数组
// 给了一个初始值 props.modelValue，是 App.vue 那边传过来的 v-model 绑定的值
const activeNames = ref<NameType[]>(props.modelValue)
// 为什么要使用 watch
watch(
  () => props.modelValue, // 监听父组件传递的 modelValue
  () => {
    activeNames.value = props.modelValue // 同步到内部状态
  },
)

// 给用户一个友好提示，如果此时数组里已经有一个名字  并且开起了手风琴模式，    那么最开始初始化的时候就只能传递一个名字
if (activeNames.value.length > 1 && props.accordion) {
  console.log('❌')
  console.warn('accordion mode should only have one acitve item')
}

// handleItemClick 这个是最终会在子组件 CollapseItem 中点击时候被调用的函数，传入的参数就是 哪个 item 被点击了，传入的是点击的名字
const handleItemClick = (item: NameType) => {
  // 先判断有么有开启手风琴模式   开启手风琴模式一次就是只能展示一个
  if (props.accordion) {
    // 如果是手风琴模式，那么数组内就只会有一个元素，所以就是判断[0]元素是不是当前点击的名字，
    // 就是数组中只能保留一项，如果点击的等于此时数组[0](就代表点击的是本来就展开的)，那么就置空（然后再通过事件发送出去，就渲染一个空的就好了，也不会有别的再被打开），
    // 如果不等于，就给原来的替换掉（然后会通过下边的事件发送过去，去打开新点击的，而且原来的也会被关闭（因为数组中不存在了）
    activeNames.value = [activeNames.value[0] === item ? '' : item]
  } else {
    // 先判断名字是不是已经在数组中
    const index = activeNames.value.indexOf(item)
    if (index > -1) {
      // 存在，删除数组对应的一项            因为如果存在，那么再点击，就代表要关闭，所以要从数组中删除已经存在的 name
      activeNames.value.splice(index, 1)
    } else {
      // 不存在，插入对应的name
      activeNames.value.push(item)
    }
  }
  // 为什么要发送事件？？
  // v-model 的本质：在 Vue 3 中，v-model是 :modelValue和 @update:modelValue的语法糖。
  // 当用户使用：<Collapse v-model="openedValue">
  // 实际上相当于： <Collapse :modelValue="openedValue" @update:modelValue="(value) => openedValue = value">
  // 它让父组件的 openedValue能够同步更新，实现真正的双向数据流   如果没有这些事件发射，父组件的 openedValue永远不会更新
  // 发送事件   实现 v-model 的双向绑定
  emits('update:modelValue', activeNames.value) // 实现 v-model 双向绑定
  emits('change', activeNames.value) // 提供业务变更通知
}

// 向子组件提供当前数组内的数据？
// 为什么这两个要通过父组件向子组件提供   为什么不直接在子组件那边自己维护？
provide(collapseContextKey, {
  activeNames,
  handleItemClick,
})
</script>

<style></style>
