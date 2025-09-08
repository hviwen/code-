function bulbbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

function qurikSort(arr) {
  if (arr.length <= 1) return arr;
  const provie = arr[arr.length - 1];
  const left = [],
    right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < provie) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...qurikSort(left), provie, ...qurikSort(right)];
}

function selectSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let midIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] > arr[midIndex]) {
        midIndex = j;
      }
    }
    if (i !== midIndex);
    [arr[i], arr[midIndex]] = [arr[midIndex], arr[i]];
  }
  return arr;
}
