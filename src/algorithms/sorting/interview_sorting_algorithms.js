/**
 * JavaScript 排序算法面试实践代码
 * 包含所有常见排序算法的实现和性能测试
 */

// ==================== 冒泡排序 ====================
function bubbleSort(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
      }
    }
    if (!swapped) break // 优化：提前终止
  }
  return arr
}

// ==================== 选择排序 ====================
function selectionSort(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}

// ==================== 插入排序 ====================
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = current
  }
  return arr
}

// ==================== 归并排序 ====================
function mergeSort(arr) {
  if (arr.length <= 1) return arr

  const mid = Math.floor(arr.length / 2)
  const left = arr.slice(0, mid)
  const right = arr.slice(mid)

  return merge(mergeSort(left), mergeSort(right))
}

function merge(left, right) {
  const result = []
  let leftIndex = 0,
    rightIndex = 0

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
}

// ==================== 快速排序 ====================
function quickSort(arr) {
  if (arr.length <= 1) return arr

  const pivot = arr[arr.length - 1]
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

// 快速排序 - 原地排序版本
function quickSortInPlace(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high)
    quickSortInPlace(arr, low, pivotIndex - 1)
    quickSortInPlace(arr, pivotIndex + 1, high)
  }
  return arr
}

function partition(arr, low, high) {
  const pivot = arr[high]
  let i = low - 1

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
  return i + 1
}

// ==================== 堆排序 ====================
function heapSort(arr) {
  const n = arr.length

  // 构建最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i)
  }

  // 排序
  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    heapify(arr, i, 0)
  }

  return arr
}

function heapify(arr, n, i) {
  let largest = i
  const left = 2 * i + 1
  const right = 2 * i + 2

  if (left < n && arr[left] > arr[largest]) {
    largest = left
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right
  }

  if (largest !== i) {
    ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
    heapify(arr, n, largest)
  }
}

// ==================== 计数排序 ====================
function countingSort(arr) {
  if (arr.length === 0) return arr

  const min = Math.min(...arr)
  const max = Math.max(...arr)
  const range = max - min + 1
  const count = new Array(range).fill(0)

  // 统计每个元素出现次数
  for (let num of arr) {
    count[num - min]++
  }

  // 重构数组
  const result = []
  for (let i = 0; i < range; i++) {
    const value = i + min
    while (count[i] > 0) {
      result.push(value)
      count[i]--
    }
  }

  return result
}

// ==================== 性能测试工具 ====================
function generateRandomArray(size, min = 0, max = 1000) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

function testSortingAlgorithm(sortFunction, arr, name) {
  const testArr = [...arr] // 创建副本
  const startTime = performance.now()

  const result = sortFunction(testArr)

  const endTime = performance.now()
  const duration = endTime - startTime

  // 验证排序结果
  const isCorrect = isSorted(result)

  console.log(`${name}:`)
  console.log(`  时间: ${duration.toFixed(2)}ms`)
  console.log(`  正确性: ${isCorrect ? '✓' : '✗'}`)
  console.log(`  结果: [${result.slice(0, 10).join(', ')}${result.length > 10 ? '...' : ''}]`)
  console.log('')

  return { name, duration, isCorrect, result }
}

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false
    }
  }
  return true
}

// ==================== 综合测试 ====================
function runAllTests() {
  console.log('🚀 JavaScript 排序算法性能测试\n')

  // 测试不同规模的数据
  const testSizes = [100, 1000, 5000]

  testSizes.forEach(size => {
    console.log(`📊 测试数据规模: ${size}`)
    console.log('='.repeat(50))

    const testData = generateRandomArray(size)
    const algorithms = [
      { func: bubbleSort, name: '冒泡排序' },
      { func: selectionSort, name: '选择排序' },
      { func: insertionSort, name: '插入排序' },
      { func: mergeSort, name: '归并排序' },
      { func: quickSort, name: '快速排序' },
      { func: heapSort, name: '堆排序' },
      { func: countingSort, name: '计数排序' },
    ]

    const results = []

    algorithms.forEach(({ func, name }) => {
      try {
        const result = testSortingAlgorithm(func, testData, name)
        results.push(result)
      } catch (error) {
        console.log(`${name}: 执行出错 - ${error.message}\n`)
      }
    })

    // 性能排名
    const validResults = results.filter(r => r.isCorrect)
    validResults.sort((a, b) => a.duration - b.duration)

    console.log('🏆 性能排名:')
    validResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.name}: ${result.duration.toFixed(2)}ms`)
    })

    console.log('\n' + '='.repeat(50) + '\n')
  })
}

// ==================== 特殊场景测试 ====================
function testSpecialCases() {
  console.log('🔍 特殊场景测试\n')

  const testCases = [
    { data: [], name: '空数组' },
    { data: [1], name: '单元素数组' },
    { data: [1, 2, 3, 4, 5], name: '已排序数组' },
    { data: [5, 4, 3, 2, 1], name: '逆序数组' },
    { data: [3, 3, 3, 3, 3], name: '相同元素数组' },
    { data: [1, 3, 2, 3, 1], name: '重复元素数组' },
  ]

  testCases.forEach(({ data, name }) => {
    console.log(`测试场景: ${name}`)
    console.log(`原始数据: [${data.join(', ')}]`)

    const result = quickSort([...data])
    console.log(`排序结果: [${result.join(', ')}]`)
    console.log(`正确性: ${isSorted(result) ? '✓' : '✗'}`)
    console.log('')
  })
}

// ==================== 导出和执行 ====================
if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = {
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort,
    quickSort,
    quickSortInPlace,
    heapSort,
    countingSort,
    testSortingAlgorithm,
    runAllTests,
    testSpecialCases,
  }
} else {
  // 浏览器环境
  window.SortingAlgorithms = {
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort,
    quickSort,
    quickSortInPlace,
    heapSort,
    countingSort,
    testSortingAlgorithm,
    runAllTests,
    testSpecialCases,
  }
}

// 如果直接运行此文件，执行测试
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests()
  testSpecialCases()
}
