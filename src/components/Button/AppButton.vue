<template>
  <!-- 属性管行为（是否可点）   类名管外观（长什么样） -->
  <button
    ref="_ref"
    class="vk-button"
    :class="{
      [`vk-button--${type}`]: type,
      [`vk-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <Icon icon="spinner" spin v-if="loading"></Icon>
    <Icon :icon="icon" v-if="icon"></Icon>
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
/// <reference types="d:/Code/NeoUI-Plus/NeoUI-Plus/node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import type { ButtonProps } from './ButtonTypes'
import { ref } from 'vue'
import Icon from '../Icon/Icon.vue'
defineOptions({
  name: 'VkButton',
})

withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button',
})

const _ref = ref<HTMLButtonElement>()

defineExpose({
  ref: _ref,
})
</script>

<style>
.vk-button {
  background-color: var(--main-bg-color);
}
</style>
