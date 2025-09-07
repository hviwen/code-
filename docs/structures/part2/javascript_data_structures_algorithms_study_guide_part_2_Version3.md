  - `find`, `findIndex` - 查找满足条件的元素
  - `includes` - 检查是否包含特定值
  - `some`, `every` - 检查是否有/所有元素满足条件

- **数组归约**：
  - `reduce`, `reduceRight` - 将数组转换为单个值
  - 可用于求和、求积、分组、计数等复杂操作
  - 传入初始值可避免空数组错误

- **迭代方法**：
  - `forEach` - 无返回值的迭代
  - 不能中断循环（不支持 break/continue）
  - 比 for 循环更简洁但控制较少

- **数组转换**：
  - `join` - 将元素连接为字符串
  - `toString` - 默认以逗号分隔
  - `Array.from` - 从类数组对象创建数组
  - `Array.of` - 从参数创建数组

- **性能最佳实践**：
  - 优先使用末尾操作（push/pop）而非开头操作
  - 预分配数组大小可提高性能
  - 考虑使用不可变方法以避免副作用
  - 复杂操作优先使用数组内置方法

## 二维和多维数组

### 知识点介绍

二维和多维数组是存储和操作表格数据、矩阵和更复杂数据结构的基础。在 JavaScript 中，多维数组实际上是"数组的数组"，即数组的元素本身也是数组。这种数据结构广泛应用于图像处理、游戏开发、科学计算和表格数据处理等领域。理解如何创建、访问和操作多维数组是处理复杂数据结构的关键技能。

### 知识点系统梳理

**在知识体系中的位置**：
- 是基本数组概念的扩展和深化
- 是矩阵运算和图数据结构的基础
- 与表格数据处理和网格算法紧密相关
- 是实现图像处理和游戏地图的数据基础

**与其他概念的关联关系**：
- 与矩阵运算关联，是线性代数算法的基础
- 与图论算法相关，可以表示邻接矩阵
- 与动态规划问题密切相关，如路径规划
- 与递归算法结合，解决多维空间中的问题

**核心特性和属性列表**：

1. 二维数组基础：
   - 表示：行和列组成的表格结构
   - 实现：数组的数组，外层数组表示行，内层数组表示列
   - 访问：使用两个索引 `array[row][column]`
   - 常见形状：矩形（每行长度相同）和锯齿形（每行长度可变）

2. 多维数组：
   - 三维数组：数组的数组的数组，表示立方体结构
   - 更高维度：可以无限嵌套，但通常超过三维会变得难以处理
   - 访问：使用多个索引 `array[dim1][dim2][dim3]...`

3. 创建和初始化：
   - 字面量方式：嵌套数组字面量
   - 循环方式：使用嵌套循环
   - 填充方式：使用 Array.from 或 map 方法
   - 注意深拷贝问题：避免引用相同的子数组

4. 常见操作：
   - 遍历：使用嵌套循环或递归
   - 查找：在多维空间中搜索元素
   - 转置：行列互换（针对二维数组/矩阵）
   - 旋转：顺时针或逆时针旋转数组
   - 合并：连接多个多维数组

### 使用示例

```javascript
// 创建二维数组的不同方法

// 1. 使用字面量（最直观）
const matrix1 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// 2. 嵌套循环创建
const rows = 3;
const cols = 4;
const matrix2 = [];

for (let i = 0; i < rows; i++) {
  matrix2[i] = [];
  for (let j = 0; j < cols; j++) {
    matrix2[i][j] = i * cols + j + 1;
  }
}

console.log(matrix2);
// [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9, 10, 11, 12]
// ]

// 3. 使用 Array.from 创建
const matrix3 = Array.from({ length: rows }, (_, i) =>
  Array.from({ length: cols }, (_, j) => i * cols + j + 1)
);

console.log(matrix3);
// [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9, 10, 11, 12]
// ]

// 4. 使用 Array(n).fill().map() 创建
// 注意：避免使用 Array(rows).fill([]) 因为会创建引用相同的数组
const matrix4 = Array(rows).fill().map(() => Array(cols).fill(0));

// 5. 创建具有默认值的二维数组
const matrix5 = Array(rows).fill().map(() => Array(cols).fill(-1));

// 访问二维数组元素
console.log(matrix1[1][2]); // 6 (第二行，第三列)

// 修改元素
matrix1[0][0] = 10;
console.log(matrix1);
// [
//   [10, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9]
// ]

// 遍历二维数组
// 1. 使用嵌套 for 循环
for (let i = 0; i < matrix1.length; i++) {
  for (let j = 0; j < matrix1[i].length; j++) {
    console.log(`Element at [${i}][${j}]: ${matrix1[i][j]}`);
  }
}

// 2. 使用 for...of 循环
for (const row of matrix1) {
  for (const element of row) {
    console.log(`Element: ${element}`);
  }
}

// 3. 使用 forEach
matrix1.forEach((row, i) => {
  row.forEach((element, j) => {
    console.log(`Element at [${i}][${j}]: ${element}`);
  });
});

// 4. 使用 map 转换二维数组
const doubled = matrix1.map(row => row.map(value => value * 2));
console.log(doubled);
// [
//   [20, 4, 6],
//   [8, 10, 12],
//   [14, 16, 18]
// ]

// 获取二维数组的行数和列数
const numRows = matrix1.length;
const numCols = matrix1[0].length; // 假设矩形数组
console.log(`Rows: ${numRows}, Columns: ${numCols}`); // Rows: 3, Columns: 3

// 创建三维数组
const depth = 2;
const cube = Array(depth).fill().map(() => 
  Array(rows).fill().map(() => 
    Array(cols).fill(0)
  )
);

// 访问三维数组元素
cube[0][1][2] = 42; // 第一层，第二行，第三列
console.log(cube[0][1][2]); // 42

// 创建锯齿形数组（每行长度不同）
const jagged = [
  [1, 2, 3],
  [4, 5],
  [6, 7, 8, 9]
];

// 遍历锯齿形数组
for (let i = 0; i < jagged.length; i++) {
  for (let j = 0; j < jagged[i].length; j++) {
    console.log(`Element at [${i}][${j}]: ${jagged[i][j]}`);
  }
}
```

