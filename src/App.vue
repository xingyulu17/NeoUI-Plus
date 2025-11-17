<template>
  <main>
    <AppButton ref="buttonRef">Test Button</AppButton>
    <AppButton plain>Plain AppButton</AppButton>
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

  <Icon :icon="['fas', 'user-secret']" type="danger" />
  <Icon :icon="['fas', 'user-secret']" color="#0e7a0d" /><br /><br />

  <Tooltip content="Hello" :trigger="trigger">
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
import type { ButtonInstance } from './components/Button/ButtonTypes'
import { ref, onMounted } from 'vue'
// import type { CollapseProps } from '../src/components/Collapse/CollapseTypes'
// 导入图标
import Icon from './components/Icon/Icon.vue'
import Tooltip from './components/Tooltip/Tooltip.vue'

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
</script>

<style scoped></style>
