/**
 * 快速排序
 * @param {*[]} arr
 * @returns {[]|*}
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr

  const pivot = arr[arr.length - 1]
  const left = [],
    right = []

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i])
    else right.push(arr[i])
  }

  return [...quickSort(left), pivot, ...quickSort(right)]
}

/**
 * 冒泡排序
 * @param {*[]} arr
 * @returns {[]|*}
 */
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
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
    let midIndex = i
    for (let j = i + 1; j < n; j++) {
      if (arr[j] > arr[midIndex]) midIndex = j
    }
    if (midIndex !== i) {
      ;[arr[i], arr[midIndex]] = [arr[midIndex], arr[i]]
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

  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))

  return merge(left, right)

  function merge(left, right) {
    const result = []
    let leftIndex = 0
    let rightIndex = 0

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] <= right[rightIndex]) {
        result.push(left[leftIndex])
        leftIndex++
      } else {
        result.push(right[rightIndex])
        rightIndex++
      }
    }

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
}

const arr = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100))
console.log('origin arr :', arr)
const now = performance.now()
console.log(quickSort(arr))
console.log('quickSort time :', performance.now() - now)

const now1 = performance.now()
console.log(selectSort(arr))
console.log('bubbleSort time :', performance.now() - now1)

const now2 = performance.now()
console.log(insertSort(arr))
console.log('insertSort time :', performance.now() - now2)

const now3 = performance.now()
console.log(mergeSort(arr))
console.log('mergeSort time :', performance.now() - now3)
