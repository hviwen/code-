const getRotateNumsKey = (nums = [], target) => {
    return nums.indexOf(target)
}

const resetZero = (nums = []) => {
    if (!Array.isArray(nums) || nums.length === 0) return nums

    const _filter = nums.filter(item => item > 0)
    return _filter.concat(Array(nums.length - _filter.length).fill(0))
}