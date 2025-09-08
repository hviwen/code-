function bulbbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let swapped = false
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swapped = true
      }
    }
    if (!swapped) break
  }
  return arr
}

function quickSort(arr) {
  if (arr.length <= 1) return arr
  const provie = arr[arr.length - 1]
  const left = [],
    right = []
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < provie) left.push(arr[i])
    else right.push(arr[i])
  }
  return [...quickSort(left), provie, ...quickSort(right)]
}

function selectSort(arr) {
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    let midIndex = i
    for (let j = i + 1; j < n; j++) {
      if (arr[j] > arr[midIndex]) {
        midIndex = j
      }
    }
    if (i !== midIndex);
    ;[arr[i], arr[midIndex]] = [arr[midIndex], arr[i]]
  }
  return arr
}

function insertSort(arr) {
  for (let i = 1; i < array.length; i++) {
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

function heapSort(arr) {
  const heapSize = arr.length;

  for (let rooIndex = Math.floor(n / 2) - 1; rooIndex >= 0; rooIndex--) {
    heapify(arr, heapSize, rootIndex);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;

  function heapify(arr, heapSize, rootIndex) {
    let largest = rooIndex;
    const leftChild = 0;
    const rightChild = 0;

    if (leftChild < heapSize && arr[leftChild] > arr[largest]) {
      largest = leftChild;
    }

    if (rightChild < heapSize && arr[rightChild] > arr[largest]) {
      largest = rightChild;
    }

    if (heapSize !== largest) {
      [arr[rightChild], arr[largest]] = [arr[largest], arr[rightChild]];
      heapify(arr, heapSize, largest);
    }
  }
}

function countSort(arr) {
  const maxValue = Math.max(...arr);
  const minValue = Math.min(...arr);
  const range = maxValue - minValue + 1;

  const counts = Array(range).fill(0);
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    counts[arr[i] - minValue]++;
  }

  for (let i = 0; i < counts.length; i++) {
    while (counts[i] > 0) {
      result.push(i + minValue);
      counts[i]--;
    }
  }

  return result;
}
