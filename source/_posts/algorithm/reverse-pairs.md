---
title: 翻转对
date: 2022-06-08 14:25:31
katex: true
tags: 
  - leetcode
  - 分治
categories:
  - [数据结构与算法, 分治]
---
{% poem author:辛弃疾 source:鹧鸪天·送人 %}
唱彻《阳关》泪未干，功名馀事且加餐。浮天水送无穷树，带雨云埋一半山。
今古恨，几千般，只应离合是悲欢。江头未是风波恶，别有人间行路难!
{% endpoem %}

## 题目描述
leetcode链接: [https://leetcode-cn.com/problems/reverse-pairs/](https://leetcode-cn.com/problems/reverse-pairs/)

给定一个数组 $nums$ ，如果 $i < j$ 且 $nums[i] > 2*nums[j]$ 我们就将 $(i, j)$ 称作一个重要翻转对。

你需要返回给定数组中的重要翻转对的数量。
## 示例1
>**输入**：[1,3,2,3,1]
**输出**：2
## 示例2
>**输入**：[2,4,3,5,1]
**输出**：3

## 问题分析
本题宜采用分治算法。对于数组$nums$，将其分为两半，不妨令左半段为$left$，右半段为$right$。
最终结果为$left$、$right$中的翻转对数量之和，加上横跨$left$和$right$的翻转对数量。这里的横跨指的是$nums[i]$位于$left$中，$nums[j]$位于$right$中。
我们发现，对于横跨的翻转对数量来说，无论$left$和$right$中的元素顺序如何变化，只要$left$中的元素仍然在$left$中，$right$中的元素仍然在$right$中，那么横跨的翻转对数量就不会受到影响。

由上面的发现，我们在递归求得$left$和$right$的翻转对过程中，可以顺便将其排序，方便后面求横跨$left$和$right$的翻转对数量。

现在，我们得到了算法的大致框架，如下所示
 - 首先将数组$nums$分为两半，分别为$left$和$right$
 - 递归求得$left$和$right$中的翻转对数量，该过程会顺便对$left$和$right$进行排序。
 - 求横跨$left$和$right$的翻转对，并将$left$和$right$合并成一个有序的数组。

接下来讨论如何求横跨$left$和$right$的翻转对数量。

$left$数组是有序的，对于$right$中任意一个元素$right[j]$，如果$left[i]$与其构成翻转对，那么$left[i]$之后的元素一定与其构成翻转对，因此我们的结果可以直接加上$left[i]$后面的元素个数。

同样的，对于$right$中的任意元素$right[j]$，如果$left[i]$不与其构成翻转对关系，则$left[i]$之前的所有元素都不与其构成翻转对关系，因此，我们不需要再判断$left[i]$之前的元素。

通过上面的结论，我们可以构造出如下算法:
 - 定义两个索引$i$、$j$，分别用于$left$和$right$，并分别初始化为$left$和$right$的起始位置。
 - 当$left[i]$和$right[j]$不满足翻转对关系时，增加$i$，直到满足翻转对关系或者$i$超出$left$范围。
 - 当$left[i]$和$right[j]$满足翻转对关系时，假设$left[i]$后面还有$k$个元素，那么我们就找到了$k$个翻转对，于是结果要加上$k$。然后增加$j$。
 - 重复中间两步，直到$i$或者$j$超出范围。


## 具体实现
{% codetabs 具体实现 %}
<!-- tab lang:rust -->
pub fn reverse(nums: &mut [i32]) -> i32 {
    if nums.len() <= 1 {
        return 0;
    }

    let mid = (nums.len() - 1) / 2;
    let t1 = reverse(&mut nums[..mid + 1]);
    let t2 = reverse(&mut nums[mid + 1..]);
    let mut left = 0;
    let mut right = mid + 1;
    let mut ret = t1 + t2;
    while left <= mid && right < nums.len() {
        while left <= mid && nums[left] as i64 <= 2 * nums[right] as i64 {
            left += 1;
        }
        if left > mid {
            break;
        }
        while right < nums.len() && nums[left] as i64 > 2 * nums[right] as i64 {
            ret += (mid - left + 1) as i32;
            right += 1;
        }
    }
    left = 0;
    right = mid + 1;
    let mut hold: Vec<i32> = Vec::new();
    while left <= mid && right < nums.len() {
        if nums[left] < nums[right] {
            hold.push(nums[left]);
            left += 1;
        } else {
            hold.push(nums[right]);
            right += 1;
        }
    }

    while left <= mid {
        hold.push(nums[left]);
        left += 1;
    }
    while right < nums.len() {
        hold.push(nums[right]);
        right += 1;
    }
    for i in 0..nums.len() {
        nums[i] = hold[i];
    }
    ret
}
<!-- endtab -->
<!-- tab lang:cpp -->
class Solution {
public:
    int reversePairs(vector<int>& nums) {
        return reversePairs(nums, 0, nums.size() - 1);
    }

    int reversePairs(vector<int>& nums, int l, int r) {
        if(l >= r) return 0;

        // 至少3个元素
        int mid = (l+r) >> 1;
        int t1 = reversePairs(nums, l, mid);
        int t2 = reversePairs(nums, mid+1,r);

        int left = l, right = mid+1;
        int ret = t1 + t2;
        while(left <= mid && right <= r) {
            while(left <= mid && nums[left] <= 2 * (long long)nums[right]) left++;
            
            // left > mid || nums[left] > 2 * nums[right]
            if(left > mid) break;

            // nums[left] > 2 * nums[right]
            int hold = right;
            while(right <= r && nums[left] > 2 * (long long)nums[right]) { 
                ret += (mid-left+1);
                right++; 
            }
        }
        
        // 排序
        left = l, right = mid+1;
        vector<int> hold;
        while(left <= mid && right <= r) {
            hold.push_back(
                nums[left] < nums[right] ? nums[left++] : nums[right++]
            );
        }

        while(left <= mid) {
            hold.push_back(nums[left++]);
        }
        while(right <= r) {
            hold.push_back(nums[right++]);
        }

        for(int i=l,j=0; i<=r; i++, j++) {
            nums[i] = hold[j];
        }
        return ret;
    }
};
<!-- endtab -->
{% endcodetabs %}