   - `sort()`: 对数组元素排序
   - `reverse()`: 反转数组元素顺序
   - `fill()`: 用静态值填充数组

2. 返回新数组的方法（非变异方法）：
   - `concat()`: 合并数组
   - `slice()`: 提取数组的一部分
   - `map()`: 映射每个元素到新数组
   - `filter()`: 筛选符合条件的元素
   - `flat()`: 扁平化嵌套数组
   - `flatMap()`: 映射且扁平化结果

3. 搜索和位置方法：
   - `indexOf()`: 查找元素的第一个索引
   - `lastIndexOf()`: 查找元素的最后一个索引
   - `find()`: 查找符合条件的第一个元素
   - `findIndex()`: 查找符合条件的第一个元素的索引
   - `includes()`: 检查数组是否包含指定元素

4. 迭代方法：
   - `forEach()`: 为每个元素执行回调
   - `every()`: 检查所有元素是否都符合条件
   - `some()`: 检查是否至少有一个元素符合条件
   - `reduce()`: 将数组归约为单个值
   - `reduceRight()`: 从右到左归约

5. 其他实用方法：
   - `join()`: 将数组元素连接成字符串
   - `toString()`: 将数组转换为字符串
   - `toLocaleString()`: 将数组转换为本地化字符串
   - `entries()`, `keys()`, `values()`: 返回迭代器对象
   - `at()`: 返回指定索引的元素（支持负索引）

### 使用示例

```javascript
// 创建示例数组
let fruits = ['Apple', 'Banana', 'Cherry'];
let numbers = [3, 1, 4, 1, 5, 9];

// 1. 添加和删除元素
// 末尾添加/删除 - O(1) 操作
fruits.push('Date');        // 返回 4, fruits = ['Apple', 'Banana', 'Cherry', 'Date']
const lastFruit = fruits.pop(); // 返回 'Date', fruits = ['Apple', 'Banana', 'Cherry']

// 开头添加/删除 - O(n) 操作
fruits.unshift('Apricot');  // 返回 4, fruits = ['Apricot', 'Apple', 'Banana', 'Cherry']
const firstFruit = fruits.shift(); // 返回 'Apricot', fruits = ['Apple', 'Banana', 'Cherry']

// 使用 splice 修改 - O(n) 操作
// 参数: 起始索引, 删除数量, 要添加的元素...
fruits.splice(1, 1, 'Blueberry', 'Blackberry'); // 返回 ['Banana'], fruits = ['Apple', 'Blueberry', 'Blackberry', 'Cherry']

// 2. 创建新数组
// 合并数组
const moreFruits = ['Dragon fruit', 'Elderberry'];
const allFruits = fruits.concat(moreFruits); // 不修改原数组
console.log(allFruits); // ['Apple', 'Blueberry', 'Blackberry', 'Cherry', 'Dragon fruit', 'Elderberry']

// 提取部分数组
const someFruits = allFruits.slice(1, 4); // 不修改原数组
console.log(someFruits); // ['Blueberry', 'Blackberry', 'Cherry']

// 3. 搜索和位置
// 查找元素
console.log(allFruits.indexOf('Cherry')); // 3
console.log(allFruits.includes('Banana')); // false
console.log(allFruits.find(fruit => fruit.startsWith('B'))); // 'Blueberry'
console.log(allFruits.findIndex(fruit => fruit.length > 10)); // 4 ('Dragon fruit')

// 4. 数组转换
// 映射
const fruitLengths = allFruits.map(fruit => fruit.length);
console.log(fruitLengths); // [5, 9, 10, 6, 12, 10]

// 过滤
const longFruits = allFruits.filter(fruit => fruit.length > 6);
console.log(longFruits); // ['Blueberry', 'Blackberry', 'Dragon fruit', 'Elderberry']

// 排序
numbers.sort((a, b) => a - b); // 数字排序需要比较函数
console.log(numbers); // [1, 1, 3, 4, 5, 9]

// 反转
numbers.reverse();
console.log(numbers); // [9, 5, 4, 3, 1, 1]

// 5. 数组归约
// 求和
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 23

// 查找最大值
const max = numbers.reduce((max, num) => Math.max(max, num), -Infinity);
console.log(max); // 9

// 6. 数组填充
const zeros = new Array(5).fill(0);
console.log(zeros); // [0, 0, 0, 0, 0]

// 7. 数组扁平化
const nestedArray = [1, [2, [3, 4]], 5];
console.log(nestedArray.flat());     // [1, 2, [3, 4], 5]
console.log(nestedArray.flat(2));    // [1, 2, 3, 4, 5]
console.log(nestedArray.flat(Infinity)); // 完全扁平化

// 8. 映射并扁平化
const sentences = ['Hello world', 'JavaScript is fun'];
const words = sentences.flatMap(sentence => sentence.split(' '));
console.log(words); // ['Hello', 'world', 'JavaScript', 'is', 'fun']

// 9. 迭代方法
// forEach - 没有返回值
fruits.forEach((fruit, index) => {
  console.log(`${index}: ${fruit}`);
});

// some - 检查是否至少有一个元素满足条件
const hasLongFruit = fruits.some(fruit => fruit.length > 10);
console.log(hasLongFruit); // true

// every - 检查是否所有元素都满足条件
const allShortFruits = fruits.every(fruit => fruit.length < 15);
console.log(allShortFruits); // true

// 10. 数组转字符串
console.log(fruits.join(', ')); // "Apple, Blueberry, Blackberry, Cherry"
console.log(fruits.toString()); // "Apple,Blueberry,Blackberry,Cherry"

// 11. 使用 at() 方法（ES2022）
console.log(fruits.at(0));  // "Apple"
console.log(fruits.at(-1)); // "Cherry" (从末尾计数)

// 12. 迭代器方法
const iterator = fruits.entries();
console.log(iterator.next().value); // [0, "Apple"]
console.log(iterator.next().value); // [1, "Blueberry"]

// 展开运算符使用
const fruitsCopy = [...fruits];
console.log(fruitsCopy); // 创建浅拷贝
```

