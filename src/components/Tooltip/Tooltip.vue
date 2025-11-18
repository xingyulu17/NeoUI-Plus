<template>
  <div class="vk-tooltip" v-on="OutEvents" ref="popperContainerNode">
    <!-- vk-tooltip__trigger 是触发区 -->
    <!-- v-on="events" 是在动态添加类名，即是 hover 还是 click -->
    <div class="vk-tooltip__trigger" ref="triggerNode" v-on="events">
      <!-- 默认插槽   想要渲染的就放在这     所以这个插槽就是那个触发区   只不过是用一个 div包裹起来的  因为要加类名 -->
      <slot />
    </div>
    <!-- 展示区用动画包裹 -->
    <Transition :name="transition">
      <!-- vk-tooltip__popper 是内容展示区    隐藏还是展示 -->
      <div class="vk-tooltip__popper" v-if="isOpen" ref="popperNode">
        <!-- 带名字的插槽  展示内容，要么默认值  要么就展示传递过来的 -->
        <slot name="content">{{ content }}</slot>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
// 给当前组件加名字
defineOptions({
  name: 'VkTooltip',
})

import { ref, watch, reactive, onUnmounted, computed } from 'vue'
import type { TooltipProps, TooltipEmits, TooltipInstance } from './TooltipTypes'
import { createPopper } from '@popperjs/core'
import type { Instance } from '@popperjs/core'
import useClickOutside from '@/hooks/useClickOutside'

import { debounce } from 'lodash-es' //防抖

// 计算一些属性值   比如放在哪里   布局是什么
const popperOptions = computed(() => {
  //  //因为我们给placements设置了默认值，但是props.popperOptions里也有placements，这里有一个优先级的问题，所以用 computed 进行混入
  return {
    placements: props.placement,
    ...props.popperOptions,
  }
})
// defineProps、defineEmits，是因为你在 App.vue 中肯定是要调用现在这个组件Tooltip.vue的，
// 那么肯定要传递一些东西到Tooltip.vue组件（Tooltip.vue而且这个组件也写了插槽）
// 接收 props 并且给设置默认值
// TooltipProps 接口里写的就是你要传递过来的 东西  需要携带的属性的类型
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade', //默认的动画效果是渐隐
  openDelay: 1000,
  closeDelay: 1000,
})
// 事件
// TooltipEmits 就是你传递过来的东西身上绑定的事件要满足的类型
const emits = defineEmits<TooltipEmits>()

// ref变量控制 vk-tooltip__popper 是展示还是隐藏
const isOpen = ref(false)
// 要引入   给上边的两个外层div绑定ref   是因为createPopper需要三个参数，其中前两个就是触发区和展示区的DOM 元素，第三个参数是展示区的位置
// 所以要给两个外层的 div 绑定 ref 属性
const popperNode = ref<HTMLElement>() // 显示还是隐藏的 div
const triggerNode = ref<HTMLElement>() //触发区div
// 用 popperInstance这个变量来保存 Popper.js 的实例
let popperInstance: null | Instance = null
//events 动态管理类名  因为触发的事件可能是 click 可能是 hover，如果是click触发对应的事件，如果是hover则触发hover对应的事件
// 所以初始值是空的对象，里边应该包含的是键值对
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let events: Record<string, any> = reactive({}) // const 赋值的话，以后就不能改了
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let OutEvents: Record<string, any> = reactive({}) //OutEvents 是为了鼠标放在展示区域的内容上，内容也不会隐藏

// 获取上边最外边的DOM节点  实现点击节点外侧的区域也可以实现隐藏内容
const popperContainerNode = ref<HTMLElement>()