### 实战应用举例

**实例1：图像处理**

```javascript
/**
 * 简单图像处理类
 * 应用场景：图像处理、滤镜应用
 */
class ImageProcessor {
  /**
   * @param {number[][]} pixels - 表示图像的二维数组（灰度值 0-255）
   */
  constructor(pixels) {
    // 深拷贝输入数组，避免修改原始数据
    this.pixels = pixels.map(row => [...row]);
    this.height = pixels.length;
    this.width = pixels[0].length;
  }
  
  /**
   * 获取图像的副本
   * @return {number[][]} 图像的深拷贝
   */
  getImage() {
    return this.pixels.map(row => [...row]);
  }
  
  /**
   * 应用阈值处理（二值化）
   * @param {number} threshold - 阈值（0-255）
   * @return {ImageProcessor} 当前实例，支持链式调用
   */
  applyThreshold(threshold) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.pixels[y][x] = this.pixels[y][x] > threshold ? 255 : 0;
      }
    }
    return this;
  }
  
  /**
   * 应用反转效果
   * @return {ImageProcessor} 当前实例，支持链式调用
   */
  invert() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.pixels[y][x] = 255 - this.pixels[y][x];
      }
    }
    return this;
  }
  
  /**
   * 应用模糊效果（均值滤波）
   * @param {number} radius - 模糊半径
   * @return {ImageProcessor} 当前实例，支持链式调用
   */
  blur(radius = 1) {
    // 创建输出图像的副本
    const output = Array(this.height).fill().map(() => Array(this.width).fill(0));
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let sum = 0;
        let count = 0;
        
        // 计算邻域像素的平均值
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            
            // 检查边界
            if (ny >= 0 && ny < this.height && nx >= 0 && nx < this.width) {
              sum += this.pixels[ny][nx];
              count++;
            }
          }
        }
        
        output[y][x] = Math.round(sum / count);
      }
    }
    
    this.pixels = output;
    return this;
  }
  
  /**
   * 应用边缘检测（简化的 Sobel 算子）
   * @return {ImageProcessor} 当前实例，支持链式调用
   */
  detectEdges() {
    // 创建输出图像的副本
    const output = Array(this.height).fill().map(() => Array(this.width).fill(0));
    
    // Sobel 算子
    const sobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];
    
    const sobelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ];
    
    // 应用 Sobel 算子
    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        let gx = 0;
        let gy = 0;
        
        // 应用卷积
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            const pixel = this.pixels[y + ky - 1][x + kx - 1];
            gx += pixel * sobelX[ky][kx];
            gy += pixel * sobelY[ky][kx];
          }
        }
        
        // 计算梯度幅值
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        output[y][x] = Math.min(255, Math.max(0, Math.round(magnitude)));
      }
    }
    
    this.pixels = output;
    return this;
  }
  
  /**
   * 旋转图像
   * @param {number} angle - 旋转角度（度数，支持 90、180、270）
   * @return {ImageProcessor} 当前实例，支持链式调用
   */
  rotate(angle) {
    angle = ((angle % 360) + 360) % 360; // 归一化到 0-359
    
    let rotated;
    
    switch (angle) {
      case 90:
        rotated = Array(this.width).fill().map(() => Array(this.height).fill(0));
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            rotated[x][this.height - 1 - y] = this.pixels[y][x];
          }
        }
        break;
        
      case 180:
        rotated = Array(this.height).fill().map(() => Array(this.width).fill(0));
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            rotated[this.height - 1 - y][this.width - 1 - x] = this.pixels[y][x];
          }
        }
        break;
        
      case 270:
        rotated = Array(this.width).fill().map(() => Array(this.height).fill(0));
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            rotated[this.width - 1 - x][y] = this.pixels[y][x];
          }
        }
        break;
        
      default:
        return this; // 不支持的角度，不做任何操作
    }
    
    // 更新维度
    if (angle === 90 || angle === 270) {
      [this.width, this.height] = [this.height, this.width];
    }
    
    this.pixels = rotated;
    return this;
  }
  
  /**
   * 调整图像对比度
   * @param {number} factor - 对比度因子 (0.0-2.0)
   * @return {ImageProcessor} 当前实例，支持链式调用
   */
  adjustContrast(factor) {
    const avg = this.calculateAverage();
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const pixel = this.pixels[y][x];
        const adjusted = Math.round(avg + (pixel - avg) * factor);
        this.pixels[y][x] = Math.min(255, Math.max(0, adjusted));
      }
    }
    
    return this;
  }
  
  /**
   * 计算图像的平均灰度值
   * @return {number} 平均灰度值
   * @private
   */
  calculateAverage() {
    let sum = 0;
    let count = 0;
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        sum += this.pixels[y][x];
        count++;
      }
    }
    
    return Math.round(sum / count);
  }
  
  /**
   * 裁剪图像
   * @param {number} startX - 起始 X 坐标
   * @param {number} startY - 起始 Y 坐标
   * @param {number} width - 裁剪宽度
   * @param {number} height - 裁剪高度
   * @return {ImageProcessor} 当前实例，支持链式调用
   */
  crop(startX, startY, width, height) {
    // 验证参数
    if (startX < 0 || startY < 0 || 
        startX + width > this.width || 
        startY + height > this.height) {
      throw new Error('Crop dimensions out of bounds');
    }
    
    const cropped = Array(height).fill().map(() => Array(width).fill(0));
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        cropped[y][x] = this.pixels[startY + y][startX + x];
      }
    }
    
    this.pixels = cropped;
    this.height = height;
    this.width = width;
    
    return this;
  }
  
  /**
   * 将处理后的图像导出为 ASCII 艺术
   * @param {string[]} asciiChars - 用于表示不同灰度级别的字符，从暗到亮
   * @return {string} ASCII 艺术字符串
   */
  toAsciiArt(asciiChars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@']) {
    const asciiArt = [];
    const charLength = asciiChars.length - 1;
    
    for (let y = 0; y < this.height; y++) {
      let line = '';
      for (let x = 0; x < this.width; x++) {
        // 将像素值（0-255）映射到字符索引
        const charIndex = Math.round((this.pixels[y][x] / 255) * charLength);
        line += asciiChars[charIndex];
      }
      asciiArt.push(line);
    }
    
    return asciiArt.join('\n');
  }
}

// 使用示例
// 创建一个简单的 10x10 灰度图像
const createTestImage = () => {
  const image = Array(10).fill().map(() => Array(10).fill(128)); // 中灰色背景
  
  // 添加一些图案
  for (let i = 0; i < 10; i++) {
    image[i][i] = 255; // 对角线
    image[i][9 - i] = 255; // 反对角线
  }
  
  // 添加边框
  for (let i = 0; i < 10; i++) {
    image[0][i] = 255; // 上边框
    image[9][i] = 255; // 下边框
    image[i][0] = 255; // 左边框
    image[i][9] = 255; // 右边框
  }
  
  return image;
};

const testImage = createTestImage();
const processor = new ImageProcessor(testImage);

// 应用一系列处理
const processedImage = processor
  .blur()
  .detectEdges()
  .invert()
  .getImage();

// 输出为 ASCII 艺术
const asciiArt = new ImageProcessor(processedImage).toAsciiArt();
console.log(asciiArt);

// 使用链式操作
const rotatedAndThresholded = new ImageProcessor(testImage)
  .rotate(90)
  .applyThreshold(128)
  .toAsciiArt([' ', '@']);
console.log('\nRotated and thresholded:');
console.log(rotatedAndThresholded);
```

