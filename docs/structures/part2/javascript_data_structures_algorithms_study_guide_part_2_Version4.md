```javascript
function rotate90ClockwiseByLayers(matrix) {
  const n = matrix.length;
  
  for (let layer = 0; layer < Math.floor(n / 2); layer++) {
    const first = layer;
    const last = n - 1 - layer;
    
    for (let i = first; i < last; i++) {
      const offset = i - first;
      
      // 保存顶部
      const top = matrix[first][i];
      
      // 左边 -> 顶部
      matrix[first][i] = matrix[last - offset][first];
      
      // 底部 -> 左边
      matrix[last - offset][first] = matrix[last][last - offset];
      
      // 右边 -> 底部
      matrix[last][last - offset] = matrix[i][last];
      
      // 顶部 -> 右边
      matrix[i][last] = top;
    }
  }
  
  return matrix; // 返回原矩阵（已修改）
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(rotate90ClockwiseByLayers(matrix));
/*
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3]
]
*/
```

- 时间复杂度：O(n²)
- 空间复杂度：O(1)（原地操作）
- 优点：直观地理解旋转过程，一次移动四个元素
- 缺点：代码稍复杂，仅适用于方阵

**2. 90度逆时针旋转**

```javascript
function rotate90CounterClockwise(matrix) {
  const n = matrix.length;
  const result = Array(n).fill().map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[n - 1 - j][i] = matrix[i][j];
    }
  }
  
  return result;
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(rotate90CounterClockwise(matrix));
/*
[
  [3, 6, 9],
  [2, 5, 8],
  [1, 4, 7]
]
*/
```

原地逆时针旋转：

```javascript
function rotate90CounterClockwiseInPlace(matrix) {
  const n = matrix.length;
  
  // 转置矩阵
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  
  // 垂直翻转每一行（或者说交换每行的元素）
  for (let i = 0; i < Math.floor(n / 2); i++) {
    for (let j = 0; j < n; j++) {
      [matrix[i][j], matrix[n - 1 - i][j]] = [matrix[n - 1 - i][j], matrix[i][j]];
    }
  }
  
  return matrix;
}
```

**3. 180度旋转**

```javascript
function rotate180(matrix) {
  const n = matrix.length;
  const m = matrix[0].length;
  const result = Array(n).fill().map(() => Array(m).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      result[n - 1 - i][m - 1 - j] = matrix[i][j];
    }
  }
  
  return result;
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(rotate180(matrix));
/*
[
  [9, 8, 7],
  [6, 5, 4],
  [3, 2, 1]
]
*/
```

原地 180 度旋转（适用于任何矩形矩阵）：

```javascript
function rotate180InPlace(matrix) {
  const n = matrix.length;
  const m = matrix[0].length;
  
  // 考虑矩阵可能是长方形的情况
  for (let i = 0; i < Math.floor(n / 2) + (n % 2); i++) {
    for (let j = 0; j < m; j++) {
      // 跳过中心元素（如果矩阵大小是奇数）
      if (i === Math.floor(n / 2) && j === Math.floor(m / 2) && n % 2 === 1 && m % 2 === 1) {
        continue;
      }
      
      // 交换对角位置的元素
      if (i < Math.floor(n / 2) || (i === Math.floor(n / 2) && j < Math.floor(m / 2))) {
        [matrix[i][j], matrix[n - 1 - i][m - 1 - j]] = [matrix[n - 1 - i][m - 1 - j], matrix[i][j]];
      }
    }
  }
  
  return matrix;
}
```

**4. 处理非方阵的旋转**

对于非方阵（行数≠列数），90度旋转后尺寸会改变：

```javascript
function rotateNonSquareMatrix(matrix) {
  const n = matrix.length;     // 行数
  const m = matrix[0].length;  // 列数
  
  // 注意：旋转90度后，行列互换
  const result = Array(m).fill().map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      result[j][n - 1 - i] = matrix[i][j];
    }
  }
  
  return result;
}

const nonSquareMatrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8]
];

console.log(rotateNonSquareMatrix(nonSquareMatrix));
/*
[
  [5, 1],
  [6, 2],
  [7, 3],
  [8, 4]
]
*/
```

**算法优化**

