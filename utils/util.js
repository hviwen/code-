// 防抖
export function debounce(fn, delay = 300) {
  let timer = null

  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

class SimpleRange {
  constructor(start, end) {
    this.start = start
    this.end = end
  }
  *[Symbol.iterator]() {
    for (let i = this.start; i < this.end; i++) {
      yield i
    }
  }
}

class TreeNode {
  constructor(value) {
    this.value = value
    this.children = []
  }

  addChild(child){
    this.children.push(child)
    return this
  }

  *[Symbol.iterator]() {
    yield this.value
    for (const child of this.children) {
      yield* child
    }
  }

  *breadthFirst() {
    const queue = [this]
    while (queue.length) {
      const node = queue.shift()
      yield node.value
      queue.push(...node.children)
    }
  }
}

const root = new TreeNode('root')
const child1 = new TreeNode('child1')
const child2 = new TreeNode('child2')
const grandchild = new TreeNode('grandchild')

root.addChild(child1).addChild(child2)
child1.addChild(grandchild)

console.log('Tree depth-first traversal:')
for (const value of root) {
  console.log(value) // root, child1, grandchild, child2
}

console.log('Tree breadth-first traversal:')
for (const value of root.breadthFirst()) {
  console.log(value) // root, child1, child2, grandchild
}
