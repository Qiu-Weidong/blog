---
title: 矩阵区域和
date: 2022-06-08 14:17:50
katex: true
tags:
  - 前缀和
  - leetcode
categories:
  - [数据结构与算法, 前缀和]
---
{% poem author:辛弃疾 source:太常引·建康中秋夜为吕叔潜赋 %}
一轮秋影转金波，飞镜又重磨。把酒问姮娥：被白发，欺人奈何？
乘风好去，长空万里，直下看山河。斫去桂婆娑，人道是，清光更多。
{% endpoem %}
## 题目描述
leetcode链接: [https://leetcode-cn.com/problems/matrix-block-sum/](https://leetcode-cn.com/problems/matrix-block-sum/)

给你一个 $m \times n$ 的矩阵 $mat$ 和一个整数 $k$ ，请你返回一个矩阵 $answer$ ，其中每个 $answer[i][j]$ 是所有满足下述条件的元素 $mat[r][c]$ 的和： 

 - $i - k \leq r \leq i + k$,
 - $j - k \leq c \leq j + k$ 且
 - $(r, c)$ 在矩阵内。

## 示例1
>**输入**：mat = [[1,2,3],[4,5,6],[7,8,9]], k = 1
**输出**：[[12,21,16],[27,45,33],[24,39,28]]

## 示例2
>**输入**：mat = [[1,2,3],[4,5,6],[7,8,9]], k = 2
**输出**：[[45,45,45],[45,45,45],[45,45,45]]

## 数据范围
 - $m == mat.length$
 - $n == mat[i].length$
 - $1 \leq m, n, k \leq 100$
 - $1 \leq mat[i][j] \leq 100$

## 具体实现
{% codetabs 具体代码实现 %}

<!-- tab lang:rust -->
impl Solution {
    pub fn matrix_block_sum(mat: Vec<Vec<i32>>, k: i32) -> Vec<Vec<i32>> {
        let mut mat = mat;

        for i in 1..mat[0].len() {
            mat[0][i] += mat[0][i-1];
        }
        for i in 1..mat.len() {
            mat[i][0] += mat[i-1][0];
        }

        for i in 1..mat.len() {
            for j in 1..mat[i].len() {
                mat[i][j] = mat[i-1][j] + mat[i][j-1] + mat[i][j] - mat[i-1][j-1];
            }
        }
        let k = k as usize;
        let mut ret = mat.clone();
        for i in 0..ret.len() {
            for j in 0..ret[i].len() {
                let l = if j >= k {j-k} else {0};
                let r = if j+k < ret[i].len() { j+k } else { ret[i].len() - 1 };
                let u = if i >= k { i - k } else { 0 };
                let d = if i+k < ret.len() { i+k } else { ret.len() - 1 };

                if l == 0 && u == 0 {
                    ret[i][j] = mat[d][r];
                }
                else if l == 0 {
                    ret[i][j] = mat[d][r] - mat[u-1][r];
                }
                else if u == 0 {
                    ret[i][j] = mat[d][r] - mat[d][l-1];
                }
                else {
                    ret[i][j] = mat[d][r] - mat[u-1][r] - mat[d][l-1] + mat[u-1][l-1];
                }
            }
        }
        ret
    }
    
}
<!-- endtab -->

<!-- tab lang:cpp -->
class Solution {
public:
    vector<vector<int>> matrixBlockSum(vector<vector<int>>& mat, int k) {
        for(int i=1; i<mat[0].size(); i++) {
            mat[0][i] += mat[0][i-1];
        }

        for(int i=1; i<mat.size(); i++) {
            mat[i][0] += mat[i-1][0];
        }

        for(int i=1; i<mat.size(); i++) {
            for(int j=1; j<mat[i].size(); j++) {
                mat[i][j] = mat[i-1][j] + mat[i][j-1] - mat[i-1][j-1] + mat[i][j];
            }
        }
        vector<vector<int>> ret = mat;

        for(int i=0; i<ret.size(); i++) {
            for(int j=0; j<ret[i].size(); j++ ) {
                int l = j - k >= 0 ? j-k : 0;
                int r = j + k < ret[i].size() ? j + k : ret[i].size() - 1;
                int u = i - k >= 0 ? i - k : 0;
                int d = i + k < ret.size() ? i + k : ret.size()-1;

                if(l == 0 && u == 0) {
                    ret[i][j] = mat[d][r];
                }

                else if( l == 0 ) {
                    ret[i][j] = mat[d][r] - mat[u-1][r];
                }
                else if(u == 0) {
                    ret[i][j] = mat[d][r] - mat[d][l-1];
                }
                else {
                    ret[i][j] = mat[d][r] - mat[u-1][r] - mat[d][l-1] + mat[u-1][l-1];
                }
            }
        }

        return ret;
    }
};
<!-- endtab -->
{% endcodetabs %}