**实例2：游戏开发 - 迷宫生成与寻路**

```javascript
/**
 * 迷宫生成与寻路系统
 * 应用场景：游戏开发、路径规划算法
 */
class Maze {
  /**
   * @param {number} width - 迷宫宽度
   * @param {number} height - 迷宫高度
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    
    // 初始化迷宫，0 表示路径，1 表示墙
    this.grid = Array(height).fill().map(() => Array(width).fill(1));
    
    // 定义起点和终点
    this.start = { x: 1, y: 1 };
    this.end = { x: width - 2, y: height - 2 };
    
    // 生成迷宫
    this.generate();
  }
  
  /**
   * 使用递归回溯算法生成迷宫
   */
  generate() {
    // 确保起点和终点是路径
    this.grid[this.start.y][this.start.x] = 0;
    this.grid[this.end.y][this.end.x] = 0;
    
    // 从起点开始递归生成迷宫
    this.carvePassages(this.start.x, this.start.y);
    
    // 确保起点和终点周围有路径
    this.ensurePathAroundPoint(this.start.x, this.start.y);
    this.ensurePathAroundPoint(this.end.x, this.end.y);
  }
  
  /**
   * 递归回溯算法的核心
   * @param {number} x - 当前 x 坐标
   * @param {number} y - 当前 y 坐标
   */
  carvePassages(x, y) {
    // 定义四个方向：上、右、下、左
    const directions = [
      { dx: 0, dy: -2 }, // 上
      { dx: 2, dy: 0 },  // 右
      { dx: 0, dy: 2 },  // 下
      { dx: -2, dy: 0 }  // 左
    ];
    
    // 随机打乱方向
    this.shuffleArray(directions);
    
    // 尝试每个方向
    for (const dir of directions) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      
      // 检查是否在边界内且还未访问
      if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height && this.grid[ny][nx] === 1) {
        // 打通墙壁
        this.grid[y + dir.dy / 2][x + dir.dx / 2] = 0;
        this.grid[ny][nx] = 0;
        
        // 递归继续生成
        this.carvePassages(nx, ny);
      }
    }
  }
  
  /**
   * 确保指定点周围有路径
   * @param {number} x - 点的 x 坐标
   * @param {number} y - 点的 y 坐标
   */
  ensurePathAroundPoint(x, y) {
    const directions = [
      { dx: 0, dy: -1 }, // 上
      { dx: 1, dy: 0 },  // 右
      { dx: 0, dy: 1 },  // 下
      { dx: -1, dy: 0 }  // 左
    ];
    
    // 确保至少有一个方向是路径
    let hasPath = false;
    
    for (const dir of directions) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      
      if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
        if (this.grid[ny][nx] === 0) {
          hasPath = true;
          break;
        }
      }
    }
    
    // 如果没有路径，随机打通一个方向
    if (!hasPath) {
      this.shuffleArray(directions);
      
      for (const dir of directions) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;
        
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          this.grid[ny][nx] = 0;
          break;
        }
      }
    }
  }
  
  /**
   * 辅助方法：随机打乱数组
   * @param {Array} array - 要打乱的数组
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  /**
   * 使用广度优先搜索（BFS）寻找从起点到终点的最短路径
   * @return {Array|null} 路径坐标数组，如果没有路径则返回 null
   */
  findPath() {
    // 使用 BFS 寻找路径
    const queue = [{ x: this.start.x, y: this.start.y, path: [] }];
    const visited = Array(this.height).fill().map(() => Array(this.width).fill(false));
    visited[this.start.y][this.start.x] = true;
    
    const directions = [
      { dx: 0, dy: -1 }, // 上
      { dx: 1, dy: 0 },  // 右
      { dx: 0, dy: 1 },  // 下
      { dx: -1, dy: 0 }  // 左
    ];
    
    while (queue.length > 0) {
      const { x, y, path } = queue.shift();
      
      // 如果到达终点
      if (x === this.end.x && y === this.end.y) {
        return [...path, { x, y }];
      }
      
      // 尝试四个方向
      for (const dir of directions) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;
        
        // 检查是否在边界内，是路径，且未访问过
        if (
          nx >= 0 && nx < this.width && 
          ny >= 0 && ny < this.height && 
          this.grid[ny][nx] === 0 && 
          !visited[ny][nx]
        ) {
          visited[ny][nx] = true;
          queue.push({
            x: nx,
            y: ny,
            path: [...path, { x, y }]
          });
        }
      }
    }
    
    // 如果没有找到路径
    return null;
  }
  
  /**
   * 使用 A* 算法寻找路径
   * @return {Array|null} 路径坐标数组，如果没有路径则返回 null
   */
  findPathAStar() {
    // 启发式函数：曼哈顿距离
    const heuristic = (x, y) => {
      return Math.abs(x - this.end.x) + Math.abs(y - this.end.y);
    };
    
    // 优先队列，按 f 值（g + h）排序
    const openSet = [{
      x: this.start.x,
      y: this.start.y,
      g: 0,
      h: heuristic(this.start.x, this.start.y),
      f: heuristic(this.start.x, this.start.y),
      path: []
    }];
    
    const closedSet = Array(this.height).fill().map(() => Array(this.width).fill(false));
    
    const directions = [
      { dx: 0, dy: -1 }, // 上
      { dx: 1, dy: 0 },  // 右
      { dx: 0, dy: 1 },  // 下
      { dx: -1, dy: 0 }  // 左
    ];
    
    while (openSet.length > 0) {
      // 按 f 值排序，取最小的
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();
      
      // 如果到达终点
      if (current.x === this.end.x && current.y === this.end.y) {
        return [...current.path, { x: current.x, y: current.y }];
      }
      
      // 标记为已访问
      closedSet[current.y][current.x] = true;
      
      // 检查邻居
      for (const dir of directions) {
        const nx = current.x + dir.dx;
        const ny = current.y + dir.dy;
        
        // 检查是否在边界内，是路径，且未在关闭集中
        if (
          nx >= 0 && nx < this.width && 
          ny >= 0 && ny < this.height && 
          this.grid[ny][nx] === 0 && 
          !closedSet[ny][nx]
        ) {
          // 计算 g 值（从起点到当前点的代价）
          const g = current.g + 1;
          
          // 查找此邻居是否已在开放集中
          const existingIndex = openSet.findIndex(node => node.x === nx && node.y === ny);
          
          if (existingIndex === -1 || g < openSet[existingIndex].g) {
            // 如果不在开放集中，或找到了更短的路径
            const h = heuristic(nx, ny);
            
            if (existingIndex === -1) {
              // 添加到开放集
              openSet.push({
                x: nx,
                y: ny,
                g,
                h,
                f: g + h,
                path: [...current.path, { x: current.x, y: current.y }]
              });
            } else {
              // 更新开放集中的节点
              openSet[existingIndex].g = g;
              openSet[existingIndex].f = g + h;
              openSet[existingIndex].path = [...current.path, { x: current.x, y: current.y }];
            }
          }
        }
      }
    }
    
    // 如果没有找到路径
    return null;
  }
  
  /**
   * 将迷宫转换为可视化字符串
   * @param {Array} [path] - 可选的路径坐标数组
   * @return {string} 迷宫的字符串表示
   */
  toString(path = null) {
    // 创建结果数组
    const result = Array(this.height).fill().map(() => Array(this.width).fill(' '));
    
    // 填充墙壁和路径
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === 1) {
          result[y][x] = '█'; // 墙
        } else {
          result[y][x] = ' '; // 路径
        }
      }
    }
    
    // 标记起点和终点
    result[this.start.y][this.start.x] = 'S';
    result[this.end.y][this.end.x] = 'E';
    
    // 如果提供了路径，标记路径
    if (path) {
      for (const point of path) {
        // 跳过起点和终点
        if (
          (point.x === this.start.x && point.y === this.start.y) ||
          (point.x === this.end.x && point.y === this.end.y)
        ) {
          continue;
        }
        
        result[point.y][point.x] = '·';
      }
    }
    
    // 将二维数组转换为字符串
    return result.map(row => row.join('')).join('\n');
  }
}

// 使用示例
const maze = new Maze(21, 11); // 创建 21x11 的迷宫
console.log("迷宫：");
console.log(maze.toString());

// 使用 BFS 寻找路径
const path = maze.findPath();
console.log("\n使用 BFS 寻找的路径：");
console.log(maze.toString(path));

// 使用 A* 寻找路径
const astarPath = maze.findPathAStar();
console.log("\n使用 A* 寻找的路径：");
console.log(maze.toString(astarPath));
```

