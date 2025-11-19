<template>
  <Dropdown placement="right-end" :trigger="trigger" :menu-options="optionsDropdown">
    <img src="./assets/logo.svg" alt="" width="125" height="125" />
  </Dropdown>
  <br /><br />
  <DropdownTSX placement="bottom" :trigger="trigger" :menu-options="optionsDropdown">
    <img src="./assets/logo.svg" alt="" width="125" height="125" />
  </DropdownTSX>
  <main>
    <AppButton ref="buttonRef" @click="open">Test Button</AppButton>
    <AppButton plain @click="close">Plain AppButton</AppButton>
    <AppButton round>Round AppButton</AppButton>
    <AppButton circle>VK</AppButton>
    <AppButton disabled>Disabled AppButton</AppButton><br /><br />
    <AppButton type="primary">Primary</AppButton>
    <AppButton type="success">Success</AppButton>
    <AppButton type="info">Info</AppButton>
    <AppButton type="warning">Warning</AppButton>
    <AppButton type="danger">Danger</AppButton><br /><br />
    <AppButton type="primary" plain>Primary</AppButton>
    <AppButton type="success" plain>Success</AppButton>
    <AppButton type="info" plain>Info</AppButton>
    <AppButton type="warning" plain>Warning</AppButton>
    <AppButton type="danger" plain>Danger</AppButton><br /><br />
    <AppButton size="large">Large</AppButton>
    <AppButton size="small">Small</AppButton><br /><br />
    <AppButton size="large" loading>Loading</AppButton>
    <AppButton size="large" icon="arrow-up">Icon</AppButton><br /><br />

    <Collapse v-model="openedValue">
      <Item name="a" title="Title A">
        <h1>headline title</h1>
        <div>this is content a aaa</div>
      </Item>
      <Item name="b" title="Title B">
        <div>this is bbbbb test</div>
      </Item>
      <Item name="c" title="Disabled Title" disabled>
        <div>this is cccc test</div>
      </Item>
    </Collapse>
    <!-- {{ openedValue }} -->
  </main>

  <Icon :icon="['fas', 'user-secret']" type="danger" /><br /><br />

  <!-- manual 启动自己手动触发事件 -->
  <Tooltip content="Hello" :trigger="trigger" ref="tooltipRef" :popper-options="options">
    <Icon :icon="['fas', 'arrow-up']" size="sm" spin type="primary" />
    <template #content>
      <h1>Hello srz</h1>
    </template>
  </Tooltip>
</template>

<script setup lang="ts">
import AppButton from '../src/components/Button/AppButton.vue'
import Collapse from './components/Collapse/Collapse.vue'
import Item from './components/Collapse/CollapseItem.vue'
import Dropdown from './components/Dropdown/Dropdown.vue'
import DropdownTSX from './components/Dropdown/Dropdown'
import type { ButtonInstance } from './components/Button/ButtonTypes'
import type { MenuOption } from './components/Tooltip/TooltipTypes'
import { ref, onMounted, h } from 'vue'
import type { Options } from '@popperjs/core'

// import type { CollapseProps } from '../src/components/Collapse/CollapseTypes'
// 导入图标
import Icon from './components/Icon/Icon.vue'
import Tooltip from './components/Tooltip/Tooltip.vue'
import type { TooltipInstance } from './components/Tooltip/TooltipTypes'

// 创建 TooltipInstance 的实例tooltipRef，并且给Tooltip绑定ref，那么我们就可以拿到TooltipInstance里的两个方法
const tooltipRef = ref<TooltipInstance | null>(null)

// 定义tooltipRef身上的两个方法        就可以是在任意组件身上绑定点击事件的回调函数
const open = () => {
  tooltipRef.value?.show()
}
const close = () => {
  tooltipRef.value?.hide()
}

// 8-7 给 Tooltip 定义一些新熟悉      就是可以批量修改 popper中的一些属性   因为展开的内容显示在哪里 是用的 popper
const options: Partial<Options> = {
  placement: 'top-start',
  strategy: 'fixed',
}

// Button
const buttonRef = ref<ButtonInstance | null>(null)

// Tooltip
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const trigger = ref<any>('click')
onMounted(() => {
  // console.log(buttonRef.value)           // Proxy(AppButton)
  // console.log(buttonRef.value.ref)       // HTMLButtonElement
  if (buttonRef.value) {
    console.log('buttonRef', buttonRef.value.ref)
  }
})

// Collapse
// 让初始的时候默认展示 a
const openedValue = ref(['a'])

// Dropdown
// h是 "createElement"（创建元素）的缩写，用于创建虚拟 DOM 节点（VNode）。
const optionsDropdown: MenuOption[] = [
  { key: 1, label: h('b', 'this is bold') }, //b是加粗的意思
  { key: 2, label: 'item2', disabled: true },
  { key: 3, label: 'item3', divided: true },
  { key: 4, label: 'item4' },
]
</script>

<style scoped></style>
