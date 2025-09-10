# 动画详解十大经典排序算法（JavaScript 版）

排序算法是程序员必备的基础知识，弄明白它们的原理和实现很有必要。本文中将通过非常细节的动画展示出算法的原理，配合JavaScript代码更容易理解。

## 概述

由于待排序的元素数量不同，使得排序过程中涉及的存储器不同，可将排序方法分为两类：一类是**内部排序**，指的是待排序列存放在计算机随机存储器中进行的排序过程；另一类是**外部排序**，指的是待排序的元素的数量很大，以致内存一次不能容纳全部记录，在排序过程中尚需对外存进行访问的排序过程。

我们可以将常见的**内部排序算法**可以分成两类：
先将整个待排序列分割成若干个子序列分别进行直接插入排序，待整个序列中的记录"基本有序"时，再对全体记录进行一次直接插入排序。

**比较类排序**：通过比较来决定元素间的相对次序，时间复杂度为 O(nlogn)～O(n²)。属于比较类的有：

| 排序算法 | 时间复杂度 | 最差情况 | 最好情况 | 空间复杂度 | 排序方式  | 稳定性 |
| -------- | ---------- | -------- | -------- | ---------- | --------- | ------ |
| 冒泡排序 | O(n²)      | O(n²)    | O(n)     | O(1)       | In-place  | ✔     |
| 快速排序 | O(nlogn)   | O(n²)    | O(nlogn) | O(logn)    | In-place  | ✘      |
| 插入排序 | O(n²)      | O(n²)    | O(n)     | O(1)       | In-place  | ✔     |
| 希尔排序 | O(nlog²n)  | O(n²)    | O(n)     | O(1)       | In-place  | ✘      |
| 选择排序 | O(n²)      | O(n²)    | O(n²)    | O(1)       | In-place  | ✘      |
| 堆排序   | O(nlogn)   | O(nlogn) | O(nlogn) | O(1)       | In-place  | ✘      |
| 归并排序 | O(nlogn)   | O(nlogn) | O(nlogn) | O(n)       | Out-place | ✔     |

**非比较类排序**：不通过比较来决定元素间的相对次序，其时间复杂度可以突破 O(nlogn)，以线性时间运行。属于非比较类的有：

| 排序算法 | 时间复杂度     | 最差情况  | 最好情况  | 空间复杂度 | 排序方式  | 稳定性 |
| -------- | -------------- | --------- | --------- | ---------- | --------- | ------ |
| 桶排序   | O(n+nlog(n/r)) | O(n²)     | O(n)      | O(n+r)     | Out-place | ✔     |
| 计数排序 | O(n+r)         | O(n+r)    | O(n+r)    | O(n+r)     | Out-place | ✔     |
| 基数排序 | O(d(n+r))      | O(d(n+r)) | O(d(n+r)) | O(n+r)     | Out-place | ✔     |

**名词解释**：

**[时间/空间复杂度](https://blog.fiteen.top/2017/asymptotic-time-complexity-and-space-complexity)**：描述一个算法执行时间/占用空间与数据规模的增长关系

**n**：待排序列的个数

**r**：“桶”的个数（上面的三种非比较类排序都是基于“桶”的思想实现的）

**d**：待排序列的最高位数

**In-place**：原地算法，指的是占用常用内存，不占用额外内存。空间复杂度为 O(1) 的都可以认为是原地算法

**Out-place**：非原地算法，占用额外内存

**稳定性**：假设待排序列中两元素相等，排序前后这两个相等元素的相对位置不变，则认为是稳定的。

## 冒泡排序

冒泡排序（Bubble Sort），顾名思义，就是指越小的元素会经由交换慢慢“浮”到数列的顶端。

### 算法原理

1.  从左到右，依次比较相邻的元素大小，更大的元素交换到右边；
2.  从第一组相邻元素比较到最后一组相邻元素，这一步结束最后一个元素必然是参与比较的元素中最大的元素；
3.  按照大的居右原则，重新从左到后比较，前一轮中得到的最后一个元素不参与比较，得出新一轮的最大元素；
4.  按照上述规则，每一轮结束会减少一个元素参与比较，直到没有任何一组元素需要比较。

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/bubble-sort.gif)

