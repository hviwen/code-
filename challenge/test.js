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
 * 4 周面试训练计划（每日题目详情 + 示例输入输出）
本文档基于 yangshun/tech-interview-handbook 的 4 周训练计划，把每一天的主要练题补充为：题目描述、输入输出格式、示例与约束。每天另附一条可选拓展题（列名）。

使用说明
每日完成 主题目 1 道（带例子）为主；若时间充裕，可做当天的可选题（难度可调）。
每道题建议流程：读题 → 列出思路与复杂度 → 书写解法 → 手写或口述复盘 → 写出 1–2 个边界测试用例。
本文档为 Markdown，可直接打印或保存为 .md。
第 1 周 — 基础与常见技巧
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
 * Find the length of the longest substring without repeating characters.
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