### 实战应用举例

**实例1：任务管理系统**

```javascript
/**
 * 任务管理系统
 * 应用场景：项目管理工具中的任务管理功能
 */
class TaskManager {
  constructor() {
    this.tasks = [];
    this.lastId = 0;
  }
  
  /**
   * 创建新任务
   * @param {string} title - 任务标题
   * @param {string} description - 任务描述
   * @param {string} priority - 优先级 ('low', 'medium', 'high')
   * @return {Object} 创建的任务对象
   */
  createTask(title, description, priority = 'medium') {
    const newTask = {
      id: ++this.lastId,
      title,
      description,
      priority,
      completed: false,
      createdAt: new Date(),
      completedAt: null
    };
    
    this.tasks.push(newTask);
    return newTask;
  }
  
  /**
   * 删除任务
   * @param {number} taskId - 要删除的任务ID
   * @return {boolean} 是否成功删除
   */
  deleteTask(taskId) {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    return this.tasks.length !== initialLength;
  }
  
  /**
   * 更新任务
   * @param {number} taskId - 任务ID
   * @param {Object} updates - 要更新的字段
   * @return {Object|null} 更新后的任务或null
   */
  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return null;
    
    // 创建任务的副本并应用更新
    const updatedTask = { ...this.tasks[taskIndex], ...updates };
    
    // 如果更新了完成状态，设置完成时间
    if (updates.completed && !this.tasks[taskIndex].completed) {
      updatedTask.completedAt = new Date();
    } else if (updates.completed === false) {
      updatedTask.completedAt = null;
    }
    
    // 更新任务数组
    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }
  
  /**
   * 标记任务为已完成
   * @param {number} taskId - 任务ID
   * @return {Object|null} 更新后的任务或null
   */
  completeTask(taskId) {
    return this.updateTask(taskId, { completed: true });
  }
  
  /**
   * 获取所有任务
   * @return {Array} 任务数组
   */
  getAllTasks() {
    return [...this.tasks]; // 返回副本，防止外部修改
  }
  
  /**
   * 获取特定状态的任务
   * @param {boolean} completed - 完成状态
   * @return {Array} 符合条件的任务数组
   */
  getTasksByStatus(completed) {
    return this.tasks.filter(task => task.completed === completed);
  }
  
  /**
   * 按优先级获取任务
   * @param {string} priority - 优先级
   * @return {Array} 符合优先级的任务数组
   */
  getTasksByPriority(priority) {
    return this.tasks.filter(task => task.priority === priority);
  }
  
  /**
   * 获取今日创建的任务
   * @return {Array} 今日创建的任务数组
   */
  getTasksCreatedToday() {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    
    return this.tasks.filter(task => 
      task.createdAt >= startOfDay
    );
  }
  
  /**
   * 按创建日期排序任务
   * @param {boolean} ascending - 是否升序排列
   * @return {Array} 排序后的任务数组
   */
  sortTasksByDate(ascending = true) {
    return [...this.tasks].sort((a, b) => {
      const comparison = a.createdAt - b.createdAt;
      return ascending ? comparison : -comparison;
    });
  }
  
  /**
   * 按优先级排序任务
   * @return {Array} 按优先级排序的任务数组
   */
  sortTasksByPriority() {
    const priorityWeight = {
      'low': 1,
      'medium': 2,
      'high': 3
    };
    
    return [...this.tasks].sort((a, b) => 
      priorityWeight[b.priority] - priorityWeight[a.priority]
    );
  }
  
  /**
   * 搜索任务
   * @param {string} query - 搜索查询
   * @return {Array} 匹配的任务数组
   */
  searchTasks(query) {
    if (!query) return this.getAllTasks();
    
    const lowercaseQuery = query.toLowerCase();
    
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  /**
   * 获取任务统计信息
   * @return {Object} 统计信息
   */
  getStats() {
    const completed = this.tasks.filter(task => task.completed).length;
    const pending = this.tasks.length - completed;
    
    // 使用 reduce 统计各优先级的任务数量
    const priorityCounts = this.tasks.reduce((counts, task) => {
      counts[task.priority] = (counts[task.priority] || 0) + 1;
      return counts;
    }, {});
    
    return {
      total: this.tasks.length,
      completed,
      pending,
      completionRate: this.tasks.length ? completed / this.tasks.length : 0,
      priorityCounts
    };
  }
}

// 使用示例
const taskManager = new TaskManager();

// 添加任务
taskManager.createTask(
  '完成项目提案',
  '准备下周会议的项目提案文档',
  'high'
);

taskManager.createTask(
  '回复邮件',
  '回复客户关于新功能的咨询邮件',
  'medium'
);

taskManager.createTask(
  '更新个人简历',
  '添加最近项目经验到简历中',
  'low'
);

// 完成任务
taskManager.completeTask(2);

// 获取所有待办任务
const pendingTasks = taskManager.getTasksByStatus(false);
console.log('待办任务:', pendingTasks);

// 按优先级排序
const prioritizedTasks = taskManager.sortTasksByPriority();
console.log('按优先级排序:', prioritizedTasks);

// 搜索任务
const searchResults = taskManager.searchTasks('项目');
console.log('搜索结果:', searchResults);

// 获取统计信息
const stats = taskManager.getStats();
console.log('任务统计:', stats);
```