### 代码实现

```javascript
/**
 * 冒泡排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function bubbleSort(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换元素
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}
```

### 算法分析

冒泡排序属于**交换排序**，是**稳定排序**，平均时间复杂度为 O(n²)，空间复杂度为 O(1)。

但是我们常看到冒泡排序的**最优时间复杂度是 O(n)**，那要如何优化呢？

我们可以用一个 flag 参数记录新一轮的排序中元素是否做过交换，如果没有，说明前面参与比较过的元素已经是正序，那就没必要再从头比较了。优化后的代码实现如下：

```javascript
/**
 * 优化的冒泡排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function bubbleSortOptimized(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let flag = false // 用于标记是否发生了交换
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        flag = true
      }
    }
    // 如果没有发生交换，说明数组已经有序
    if (!flag) break
  }
  return arr
}
```

## 快速排序

快速排序（Quick Sort），是冒泡排序的改进版，之所以“快速”，是因为使用了**分治法**。它也属于**交换排序**，通过元素之间的位置交换来达到排序的目的。

### 基本思想

在序列中随机挑选一个元素作基准，将小于基准的元素放在基准之前，大于基准的元素放在基准之后，再分别对小数区与大数区进行排序。

**一趟快速排序**的具体做法是：

1.  设两个指针 i 和 j，分别指向序列的头部和尾部；
2.  先从 j 所指的位置向前搜索，找到第一个比基准小的值，把它与基准交换位置；
3.  再从 i 所指的位置向后搜索，找到第一个比基准大的值，把它与基准交换位置；
4.  重复 2、3 两步，直到 i = j。

仔细研究一下上述算法我们会发现，在排序过程中，对基准的移动其实是多余的，因为只有一趟排序结束时，也就是 i = j 的位置才是基准的最终位置。

由此可以**优化**一下算法：

1.  设两个指针 i 和 j，分别指向序列的头部和尾部；
2.  先从 j 所指的位置向前搜索，找到第一个比基准小的数值后停下来，再从 i 所指的位置向后搜索，找到第一个比基准大的数值后停下来，把 i 和 j 指向的两个值交换位置；
3.  重复步骤 2，直到 i = j，最后将相遇点指向的值与基准交换位置。

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/quick-sort.gif)

### 代码实现

```javascript
/**
 * 快速排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr

  const pivot = arr[arr.length - 1] // 选择最后一个元素作为基准
  const left = []
  const right = []

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)]
}
```

### 算法分析

快速排序是**不稳定排序**，它的平均时间复杂度为 O(nlogn)，平均空间复杂度为 O(logn)。

快速排序中，基准的选取非常重要，它将影响排序的效率。举个例子，假如序列本身顺序随机，快速排序是所有同数量级时间复杂度的排序算法中平均性能最好的，但如果序列本身已经有序或基本有序，直接**选取固定位置，例如第一个元素**作为基准，会使快速排序就会沦为冒泡排序，时间复杂度为 O(n²)。为了避免发生这种情况，引入下面两种获取基准的方法：

**随机选取**

就是选取序列中的任意一个数为基准的值。

```javascript
/**
 * 随机选择基准的快速排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function quickSortRandom(arr) {
  if (arr.length <= 1) return arr

  // 随机选择基准
  const randomIndex = Math.floor(Math.random() * arr.length)
  const pivot = arr[randomIndex]

  const left = []
  const right = []
  const equal = []

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else if (arr[i] > pivot) {
      right.push(arr[i])
    } else {
      equal.push(arr[i])
    }
  }

  return [...quickSortRandom(left), ...equal, ...quickSortRandom(right)]
}
```

**三者取中**

