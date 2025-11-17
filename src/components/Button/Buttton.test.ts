import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './AppButton.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Icon from '../Icon/Icon.vue'

// 测试的命令是 ：  npx vitest Button
describe('AppButton.vue', () => {
  test('basic button', () => {
    // 把按钮挂载上去
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
      },
      slots: {
        default: 'button',
      },
    })
    console.log(wrapper.html())
    // wrapper.classes()) 会返回 DOM 节点上的一系列 class   toContain 判断 vk-button--primary类名是否存在
    // 正确的方式：找到 button 元素
    const button = wrapper.find('button')
    console.log('Button classes:', button.classes())
    // console.log(wrapper.classes()) //打印出来的是 []
    // 1 测试类名是否正常显示
    expect(button.classes()).toContain('vk-button--primary')
    // 2 测试slot是不是正常显示按钮的内容
    // slot
    // get, find   ==》  两个找 DOM 节点的方法
    // find：如果找不到也不会报错    get 是找不到就会报错
    expect(wrapper.get('button').text()).toBe('button')
    // 3 测试 Button 的事件
    // events
    wrapper.get('button').trigger('click') // 触发 click 事件（因为我们还没给button 绑定事件，先测试原生事件）
    console.log(wrapper.emitted())
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  // 测试 disabled 属性
  test('disabled', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'disabled',
      },
    })
    // 测试属性的时候，要.find('Button') 拿到真正的DOM节点，因为属性都是绑定在 Button身上的
    // attributes
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    // attributes
    expect(wrapper.find('button').element.disabled).toBeDefined()
    wrapper.get('button').trigger('click')
    // 测试有没有触发 click事件     因为这个是disabled属性，所以应该是不触发 click事件的
    expect(wrapper.emitted()).not.toHaveProperty('click')
  })
  // 测试 图标
  test('icon', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'arrow-up',
      },
      slots: {
        default: 'icon',
      },
      // 当你要测试第三方库的时候，就要引入下边的配置   因为不然的话，你还要自己再去加一个图标，再测试
      global: {
        stubs: ['FontAwesomeIcon'],
      },
    })
    // findComponent 找组件的方法
    const iconElement = wrapper.findComponent(FontAwesomeIcon)
    expect(iconElement.exists()).toBeTruthy() //判断这个组件是否存在
    expect(iconElement.attributes('icon')).toBe('arrow-up') //判断他的 icon属性是不是这个图标arrow-up
  })
  // 测试 loading
  test('loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      slots: {
        default: 'loading',
      },
      global: {
        //  stubs: ['Icon']   技巧：可以把第三方的库模拟掉
        stubs: ['Icon'],
      },
    })
    console.log(wrapper.html())
    const iconElement = wrapper.findComponent(Icon)
    console.log(iconElement)
    expect(iconElement.exists()).toBeTruthy()
    expect(iconElement.attributes('icon')).toBe('spinner')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})
