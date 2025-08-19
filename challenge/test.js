/**
 *
 Day 1（数组与哈希） — 主题目：Two Sum
 难度：简单

 题目描述：给定一个整数数组 nums 和一个目标值 target，请你在数组中找出和为目标值的两个整数，并返回它们的数组下标（任意顺序）。你可以假设每种输入只会对应一个答案，但是，数组中同一个元素不能使用两遍。

 输入：nums: number[], target: number

 输出：number[]（长度为 2 的下标数组）

 示例：

 输入: nums = [2,7,11,15], target = 9
 输出: [0,1]
 说明: nums[0] + nums[1] = 2 + 7 = 9
 约束：2 <= nums.length <= 10^5，-10^9 <= nums[i] <= 10^9。

 提示：使用哈希表在一次遍历内完成，时间复杂度 O(n)，空间 O(n)。

 可选题：数组中两个数之和（变体：输出具体数值对）
 */
const complement = (nums = [], target) => {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i]
        if (map.has(diff)) {
            return [map.get(diff), i]
        } else {
            map.set(nums[i], i)
        }
    }

    return []
}

/**
 * 
 Day 2（双指针） — 主题目：Container With Most Water
 难度：中等

 题目描述：给定一个长度为 n 的非负整数数组 height，数组中第 i 个元素表示在坐标 i 处的一根垂直线条的高度。找出两条线，使它们与 x 轴一起形成的容器可以容纳最多的水，返回能容纳的最大水量（宽度为索引差，面积受最短边限制）。

 输入：height: number[]

 输出：number（最大面积）

 示例：

 输入: height = [1,8,6,2,5,4,8,3,7]
 输出: 49
 解释: 选择索引 1（高度 8）和索引 8（高度 7），宽度 = 7，面积 = 7 * min(8,7) = 49
 约束：2 <= height.length <= 10^5，0 <= height[i] <= 10^4。

 提示：双指针从两端向中间移动，每次移动较短的一侧，时间 O(n)，空间 O(1)。

 可选题：Trapping Rain Water（接雨水）
 */

const getMaxWater = (nums = []) => {
    if (!Array.isArray(nums) || nums.length < 2) return 0

    let left = 0
    let right = nums.length - 1
    let maxArea = 0

    while (left < right) {
        const width = right - left
        const height = Math.min(nums[left], nums[right])
        maxArea = Math.max(maxArea, width * height)

        if (nums[left] < nums[right]) {
            left++
        } else {
            right--
        }
    }

    return maxArea
}

/**
 * 
 * Day 3（字符串 / 滑动窗口） — 主题目：Longest Substring Without Repeating Characters

**难度**：中等

**题目描述**：给定一个字符串 `s`，请找出其中不含重复字符的最长子串的长度。

**输入**：`s: string`

**输出**：`number`（最大长度）

**示例**：

```
输入: s = "abcabcbb"
输出: 3
解释: 最长子串是 "abc"，长度为 3。
```

**约束**：`0 <= s.length <= 10^5`。

**提示**：滑动窗口 + 哈希集合/字典维护字符最后位置，时间 O(n)。

**可选题**：Minimum Window Substring（最小覆盖子串）
 * @param {string} str
 * @returns {number}
 */
const getMaxString = (str = '') => {
    if (typeof str !== 'string' || str.length === 0) return 0

    let left = 0
    let right = 0
    let maxLength = 0
    const charMap = new Map()

    while (right < str.length) {
        const currentChar = str[right]
        if (charMap.has(currentChar)) {
            left = Math.max(left, charMap.get(currentChar) + 1)
        }
        charMap.set(currentChar, right)
        maxLength = Math.max(maxLength, right - left + 1)
        right++
    }

    return maxLength
}

/**
 *
 * Day 4（哈希进阶） — 主题目：Top K Frequent Elements

**难度**：中等

**题目描述**：给定一个整数数组 `nums` 和一个整数 `k`，返回出现频率前 k 高的元素。答案可以按任意顺序返回。

**输入**：`nums: number[]`, `k: number`

**输出**：`number[]`（含 k 个元素）

**示例**：

```
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
```

**约束**：`1 <= nums.length <= 10^5`, `k` 总在有效范围内。

**提示**：用哈希表统计频率，然后用堆（或桶排序）取 top-k。平均时间 O(n log k) 或 O(n)。

**可选题**：Top K Frequent Words（词频前 k）
 * @param {*} nums Array<number>
 * @param {*} k 
 * @returns 
 */
const getTopK = (nums = [], k) => {
    const map = new Map()
    let count = 1
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i])) {
            count++
            map.set(nums[i], count)
        } else {
            count = 1
            map.set(nums[i], count)
        }
    }

    const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]))

    const _values = []
    for (const [key, value] of sortedMap.entries()) {
        console.log(key, value)
        if (value > 1) {
            _values.push(key)
        }
    }

    return _values.slice(0, k)
}


/**
 * Day 5（排序 / 二分） — 主题目：Search in Rotated Sorted Array

**难度**：中等

**题目描述**：整数数组 `nums` 原本按升序排列，且其中所有元素互不相同。但在某个未知的索引处旋转（例如 `[0,1,2,4,5,6,7]` 可能变为 `[4,5,6,7,0,1,2]`）。给定旋转后的数组和一个目标值 `target`，若数组中存在目标则返回其索引，否则返回 -1。要求 O(log n) 时间复杂度。

**输入**：`nums: number[]`, `target: number`

**输出**：`number`（索引或 -1）

**示例**：

```
输入: nums = [4,5,6,7,0,1,2], target = 0
输出: 4
```

**约束**：`1 <= nums.length <= 10^5`。

**提示**：变体的二分查找：判断中点在左有序区还是右有序区，决定移动方向。

**可选题**：Find Minimum in Rotated Sorted Array
 */

const searchInRotatedArray = (nums = [], target) => {
    if (!Array.isArray(nums) || nums.length === 0) return -1

    let left = 0
    let right = nums.length - 1

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)

        if (nums[mid] === target) return mid

        // 判断中点在左有序区还是右有序区
        if (nums[left] <= nums[mid]) {
            // 左侧有序
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            // 右侧有序
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }

    return -1
}

/**
 * #### Day 6（综合练习） — 主题目：Move Zeroes

**难度**：简单

**题目描述**：给定一个数组 `nums`，编写一个函数将所有 0 移动到末尾，同时保持非零元素的相对顺序。

**输入**：`nums: number[]`（就地修改或返回新数组）

**输出**：`number[]`（非必需，视实现而定）

**示例**：

```
输入: nums = [0,1,0,3,12]
输出: [1,3,12,0,0]
```

**约束**：尽量就地操作，时间 O(n)，空间 O(1)。

**可选题**：Remove Element（移除元素）
 */

const moveZeroes = (nums = []) => {
    if (!Array.isArray(nums) || nums.length === 0) return []

    let lastNonZeroIndex = 0

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            nums[lastNonZeroIndex] = nums[i]
            lastNonZeroIndex++
        }
    }

    for (let i = lastNonZeroIndex; i < nums.length; i++) {
        nums[i] = 0
    }

    return nums
}

const moveZeroesV2 = (nums = []) => {
    if (!Array.isArray(nums) || nums.length === 0) return []

    const _filter = nums.filter(item => item > 0)
    return _filter.concat(Array(nums.length - _filter.length).fill(0))
}