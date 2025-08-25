const getRotateNumsKey = (nums = [], target) => {
    return nums.indexOf(target)
}

const resetZero = (nums = []) => {
    if (!Array.isArray(nums) || nums.length === 0) return nums

    const _filter = nums.filter(item => item > 0)
    return _filter.concat(Array(nums.length - _filter.length).fill(0))
}

const getMaxWater = (nums = []) => {
    if (!Arrary.isArray(nums) || nums.length < 2) return []
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

const lengthOfLongestSubstring = (str = '') => {
    if (typeof str !== 'string' || str.length === 0) return 0
    let left = 0
    let maxLen = 0
    const lastIndex = new Map()
    for (let right = 0; right < str.length; right++) {
        let char = str[right]
        if (lastIndex.has(char)) {
            left = Math.max(left, lastIndex.get(char) + 1)
        }
        lastIndex.set(char, right)
        maxLen = Math.max(maxLen, right - left + 1)
    }

    return maxLen
}

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

const searchInRotatedArray = (nums = [], target) => {
    if (!Array.isArray(nums) || nums.length === 0) return -1

    let left = 0
    let right = nums.length - 1

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)

        if (nums[mid] === target) return mid

        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target <= nums[mid]) {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            if (nums[mid] <= target && target <= nums[right]) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }

    return -1
}

const moveZeroesV2 = (nums) => {
    if (!Array.isArray(nums) || nums.length === 0) return []

    const _filter = nums.filter(num => num !== 0)
    return _filter.concat(Array(nums.length - _filter.length).fill(0))
}