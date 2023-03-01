---
title: 欧拉路径
date: 2023-01-02 22:10:26
katex: true
tags:
  - 图论
  - 欧拉路径
categories:
  - [数据结构与算法, 图论]
  - [数据结构与算法, 欧拉路径]
---

## 题目描述
求有向图字典序最小的欧拉路径。

## 输入格式
第一行两个整数 $n$,$m$ 表示有向图的点数和边数。

接下来 $m$ 行每行两个整数 $u$,$v$ 表示存在一条 $u \to v$ 的有向边。

## 输出格式
如果不存在欧拉路径，输出一行 `No`。

否则输出一行 $m+1$ 个数字，表示字典序最小的欧拉路径。

## 样例
>**输入** 
4 6
1 3
2 1
4 2
3 3
1 2
3 4
**输出** 
1 2 1 3 3 4 2

>**输入**
5 5
1 2
3 5
4 3
3 4
2 3
**输出** 
1 2 3 4 3 5

>**输入** 
4 3
1 2
1 3
1 4
**输出** 
No
## 说明/提示
对于 $50\%$ 的数据，$n,m\leq 10^3$ 。

对于 $100\%$ 的数据，$1\leq u,v\leq n\leq 10^5$，$m\leq 2\times 10^5$。

保证将有向边视为无向边后图连通。
## 分析
这里以样例一为例进行分析。样例一的有向图如下所示：
{% graphviz maxWidth:400 %}
digraph {
    rankdir = LR;
    node [shape=circle];
    1 -> 3;
    2 -> 1;
    4 -> 2;
    3 -> 3;
    1 -> 2;
    3 -> 4;
}
{% endgraphviz %}
首先找到欧拉路径的起点，即出度比入度大一的点。容易发现顶点1的出度为$2$，入度为$1$，因此，顶点1是欧拉路径的起点。


## 具体代码
{% codetabs  %}
<!-- tab lang:rust -->
use std::collections::VecDeque;

fn main() {
  let mut graph = read_graph();
  let mut result = Vec::new();
  if let Ok((start, _end)) = check(&graph) {
    dfs(&mut graph, start, &mut result);
    result.push(start);
    result.reverse();
    for x in result {
      print!("{} ", x+1);
    }
  }
  else {
    println!("No");
  }

}

fn check(graph: &Vec<VecDeque<usize>>) -> Result<(usize, usize), ()> {
  /*
  判断是否为欧拉图的条件:
  - 图G是连通的，无孤立的点。
  - 每个点的入度等于出度。
  - 可以存在两个点，其入度不等于出度，其中一个入度比出度大一，为路径的终点；另一个出度比入度大一，为路径的起点
  */
  let mut in_degree = vec![0; graph.len()];
  let mut out_degree = vec![0; graph.len()];

  for u in 0..graph.len() {
    for v in graph[u].iter() {
      // 一条 u -> v 的边
      out_degree[u] += 1;
      in_degree[*v] += 1;
    }
  }

  let magic_number = 0x80000000usize;
  let mut start = magic_number;
  let mut end = magic_number;

  for i in 0..graph.len() {
    if out_degree[i] == in_degree[i] { continue; }
    else if out_degree[i] > in_degree[i] && out_degree[i] - in_degree[i] == 1 {
      if start != magic_number {
        return Err(());
      }
      else {
        start = i;
      }
    }
    else if in_degree[i] > out_degree[i] && in_degree[i] - out_degree[i] == 1 {
      // 入度比出度大一，为路径的终点
      if end != magic_number {
        return Err(());
      }
      else {
        end = i;
      }
    }
    else {
      return Err(());
    }
  }

  if start == magic_number {
    // 此时存在欧拉回路，但是我们只需要找欧拉通路，于是，将起点设置为 0 即可。
    start = 0;
    end = 0;
  }


  // 连通性判断，使用广度优先搜索
  let mut queue = VecDeque::new();
  let mut visit = vec![false; graph.len()];

  queue.push_back(start);
  visit[start] = true;
  
  while ! queue.is_empty() {
    let u = queue.pop_front().unwrap();
    assert!( visit[u] );

    for v in graph[u].iter() {
      if visit[*v] { continue; }
      visit[*v] = true;
      queue.push_back(*v);
    }
  }

  for flag in visit.iter() {
    if ! *flag { return Err(()); } // 如果有节点没有访问到，则不存在欧拉通路, 因为这个图不连通
  }

  Ok((start, end))
}


fn dfs(graph: &mut Vec<VecDeque<usize>>, current_vec: usize, result: &mut Vec<usize>) {

  while ! graph[current_vec].is_empty() {
    let front = graph[current_vec].pop_front().unwrap();
    dfs(graph, front, result);
    result.push(front);
  }
}


fn read_graph() -> Vec<VecDeque<usize>> {
  let mut buf = String::new();
  std::io::stdin().read_line(&mut buf).unwrap();
  let mut numbers = buf.trim().split(" ");
  let n = numbers.next().unwrap().parse::<usize>().unwrap();
  let m = numbers.next().unwrap().parse::<usize>().unwrap();

  let mut graph: Vec<VecDeque<usize>> = vec![VecDeque::new(); n];

  for _ in 0..m {
    buf.clear();
    std::io::stdin().read_line(&mut buf).unwrap();
    let mut numbers = buf.trim().split(" ");
    let u = numbers.next().unwrap().parse::<usize>().unwrap() - 1;
    let v = numbers.next().unwrap().parse::<usize>().unwrap() - 1;

    assert!(u < n);
    assert!(v < n);
    graph[u].push_back(v);
  }

  // 对 graph 排序, 因为要按照字典序输出
  for raw in graph.iter_mut() {
    raw.make_contiguous().sort();
  }

  graph

}

<!-- endtab -->
{% endcodetabs %}