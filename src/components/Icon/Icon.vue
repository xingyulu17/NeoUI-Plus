<template>
  <!-- v-bind="$attrs"   是因为限制了透传，也就是在 App.vue 中的属性传不到这边，
   但是通过attrs就可以拿到所有过滤掉 props 和 emits 事件的其余所有属性 -->
  <i class="vk-icon" :class="{ [`vk-icon--${type}`]: type }" :style="customStyles" v-bind="$attrs">
    <font-awesome-icon v-bind="filteredProps" />
  </i>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { omit } from 'lodash-es'
import type { IconProps } from './types'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
defineOptions({
  name: 'VkIcon',
  inheritAttrs: false, //这样就不会透传到根组件<i>上
})
const props = defineProps<IconProps>()
// props 是响应式对象  当你对响应式对象做初始化赋值的时候，就要用 computed 包裹    因为当你比如在 App.vue 里设置两秒后改变他的值，他是不会更新的
const filteredProps = computed(() => omit(props, ['type', 'color'])) // 从 props  把 'type', 'color' 过滤掉
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {}
})
</script>