### 常见面试问题

**问题1：如何正确创建二维数组？为什么 Array(n).fill([]) 可能导致问题？**

答：在 JavaScript 中创建二维数组有多种方法，但一些常见的做法可能会导致意外问题。

**问题的来源**：
使用 `Array(n).fill([])` 来创建二维数组时，所有行都引用相同的数组实例，导致修改一行会影响所有行：

```javascript
// 错误的创建方式
const matrix = Array(3).fill([]);
matrix[0].push(1);
console.log(matrix);
// 输出: [[1], [1], [1]] - 所有行都被修改！
```

这是因为 `fill()` 使用相同的引用填充数组，而不是创建新的数组实例。

**正确的创建方式**：

1. **使用嵌套循环**：
```javascript
const rows = 3, cols = 4;
const matrix = [];
for (let i = 0; i < rows; i++) {
  matrix[i] = [];
  for (let j = 0; j < cols; j++) {
    matrix[i][j] = 0; // 或其他初始值
  }
}
```

2. **使用 Array.from**：
```javascript
const rows = 3, cols = 4;
const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
```

3. **使用 map 方法**：
```javascript
const rows = 3, cols = 4;
const matrix = Array(rows).fill().map(() => Array(cols).fill(0));
```

4. **使用数组推导式**：
```javascript
const rows = 3, cols = 4;
const matrix = [...Array(rows)].map(() => Array(cols).fill(0));
```