// 调用点击外侧区域 实现隐藏内容的钩子函数
useClickOutside(popperContainerNode, () => {
  if (props.trigger === 'click' && isOpen.value && !props.manual) {
    //必须要是点击事件，并且此时内容是已经打开的    而且此时不是用户自己触发事件
    closeFinal()
  }
})
// 点击事件的回调函数
const togglePopper = () => {
  console.log('isOpen.value:', isOpen.value)
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

let openTimes = 0 // 是为了看如果不用debounce，会多次触发事件
let closeTimes = 0

// 鼠标移入对应的事件   打开展示区
function open() {
  openTimes++
  console.log('open times', openTimes)
  isOpen.value = true
  emits('visible-change', true)
}
// 鼠标移出对应的事件
function close() {
  closeTimes++
  console.log('close times', closeTimes)
  isOpen.value = false
  emits('visible-change', false)
}

// 用 debounce 包装，防抖，就不需要  setTimeout         防止用户频繁触发事件，浪费资源
const openDebounce = debounce(open, props.openDelay)
const closeDebounce = debounce(close, props.closeDelay)

// 再次包装 每次执行打开  都把之前的关闭取消掉
const openFinal = () => {
  //这是最终版的打开函数
  closeDebounce.cancel()
  openDebounce()
}
const closeFinal = () => {
  //这是最终版的关闭函数
  openDebounce.cancel()
  closeDebounce()
}
// 类名是根据 trigger 来的 ，所以 watch trigger
//
watch(
  () => props.trigger,
  (newTrigger, oldTrigger) => {
    if (newTrigger !== oldTrigger) {
      //他俩指不相等就说明trigger改变了
      // 清空之前的类名
      events = {}
      OutEvents = {}
      // 根据此时的类名，触发对应的事件
      // 动态添加此时的类名
      attachEvents()
    }
  },
)

// 动态添加类名   的处理事件函数
// 注意这里只是给events、OutEvents添加对应的键值对，即mouseenter：open 类似这样，并不会直接触发函数
// 真正触发函数是在上边的 watch 里检测到 props的属性值改变 了，调用了对应的函数
const attachEvents = () => {
  if (props.trigger === 'hover') {
    // 鼠标移入， 对应的事件是open  // 赋值函数引用，不加括号
    events['mouseenter'] = openFinal
    // 鼠标移出，对应的事件是close
    OutEvents['mouseleave'] = closeFinal //即当鼠标移出OutEvents绑定的盒子的区域的事件发生时，执行 close函数
  } else if (props.trigger === 'click') {
    // 直接调用之前给 click 绑定的事件回调函数
    events['click'] = togglePopper // 赋值函数引用，不是调用！   不是直接togglePopper()
  }
}
// 自己直接调用  当没有选择用户自己手动触发时候
if (!props.manual) {
  attachEvents()
}

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
      // 添加类型守卫：确保两个 DOM 引用都不为 undefined  不然ts会推断triggerNode.value可能为undefined
      if (triggerNode.value && popperNode.value) {
        popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
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

// 卸载时   做的一个优化
onUnmounted(() => {
  popperInstance?.destroy()
})

// 监控是不是用户自己触发事件  因为只监控props上的一个属性，所以第一个参数要写成 getter方式
watch(
  () => props.manual,
  () => {
    if (props.manual) {
      // 启动手动触发
      // 把类名清空
      events = {}
      OutEvents = {}
    } else {
      attachEvents()
    }
  },
)

// 把 show hide 方法暴露出去         需要暴露给用户的东西就这么写
defineExpose<TooltipInstance>({
  show: openFinal,
  hide: closeFinal,
})
</script>

<style></style>

<!-- 其中togglePopper 、open、close事件都是怎么触发的-->
<!-- 1. togglePopper函数的触发路径
触发源头：用户的点击操作。
具体流程：
当 props.trigger被设置为 'click'时，attachEvents函数会执行 events['click'] = togglePopper。
这行代码将 togglePopper函数引用（注意不是执行结果）赋值给了 events对象的 click属性。
在模板中，触发区的 div 通过 v-on="events"绑定了这个动态事件对象。
当用户点击这个 div 或其中的插槽内容（如图标）时，浏览器产生一个 click事件。
事件冒泡到绑定了 v-on="events"的 div 上。
Vue 在 events对象中查找 click属性对应的处理函数，找到并执行 togglePopper。  !!
关键点：这是一个标准的事件监听-处理模式。函数本身被“寄存”在事件对象中，等待特定的事件（click）发生时才被调用。 -->

<!-- 2. open和 close函数的触发路径
触发源头：用户的鼠标悬停操作。
具体流程：
当 props.trigger被设置为 'hover'时，attachEvents函数会执行：
events['mouseenter'] = open
OutEvents['mouseleave'] = close
这分别将 open和 close函数引用赋值给不同的事件对象。
在模板中：
触发区的 div 通过 v-on="events"监听 mouseenter事件。
最外层的容器 div 通过 v-on="OutEvents"监听 mouseleave事件。
当用户鼠标移入触发区时，触发 mouseenter事件，执行 open函数，打开 Tooltip。
当用户鼠标移出整个 Tooltip 组件（包括触发区和弹出的内容区）时，触发 mouseleave事件，执行 close函数，关闭 Tooltip。
设计巧思：这里使用两个不同容器监听不同事件，是为了实现更好的用户体验。将 mouseleave绑定在外层容器，可以确保当鼠标从触发区移动到弹出的内容区时，Tooltip 不会立即关闭。 -->
