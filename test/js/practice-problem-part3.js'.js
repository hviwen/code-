/*
### 70. 反转字符串中的单词
**描述**：反转字符串中单词的顺序。
- 单词被定义为非空格字符序列。
- 输入字符串可能包含前导或尾随空格。
- 将单词之间的多个空格减少为单个空格。

**输入**：字符串
**输出**：字符串

**示例**：
```javascript
reverseWords("the sky is blue") // 返回 "blue is sky the"
reverseWords("  hello world  ") // 返回 "world hello"
```*/

function reverseWords(str) {
  const strArr = str.trim().split(/\s/)
  const stack = []
  for (let i = strArr.length - 1; i >= 0; i--) {
    stack.push(strArr[i])
  }
  return stack.join(' ')
}

/*
### 71. 用队列实现栈
**描述**：仅使用队列实现后进先出 (LIFO) 栈。
- 使用标准队列操作：push、peek、pop、size 等。

**输入**：操作
**输出**：操作结果

**示例**：
```javascript
const stack = new StackUsingQueues();
stack.push(1);
stack.push(2);
stack.top(); // 返回 2
stack.pop(); // 返回 2
stack.empty(); // 返回 false
```*/
class StackUsingQueues {
  constructor() {
    this.inStack = []
    this.outStack = []
  }

  #transform() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop())
      }
    }
  }

  push(key) {
    this.inStack.push(key)
  }

  pop() {
    this.#transform()
    return this.outStack.length === 0 ? null : this.outStack.pop()
  }

  top() {
    this.#transform()
    return this.outStack.length === 0 ? null : this.outStack[this.outStack.length - 1]
  }

  empty() {
    return this.outStack === 0
  }
}
