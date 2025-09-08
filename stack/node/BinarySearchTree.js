export class BNode {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null
  }

  insert(key) {
    const newNode = new BNode(key)
    if (!this.root) {
      this.root = newNode
    } else {
      this.insertNode(this.root, newNode)
    }
  }

  insertNode(node, newNode) {
    if (newNode.key < node.key) {
      if (!node.left) node.left = newNode
      else this.insertNode(node.left, newNode)
    } else if (!node.right) node.right = newNode
      else this.insertNode(node.right, newNode)
  }

  search(node, key) {
    // Return true if key exists in the BST starting from node
    if (!node) return false
    if (node.key === key) return true
    if (key < node.key) {
      return this.search(node.left, key)
    }
    return this.search(node.right, key)
  }

  order(node = this.root, type = '') {
    if (!node) return
    // 前序遍历
    if (type === 'pre') {
      console.log(node.key)
      this.order(node.left, type)
      this.order(node.right, type)
      return
    }

    // 中序遍历
    if (type === 'in') {
      this.order(node.left, type)
      console.log(node.key)
      this.order(node.right, type)
      return
    }

    // 后序遍历
    if (type === 'post') {
      this.order(node.left, type)
      this.order(node.right, type)
      console.log(node.key)
    }
  }

  levelOrder(root = this.root) {
    if (!root) return []
    const queue = [root]
    const result = []

    while (queue.length) {
      const node = queue.shift()
      result.push(node.key)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    return result
  }

  // 打印为可视化树形结构（侧向展示）
  toVisualString(node = this.root) {
    if (!node) return '(empty)'
    const lines = []
    const traverse = (curr, prefix, isLeft) => {
      if (curr.right) {
        traverse(curr.right, prefix + (isLeft ? '│   ' : '    '), false)
      }
      lines.push(prefix + (isLeft ? '└── ' : '┌── ') + curr.key)
      if (curr.left) {
        traverse(curr.left, prefix + (isLeft ? '    ' : '│   '), true)
      }
    }
    traverse(node, '', true)
    return lines.join('\n')
  }

  print() {
    console.log(this.toVisualString())
  }
}

// test
const tree = new BinarySearchTree()
tree.insert(11)
tree.insert(7)
tree.insert(15)
tree.insert(5)
tree.insert(3)
tree.insert(9)
tree.insert(8)
tree.insert(10)
tree.insert(13)
tree.insert(12)
tree.insert(14)
tree.insert(20)
tree.insert(18)
tree.insert(25)
tree.insert(6)

// tree.order(tree.root, 'pre')

// tree.order(tree.root,'in')

// tree.order(tree.root,'post')

// 是否可以打印一个树形结构
// tree.print()
