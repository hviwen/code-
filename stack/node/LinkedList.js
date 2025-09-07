class Node {
  constructor(element) {
    this.element = element
    this.next = null
  }
}

class LinkedList {
  constructor() {
    this.header = null
    this.count = 0
  }
  append(element) {
    const node = new Node(element)
    if (this.header === null) {
      this.header = node
    } else {
      let current = this.header
      while (current.next) {
        current = current.next
      }
      current.next = node
    }
    this.count++
  }

  insert(position, element) {
    if (position < 0 || position > this.count) return false
    const node = new Node(element)
    if (position === 0) {
      node.next = this.header
      this.header = node
    } else {
      const previous = this.getElementAt(position - 1)
      node.next = previous.next
      previous.next = node
    }
    this.count++
    return true
  }

  removeAt(position) {
    if (position < 0 || position > this.count) return null
    const current = this.getElementAt(position)
    if (current === this.header) {
      this.header = current.next
    } else {
      const previous = this.getElementAt(position - 1)
      previous.next = current.next
    }
    this.count--
    return current.element
  }

  getElementAt(index) {
    if (index < 0 || index >= this.count) return null
    let current = this.header
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }

  size() {
    return this.count
  }

  isEmpty() {
    return this.count === 0
  }
}
