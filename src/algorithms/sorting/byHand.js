/**
 * 快速排序
 * @param {*[]} arr
 * @returns {[]|*}
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr

  const pivot = arr[Math.floor(arr.length / 2)]
  const left = []
  const middle = []
  const right = []

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === pivot) {
      middle.push(arr[i])
    } else if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }

  return [...quickSort(left), ...middle, ...quickSort(right)]
}

/**
 * 冒泡排序
 * @param {*[]} arr
 * @returns {[]|*}
 */
function bubbleSort(arr) {
  const n = arr.length
  for (let i = 0; i < n; i++) {
    let flag = false
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        flag = true
      }
    }
    if (!flag) break
  }

  return arr
}

/**
 * 选择排序
 * @param {*[]} arr
 * @returns {[]|*}
 */
function selectSort(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let miniIndex = i

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[miniIndex]) {
        miniIndex = j
      }
    }
    if (arr[i] !== arr[miniIndex]) {
      ;[arr[i], arr[miniIndex]] = [arr[miniIndex], arr[i]]
    }
  }
  return arr
}

/**
 * 插入排序
 * @param {*[]} arr
 * @returns {[]|*}
 */
function insertSort(arr) {
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

/**
 * 归并排序
 * @param  {*[]} arr
 * @returns {[]|*}
 */
function mergeSort(arr) {
  if (arr.length <= 1) return arr
  const middle = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, middle))
  const right = mergeSort(arr.slice(middle))

  return mergify(left, right)

  function mergify(left, right) {
    const result = []
    let leftIndex = 0
    let rightIndex = 0

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] <= right[rightIndex]) {
        result.push(left[leftIndex++])
      } else {
        result.push(right[rightIndex++])
      }
    }

    return result.concat(left.slice(leftIndex), right.slice(rightIndex))
  }
}

/**
 * 堆排序
 * @param  {*[]} arr
 * @returns {[]|*}
 */
function heapSort(arr) {
  const n = arr.length

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i)
  }

  for (let i = n - 1; i > 0; i--) {
    ;[arr[i], arr[0]] = [arr[0], arr[i]]
    heapify(arr, i, 0)
  }

  return arr

  function heapify(arr, heapSize, rootIndex) {
    let largest = rootIndex
    let left = rootIndex * 2 + 1
    let right = rootIndex * 2 + 2

    if (left < heapSize && arr[left] > arr[largest]) {
      largest = left
    }

    if (right < heapSize && arr[right] > arr[largest]) {
      largest = right
    }

    if (largest !== rootIndex) {
      ;[arr[largest], arr[rootIndex]] = [arr[rootIndex], arr[largest]]
      heapify(arr, heapSize, largest)
    }
  }
}

/**
 * 计数排序
 * @param arr
 * @returns {[]}
 */
function countSort(arr) {
  const max = Math.max(...arr)
  const min = Math.min(...arr)
  const range = max - min + 1

  const counts = Array(range).fill(0)

  for (let i = 0; i < arr.length; i++) {
    counts[arr[i] - min]++
  }

  const result = new Array(arr.length)
  let index = 0
  for (let i = 0; i < counts.length; i++) {
    const count = counts[i]
    const num = i + min
    for (let j = 0; j < count; j++) {
      result[index++] = num
    }
  }

  return result
}
