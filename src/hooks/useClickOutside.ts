// 即点击某一个区域的外部   执行对应的逻辑的钩子函数    具体要执行的逻辑不在这里写
// 传入的应该是你要点击的除哪个部分以外的区域
// 所以传入的应该是一个响应式的DOM节点
import type { Ref } from 'vue'
// Ref 是 Vue 3 提供的响应式引用类型，用来把任何值包装成响应式对象。
// 简单说：它让一个普通变量（包括 DOM 节点）变成“Vue 能追踪变化”的变量。
import { onMounted, onUnmounted } from 'vue'

// elementRef 是传入的DOM节点，一开始是 undefined，最后肯定是 HTMLElement，而且是响应式的
// 传入 DOM节点，触发的回调函数是 callback:(e:MouseEvent)=>void   callback是一个函数类型，回调函数会有 e e是鼠标类型的事件
// 参数 e代表的是原生的 MouseEvent（鼠标事件）对象
const useClickOutside = (
  elementRef: Ref<undefined | HTMLElement>,
  callback: (e: MouseEvent) => void,
) => {
  // 回调函数具体的内容
  const handler = (e: MouseEvent) => {
    if (elementRef.value && e.target) {
      //如果点击的DOM节点存在  并且 有鼠标事件
      if (!elementRef.value.contains(e.target as HTMLElement)) {
        // 如果传过来的区域里  不包含点击事件的区域
        callback(e)
      }
    }
  }

  // 挂载完成时
  onMounted(() => {
    // document.addEventListener('click', handler)意味着我们在整个文档（document）级别上监听点击事件。
    // 无论用户点击页面上的任何地方，我们的 handler函数都会被调用。
    // 这是一种事件委托或全局捕获的模式，它确保了不会漏掉任何一次点击行为，是实现“点击外部关闭”功能的基石。
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}

export default useClickOutside