**实例2：电子商务产品分析**

```javascript
/**
 * 产品分析工具
 * 应用场景：电子商务平台的销售和库存分析
 */
class ProductAnalytics {
  /**
   * @param {Array} products - 产品数据数组
   * @param {Array} sales - 销售数据数组
   */
  constructor(products, sales) {
    this.products = [...products];
    this.sales = [...sales];
  }
  
  /**
   * 获取畅销产品
   * @param {number} limit - 返回结果数量
   * @return {Array} 畅销产品数组
   */
  getTopSellingProducts(limit = 5) {
    // 按产品ID分组销售数量
    const salesByProduct = this.sales.reduce((result, sale) => {
      const { productId, quantity } = sale;
      result[productId] = (result[productId] || 0) + quantity;
      return result;
    }, {});
    
    // 将产品与销售数据合并
    const productsWithSales = this.products.map(product => ({
      ...product,
      totalSold: salesByProduct[product.id] || 0
    }));
    
    // 按销售量排序并限制结果数量
    return productsWithSales
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);
  }
  
  /**
   * 获取收入最高的产品
   * @param {number} limit - 返回结果数量
   * @return {Array} 收入最高产品数组
   */
  getTopRevenueProducts(limit = 5) {
    // 计算每个产品的销售额
    const revenueByProduct = this.sales.reduce((result, sale) => {
      const { productId, quantity, pricePerUnit } = sale;
      const revenue = quantity * pricePerUnit;
      result[productId] = (result[productId] || 0) + revenue;
      return result;
    }, {});
    
    // 将产品与收入数据合并
    const productsWithRevenue = this.products.map(product => ({
      ...product,
      totalRevenue: revenueByProduct[product.id] || 0
    }));
    
    // 按收入排序并限制结果数量
    return productsWithRevenue
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }
  
  /**
   * 按类别分析销售情况
   * @return {Array} 按类别汇总的销售数据
   */
  getSalesByCategory() {
    // 创建产品ID到类别的映射
    const productCategories = this.products.reduce((map, product) => {
      map[product.id] = product.category;
      return map;
    }, {});
    
    // 按类别分组销售数据
    const salesByCategory = this.sales.reduce((result, sale) => {
      const category = productCategories[sale.productId];
      if (!category) return result;
      
      if (!result[category]) {
        result[category] = {
          category,
          totalQuantity: 0,
          totalRevenue: 0,
          salesCount: 0
        };
      }
      
      result[category].totalQuantity += sale.quantity;
      result[category].totalRevenue += sale.quantity * sale.pricePerUnit;
      result[category].salesCount += 1;
      
      return result;
    }, {});
    
    // 转换为数组并排序
    return Object.values(salesByCategory)
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }
  
  /**
   * 获取库存过低的产品
   * @param {number} threshold - 库存阈值
   * @return {Array} 库存过低的产品
   */
  getLowStockProducts(threshold = 10) {
    return this.products
      .filter(product => product.stock <= threshold)
      .sort((a, b) => a.stock - b.stock);
  }
  
  /**
   * 计算产品销售增长率
   * @param {number} timeFrame - 时间范围（天）
   * @return {Array} 产品增长率数据
   */
  getProductGrowthRate(timeFrame = 30) {
    const now = new Date();
    const cutoffDate = new Date(now.setDate(now.getDate() - timeFrame));
    
    // 将销售按时间段和产品分组
    const salesByPeriod = this.sales.reduce((result, sale) => {
      const saleDate = new Date(sale.date);
      const period = saleDate >= cutoffDate ? 'current' : 'previous';
      
      if (!result[period]) {
        result[period] = {};
      }
      
      if (!result[period][sale.productId]) {
        result[period][sale.productId] = 0;
      }
      
      result[period][sale.productId] += sale.quantity;
      
      return result;
    }, {});
    
    // 计算增长率
    return this.products.map(product => {
      const currentSales = (salesByPeriod.current && salesByPeriod.current[product.id]) || 0;
      const previousSales = (salesByPeriod.previous && salesByPeriod.previous[product.id]) || 0;
      
      let growthRate;
      if (previousSales === 0) {
        growthRate = currentSales > 0 ? Infinity : 0;
      } else {
        growthRate = (currentSales - previousSales) / previousSales;
      }
      
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        currentSales,
        previousSales,
        growthRate
      };
    }).sort((a, b) => b.growthRate - a.growthRate);
  }
  
  /**
   * 获取销售趋势数据
   * @param {number} days - 天数
   * @return {Array} 每日销售数据
   */
  getDailySalesTrend(days = 30) {
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() - days));
    
    // 创建日期范围的空数据
    const dateRange = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    
    // 初始化结果对象
    const dailySales = dateRange.reduce((result, date) => {
      result[date] = { date, totalSales: 0, totalRevenue: 0, uniqueProducts: 0 };
      return result;
    }, {});
    
    // 填充销售数据
    this.sales.forEach(sale => {
      const saleDate = new Date(sale.date).toISOString().split('T')[0];
      
      if (dailySales[saleDate]) {
        dailySales[saleDate].totalSales += sale.quantity;
        dailySales[saleDate].totalRevenue += sale.quantity * sale.pricePerUnit;
        
        // 跟踪唯一产品ID
        if (!dailySales[saleDate].products) {
          dailySales[saleDate].products = new Set();
        }
        dailySales[saleDate].products.add(sale.productId);
      }
    });
    
    // 计算每天的唯一产品数
    Object.values(dailySales).forEach(day => {
      if (day.products) {
        day.uniqueProducts = day.products.size;
        delete day.products; // 清理临时集合
      }
    });
    
    // 转换为数组并按日期排序
    return Object.values(dailySales)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  /**
   * 使用移动平均线平滑销售数据
   * @param {Array} data - 原始销售数据
   * @param {number} windowSize - 移动窗口大小
   * @return {Array} 平滑后的数据
   */
  smoothSalesData(data, windowSize = 7) {
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
      // 确定窗口的起始和结束位置
      const windowStart = Math.max(0, i - Math.floor(windowSize / 2));
      const windowEnd = Math.min(data.length - 1, i + Math.floor(windowSize / 2));
      const windowLength = windowEnd - windowStart + 1;
      
      // 计算窗口内销售量的平均值
      let totalSales = 0;
      let totalRevenue = 0;
      
      for (let j = windowStart; j <= windowEnd; j++) {
        totalSales += data[j].totalSales;
        totalRevenue += data[j].totalRevenue;
      }
      
      result.push({
        date: data[i].date,
        originalSales: data[i].totalSales,
        originalRevenue: data[i].totalRevenue,
        smoothedSales: totalSales / windowLength,
        smoothedRevenue: totalRevenue / windowLength
      });
    }
    
    return result;
  }
}

// 示例使用
const products = [
  { id: 1, name: '智能手机', category: '电子产品', price: 699.99, stock: 42 },
  { id: 2, name: '笔记本电脑', category: '电子产品', price: 1299.99, stock: 15 },
  { id: 3, name: '无线耳机', category: '配件', price: 159.99, stock: 78 },
  { id: 4, name: '智能手表', category: '可穿戴设备', price: 249.99, stock: 27 },
  { id: 5, name: '平板电脑', category: '电子产品', price: 499.99, stock: 8 },
  { id: 6, name: '充电器', category: '配件', price: 29.99, stock: 112 },
  { id: 7, name: '保护套', category: '配件', price: 19.99, stock: 94 }
];

// 生成模拟销售数据
function generateSalesData(productCount, daysCount) {
  const sales = [];
  const now = new Date();
  
  for (let day = 0; day < daysCount; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);
    
    // 每天随机销售一些产品
    const productSalesCount = Math.floor(Math.random() * 10) + 5; // 5-15 销售记录
    
    for (let i = 0; i < productSalesCount; i++) {
      const productId = Math.floor(Math.random() * productCount) + 1;
      const product = products.find(p => p.id === productId);
      
      if (product) {
        sales.push({
          id: sales.length + 1,
          productId,
          date: date.toISOString(),
          quantity: Math.floor(Math.random() * 5) + 1, // 1-5 件
          pricePerUnit: product.price * (Math.random() * 0.2 + 0.9) // 价格波动
        });
      }
    }
  }
  
  return sales;
}

const sales = generateSalesData(products.length, 60);
const analytics = new ProductAnalytics(products, sales);

// 分析结果
console.log('畅销产品:', analytics.getTopSellingProducts(3));
console.log('高收入产品:', analytics.getTopRevenueProducts(3));
console.log('类别销售情况:', analytics.getSalesByCategory());
console.log('库存低的产品:', analytics.getLowStockProducts());
console.log('产品增长率:', analytics.getProductGrowthRate());

// 获取并平滑销售趋势
const dailySales = analytics.getDailySalesTrend(30);
const smoothedSales = analytics.smoothSalesData(dailySales);
console.log('平滑后的销售趋势:', smoothedSales.slice(0, 5)); // 只显示前5天
```