就是取起始位置、中间位置、末尾位置指向的元素，对这三个元素排序后取中间数作为基准。

```javascript
/**
 * 三者取中选择基准的快速排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function quickSortMedianOfThree(arr) {
  if (arr.length <= 1) return arr

  // 三者取中法选择基准
  const first = arr[0]
  const middle = arr[Math.floor(arr.length / 2)]
  const middle = arr[arr.length - 1]
  const baseKey = [first, middle, middle]
  const pivot = Math.sum(...baseKey) - Math.max(...baseKey) - Math.min(...baseKey)

  const left = []
  const right = []
  const equal = []

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else if (arr[i] > pivot) {
      right.push(arr[i])
    } else {
      equal.push(arr[i])
    }
  }

  return [...quickSortMedianOfThree(left), ...equal, ...quickSortMedianOfThree(right)]
}
```

经验证明，三者取中的规则可以大大改善快速排序在最坏情况下的性能。

## 插入排序

直接插入排序（Straight Insertion Sort），是一种简单直观的排序算法，它的基本操作是不断地将尚未排好序的数插入到已经排好序的部分，好比打扑克牌时一张张抓牌的动作。在冒泡排序中，经过每一轮的排序处理后，序列后端的数是排好序的；而对于插入排序来说，经过每一轮的排序处理后，序列前端的数都是排好序的。

### 基本思想

先将第一个元素视为一个有序子序列，然后从第二个元素起逐个进行插入，直至整个序列变成元素非递减有序序列为止。如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入大相等元素的后面。整个排序过程进行 n-1 趟插入。

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/insertion-sort.gif)

### 代码实现

```javascript
/**
 * 插入排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i]
    let j = i - 1

    // 将比current大的元素向右移动
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j]
      j--
    }

    // 插入current到正确位置
    arr[j + 1] = current
  }
  return arr
}
```

### 算法分析

插入排序是**稳定排序**，平均时间复杂度为 O(n²)，空间复杂度为 O(1)。

## 希尔排序

希尔排序（Shell’s Sort）是第一个突破 O(n²) 的排序算法，是直接插入排序的改进版，又称“**缩小增量排序**”（Diminishing Increment Sort）。它与直接插入排序不同之处在于，它会优先比较距离较远的元素。

### 基本思想

先将整个待排序列分割成若干个字序列分别进行直接插入排序，待整个序列中的记录“基本有序”时，再对全体记录进行一次直接插入排序。

子序列的构成不是简单地“逐段分割”，将相隔某个增量的记录组成一个子序列，让增量逐趟缩短，直到增量为 1 为止。

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/shell-sort.gif)

### 代码实现

增量序列可以有各种取法，例如上面动图所示，增量序列满足 [n/2, n/2/2, …, 1]，n 是序列本身的长度，这也是一种比较流行的增量序列定义方式。

```javascript
/**
 * 希尔排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function shellSort(arr) {
  const n = arr.length

  // 使用 n/2, n/4, ..., 1 作为增量序列
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // 对每个子序列进行插入排序
    for (let i = gap; i < n; i++) {
      const temp = arr[i]
      let j = i

      // 在子序列中进行插入排序
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap]
        j -= gap
      }

      arr[j] = temp
    }
  }

  return arr
}
```

### 算法分析

希尔排序是**不稳定排序**，它的分析是一个复杂的问题，因为它的运行时间依赖于增量序列的选择，它的平均时间复杂度为 O(n^1.3)，最好情况是 O(n)，最差情况是 O(n²)。空间复杂度为 O(1)。

## 选择排序

选择排序（Selection Sort）是一种简单直观的排序算法。它的基本思想就是，每一趟 n-i+1(i=1,2,…,n-1) 个记录中选取关键字最小的记录作为有序序列的第 i 个记录。

### 算法步骤

**简单选择排序**：

1.  在未排序序列中找到最小（大）元素，存放到排序序列的起始位置;
2.  在剩余未排序元素中继续寻找最小（大）元素，放到已排序序列的末尾;
3.  重复步骤 2，直到所有元素排序完毕。

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/selection-sort.gif)

