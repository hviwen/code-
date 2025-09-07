class MinHeap {
  constructor() {
    this.heap = []
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2)
  }

  getLeftIndex(i) {
    return i * 2 + 1
  }

  getRightIndex(i) {
    return i * 2 + 2
  }

  swap(i1, i2) {
    ;[this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]]
  }

  insert(value) {
    this.heap.push(value)
    this.bubbleUp()
  }

  bubbleUp() {
    let index = this.heap.length - 1
    while (index > 0) {
      const parentIndex = this.getParentIndex(index)
      if (this.heap[parentIndex] > this.heap[index]) {
        this.swap(parentIndex, index)
        index = parentIndex
      } else {
        break
      }
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null
    if (this.heap.length === 1) return this.heap.pop()

    const root = this.heap[0]
    this.heap[0] = this.heap.pop()
    this.bubbleDown(0)
    return root
  }

  bubbleDown(index) {
    const left = this.getLeftIndex(index)
    const right = this.getRightIndex(index)
    let smallest = index

    if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
      smallest = left
    }

    if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
      smallest = right
    }

    if (smallest !== index) {
      this.swap(index, smallest)
      this.bubbleDown(smallest)
    }
  }

  // 打印为可视化树形结构（侧向展示）
  toVisualString(heap = this.heap) {
    if (!heap || heap.length === 0) return '(empty)'
    const lines = []
    const traverse = (i, prefix, isLeft) => {
      const left = i * 2 + 1
      const right = i * 2 + 2
      if (right < heap.length) {
        traverse(right, prefix + (isLeft ? '│   ' : '    '), false)
      }
      lines.push(prefix + (isLeft ? '└── ' : '┌── ') + heap[i])
      if (left < heap.length) {
        traverse(left, prefix + (isLeft ? '    ' : '│   '), true)
      }
    }
    traverse(0, '', true)
    return lines.join('\n')
  }

  print() {
    console.log(this.toVisualString(this.heap))
  }
}

const heap = new MinHeap()
heap.insert(10)
heap.insert(5)
heap.insert(15)
heap.insert(2)
heap.insert(7)
heap.print()