### 常见面试问题

**问题1：解释 map、forEach 和 for 循环的区别，以及它们各自的使用场景。**

答：map、forEach 和 for 循环都用于遍历数组，但它们有重要的区别：

**for 循环**：
- 是 JavaScript 的基础控制结构
- 提供最大的灵活性和控制
- 可以随时中断循环（break）或跳过迭代（continue）
- 性能通常略好于数组方法
- 代码冗长，需要手动跟踪索引

```javascript
const numbers = [1, 2, 3, 4];
const squared = [];

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 2) { // 可以使用条件控制
    squared.push(numbers[i] * numbers[i]);
  }
}
```

**forEach 方法**：
- 数组原型方法，为每个元素执行回调函数
- 更简洁、更具声明性
- 无法中断循环（不支持 break 或 continue）
- 不直接返回新数组
- 适合需要副作用的操作（如日志记录、DOM 更新）

```javascript
const numbers = [1, 2, 3, 4];
const squared = [];

numbers.forEach(num => {
  if (num > 2) {
    squared.push(num * num);
  }
});
```

**map 方法**：
- 数组原型方法，创建新数组，其元素是对原始数组元素应用回调函数的结果
- 不修改原始数组（纯函数）
- 回调必须返回值
- 始终返回与原始数组长度相同的新数组
- 适合转换数据

```javascript
const numbers = [1, 2, 3, 4];
const squared = numbers
  .filter(num => num > 2) // 可以链式调用
  .map(num => num * num);
```

**使用场景**：

