---
title: 不同的二叉搜索树
date: 2022-06-08 14:14:21
katex: true
tags: 
  - leetcode
  - 动态规划
  - 二叉树
categories:
  - [数据结构与算法, 二叉树]
  - [数据结构与算法, 动态规划]
---
{% poem author:辛弃疾 source:青玉案·元夕 %}
东风夜放花千树，更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。
蛾儿雪柳黄金缕，笑语盈盈暗香去。众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。
{% endpoem %}

## 题目描述
leetcode链接: 
 - [不同的二叉搜索树ii](https://leetcode-cn.com/problems/unique-binary-search-trees-ii/)
 - [不同的二叉搜索树](https://leetcode-cn.com/problems/unique-binary-search-trees-ii/)

给你一个整数 $n$ ，请你生成并返回所有由 $n$ 个节点组成且节点值从 $1$ 到 $n$ 互不相同的不同 二叉搜索树 。可以按 **任意顺序** 返回答案。

## 示例1
>**输入**: n = 3
>**输出**: [[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]

## 示例2
>**输入**: n=1
**输出** [ [1] ]

## 数据范围
$1 \leq n \leq 8$
## 二叉树节点定义以及接口函数签名
{% codeblock lang:cpp %}
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    vector<TreeNode*> generateTrees(int n) {

    }
};
{% endcodeblock %}
## 解题思路
考虑使用动态规划算法，定义一个二维数组$dp$，其元素为$vector<TreeNode *>$，$dp[i][j]$保存了节点值从$i$到$j$的所有互不相同的二叉搜索树。$dp[1][n]$就是我们需要的结果。

现在考虑节点值从$i$到$j$有多少互不相同的二叉搜索树，我们可以通过根节点的不同来区分这些二叉树，即以节点值$i$为根节点的二叉树、以$i+1$为根节点的二叉树...以$j$为根节点的二叉树。

当根节点为$k$时$(i <= k <= j)$，其左子树的集合为$dp[i][k-1]$，其右子树的集合为$dp[k+1][j]$。我们可以通过排列组合来求得根节点为k的所有二叉树。

## 具体实现
这里仅给出C++实现
{% codeblock lang:cpp %}
class Solution {
public:
    vector<TreeNode*> generateTrees(int n) {
        vector<TreeNode *> dp[16][16];

        for(int i=1;i<=n+1;i++) {
            TreeNode * t = new TreeNode(i);
            dp[i][i].push_back(t);
            dp[i][i-1].push_back(nullptr);
        }

        for(int len=1;len<n;len++) {
            for(int i=1;i+len<=n;i++) {
                for(int j=i;j<=i+len;j++) {
                    // j作为头节点
                    for(TreeNode * left : dp[i][j-1]) {
                        for(TreeNode * right : dp[j+1][i+len]) {
                            TreeNode * t = new TreeNode(j, left, right);
                            dp[i][i+len].push_back(t);
                        }
                    }
                }
            }
        }
        return dp[1][n];
    }
};
{% endcodeblock %}

## 仅返回不同二叉树的数量
本题的一个简单版本是只返回不同二叉树的数量，原理同上，现给出rust代码
{% codeblock lang:rust %}
impl Solution {
    pub fn num_trees(n: i32) -> i32 {
        let n = n as usize;
        let mut dp = [[0; 32]; 32];

        for i in 1..(n+2) {
            dp[i][i] = 1;
            dp[i][i-1] = 1;
        }

        for len in 1..n {
            for i in 1..(n-len+1) {
                for j in i..(i+len+1) {
                    dp[i][i+len] += dp[i][j-1] * dp[j+1][i+len];
                }
            }
        }

        dp[1][n] 
    }
}
{% endcodeblock %}