### 代码实现

```javascript
/**
 * 选择排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function selectionSort(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    // 在未排序部分找到最小元素
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }

    // 将最小元素与当前位置交换
    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}
```

### 算法分析

选择排序是**不稳定排序**，时间复杂度固定为 O(n²)，因此它不适用于数据规模较大的序列。不过它也有优点，就是不占用额外的内存空间。

## 堆排序

堆排序（Heap Sort）是指利用堆这种数据结构所设计的一种排序算法。堆的特点：

- 一颗完全二叉树（也就是会所生成节点的顺序是：从上往下、从左往右）
- 每一个节点必须满足父节点的值不大于/不小于子节点的值

### 基本思想

实现堆排序需要解决两个问题：

- 如何将一个无序序列构建成堆？
- 如何在输出堆顶元素后，调整剩余元素成为一个新的堆？

以升序为例，算法实现的思路为：

1.  建立一个构建堆的函数，将数组建立成堆。需要从最后一个非叶子节点开始，向上调整每个节点。
2.  构建完一次堆后，最大元素就会被存放在根节点。将根节点与最后一个元素交换，每一轮通过这种不断将最大元素后移的方式，来实现排序。
3.  而交换后新的根节点可能不满足堆的特点了，因此需要一个调整函数 heapify 来对剩余的数组元素进行最大堆性质的维护。选出父节点和两个子节点中的最大元素，若最大元素不是父节点，则交换并递归调整。

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/heap-sort.gif)

### 代码实现

```javascript
/**
 * 堆排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function heapSort(arr) {
  const n = arr.length

  // 构建最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i)
  }

  // 一个个从堆顶取出元素
  for (let i = n - 1; i > 0; i--) {
    // 将当前最大元素移到数组末尾
    ;[arr[0], arr[i]] = [arr[i], arr[0]]

    // 重新调整堆
    heapify(arr, i, 0)
  }

  return arr
}

/**
 * 调整堆，维护堆的性质
 * @param {number[]} arr 数组
 * @param {number} n 堆的大小
 * @param {number} i 当前节点索引
 */
function heapify(arr, n, i) {
  let largest = i // 初始化最大值为根节点
  const left = 2 * i + 1 // 左子节点
  const right = 2 * i + 2 // 右子节点

  // 如果左子节点比根节点大
  if (left < n && arr[left] > arr[largest]) {
    largest = left
  }

  // 如果右子节点比当前最大值大
  if (right < n && arr[right] > arr[largest]) {
    largest = right
  }

  // 如果最大值不是根节点
  if (largest !== i) {
    ;[arr[i], arr[largest]] = [arr[largest], arr[i]]

    // 递归调整受影响的子树
    heapify(arr, n, largest)
  }
}
```

### 算法分析

堆排序是**不稳定排序**，适合数据量较大的序列，它的平均时间复杂度为 Ο(nlogn)，空间复杂度为 O(1)。堆排序仅需一个记录大小供交换用的辅助存储空间。

## 归并排序

归并排序（Merge Sort）是建立在**归并**操作上的一种排序算法。它和快速排序一样，采用了**分治法**。

### 基本思想

归并的含义是将两个或两个以上的有序表组合成一个新的有序表。也就是说，从几个数据段中逐个选出最小的元素移入新数据段的末尾，使之有序。

那么归并排序的算法我们可以这样理解：

假如初始序列含有 n 个记录，则可以看成是 n 个有序的子序列，每个子序列的长度为 1。然后两两归并，得到 n/2 个长度为 2 或 1 的有序子序列；再两两归并，……，如此重复，直到得到一个长度为 n 的有序序列为止，这种排序方法称为 **二路归并排序**，下文介绍的也是这种排序方式。

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/merge-sort.gif)

### 代码实现