使用 **for 循环** 当：
- 需要中断循环或使用 continue 语句
- 需要向后或不规则地遍历
- 处理大型数组且性能至关重要
- 涉及复杂的索引操作

使用 **forEach** 当：
- 需要对每个元素执行操作，而不需要创建新数组
- 代码清晰度比性能更重要
- 执行有副作用的操作（如更新 UI、记录日志）

使用 **map** 当：
- 需要基于原始数组创建新的转换后的数组
- 进行函数式编程
- 需要链式调用多个数组操作
- 保持数据不可变性很重要

**性能考虑**：
- for 循环通常比数组方法略快，但差异在现代 JavaScript 引擎中已经很小
- 对于绝大多数应用程序，选择应基于代码可读性和适用性，而非性能微优化

**问题2：Array.prototype.splice() 方法的完整功能是什么？给出一些使用示例。**

答：`splice()` 是 JavaScript 数组中最通用的修改方法之一，可以用于添加、删除和替换数组元素。

**语法**：
```javascript
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
```

**参数**：
- `start`：操作的起始索引
  - 正数表示从前向后的位置
  - 负数表示从后向前的位置（-1 表示最后一个元素）
  - 如果大于数组长度，则从数组末尾开始
- `deleteCount`（可选）：要删除的元素数量
  - 如果省略或大于 `start` 之后的元素数量，则删除 `start` 之后的所有元素
  - 如果为 0 或负数，则不删除元素
- `item1, item2, ...`（可选）：要添加到数组的新元素

**返回值**：
- 包含被删除元素的数组
- 如果没有删除元素，则返回空数组

**使用示例**：

1. **删除元素**：
```javascript
const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

// 从索引 2 开始，删除 2 个元素
const removed = fruits.splice(2, 2);

console.log(fruits);     // ['Apple', 'Banana', 'Elderberry']
console.log(removed);    // ['Cherry', 'Date']
```

2. **添加元素**：
```javascript
const numbers = [1, 2, 5, 6];

// 从索引 2 开始，删除 0 个元素，插入 3 和 4
numbers.splice(2, 0, 3, 4);

console.log(numbers);    // [1, 2, 3, 4, 5, 6]
```

3. **替换元素**：
```javascript
const letters = ['a', 'b', 'c', 'd'];

// 从索引 1 开始，删除 2 个元素，插入 'B', 'C'
letters.splice(1, 2, 'B', 'C');

console.log(letters);    // ['a', 'B', 'C', 'd']
```

4. **使用负索引**：
```javascript
const colors = ['red', 'green', 'blue', 'yellow'];

// 从倒数第 2 个元素开始，删除 1 个元素
colors.splice(-2, 1);

console.log(colors);     // ['red', 'green', 'yellow']
```

5. **删除数组末尾元素**：
```javascript
const stack = [1, 2, 3, 4, 5];

// 删除最后一个元素（类似 pop，但返回数组）
const lastElement = stack.splice(-1, 1)[0];

console.log(stack);          // [1, 2, 3, 4]
console.log(lastElement);    // 5
```

6. **删除数组开头元素**：
```javascript
const queue = [1, 2, 3, 4, 5];

// 删除第一个元素（类似 shift，但返回数组）
const firstElement = queue.splice(0, 1)[0];

console.log(queue);          // [2, 3, 4, 5]
console.log(firstElement);   // 1
```

7. **清空数组**：
```javascript
const data = [1, 2, 3, 4, 5];

// 删除所有元素
data.splice(0);

console.log(data);     // []
```

**注意事项**：
- `splice()` 方法直接修改原始数组
- 它是一个通用方法，可以替代 `push()`, `pop()`, `shift()`, `unshift()` 的功能
- 对大型数组执行 `splice()` 操作可能会影响性能，特别是在数组开头附近进行操作时，因为需要移动后续元素

**问题3：如何有效地从数组中删除重复项？比较不同方法的效率。**

答：从数组中删除重复项是一个常见操作，有多种实现方法，各有优缺点：

**1. 使用 Set 对象（ES6+）**：
```javascript
function removeDuplicatesWithSet(array) {
  return [...new Set(array)];
  // 或者：Array.from(new Set(array));
}

const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(removeDuplicatesWithSet(numbers)); // [1, 2, 3, 4, 5]
```

优点：
- 简洁高效，代码量最少
- 时间复杂度 O(n)
- 适用于所有基本类型和引用类型（按引用去重）

缺点：
- 不保留原始元素顺序（实际上 Set 在现代浏览器中通常会保留顺序，但这不是规范保证的）
- 对象是按引用去重，而不是内容

**2. 使用 filter 方法**：
```javascript
function removeDuplicatesWithFilter(array) {
  return array.filter((item, index) => array.indexOf(item) === index);
}

const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(removeDuplicatesWithFilter(numbers)); // [1, 2, 3, 4, 5]
```

优点：
- 保留原始元素顺序
- 不需要额外的数据结构
- 适用于所有类型的数组

缺点：
- 时间复杂度 O(n²)，对大型数组性能较差（indexOf 是线性搜索）
- 对象按引用比较

**3. 使用 reduce 方法**：
```javascript
function removeDuplicatesWithReduce(array) {
  return array.reduce((unique, item) => 
    unique.includes(item) ? unique : [...unique, item], []);
}

const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(removeDuplicatesWithReduce(numbers)); // [1, 2, 3, 4, 5]
```

优点：
- 保留原始元素顺序
- 函数式编程风格
- 可以轻松扩展为更复杂的去重逻辑

缺点：
- 时间复杂度 O(n²)，性能不佳
- 每次迭代都创建新数组，内存使用较高