**为什么这些方法有效**：
这些方法对每一行都创建了新的数组实例，而不是重用同一个数组引用。这确保了修改一行不会影响其他行。

**更复杂的初始化**：
有时你可能需要更复杂的初始化逻辑：

```javascript
// 创建具有不同初始值的矩阵
const matrix = Array.from({ length: 3 }, (_, i) => 
  Array.from({ length: 4 }, (_, j) => i * 4 + j + 1)
);
console.log(matrix);
// 输出: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
```

**最佳实践**：
- 优先使用 `Array.from` 或 `map` 方法，它们最清晰
- 永远不要使用 `Array(n).fill([])` 或 `Array(n).fill(Array(m))`
- 对于大型数组，考虑使用嵌套循环以避免创建不必要的临时数组
- 创建后测试修改一个元素，确保其他元素不受影响

**问题2：如何有效地遍历多维数组？比较不同的遍历方法。**

答：遍历多维数组是处理矩阵和更复杂数据结构的基本操作。有几种方法可以实现这一点，每种方法都有其优缺点。

**常见的遍历方法**：

1. **嵌套 for 循环**：
```javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// 按行遍历
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    console.log(`matrix[${i}][${j}] = ${matrix[i][j]}`);
  }
}
```

优点：
- 最直观和灵活
- 可以轻松获取索引
- 可以从任何位置开始，以任何方向遍历
- 性能最佳，尤其是对大型数组