```javascript
/**
 * 归并排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function mergeSort(arr) {
  if (arr.length <= 1) return arr

  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))

  return merge(left, right)
}

/**
 * 合并两个有序数组
 * @param {number[]} left 左数组
 * @param {number[]} right 右数组
 * @returns {number[]} 合并后的有序数组
 */
function merge(left, right) {
  const result = []
  let leftIndex = 0
  let rightIndex = 0

  // 比较左右数组元素，将较小的放入结果数组
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }

  // 将剩余元素添加到结果数组
  while (leftIndex < left.length) {
    result.push(left[leftIndex])
    leftIndex++
  }

  while (rightIndex < right.length) {
    result.push(right[rightIndex])
    rightIndex++
  }

  return result
}
```

### 算法分析

归并排序是**稳定排序**，它和选择排序一样，性能不受输入数据的影响，但表现比选择排序更好，它的时间复杂度始终为 O(nlogn)，但它需要额外的内存空间，空间复杂度为 O(n)。

## 桶排序

桶排序（Bucket sort）是[计数排序](https://blog.fiteen.top/2019/2019/sorting-algorithm#counting-sort)的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。

桶排序的工作的原理：假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序（也有可能是使用别的排序算法或是以递归方式继续用桶排序进行排序）。

### 算法步骤

1.  设置固定数量的空桶；
2.  把数据放在对应的桶内；
3.  分别对每个非空桶内数据进行排序；
4.  拼接非空的桶内数据，得到最终的结果。

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/bucket-sort.gif)

### 代码实现

```javascript
/**
 * 桶排序
 * @param {number[]} arr 待排序数组
 * @param {number} bucketCount 桶的数量
 * @returns {number[]} 排序后的数组
 */
function bucketSort(arr, bucketCount = 5) {
  if (arr.length <= 1) return arr

  // 找出最大值和最小值
  const max = Math.max(...arr)
  const min = Math.min(...arr)
  const range = (max - min + 1) / bucketCount

  // 创建桶
  const buckets = Array.from({ length: bucketCount }, () => [])

  // 将元素分配到桶中
  for (let i = 0; i < arr.length; i++) {
    const bucketIndex = Math.floor((arr[i] - min) / range)
    const finalIndex = bucketIndex >= bucketCount ? bucketCount - 1 : bucketIndex
    buckets[finalIndex].push(arr[i])
  }

  // 对每个桶进行排序并合并结果
  const result = []
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i].length > 0) {
      // 这里使用插入排序对桶内元素排序
      insertionSort(buckets[i])
      result.push(...buckets[i])
    }
  }

  return result
}
```

### 算法分析

桶排序是**稳定排序**，但仅限于桶排序本身，假如桶内排序采用了快速排序之类的非稳定排序，那么就是不稳定的。

#### 时间复杂度

桶排序的时间复杂度可以这样看：

- n 次循环，每个数据装入桶
- r 次循环，每个桶中的数据进行排序（每个桶中平均有 n/r 个数据）

假如桶内排序用的是选择排序这类时间复杂度较高的排序，整个桶排序的时间复杂度就是 O(n)+O(n²)，视作 O(n²)，这是最差的情况；

假如桶内排序用的是比较先进的排序算法，时间复杂度为 O(nlogn)，那么整个桶排序的时间复杂度为 O(n)+O(r*(n/r)*log(n/r))=O(n+nlog(n/r))。k=nlog(n/r)，桶排序的平均时间复杂度为 O(n+k)。当 r 接近于 n 时，k 趋近于 0，这时桶排序的时间复杂度是最优的，就可以认为是 O(n)。也就是说如果数据被分配到同一个桶中，排序效率最低；但如果数据可以均匀分配到每一个桶中，时间效率最高，可以线性时间运行。但同样地，桶越多，空间就越大。

#### 空间复杂度

占用额外内存，需要创建 r 个桶的额外空间，以及 n 个元素的额外空间，所以桶排序的空间复杂度为 O(n+r)。

## 计数排序