**4. 使用对象哈希表（适用于基本类型）**：
```javascript
function removeDuplicatesWithHash(array) {
  const seen = {};
  return array.filter(item => {
    const key = typeof item + JSON.stringify(item);
    return seen.hasOwnProperty(key) ? false : (seen[key] = true);
  });
}

const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(removeDuplicatesWithHash(numbers)); // [1, 2, 3, 4, 5]
```

优点：
- 时间复杂度 O(n)，高效
- 保留元素顺序
- 可以处理混合类型的数组

缺点：
- 对于复杂对象，JSON.stringify 可能不能正确处理循环引用
- 额外的内存使用
- 类型转换可能导致某些边缘情况下的意外结果

**5. 使用 Map 对象（处理对象数组）**：
```javascript
function removeDuplicateObjects(array, keyFn) {
  const map = new Map();
  
  return array.filter(item => {
    const key = keyFn(item);
    if (map.has(key)) {
      return false;
    } else {
      map.set(key, true);
      return true;
    }
  });
}

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' }, // 重复的用户
  { id: 3, name: 'Charlie' }
];

// 按 id 去重
const uniqueUsers = removeDuplicateObjects(users, user => user.id);
console.log(uniqueUsers); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]
```

优点：
- 可以基于自定义键去重对象
- 时间复杂度 O(n)
- 保留元素顺序

缺点：
- 需要指定键函数
- 不能自动处理复杂的嵌套对象

**性能比较**：

对于小型数组（元素数量少于 1000），所有方法的性能差异通常不明显。对于大型数组：

1. **Set 方法**：通常是最快的，特别是对于大型数组
2. **哈希表方法**：接近 Set 方法的性能
3. **Map 方法**：对于对象数组很高效
4. **filter+indexOf 方法**：随着数组大小增加，性能显著下降
5. **reduce+includes 方法**：性能最差，不适合大型数组

**最佳实践**：
- 对于简单类型数组，使用 `[...new Set(array)]`
- 对于对象数组，使用基于 Map 的方法，并提供合适的键函数
- 需要自定义比较逻辑时，可以使用 filter 或 reduce 方法
- 对于性能关键的应用，避免使用嵌套循环方法（如 filter+indexOf 或 reduce+includes）

**问题4：sort() 方法如何工作？为什么对数字排序时需要比较函数？**

答：JavaScript 数组的 `sort()` 方法用于对数组元素进行排序。它的行为和工作原理有一些特点和注意事项：

**基本工作原理**：
1. `sort()` 方法直接修改原始数组（原地排序）
2. 默认按照元素的字符串 Unicode 码点值排序
3. 可以接受一个比较函数作为参数，自定义排序逻辑
4. 返回排序后的数组引用（与原数组相同）

**排序算法**：
- ECMAScript 规范没有规定具体使用哪种排序算法
- 不同浏览器实现可能不同
- 常见实现包括：
  - 快速排序（QuickSort）的变种
  - 插入排序（InsertionSort）
  - Timsort（Chrome 的 V8 引擎）
- 对于小数组（通常小于 10 个元素），可能使用插入排序
- 对于大数组，通常使用更高效的排序算法，如快速排序或 Timsort

**为什么数字排序需要比较函数**：

默认情况下，`sort()` 方法将所有元素转换为字符串，然后按字符串 Unicode 顺序排序。这导致数字排序出现意外结果：

```javascript
const numbers = [1, 5, 10, 2, 20];
numbers.sort();
console.log(numbers); // [1, 10, 2, 20, 5]
```

这里的排序结果是 `[1, 10, 2, 20, 5]` 而不是 `[1, 2, 5, 10, 20]`，因为：
- "10" 在字符串比较中小于 "2"（比较第一个字符 '1' < '2'）
- "20" 在字符串比较中小于 "5"（比较第一个字符 '2' < '5'）

要正确排序数字，需要提供比较函数：

```javascript
const numbers = [1, 5, 10, 2, 20];

// 升序排列
numbers.sort((a, b) => a - b);
console.log(numbers); // [1, 2, 5, 10, 20]

// 降序排列
numbers.sort((a, b) => b - a);
console.log(numbers); // [20, 10, 5, 2, 1]
```

**比较函数的工作原理**：
- 比较函数接收两个参数（通常命名为 a 和 b）
- 返回负数，则 a 排在 b 之前
- 返回正数，则 b 排在 a 之前
- 返回 0，则保持 a 和 b 的相对位置不变

**更复杂的排序示例**：

1. **对象数组排序**：
```javascript
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 20 },
  { name: 'Charlie', age: 30 }
];

// 按年龄排序
people.sort((a, b) => a.age - b.age);
console.log(people); // [{ name: 'Bob', ... }, { name: 'Alice', ... }, { name: 'Charlie', ... }]

// 按名字排序
people.sort((a, b) => a.name.localeCompare(b.name));
console.log(people); // [{ name: 'Alice', ... }, { name: 'Bob', ... }, { name: 'Charlie', ... }]
```

2. **多条件排序**：
```javascript
const students = [
  { name: 'Alice', grade: 'A', score: 95 },
  { name: 'Bob', grade: 'B', score: 85 },
  { name: 'Charlie', grade: 'A', score: 90 },
  { name: 'David', grade: 'B', score: 88 }
];

// 首先按等级排序，然后按分数降序
students.sort((a, b) => {
  if (a.grade !== b.grade) {
    return a.grade.localeCompare(b.grade); // 先按等级升序
  }
  return b.score - a.score; // 同等级内按分数降序
});

console.log(students);
// [
//   { name: 'Alice', grade: 'A', score: 95 },
//   { name: 'Charlie', grade: 'A', score: 90 },
//   { name: 'David', grade: 'B', score: 88 },
//   { name: 'Bob', grade: 'B', score: 85 }
// ]
```

