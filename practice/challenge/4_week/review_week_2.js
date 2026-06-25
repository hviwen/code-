/*
#### Day 8（树遍历） — 主题目：Binary Tree Preorder Traversal

**难度**：简单

**题目描述**：给定二叉树的根节点，返回它的前序遍历（根 → 左 → 右）。

**输入**：`root: TreeNode | null`（二叉树节点, `val,left,right`）

**输出**：`number[]`（遍历顺序数组）

**示例**：

```
输入: [1,null,2,3]
输出: [1,2,3]
```

**约束**：节点数可达 10^4，注意递归深度问题。

**可选题**：Inorder / Postorder Traversal（迭代实现）
*
*/

class TreeNode {
  constructor(val, left, right) {
    this.val = val
    this.left = left
    this.right = right
  }
}

function getBinaryTreePreorderTraversal(root = []) {
  const res = []
  if (root === null) return res

  const stack = [root]
  while (stack.length > 0) {
    const node = stack.pop()
    res.push(node.val)

    if (node.left !== null) stack.push(node.left)
    if (node.right !== null) stack.push(node.right)
  }
  return res
}
