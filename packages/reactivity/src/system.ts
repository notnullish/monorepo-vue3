/**
 * 链表节点
 */
export interface Link {
  // 保存 effect
  sub: Function
  // 下一个节点
  nextSub: Link | undefined
  // 上一个节点
  prevSub: Link | undefined
}

/**
 * 链接链表关系
 * @param dep
 * @param sub
 */
export function link(dep, sub) {
  const newLink: Link = {
    sub,
    nextSub: undefined,
    prevSub: undefined,
  }

  /**
   * 关联链表关系，两种情况
   * 1. 尾节点有，往尾节点后面加
   * 2. 尾节点没有，表示第一次关联，就往头节点加，头尾相同
   */
  if (dep.subsTail) {
    dep.subsTail.nextSub = newLink
    newLink.prevSub = dep.subsTail
    dep.subsTail = newLink
  } else {
    dep.subs = newLink
    dep.subsTail = newLink
  }
}

/**
 * 传播更新
 * @param subs
 */
export function propagate(subs) {
  // 通知 effect 重新执行，获取最新的值
  let link = subs
  let queuedEffect = []
  while (link) {
    queuedEffect.push(link.sub)
    link = link.nextSub
  }

  queuedEffect.forEach(effect => effect())
}