3. **区分大小写的排序**：
```javascript
const names = ['alice', 'Bob', 'Charlie', 'david'];

// 区分大小写
names.sort();
console.log(names); // ['Bob', 'Charlie', 'alice', 'david'] (大写字母排在小写字母前面)

// 不区分大小写
names.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
console.log(names); // ['alice', 'Bob', 'Charlie', 'david']
```

**注意事项和最佳实践**：
1. `sort()` 修改原始数组。如果不想修改原始数组，先创建副本：`const sorted = [...array].sort()`
2. 对于国际化字符串，使用 `localeCompare()` 方法而不是 `<` 和 `>` 运算符
3. 比较函数应该始终对相同的输入返回相同的结果，否则排序可能不稳定
4. 现代浏览器中的排序算法通常是稳定的，但 ECMAScript 规范不保证这一点

**问题5：解释 reduce 方法的工作原理及其常见用例。**

答：`reduce()` 是 JavaScript 数组的一个强大方法，用于将数组归约（reduce）为单个值。它通过对每个元素应用一个函数，累积一个结果。

**基本语法**：
```javascript
array.reduce(callback(accumulator, currentValue[, index[, array]]) [, initialValue])
```

**参数**：
- `callback`：归约函数，接收四个参数：
  - `accumulator`：累积器，存储上一次调用回调的返回值
  - `currentValue`：当前正在处理的数组元素
  - `index`（可选）：当前元素的索引
  - `array`（可选）：调用 reduce 的数组
- `initialValue`（可选）：第一次调用 callback 时 accumulator 的值
  - 如果提供，则第一次调用 callback 时，accumulator 为 initialValue，currentValue 为数组第一个元素
  - 如果不提供，则 accumulator 为数组第一个元素，currentValue 为数组第二个元素
  - 空数组调用 reduce 不提供 initialValue 会抛出 TypeError

**工作原理**：
1. reduce 从左到右遍历数组
2. 对每个元素，调用 callback 函数
3. callback 的返回值被赋给 accumulator，供下一次调用使用
4. 最终返回 accumulator 的值

**基本示例**：
```javascript
const numbers = [1, 2, 3, 4];

// 计算数组元素之和
const sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
console.log(sum); // 10

// 不使用初始值（首次 accumulator 为 1，current 为 2）
const product = numbers.reduce((accumulator, current) => accumulator * current);
console.log(product); // 24
```

**常见用例**：

1. **计算数值总和**：
```javascript
const total = [1, 2, 3, 4].reduce((sum, num) => sum + num, 0); // 10
```

2. **计算数值平均值**：
```javascript
const numbers = [1, 2, 3, 4, 5];
const average = numbers.reduce((sum, num, index, array) => {
  sum += num;
  if (index === array.length - 1) {
    return sum / array.length;
  }
  return sum;
}, 0); // 3
```

3. **将数组转换为对象**：
```javascript
const people = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const peopleMap = people.reduce((acc, person) => {
  acc[person.id] = person;
  return acc;
}, {});

console.log(peopleMap);
// {
//   1: { id: 1, name: 'Alice' },
//   2: { id: 2, name: 'Bob' },
//   3: { id: 3, name: 'Charlie' }
// }
```

4. **按属性分组**：
```javascript
const students = [
  { name: 'Alice', grade: 'A' },
  { name: 'Bob', grade: 'B' },
  { name: 'Charlie', grade: 'A' },
  { name: 'David', grade: 'B' }
];

const groupedByGrade = students.reduce((groups, student) => {
  const grade = student.grade;
  if (!groups[grade]) {
    groups[grade] = [];
  }
  groups[grade].push(student);
  return groups;
}, {});

console.log(groupedByGrade);
// {
//   A: [{ name: 'Alice', grade: 'A' }, { name: 'Charlie', grade: 'A' }],
//   B: [{ name: 'Bob', grade: 'B' }, { name: 'David', grade: 'B' }]
// }
```

5. **数组扁平化**：
```javascript
const nestedArrays = [[1, 2], [3, 4], [5, 6]];
const flattened = nestedArrays.reduce((flat, current) => flat.concat(current), []);
console.log(flattened); // [1, 2, 3, 4, 5, 6]
```

6. **去除重复元素**：
```javascript
const numbers = [1, 2, 2, 3, 4, 4, 5];
const unique = numbers.reduce((acc, current) => {
  if (!acc.includes(current)) {
    acc.push(current);
  }
  return acc;
}, []);
console.log(unique); // [1, 2, 3, 4, 5]
```

7. **计算出现频率**：
```javascript
const words = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const frequency = words.reduce((count, word) => {
  count[word] = (count[word] || 0) + 1;
  return count;
}, {});
console.log(frequency); // { apple: 3, banana: 2, orange: 1 }
```

8. **链式函数执行（函数组合/管道）**：
```javascript
function pipe(...functions) {
  return (initialValue) => 
    functions.reduce((acc, fn) => fn(acc), initialValue);
}

const double = x => x * 2;
const increment = x => x + 1;
const square = x => x * x;

const compute = pipe(double, increment, square);
console.log(compute(3)); // ((3*2)+1)² = 49
```

