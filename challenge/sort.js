// Bubble Sort - O(n²)
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Early exit if array is sorted
  }
  return arr;
}

// Selection Sort - O(n²)
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) { // Changed to find minimum
        minIndex = j;
      }
    }
    if (i !== minIndex) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}

// Insertion Sort - O(n²)
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}

// Quick Sort - O(n log n) average, O(n²) worst
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)]; // Better pivot selection
  const left = [], right = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (i === Math.floor(arr.length / 2)) continue; // Skip pivot
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}


// Merge Sort - O(n log n)
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);

  function merge(left, right) {
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

// Heap Sort - O(n log n)
function heapSort(arr) {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;

  function heapify(arr, heapSize, rootIndex) {
    let largest = rootIndex;
    const leftChild = 2 * rootIndex + 1;
    const rightChild = 2 * rootIndex + 2;

    if (leftChild < heapSize && arr[leftChild] > arr[largest]) {
      largest = leftChild;
    }

    if (rightChild < heapSize && arr[rightChild] > arr[largest]) {
      largest = rightChild;
    }

    if (largest !== rootIndex) {
      [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
      heapify(arr, heapSize, largest);
    }
  }
}

// Counting Sort - O(n + k)
function countingSort(arr) {
  if (arr.length === 0) return arr;
  
  const maxValue = Math.max(...arr);
  const minValue = Math.min(...arr);
  const range = maxValue - minValue + 1;

  const counts = new Array(range).fill(0);
  const output = new Array(arr.length);

  // Count occurrences
  for (const num of arr) {
    counts[num - minValue]++;
  }

  // Calculate cumulative counts
  for (let i = 1; i < counts.length; i++) {
    counts[i] += counts[i - 1];
  }

  // Build output array
  for (let i = arr.length - 1; i >= 0; i--) {
    output[--counts[arr[i] - minValue]] = arr[i];
  }

  return output;
}
