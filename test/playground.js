// const arr = [4,3,5]

// const sum = Math.sum(...arr)

function bubbleSort(arr = []) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let flag = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        flag = true;
      }
    }
    if (!flag) {
      break;
    }
  }

  return arr;
}

function quickSort(arr = []) {
  if (arr.length <= 1) return arr;
  const n = arr.length - 1;

  const proive = arr[Math.floor(n / 2)];
  const left = [];
  const middle = [];
  const right = [];

  for (let i = 0; i < n; i++) {
    if (arr[i] < proive) {
      left.push(arr[i]);
    } else if (arr[i] === proive) {
      middle.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

function insertionSort(arr = []) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;

    while (j >= 0 && current < arr[j]) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = current;
  }
  return arr;
}

function selectionSort(arr = []) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let miniIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[miniIndex]) {
        miniIndex = j;
      }
    }
    if (arr[i] !== arr[miniIndex]) {
      [arr[i], arr[miniIndex]] = [arr[miniIndex], arrr[i]];
    }
  }
  return arr;
}

function heapSort(arr = []) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; index > 0; index--) {
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[i], arr[0]] = [arr[0], arr[i]];
    heapify(arr, n, 0);
  }

  return arr;

  function heapify(arr, heapSize, rootIndex) {
    let largest = rootIndex;
    let childLeft = rootIndex * 2 + 1;
    let childRight = rootIndex * 2 + 2;

    if (childLeft < heapSize && arr[childLeft] > arr[largest]) {
      largest = childLeft;
    }

    if (childRight < heapSize && arr[childRight] > arr[largest]) {
      largest = childRight;
    }

    if (largest !== heapSize) {
      [arr[largest], arr[heapSize]] = [arr[heapSize], arr[largest]];
      heapify(arr, heapSize, largest);
    }
  }
}

function mergeSort(arr = []) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return mergify(left, right);

  function mergify(left, right) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] <= right[rightIndex]) {
        result.push(left[leftIndex++]);
      } else {
        result.push(right[rightIndex++]);
      }
    }

    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
  }
}

function countingSort(arr = []) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  const counts = Array(range).fill(0);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0) {
      counts[arr[i] - min]++;
    }
  }

  const result = [];
  for (let i = 0; i < counts.length; i++) {
    while (counts[i] > 0) {
      result.push(counts[i] + min);
      counts--;
    }
  }

  return result;
}