9. **实现 Promise 链**：
```javascript
function runSequentially(promiseFns) {
  return promiseFns.reduce(
    (promise, fn) => promise.then(fn),
    Promise.resolve()
  );
}

const asyncFunctions = [
  () => new Promise(resolve => setTimeout(() => resolve('First'), 1000)),
  () => new Promise(resolve => setTimeout(() => resolve('Second'), 500)),
  () => new Promise(resolve => setTimeout(() => resolve('Third'), 100))
];

runSequentially(asyncFunctions)
  .then(() => console.log('All promises completed in sequence'));
```

10. **从对象提取属性**：
```javascript
const user = {
  id: 123,
  name: 'Alice',
  email: 'alice@example.com',
  address: '123 Main St'
};

const allowedFields = ['id', 'name', 'email'];

const filteredUser = allowedFields.reduce((obj, field) => {
  if (field in user) {
    obj[field] = user[field];
  }
  return obj;
}, {});

console.log(filteredUser); // { id: 123, name: 'Alice', email: 'alice@example.com' }
```

**reduceRight 方法**：
`reduceRight()` 与 `reduce()` 类似，但从右到左处理数组元素：

```javascript
const numbers = [1, 2, 3, 4];
const rightToLeftDivision = numbers.reduceRight((acc, curr) => acc / curr);
console.log(rightToLeftDivision); // (4 / 3) / 2 / 1 = 0.6666...
```

**注意事项和最佳实践**：
1. 始终提供初始值，避免空数组导致错误
2. 当需要从数组构建不同数据结构时，优先考虑 reduce
3. 对于简单操作（如求和），使用 reduce 可能过于复杂
4. 对性能敏感的情况，传统循环可能更高效
5. 复杂 reduce 函数应该分解为小函数，提高可读性

### 使用场景选择指南

**何时使用不同的数组方法**：

**添加/删除元素**：
- **push/pop**：当需要在数组末尾添加/删除元素，实现栈（LIFO）结构
- **unshift/shift**：当需要在数组开头添加/删除元素，实现队列（FIFO）结构
- **splice**：当需要在数组任意位置添加/删除/替换元素
- **concat**：当需要合并多个数组但不修改原始数组

**访问元素**：
- **索引访问 [i]**：直接访问特定位置的元素
- **at()**：需要使用负索引从末尾访问元素
- **find/findIndex**：按条件查找元素或其索引
- **indexOf/lastIndexOf**：查找已知值的位置
- **includes**：检查数组是否包含特定值

**转换数组**：
- **map**：对每个元素应用转换，创建新数组
- **filter**：选择满足条件的元素，创建新数组
- **reduce**：将数组归约为单个值或其他数据结构
- **slice**：提取数组的一部分，不修改原始数组
- **sort**：需要排序数组元素
- **reverse**：需要反转数组元素的顺序

**迭代数组**：
- **forEach**：对每个元素执行操作，不需要返回值
- **for...of**：需要使用 break/continue 或处理异步操作
- **for 循环**：需要最大控制权或优化性能
- **every/some**：检查所有/至少一个元素是否满足条件

**转换为其他类型**：
- **join**：将数组元素连接为字符串
- **from/to 转换**：在数组和其他集合类型之间转换

**性能考虑**：

1. **修改原数组 vs 创建新数组**：
   - 修改原数组的方法（如 `sort`, `splice`）可能更高效，但可能导致副作用
   - 创建新数组的方法（如 `map`, `filter`）保持原始数据不变，但需要额外内存

2. **数组大小**：
   - 对大型数组，避免在开头添加/删除元素（`unshift`/`shift`）
   - 考虑使用 `TypedArray` 处理大型数值数组
   - 预分配数组大小可以提高性能：`new Array(size)`

3. **方法选择**：
   - 使用内置数组方法通常比手动实现循环更优化
   - 链式方法调用虽然优雅，但可能创建多个中间数组
   - 对于复杂操作，可以考虑使用 `reduce` 一次遍历处理多个转换

**优缺点对比**：

变异方法（修改原数组）：
- 优点：内存效率高，无需复制数组
- 缺点：可能引入副作用，难以跟踪状态变化
- 适用场景：性能关键应用，单线程环境

非变异方法（返回新数组）：
- 优点：保持原始数据不变，便于状态管理和调试
- 缺点：可能消耗更多内存，特别是对大型数组
- 适用场景：函数式编程，需要不可变性的场景（如 React）

**数组方法与替代方案比较**：

数组 vs 对象：
- 数组：适用于有序集合，通过索引访问
- 对象：适用于键值对，通过键名访问

数组 vs Map：
- 数组：简单序列，通过数字索引访问
- Map：复杂键值对，支持任何类型的键

数组 vs Set：
- 数组：允许重复元素，保持插入顺序
- Set：自动去重，查找效率高

### 记忆要点总结

- **修改原数组的方法**：
  - `push`, `pop` - 末尾添加/删除 - O(1)
  - `unshift`, `shift` - 开头添加/删除 - O(n)
  - `splice` - 任意位置添加/删除 - O(n)
  - `sort`, `reverse` - 排序/反转
  - `fill` - 填充元素

- **返回新数组的方法**：
  - `map` - 一对一转换
  - `filter` - 选择性包含
  - `concat` - 合并数组
  - `slice` - 提取部分
  - `flat`, `flatMap` - 扁平化嵌套

- **查找元素**：
  - `indexOf`, `lastIndexOf` - 查找已知值
  -