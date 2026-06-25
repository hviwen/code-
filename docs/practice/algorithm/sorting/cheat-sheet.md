# 🚀 JavaScript 排序算法面试速查表

## 📊 算法复杂度对比

| 算法 | 最好时间 | 平均时间 | 最坏时间 | 空间复杂度 | 稳定性 | 适用场景 |
|------|----------|----------|----------|------------|--------|----------|
| 冒泡排序 | O(n) | O(n²) | O(n²) | O(1) | ✓ | 教学演示 |
| 选择排序 | O(n²) | O(n²) | O(n²) | O(1) | ✗ | 交换次数少 |
| 插入排序 | O(n) | O(n²) | O(n²) | O(1) | ✓ | 小数组/部分有序 |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | ✓ | 稳定排序需求 |
| 快速排序 | O(n log n) | O(n log n) | O(n²) | O(log n) | ✗ | 一般用途 |
| 堆排序 | O(n log n) | O(n log n) | O(n log n) | O(1) | ✗ | 内存受限 |
| 计数排序 | O(n+k) | O(n+k) | O(n+k) | O(k) | ✓ | 整数小范围 |

## 🎯 面试选择策略

### 数据规模选择
- **n < 50**: 插入排序
- **50 ≤ n < 1000**: 快速排序
- **n ≥ 1000**: 归并排序或快速排序

### 特殊需求选择
- **需要稳定排序**: 归并排序
- **内存受限**: 堆排序
- **部分有序**: 插入排序
- **整数小范围**: 计数排序

## 💻 核心代码模板

### 快速排序 (最常考)
```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivot = partition(arr, low, high);
        quickSort(arr, low, pivot - 1);
        quickSort(arr, pivot + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}
```

### 归并排序 (稳定排序)
```javascript
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return result.concat(left.slice(i), right.slice(j));
}
```

### 堆排序 (原地排序)
```javascript
function heapSort(arr) {
    // 构建最大堆
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        heapify(arr, arr.length, i);
    }
    
    // 排序
    for (let i = arr.length - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
    
    return arr;
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}
```

## 🔥 面试高频问题

### Q1: "为什么快速排序平均比归并排序快？"
**A**: 
- 快速排序是原地排序，缓存友好
- 常数因子较小
- 分区操作比合并操作简单

### Q2: "如何优化快速排序？"
**A**:
- 三数取中选择基准
- 小数组切换到插入排序
- 三路快排处理重复元素
- 尾递归优化

### Q3: "什么时候用归并排序？"
**A**:
- 需要稳定排序
- 外部排序（数据量大）
- 链表排序
- 并行计算

### Q4: "计数排序的局限性？"
**A**:
- 只适用于非负整数
- 数据范围不能太大
- 需要额外空间

## 💡 记忆技巧

### 算法选择口诀
```
小数据插入快，大数据快归好
稳定要求选归并，内存受限用堆排
整数范围小计数，部分有序插入妙
```

### 复杂度记忆
```
冒泡选择都平方，插入最好是线性
归并堆排n log n，快排平均也如此
计数基数都线性，但要空间来换取
```

## 🎯 面试回答模板

### 1. 问题理解阶段
```
"让我确认一下需求：
- 数据规模大概多大？
- 是否需要稳定排序？
- 对时间和空间复杂度有什么要求？
- 数据有什么特殊性质吗？"
```

### 2. 算法选择阶段
```
"基于这些条件，我建议使用[算法名称]，
因为它在这种场景下具有[具体优势]。
时间复杂度是[分析]，空间复杂度是[分析]。"
```

### 3. 实现阶段
```
"我先写出基本实现，然后我们可以讨论优化方案。"
[写代码]
```

### 4. 优化讨论阶段
```
"如果需要优化，我们可以考虑：
- [优化方案1]
- [优化方案2]
- [优化方案3]"
```

## 🚨 常见陷阱

### 1. 边界条件
- 空数组处理
- 单元素数组
- 重复元素处理

### 2. 稳定性误区
- 快速排序不稳定
- 选择排序不稳定
- 堆排序不稳定

### 3. 空间复杂度
- 递归调用栈的空间
- 归并排序的额外数组
- 计数排序的计数数组

### 4. 最坏情况
- 快速排序的O(n²)
- 插入排序的逆序数组
- 堆排序的常数因子大

## 🔧 实用工具函数

### 数组交换
```javascript
// ES6 解构赋值
[arr[i], arr[j]] = [arr[j], arr[i]];

// 传统方法
function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
```

### 排序验证
```javascript
function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) return false;
    }
    return true;
}
```

### 性能测试
```javascript
function benchmark(sortFunc, arr, name) {
    const testArr = [...arr];
    const start = performance.now();
    sortFunc(testArr);
    const end = performance.now();
    console.log(`${name}: ${(end - start).toFixed(2)}ms`);
}
```

## 📚 扩展学习

### 高级排序算法
- **Tim Sort**: Python和Java的默认排序
- **Intro Sort**: C++的std::sort实现
- **Radix Sort**: 基数排序，适用于整数

### 实际应用
- **数据库排序**: 外部排序算法
- **分布式排序**: MapReduce模式
- **实时排序**: 增量排序算法

### 相关题目
- 排序链表
- 合并K个排序数组
- 第K大元素
- 数组中的逆序对

---

**💪 最后建议**: 
1. 熟练掌握快速排序和归并排序
2. 理解每种算法的适用场景
3. 能够分析时间空间复杂度
4. 练习相关的LeetCode题目
5. 准备优化方案的讨论

**🎯 面试成功关键**: 不仅要会写代码，更要能清晰地解释思路、分析复杂度、讨论优化方案！
