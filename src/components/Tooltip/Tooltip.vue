<template>
  <div class="vk-tooltip">
    <!-- vk-tooltip__trigger 是触发区 -->
    <div class="vk-tooltip__trigger" ref="triggerNode" @click="togglePopper">
      <!-- 默认插槽   想要渲染的就放在这     所以这个插槽就是那个触发区   只不过是用一个 div包裹起来的  因为要加类名 -->
      <slot />
    </div>
    <!-- vk-tooltip__popper 是内容展示区    隐藏还是展示 -->
    <div class="vk-tooltip__popper" v-if="isOpen" ref="popperNode">
      <!-- 带名字的插槽  展示内容，要么默认值  要么就展示传递过来的 -->
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>
<script setup lang="ts">
// 给当前组件加名字
defineOptions({
  name: 'VkTooltip',
})

import { ref, watch } from 'vue'
import type { TooltipProps, TooltipEmits } from './TooltipTypes'
import { createPopper } from '@popperjs/core'
import type { Instance } from '@popperjs/core'

// defineProps、defineEmits，是因为你在 App.vue 中肯定是要调用现在这个组件Tooltip.vue的，
// 那么肯定要传递一些东西到Tooltip.vue组件（Tooltip.vue而且这个组件也写了插槽）
// 接收 props 并且给设置默认值
// TooltipProps 接口里写的就是你要传递过来的 东西  需要携带的属性的类型
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
})

// 事件
// TooltipEmits 就是你传递过来的东西身上绑定的事件要满足的类型
const emits = defineEmits<TooltipEmits>()
// ref变量控制 vk-tooltip__popper 是展示还是隐藏
const isOpen = ref(false)

const togglePopper = () => {
  isOpen.value = !isOpen.value
  // 发射事件  是向父组件发送一个通知。
  // 发出的信号，其含义是：“嗨，父组件，我内部的状态变成了可见，特此通知你。”
  emits('visible-change', isOpen.value)
  // 2. emits('visible-change', isOpen.value)（对外发布通知）
  // 这个操作的目的是向组件的使用者（父组件）进行通信。想象一下，Tooltip 的展开或收起可能只是页面交互中的一环。父组件可能需要：
  // 在 Tooltip 显示时，关闭页面上的其他弹出层。
  // 在 Tooltip 显示时，记录一次用户行为进行分析。
  // 根据 Tooltip 的状态，同步更新父组件自身的某些状态。
  // 如果我不发出这个事件，父组件就无法方便地感知到 Tooltip 内部状态的变化。emit相当于组件对外的广播，告诉任何关心它的人：“我的可见状态改变了！”。这是组件化设计的重要原则：通过事件将内部状态的变化暴露给外部世界。
}

// 要引入   给上边的两个外层div绑定ref   是因为createPopper需要三个参数，其中前两个就是触发区和展示区的DOM 元素，第三个参数是展示区的位置
// 所以要给两个外层的 div 绑定 ref 属性
const popperNode = ref<HTMLElement>() // 显示还是隐藏的 div
const triggerNode = ref<HTMLElement>() //触发区div

// 用 popperInstance这个变量来保存 Popper.js 的实例
let popperInstance: null | Instance = null

// 监听器 watch(isOpen, ...)来控制 Popper 实例的创建        Popper是用的第三方的库  他可以方便我们控制内容展示的位置
// 这个监听器的作用是响应状态变化，并执行与之相关的“副作用”逻辑。
// 在这里，最主要的副作用就是管理 Popper.js 实例的生命周期。
// 即如果 isOpen为 true，此时提示框的 DOM 已准备好，于是创建 Popper 实例进行精确定位。
//如果 isOpen为 false，则销毁 Popper 实例以释放资源。
watch(
  isOpen,
  (newValue) => {
    // 当isOpen的值改变，并且他的新的值（newValue）为true 的时候，会执行下边的if
    if (newValue) {
      if (triggerNode.value && popperNode.value) {
        // 添加类型守卫：确保两个 DOM 引用都不为 undefined  不然ts会推断triggerNode.value可能为undefined
        popperInstance = createPopper(triggerNode.value, popperNode.value, {
          // 把父组件传进来的props.placement赋值给placement
          placement: props.placement,
        })
      }
      // 当需要展示内容的时候   还应该发射事件
      emits('click-outside', true)
    } else {
      // isOpen为false，不展示内容，则销毁实例
      popperInstance?.destroy()
    }
  },
  //它告诉 Vue 的 watch回调，等待组件由于 isOpen变化而引发的 DOM 更新真正完成之后再执行
  { flush: 'post' },
)
</script>

<style></style>