缺点：
- 代码较冗长
- 嵌套层级越多，代码越复杂

2. **嵌套 for...of 循环**：
```javascript
for (const row of matrix) {
  for (const element of row) {
    console.log(element);
  }
}
```

优点：
- 更简洁、更易读
- 无需担心索引边界
- 更具声明式风格

缺点：
- 无法直接获取索引（需要额外跟踪）
- 无法轻松跳过元素或修改遍历顺序
- 对于非矩形数组（锯齿状数组）也能正常工作

3. **嵌套 forEach 方法**：
```javascript
matrix.forEach((row, i) => {
  row.forEach((element, j) => {
    console.log(`matrix[${i}][${j}] = ${element}`);
  });
});
```

优点：
- 函数式风格
- 自动提供索引和元素
- 适合简单转换和操作

缺点：
- 无法使用 break 或 continue
- 可能性能略低于 for 循环（对非性能关键代码可忽略）
- 对于深度嵌套的数组，嵌套回调可能难以阅读

4. **递归遍历**（适用于不规则嵌套或未知深度）：
```javascript
function traverseNested(array, process, depth = 0, indices = []) {
  if (Array.isArray(array)) {
    array.forEach((item, index) => {
      traverseNested(item, process, depth + 1, [...indices, index]);
    });
  } else {
    process(array, depth, indices);
  }
}

// 使用示例
const nestedArray = [1, [2, [3, 4]], 5];
traverseNested(nestedArray, (value, depth, indices) => {
  console.log(`Value: ${value}, Depth: ${depth}, Indices: [${indices}]`);
});
```

优点：
- 可以处理任意深度的嵌套
- 非常灵活，可以处理不规则的数据结构
- 同时提供值、深度和完整路径

缺点：
- 性能较差，特别是对于大型深度嵌套的数组
- 代码复杂度更高
- 可能导致栈溢出（对于极深的嵌套）

5. **使用 flat() 和 forEach**（适用于简单场景）：
```javascript
// 先扁平化，再遍历
matrix.flat().forEach(element => {
  console.log(element);
});
```

优点：
- 最简洁
- 适合只需要值而不关心位置的情况

缺点：
- 丢失了元素的原始位置信息
- 创建新数组，增加内存使用
- 不适合需要保持结构的操作

6. **map 和 reduce 进行转换**：
```javascript
// 使用 map 转换每个元素
const doubled = matrix.map(row => row.map(value => value * 2));

// 使用 reduce 计算所有元素的总和
const sum = matrix.reduce((total, row) => 
  total + row.reduce((rowTotal, value) => rowTotal + value, 0), 0);
```

优点：
- 声明式而非命令式
- 结果是新数组，不修改原始数据
- 适合数据转换场景

缺点：
- 对于简单操作可能显得过于复杂
- 嵌套 map/reduce 可能难以阅读
- 性能可能不如简单循环

**性能比较**：
对于小型数组（少于几千个元素），所有方法的性能差异通常可以忽略。对于大型数组：

1. 嵌套 for 循环通常最快
2. for...of 循环次之
3. forEach 方法性能略低
4. 递归遍历对于深度嵌套数组最慢
5. 先扁平化再遍历会创建额外数组，内存使用最高

**最佳实践**：
- 对于简单的矩形二维数组，使用嵌套 for 循环或 for...of
- 需要同时访问索引和值时，使用 for 循环或 forEach
- 对于不规则或未知深度的嵌套，使用递归方法
- 对于函数式转换，使用 map 和 reduce
- 在性能关键的应用中，优先使用 for 循环

**问题3：如何在二维数组中实现矩阵转置操作？**

答：矩阵转置是将矩阵的行和列互换的操作，即原始矩阵中的 `[i][j]` 元素在转置后变为 `[j][i]` 元素。在二维数组中实现转置有多种方法：

**方法1：使用嵌套循环（标准方法）**

```javascript
function transposeMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // 创建新矩阵，行列互换
  const result = Array(cols).fill().map(() => Array(rows).fill(0));
  
  // 填充新矩阵
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  
  return result;
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];

const transposed = transposeMatrix(matrix);
console.log(transposed);
// 输出: [[1, 4], [2, 5], [3, 6]]
```

这是最直观的方法，适用于任何尺寸的矩阵。