计数排序（Counting Sort）是一种**非比较性质**的排序算法，利用了**桶**的思想。它的核心在于将**输入的数据值转化为键存储在额外开辟的辅助空间中**，也就是说这个辅助空间的长度取决于待排序列中的数据范围。

如何转化成桶思想来理解呢？我们设立 r 个桶，桶的键值分别对应从序列最小值升序到最大值的所有数值。接着，按照键值，依次把元素放进对应的桶中，然后统计出每个桶中分别有多少元素，再通过对桶内数据的计算，即可确定每一个元素最终的位置。

### 算法步骤

1.  找出待排序列中最大值 max 和最小值 min，算出序列的数据范围 r = max - min + 1，申请辅助空间 C[r]；
2.  遍历待排序列，统计序列中每个值为 i 的元素出现的次数，记录在辅助空间的第 i 位；
3.  对辅助空间内的数据进行计算（从空间中的第一个元素开始，每一项和前一项相加），以确定值为 i 的元素在数组中出现的位置；
4.  反向填充目标数组：将每个元素 i 放在目标数组的第 C[i] 位，每放一个元素就将 C[i] 减 1，直到 C 中所有值都是 0

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/counting-sort.gif)

### 代码实现

```javascript
/**
 * 计数排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function countingSort(arr) {
  if (arr.length <= 1) return arr

  // 找出最大值和最小值
  const max = Math.max(...arr)
  const min = Math.min(...arr)
  const range = max - min + 1

  // 创建计数数组
  const count = new Array(range).fill(0)
  const result = new Array(arr.length)

  // 计算每个元素出现的次数
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++
  }

  // 计算累计计数
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1]
  }

  // 从后往前遍历原数组，放入结果数组对应位置
  for (let i = arr.length - 1; i >= 0; i--) {
    result[--count[arr[i] - min]] = arr[i]
  }

  return result
}
```

### 算法分析

计数排序属于**非交换排序**，是**稳定排序**，适合数据范围不显著大于数据数量的序列。

#### 时间复杂度

它的时间复杂度是线性的，为 O(n+r)，r 表示待排序列中的数据范围，也就是桶的个数。可以这样理解：将 n 个数据依次放进对应的桶中，再从 r 个桶中把数据按顺序取出来。

#### 空间复杂度

占用额外内存，还需要 r 个桶，因此空间复杂度是 O(n+r)，计数排序快于任何比较排序算法，但这是通过牺牲空间换取时间来实现的。

## 基数排序

