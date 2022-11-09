---
title: 斐波拉契数
date: 2022-06-08 14:12:51
katex: true
tags:
  - 斐波拉契
  - 快速幂
  - 动态规划
categories:
  - [数据结构与算法, 动态规划]
  - [数据结构与算法, 快速幂]
---
{% poem author:辛弃疾 source:青玉案·元夕 %}
春已归来，看美人头上，袅袅春幡。无端风雨，未肯收尽余寒。年时燕子，料今宵梦到西园。浑未办，黄柑荐酒，更传青韭堆盘。
却笑东风，从此便熏梅染柳，更没些闲，闲时又来镜里，转变朱颜。清愁不断，问何人会解连环。生怕见花开花落，朝来塞雁先还。
{% endpoem %}

## 题目描述
题目连接: [https://www.luogu.com.cn/problem/P1962](https://www.luogu.com.cn/problem/P1962)
求第$n$个斐波拉契数$Fib_n$。$Fib_n$定义如下

$$
Fib_1 = Fib_2 = 1
$$
$$
Fib_n = Fib_{n-1} + Fib_{n-2}， n \geq 3
$$
由于最终结果很大，因此输出的结果需要对$10^9 + 7$取模。
## 示例1
>**输入**: 5
**输出**: 5
## 示例2
>**输入**: 10
**输出**: 55
## 数据范围
$1 \leq n \leq 2^{63}$

## 问题分析
考虑矩阵
$$
A_n = \left (
        \begin{matrix}
        Fib_{n+1} \\
        Fib_{n}
        \end{matrix}
    \right )
$$
如果能够求得矩阵$A_n$，自然就求得$Fib_n$了。
我们不难得到矩阵$A_n$的递推关系式
$$
\begin{aligned}
A_n &= \left (
        \begin{matrix}
        Fib_{n+1} \\
        Fib_{n}
        \end{matrix}
    \right ) = \left (
        \begin{matrix}
        Fib_{n} + Fib_{n-1} \\
        Fib_{n}
        \end{matrix}
    \right ) = \left (
        \begin{matrix}
        1 & 1 \\
        1 & 0
        \end{matrix}
    \right ) \left (
        \begin{matrix}
        Fib_{n} \\
        Fib_{n-1}
        \end{matrix}
    \right ) \\ &= {\left (
        \begin{matrix}
        1 & 1 \\
        1 & 0
        \end{matrix}
    \right )}^2 \left (
        \begin{matrix}
        Fib_{n-1} \\
        Fib_{n-2}
        \end{matrix}
    \right ) = ... = {\left (
        \begin{matrix}
        1 & 1 \\
        1 & 0
        \end{matrix}
    \right )}^{n-1} \left (
        \begin{matrix}
        Fib_{2} \\
        Fib_{1}
        \end{matrix}
    \right ) \\
    &= {\left (
        \begin{matrix}
        1 & 1 \\
        1 & 0
        \end{matrix}
    \right )}^{n-1} \left (
        \begin{matrix}
        1 \\
        1
        \end{matrix}
    \right )

\end{aligned}
$$
由于$n$的数据范围太大，采用$O(n)$的算法来计算幂不可行，这里采用快速幂的方法来求幂，时间复杂度为$O(logn)$。代码如下所示
## 完整代码
{% codetabs 具体实现代码 %}
<!-- tab lang:rust -->
use std::ops;

#[derive(Debug, Clone, Copy)]
struct Matrix {
    matrix : [[u64; 2]; 2]
}

impl Matrix {
    fn new() -> Self {
        Matrix {
            matrix: [[1, 1], [1, 0] ]
        }
    }
}

impl ops::Mul<Matrix> for Matrix {
    type Output = Matrix;

    fn mul(self, _rhs: Matrix) -> Matrix {
        const N : u64 = 1000000007;
        let mut ret = Matrix::new();
        
        ret.matrix[0][0] = (self.matrix[0][0] * _rhs.matrix[0][0] + self.matrix[0][1] * _rhs.matrix[1][0]) % N;
        ret.matrix[0][1] = (self.matrix[0][0] * _rhs.matrix[0][1] + self.matrix[0][1] * _rhs.matrix[1][1]) % N;
        ret.matrix[1][0] = (self.matrix[1][0] * _rhs.matrix[0][0] + self.matrix[1][1] * _rhs.matrix[1][0]) % N;
        ret.matrix[1][1] = (self.matrix[1][0] * _rhs.matrix[0][1] + self.matrix[1][1] * _rhs.matrix[1][1]) % N;
        ret
    }
}

fn pow(matrix: Matrix, n: u64) -> Matrix {
    if n == 0 {
        let mut ret = Matrix::new();
        ret.matrix[1][1] = 1;
        return ret;
    } else if n == 1 {
        return matrix;
    } else if n & 1 != 0 {
        return matrix * pow(matrix, n - 1);
    } else {
        let t = pow(matrix, n / 2);
        return t * t;
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n: u64 = input.trim().parse().unwrap();

    if n <= 2 { println!("1"); return; }
    let matrix = Matrix::new();

    let matrix = pow(matrix, n-1);
    println!("{}", matrix.matrix[0][0]);
}
<!-- endtab -->

<!-- tab lang:cpp -->
#include <iostream>

struct Matrix {
    int m00, m01, m10, m11;

    Matrix(int m00 = 0, int m01 = 0, int m10 = 0, int m11 = 0) : m00(m00), m01(m01), m10(m10), m11(m11) {}
    Matrix operator*(const Matrix & matrix) const {
        Matrix ret;
        const int N = 1000000007;

        ret.m00 = (1ll * m00 * matrix.m00 + 1ll * m01 * matrix.m10) % N;
        ret.m01 = (1ll * m00 * matrix.m01 + 1ll * m01 * matrix.m11) % N;
        ret.m10 = (1ll * m10 * matrix.m00 + 1ll * m11 * matrix.m10) % N;
        ret.m11 = (1ll * m10 * matrix.m01 + 1ll * m11 * matrix.m11) % N;
        return ret;
    }
};

Matrix pow(const Matrix & matrix, unsigned long long n) {
    if(n <= 0) {
        return Matrix(1,1,1,1);
    }
    else if(n <= 1) {
        return matrix;
    }
    else if(n & 1 != 0) {
        return matrix * pow(matrix, n-1);
    }
    else {
        Matrix t = pow(matrix, n >> 1);
        return t * t;
    }
}

int main(int argc, const char ** argv) {
    unsigned long long n;
    std::cin >> n ;

    if(n <=2 ) { std::cout << "1" << std::endl; }
    else {
        Matrix matrix(1, 1, 1, 0);
        matrix = pow(matrix, n-1);
        std::cout << matrix.m00 << std::endl;
    }
    return 0;
}
<!-- endtab -->
{% endcodetabs %}