**方法2：使用 Array.from 和 map**

```javascript
function transposeMatrix(matrix) {
  return Array.from({ length: matrix[0].length }, (_, colIndex) => 
    matrix.map(row => row[colIndex])
  );
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];

const transposed = transposeMatrix(matrix);
console.log(transposed);
// 输出: [[1, 4], [2, 5], [3, 6]]
```

这种方法更简洁，利用了函数式编程的特性，但可能不如循环直观。

**方法3：使用展开运算符和 map（仅适用于特定情况）**

```javascript
function transposeMatrix(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];

const transposed = transposeMatrix(matrix);
console.log(transposed);
// 输出: [[1, 4], [2, 5], [3, 6]]
```

这是最简洁的方法，但假设矩阵至少有一行。

**方法4：使用 reduce（函数式风格）**

```javascript
function transposeMatrix(matrix) {
  return matrix.reduce((result, row) => {
    row.forEach((element, colIndex) => {
      if (!result[colIndex]) result[colIndex] = [];
      result[colIndex].push(element);
    });
    return result;
  }, []);
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];

const transposed = transposeMatrix(matrix);
console.log(transposed);
// 输出: [[1, 4], [2, 5], [3, 6]]
```

这种方法展示了如何使用 reduce 实现更复杂的数组转换。

**原地转置（仅适用于方阵）**：

对于方阵（行数=列数），可以实现原地转置，无需额外内存：

```javascript
function transposeSquareMatrixInPlace(matrix) {
  const n = matrix.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // 交换 matrix[i][j] 和 matrix[j][i]
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  
  return matrix; // 返回原矩阵（已修改）
}

const squareMatrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

transposeSquareMatrixInPlace(squareMatrix);
console.log(squareMatrix);
// 输出: [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
```

注意这种方法只适用于方阵，并且会修改原始矩阵。

**性能考虑**：

- 对于小型矩阵，所有方法的性能差异通常可以忽略
- 对于大型矩阵，嵌套循环通常最高效，因为它最直接
- 原地转置对于方阵最节省内存，但修改了原始数据
- 函数式方法（map、reduce）可能创建更多中间数组，但代码更简洁

**最佳实践**：
- 一般情况下，使用标准的嵌套循环方法
- 对于需要保持不可变性的场景，使用基于 map 的方法
- 对于非常大的方阵且允许修改原数据时，使用原地转置
- 始终检查输入矩阵是否为空或不规则（行长度不一）

**问题4：如何在二维数组中高效地实现搜索操作？**

答：在二维数组中搜索元素是一种常见操作，根据数组的特性，有多种搜索策略可以采用：

**1. 线性搜索（适用于无序数组）**

最基本的方法是遍历整个数组：

```javascript
function linearSearch(matrix, target) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === target) {
        return { row: i, col: j }; // 找到目标
      }
    }
  }
  return null; // 未找到
}

const matrix = [
  [1, 3, 5],
  [7, 9, 11],
  [13, 15, 17]
];

console.log(linearSearch(matrix, 9)); // { row: 1, col: 1 }
console.log(linearSearch(matrix, 6)); // null
```

- 时间复杂度：O(m*n)，其中 m 是行数，n 是列数
- 适用情况：无序数组或没有特殊结构的数组

**2. 利用排序特性的搜索（适用于行列递增的矩阵）**

如果矩阵的每行和每列都是递增排序的，可以使用更高效的搜索：

```javascript
function searchSortedMatrix(matrix, target) {
  if (!matrix || !matrix.length || !matrix[0].length) {
    return null;
  }
  
  let row = 0;
  let col = matrix[0].length - 1;
  
  // 从右上角开始搜索
  while (row < matrix.length && col >= 0) {
    if (matrix[row][col] === target) {
      return { row, col }; // 找到目标
    } else if (matrix[row][col] > target) {
      col--; // 当前值太大，向左移动
    } else {
      row++; // 当前值太小，向下移动
    }
  }
  
  return null; // 未找到
}

const sortedMatrix = [
  [1, 4, 7, 11],
  [2, 5, 8, 12],
  [3, 6, 9, 16],
  [10, 13, 14, 17]
];

console.log(searchSortedMatrix(sortedMatrix, 9)); // { row: 2, col: 2 }
console.log(searchSortedMatrix(sortedMatrix, 15)); // null
```

- 时间复杂度：O(m + n)，其中 m 是行数，n 是列数
- 适用情况：行和列都是有序的矩阵

**3. 二分搜索（适用于每行有序的矩阵）**

如果每行都是有序的，但行与行之间没有特定关系，可以对每行使用二分搜索：

