import { computed, defineComponent, Fragment, ref } from 'vue'
import type { PropType } from 'vue'
import type { Placement, Options } from '@popperjs/core'
import type { MenuOption } from './DropdownTypes'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { TooltipInstance } from '../Tooltip/TooltipTypes'

// 原生的 JS 写法   和 Dropdown.vue 实现的功能是一样的，二者用其中一个就行

export default defineComponent({
  name: 'VkDropdown',
  // 属性 原生的JS写法 ，props就只能写对象
  props: {
    placement: {
      type: String as PropType<Placement>, //as PropType<Placement>类型断言
      default: 'bottom', //默认值
    },
    trigger: {
      type: String as PropType<'hover' | 'click'>,
      default: 'hover',
    },
    transition: {
      type: String,
      default: 'fade',
    },
    openDelay: {
      type: Number,
      default: 0,
    },
    closeDelay: {
      type: Number,
      default: 0,
    },
    popperOptions: {
      type: Object as PropType<Options>,
    },
    menuOptions: {
      type: Array as PropType<MenuOption[]>,
      required: true,
    },
    hideAfterClick: {
      type: Boolean,
      default: true,
    },
    manual: {
      type: Boolean,
    },
  },

  // 结构
  // {slots} 是插槽
  setup(props, { slots, emit, expose }) {
    const tooltipRef = ref<TooltipInstance | null>(null)

    const itemClick = (e: MenuOption) => {
      if (e.disabled) {
        return
      }
      emit('select', e)
      if (props.hideAfterClick) {
        tooltipRef.value?.hide()
      }
    }

    const visibleChange = (e: boolean) => {
      emit('visible-change', e)
    }

    // 计算 content 具名插槽里要展示的结构
    const options = computed(() => {
      return props.menuOptions.map((item) => {
        // Fragment 是原生JS生成空节点
        return (
          <Fragment key={item.key}>
            {item.divided ? <li role="separator" class="divided-placeholder" /> : ''}
            <li
              class={{
                'vk-dropdown__item': true,
                'is-disabled': item.disabled,
                'is-divided': item.divided,
              }}
              id={`dropdown-item-${item.key}`}
              onClick={() => itemClick(item)}
            >
              {item.label}
            </li>
          </Fragment>
        )
      })
    })

    expose({
      show: () => tooltipRef.value?.show(),
      hide: () => tooltipRef.value?.hide(),
    })

    // 原生JS都是 {} 写法
    return () => (
      <div class="vk-dropdown">
        <Tooltip
          trigger={props.trigger}
          placement={props.placement}
          popperOptions={props.popperOptions}
          openDelay={props.openDelay}
          closeDelay={props.closeDelay}
          manual={props.manual}
          ref={tooltipRef}
          onVisible-change={visibleChange}
        >
          {{
            default: () => slots.default && slots.default(),
            content: () => <ul class="vk-dropdown__menu">{options.value}</ul>,
          }}
        </Tooltip>
      </div>
    )
  },
})

// 下边是插槽，外边的{}代表插槽，里边的{}是对象
// {{
//      default: () => slots.default && slots.default(),             //默认插槽
//      content: () => <ul class="vk-dropdown__menu">{options.value}</ul>,          //content具名插槽
// }}