在处理大型矩阵时，可以考虑优化旋转算法：

1. **分块处理**：对于非常大的矩阵，可以将其分成小块分别旋转，提高缓存效率

2. **利用位操作**：对于某些特殊类型的矩阵（如二进制矩阵），可以使用位操作提高效率

3. **并行处理**：在支持并行的环境中，可以并行处理矩阵的不同部分

**最佳实践**：

1. 对于方阵：
   - 如果不需要保留原矩阵，使用原地旋转算法节省空间
   - 如果需要保留原矩阵，使用创建新矩阵的方法

2. 对于非方阵：
   - 由于行列数会改变，通常需要创建新矩阵
   - 确保正确计算旋转后的新维度

3. 优化提示：
   - 对于连续旋转（如旋转270度），可以将其分解为多次90度旋转
   - 或者直接实现特定角度的旋转算法
   - 测试边界情况，如空矩阵、1×1矩阵或非规则矩阵

### 使用场景选择指南

**何时使用二维数组**：
- 表示表格数据或网格结构
- 实现矩阵运算和线性代数算法
- 图像处理和像素操作
- 游戏开发中的地图和棋盘
- 动态规划问题的状态存储

**何时使用三维及更高维数组**：
- 3D 图形和体素数据
- 时间序列的二维数据（时间作为第三维）
- 科学计算中的多维数据分析
- 多层神经网络的权重存储
- 复杂系统的状态表示

**多维数组 vs 一维数组**：
- 多维数组：
  - 优点：结构清晰，直观表示多维数据
  - 缺点：访问可能较慢，内存可能不连续
- 一维数组（映射多维坐标）：
  - 优点：内存连续，访问更快
  - 缺点：索引计算复杂，代码可读性差

**多维数组 vs 对象数组**：
- 多维数组：
  - 优点：内存效率高，访问速度快
  - 缺点：结构固定，不易扩展
- 对象数组：
  - 优点：灵活，可存储异构数据，易于扩展
  - 缺点：内存开销大，访问速度较慢

**不同遍历方式的选择**：
- 嵌套 for 循环：通用且高效，需要索引时使用
- for...of 循环：简洁，不需要索引时使用
- 递归：处理未知深度的嵌套数组
- map/forEach：函数式风格，转换数据时使用

**内存效率考虑**：
- 预分配数组大小可提高性能
- 对于大型稀疏矩阵，考虑使用映射或压缩存储
- 创建二维数组时避免引用相同的子数组
- 处理完数据后及时释放不需要的大型数组

**优缺点对比**：

优点：
- 直观表示多维数据结构
- 适合矩阵运算和空间关系
- 高效的随机访问（通过索引）
- 便于实现许多经典算法

缺点：
- 内存使用可能不够高效，特别是对于稀疏数据
- 维度增加导致复杂度快速增长
- 在 JavaScript 中实现不如一些专业数学库高效
- 深拷贝和传递需要特别注意

### 记忆要点总结

- **创建二维数组**：
  - 使用 `Array.from` 或嵌套 `map` 创建，避免 `fill([])` 陷阱
  - 示例: `Array.from({ length: rows }, () => Array(cols).fill(0))`
  - 创建时确保每行是独立数组，避免引用相同数组

- **访问和修改**：
  - 使用双索引访问：`matrix[row][column]`
  - 遍历通常使用嵌套循环
  - 检查边界避免 "undefined" 错误

- **常见操作**：
  - 转置：行列互换 `result[j][i] = matrix[i][j]`
  - 旋转：90°、180°、270°
  - 对角线遍历：`matrix[i][i]`（主对角线）和 `matrix[i][n-1-i]`（反对角线）
  - 边界遍历：处理矩阵的外层元素

- **特殊矩阵**：
  - 稀疏矩阵：大多数元素为零或同一值
  - 三角矩阵：对角线以下或以上元素为零
  - 对称矩阵：关于主对角线对称
  - 单位矩阵：主对角线为1，其他为0

- **性能考虑**：
  - 按行优先顺序访问（行优先存储）更高效
  - 预分配空间避免动态调整大小
  - 大型矩阵操作考虑分块处理
  - 对重复计算使用缓存或记忆化