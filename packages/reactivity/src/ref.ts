import { activeSub } from '@vue/reactivity'
import { Link, link, propagate } from './system'

enum ReactiveFlags {
  IS_REF = '__v_isRef',
}

/**
 * ref 类
 */
class RefImpl {
  // 保存实际的值
  _value;

  // ref 标记，证明是一个 ref
  [ReactiveFlags.IS_REF] = true

  /**
   * 订阅者链表头节点 head
   */
  subs: Link

  /**
   * 订阅者链表的尾节点 tail
   */
  subsTail: Link
  constructor(value) {
    this._value = value
  }

  get value() {
    // 收集依赖
    if (activeSub) {
      trackRef(this)
    }
    return this._value
  }

  set value(newValue) {
    // 触发更新
    this._value = newValue
    triggerRef(this)
  }
}

export function ref(value) {
  return new RefImpl(value)
}

/**
 * 判断是不是一个 ref
 * @param value
 */
export function isRef(value) {
  return !!value && value[ReactiveFlags.IS_REF]
}

/**
 * 收集依赖，建立 ref 和 effect 之间的链表关系
 */
export function trackRef(dep) {
  if (activeSub) {
    link(dep, activeSub)
  }
}

/**
 * 触发 ref 关联的 effect 重新执行
 */
export function triggerRef(dep) {
  if (dep.subs) {
    propagate(dep.subs)
  }
}
