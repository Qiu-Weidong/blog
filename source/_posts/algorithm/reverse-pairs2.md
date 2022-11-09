---
title: 逆序对
katex: true
date: 2022-06-08 14:26:39
tags:
  - 分治
  - leetcode
categories:
  - [数据结构与算法, 分治]
---
{% poem 李煜 浪淘沙令·帘外雨潺潺 %}
帘外雨潺潺，春意阑珊。罗衾不耐五更寒。梦里不知身是客，一晌贪欢。
独自莫凭栏，无限江山。别时容易见时难。流水落花春去也，天上人间。
{% endpoem %}

## 题目描述
leetcode链接: [https://leetcode-cn.com/problems/shu-zu-zhong-de-ni-xu-dui-lcof/](https://leetcode-cn.com/problems/shu-zu-zhong-de-ni-xu-dui-lcof/)
在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组，求出这个数组中的逆序对的总数。
## 示例
>**输入**: [7,5,6,4]
**输出**: 5

## 数据范围
$$ 
0 \leq 数组长度 \leq 50000
$$

## 具体实现
{% codetabs %}
<!-- tab lang:rust -->
impl Solution {
    pub fn reverse_pairs_2(nums: &mut [i32]) -> i32 {
        if nums.len() <= 1 {
            return 0;
        }

        let mid = nums.len() / 2;
        let mut ret = Solution::reverse_pairs_2(&mut nums[..mid])
            + Solution::reverse_pairs_2(&mut nums[mid..]);
        let mut i = 0;
        for j in mid..nums.len() {
            while i < mid && nums[i] <= nums[j] {
                i += 1;
            }
            ret += (mid - i) as i32;
        }

        let mut hold: Vec<i32> = Vec::new();
        let mut i = 0;
        let mut j = mid;
        while i < mid && j < nums.len() {
            if nums[i] < nums[j] {
                hold.push(nums[i]);
                i += 1;
            } else {
                hold.push(nums[j]);
                j += 1;
            }
        }

        while i < mid {
            hold.push(nums[i]);
            i += 1;
        }
        while j < nums.len() {
            hold.push(nums[j]);
            j += 1;
        }
        for i in 0..hold.len() {
            nums[i] = hold[i];
        }
        ret
    }
    pub fn reverse_pairs(nums: Vec<i32>) -> i32 {
        let mut nums = nums;
        Solution::reverse_pairs_2(&mut nums[..])
    }
}
<!-- endtab -->


<!-- tab lang:cpp -->
class Solution {
public:
    int reversePairs(vector<int>& nums) {
        return solve(nums, 0, nums.size() - 1);
    }
    int solve(vector<int> &nums, int l, int r) {
        if(l >= r) return 0;

        int mid = (l + r) >> 1;
        int t1 = solve(nums, l, mid);
        int t2 = solve(nums, mid+1, r);
        int ans = t1 + t2;

        int i=l, j=mid+1;
        for(;j<=r;j++) {
            while(i<=mid && nums[i] <= nums[j]) i++;
            ans += (mid -i + 1);
        }

        i = l;
        j = mid+1;
        int k = l;
        vector<int> tmp;
        while(i<=mid && j<=r) tmp.push_back(nums[i] < nums[j] ? nums[i++]:nums[j++]);
        while(i<=mid) tmp.push_back(nums[i++]);
        while(j<=r) tmp.push_back(nums[j++]);

        for(int i=0;i<tmp.size();i++) nums[i+l] = tmp[i];
        return ans; 
    }
};
<!-- endtab -->
{% endcodetabs %}