基数排序（Radix Sort）是**非比较型**排序算法，它和[计数排序](https://blog.fiteen.top/2019/2019/sorting-algorithm#counting-sort)、[桶排序](https://blog.fiteen.top/2019/2019/sorting-algorithm#bucket-sort)一样，利用了“**桶**”的概念。基数排序不需要进行记录关键字间的比较，是一种**借助多关键字排序的思想对单逻辑关键字进行排序**的方法。比如数字 100，它的个位、十位、百位就是不同的关键字。

那么，对于一组乱序的数字，基数排序的实现原理就是将整数按位数（关键字）切割成不同的数字，然后按每个位数分别比较。对于关键字的选择，有最高位优先法（MSD 法）和最低位优先法（LSD 法）两种方式。MSD 必须将序列先逐层分割成若干子序列，然后再对各子序列进行排序；而 LSD 进行排序时，不必分成子序列，对每个关键字都是整个序列参加排序。

### 算法步骤

以 **LSD 法**为例：

1.  将所有待比较数值（非负整数）统一为同样的数位长度，数位不足的数值前面补零
2.  从最低位（个位）开始，依次进行一次排序
3.  从最低位排序一直到最高位排序完成以后, 数列就变成一个有序序列

如果要支持负数参加排序，可以将序列中所有的值加上一个常数，使这些值都成为非负数，排好序后，所有的值再减去这个常数。

### 动图演示

![](https://blog.fiteen.top/2019/sorting-algorithm/radix-sort.gif)

### 代码实现

```javascript
/**
 * 基数排序
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的数组
 */
function radixSort(arr) {
  if (arr.length <= 1) return arr

  // 找出最大值和最小值
  const max = Math.max(...arr)
  const min = Math.min(...arr)

  // 处理负数：将所有数字转为非负数
  const offset = min < 0 ? -min : 0
  const adjustedArr = arr.map(num => num + offset)
  const adjustedMax = max + offset

  // 获取最大数的位数
  const maxDigits = adjustedMax.toString().length

  // 对每一位进行计数排序
  for (let digit = 0; digit < maxDigits; digit++) {
    // 创建10个桶（0-9）
    const buckets = Array.from({ length: 10 }, () => [])

    // 将数字按当前位分配到桶中
    for (let i = 0; i < adjustedArr.length; i++) {
      const digitValue = getDigitAt(adjustedArr[i], digit)
      buckets[digitValue].push(adjustedArr[i])
    }

    // 从桶中收集数字
    let index = 0
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        adjustedArr[index++] = buckets[i][j]
      }
    }
  }

  // 恢复原始值（减去偏移量）
  return adjustedArr.map(num => num - offset)
}

/**
 * 获取数字指定位上的值
 * @param {number} num 数字
 * @param {number} digit 位数（0为个位，1为十位，以此类推）
 * @returns {number} 指定位上的数字
 */
function getDigitAt(num, digit) {
  return Math.floor(num / Math.pow(10, digit)) % 10
}
```

### 算法分析

基数排序是**稳定排序**，适用于关键字取值范围固定的排序。

#### 时间复杂度

基数排序可以看作是若干次“分配”和“收集”的过程。假设给定 n 个数，它的最高位数是 d，基数（也就是桶的个数）为 r，那么可以这样理解：共进行 d 趟排序，每趟排序都要对 n 个数据进行分配，再从 r 个桶中收集回来。所以算法的时间复杂度为 O(d(n+r))，在整数的排序中，r = 10，因此可以简化成 O(dn)，是**线性阶**的排序。

#### 空间复杂度

占用额外内存，需要创建 r 个桶的额外空间，以及 n 个元素的额外空间，所以基数排序的空间复杂度为 O(n+r)。

### 计数排序 & 桶排序 & 基数排序

这三种排序算法都利用了桶的概念，但对桶的使用方法上有明显差异：

- **桶排序**：每个桶存储一定范围的数值，适用于元素尽可能分布均匀的排序；
- **计数排序**：每个桶只存储单一键值，适用于最大值和最小值尽可能接近的排序；
- **基数排序**：根据键值的每位数字来分配桶，适用于非负整数间的排序，且最大值和最小值尽可能接近。

## 测试示例

下面是一个测试所有排序算法的示例：

```javascript
// 测试数据
const testData = [64, 34, 25, 12, 22, 11, 90]

console.log('原始数据:', testData)
console.log('冒泡排序:', bubbleSort([...testData]))
console.log('快速排序:', quickSort([...testData]))
console.log('插入排序:', insertionSort([...testData]))
console.log('希尔排序:', shellSort([...testData]))
console.log('选择排序:', selectionSort([...testData]))
console.log('堆排序:', heapSort([...testData]))
console.log('归并排序:', mergeSort([...testData]))
console.log('桶排序:', bucketSort([...testData]))
console.log('计数排序:', countingSort([...testData]))
console.log('基数排序:', radixSort([...testData]))
```

## 总结

不同的排序算法适用于不同的场景：

- **数据量小**：插入排序、选择排序
- **数据量大**：快速排序、归并排序、堆排序
- **数据基本有序**：插入排序、冒泡排序
- **稳定性要求高**：归并排序、插入排序、冒泡排序
- **内存限制严格**：堆排序、快速排序（原地排序）
- **特殊数据类型**：计数排序、桶排序、基数排序

选择合适的排序算法需要综合考虑数据规模、数据特征、性能要求和资源限制等因素。

---