```javascript
function binarySearchMatrix(matrix, target) {
  for (let i = 0; i < matrix.length; i++) {
    // 对每行进行二分搜索
    const index = binarySearch(matrix[i], target);
    if (index !== -1) {
      return { row: i, col: index };
    }
  }
  return null;
}

function binarySearch(array, target) {
  let left = 0;
  let right = array.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (array[mid] === target) {
      return mid; // 找到目标
    } else if (array[mid] < target) {
      left = mid + 1; // 目标在右半部分
    } else {
      right = mid - 1; // 目标在左半部分
    }
  }
  
  return -1; // 未找到
}

const rowSortedMatrix = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 50]
];

console.log(binarySearchMatrix(rowSortedMatrix, 16)); // { row: 1, col: 2 }
console.log(binarySearchMatrix(rowSortedMatrix, 15)); // null
```

- 时间复杂度：O(m log n)，其中 m 是行数，n 是列数
- 适用情况：每行都是有序的矩阵

**4. 将二维数组视为一维数组的二分搜索（适用于完全有序的矩阵）**

如果整个矩阵是按行优先顺序排序的，可以将其视为一维数组进行二分搜索：

```javascript
function searchSortedFlatMatrix(matrix, target) {
  if (!matrix || !matrix.length || !matrix[0].length) {
    return null;
  }
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  let left = 0;
  let right = rows * cols - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midRow = Math.floor(mid / cols);
    const midCol = mid % cols;
    const midValue = matrix[midRow][midCol];
    
    if (midValue === target) {
      return { row: midRow, col: midCol }; // 找到目标
    } else if (midValue < target) {
      left = mid + 1; // 目标在右半部分
    } else {
      right = mid - 1; // 目标在左半部分
    }
  }
  
  return null; // 未找到
}

const flatSortedMatrix = [
  [1, 3, 5],
  [7, 9, 11],
  [13, 15, 17]
];

console.log(searchSortedFlatMatrix(flatSortedMatrix, 9)); // { row: 1, col: 1 }
console.log(searchSortedFlatMatrix(flatSortedMatrix, 6)); // null
```

- 时间复杂度：O(log(m*n))，其中 m 是行数，n 是列数
- 适用情况：完全排序的矩阵（后一行的第一个元素大于前一行的最后一个元素）

**5. 使用哈希表（适用于频繁搜索）**

如果需要多次搜索同一个矩阵，预处理为哈希表可能更高效：

```javascript
function buildMatrixMap(matrix) {
  const map = new Map();
  
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const value = matrix[i][j];
      
      if (!map.has(value)) {
        map.set(value, []);
      }
      
      map.get(value).push({ row: i, col: j });
    }
  }
  
  return map;
}

function searchWithMap(map, target) {
  return map.has(target) ? map.get(target)[0] : null;
}

const matrix = [
  [1, 3, 5],
  [7, 9, 11],
  [13, 15, 17]
];

const matrixMap = buildMatrixMap(matrix);
console.log(searchWithMap(matrixMap, 9)); // { row: 1, col: 1 }
console.log(searchWithMap(matrixMap, 6)); // null
```

- 预处理时间复杂度：O(m*n)
- 搜索时间复杂度：O(1)
- 空间复杂度：O(m*n)
- 适用情况：需要多次搜索同一个矩阵，且内存足够

**最佳实践**：
- 对于无序矩阵，使用线性搜索
- 对于行列递增的矩阵，使用从右上角（或左下角）开始的搜索方法
- 对于每行有序的矩阵，对每行使用二分搜索
- 对于完全有序的矩阵，使用一维化的二分搜索
- 对于需要频繁搜索的情况，考虑预处理为哈希表
- 实际应用中，选择方法应考虑矩阵的大小、结构和搜索频率

**问题5：如何高效地旋转二维数组（矩阵）？**

答：矩阵旋转是在二维数组操作中的一个常见问题，尤其是在图像处理、游戏开发和计算机图形学中。下面介绍几种旋转矩阵的方法：

**1. 90度顺时针旋转**

方法一：使用额外空间（直观方法）：

```javascript
function rotate90Clockwise(matrix) {
  const n = matrix.length;
  const result = Array(n).fill().map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[j][n - 1 - i] = matrix[i][j];
    }
  }
  
  return result;
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(rotate90Clockwise(matrix));
/*
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3]
]
*/
```

- 时间复杂度：O(n²)
- 空间复杂度：O(n²)
- 优点：简单直观，适用于任何大小的矩阵
- 缺点：需要额外空间

方法二：原地旋转（无需额外空间，但仅适用于方阵）：

```javascript
function rotate90ClockwiseInPlace(matrix) {
  const n = matrix.length;
  
  // 转置矩阵（沿主对角线翻转）
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  
  // 水平翻转每一行
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < Math.floor(n / 2); j++) {
      [matrix[i][j], matrix[i][n - 1 - j]] = [matrix[i][n - 1 - j], matrix[i][j]];
    }
  }
  
  return matrix; // 返回原矩阵（已修改）
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(rotate90ClockwiseInPlace(matrix));
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
- 优点：空间效率高
- 缺点：修改原始矩阵，仅适用于方阵（n × n）

方法三：一层一层旋转（原地旋转的另一种思路）：