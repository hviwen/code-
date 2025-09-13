/*
### 51. 有效数独
**描述**：判断 9x9 的数独板是否有效。
- 每行必须包含数字 1-9，不能重复。
- 每列必须包含数字 1-9，不能重复。
- 九个 3x3 的子方格中的每一个必须包含数字 1-9，不能重复。

**输入**：二维数组 (9x9)
**输出**：布尔值

**示例**：
```javascript
isValidSudoku([
 ["5","3",".",".","7",".",".",".","."],
 ["6",".",".","1","9","5",".",".","."],
 [".","9","8",".",".",".",".","6","."],
 ["8",".",".",".","6",".",".",".","3"],
 ["4",".",".","8",".","3",".",".","1"],
 ["7",".",".",".","2",".",".",".","6"],
 [".","6",".",".",".",".","2","8","."],
 [".",".",".","4","1","9",".",".","5"],
 [".",".",".",".","8",".",".","7","9"]
]) // 返回 true
```*/
function isValidSudoku(arr) {
  const rows = Array.from({ length: 9 }, () => new Set())
  const columns = Array.from({ length: 9 }, () => new Set())
  const blocks = Array.from({ length: 9 }, () => new Set())

  for (let c = 0; c < 9; c++) {
    for (let r = 0; r < 9; r++) {
      const elem = arr[c][r]
      if (elem === '.') continue
      if (!/^[1-9]$/.test(elem)) return false

      const boxIndex = Math.floor(c / 3) * 3 + Math.floor(r / 3)
      console.log('boxIndex', boxIndex)

      if (rows[r].has(elem)) return false
      rows[r].add(elem)

      if (columns[c].has(elem)) return false
      columns[c].add(elem)

      if (blocks[boxIndex].has(elem)) return false
      blocks[boxIndex].add(elem)
    }
  }
  return true
}

/*
### 52. 跳跃游戏
**描述**：确定你是否能够到达数组的最后一个索引。
- 从索引 0 开始，每个元素表示你在该位置的最大跳跃长度。
- 如果能到达最后一个索引，返回 true，否则返回 false。

**输入**：非负整数数组
**输出**：布尔值

**示例**：
```javascript
canJump([2,3,1,1,4]) // 返回 true
canJump([3,2,1,0,4]) // 返回 false
```*/
