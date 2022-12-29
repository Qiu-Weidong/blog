---
title: 单源最短路径
date: 2022-12-29 21:16:51
katex: true
tags:
  - 图论
  - Dijkstra
categories:
  - [数据结构与算法, 图论]
  - [数据结构与算法, 单源最短路径]
---
## 题目描述
[洛谷链接](https://www.luogu.com.cn/problem/P4779)

给定一个 $n$ 个点，$m$ 条有向边的带非负权图，请你计算从 $s$ 出发，到每个点的最短距离。

数据保证你能从 $s$ 出发到任意点。
## 输入格式
第一行为三个正整数 $n$, $m$, $s$。 第二行起 $m$ 行，每行三个非负整数 $u_i$, $v_i$, $w_i$ ，表示从 $u_i$ 到 $v_i$ 有一条权值为 $w_i$ 的有向边。
## 输出格式
输出一行 $n$ 个空格分隔的非负整数，表示 $s$ 到每个点的距离。
## 示例
>**输入**
>>4 6 1
1 2 2
2 3 2
2 4 1
1 3 5
3 4 3
1 4 4

>**输出**
>>0 2 4 3

## 分析
本题可以使用 dijkstra 算法。
## 具体代码
{% codetabs 具体实现代码  %}
<!-- tab lang:rust -->

use std::{cmp::Ordering, collections::BinaryHeap};

fn main() {
    let mut buf = String::new();

    std::io::stdin().read_line(&mut buf).unwrap();
    let mut numbers = buf.trim().split(" ");
    let n = numbers.next().unwrap().parse::<usize>().unwrap();
    let m = numbers.next().unwrap().parse::<usize>().unwrap();
    let s = numbers.next().unwrap().parse::<usize>().unwrap() - 1;

    let mut graph: Vec<Vec<(usize, usize)>> = vec![Vec::new(); n];

    for _ in 0..m {
        buf.clear();
        std::io::stdin().read_line(&mut buf).unwrap();
        let mut numbers = buf.trim().split(" ");
        let u = numbers.next().unwrap().parse::<usize>().unwrap() - 1;
        let v = numbers.next().unwrap().parse::<usize>().unwrap() - 1;
        let w = numbers.next().unwrap().parse::<usize>().unwrap();

        assert!( u <= n );
        assert!( v <= n );
        graph[u].push((v, w));
    }

    let result = dijkstra(graph, s);
    // print!("{:?}", result);
    for x in result {
        print!("{} ", x);
    }
}


fn dijkstra(graph: Vec<Vec<(usize, usize)>>, st: usize) -> Vec<usize> {
    let inf = 0x3f3f3f3f;
    let mut result = vec![inf; graph.len()];
    // 将到原点的距离初始化为 0
    result[st] = 0;

    let mut heap: BinaryHeap<State> = BinaryHeap::new();

    // 将 源点放入优先队列
    heap.push(State::new(st, 0));

    let mut visit = vec![false; graph.len()];

    while ! heap.is_empty() {
        let mut top = heap.pop().unwrap();
        while visit[top.id] && ! heap.is_empty() {
            top = heap.pop().unwrap();
        }
        if visit[top.id] { break; }

        // 标记为已经访问过
        visit[top.id] = true;

        // 遍历与之相连的边
        for item in graph[top.id].iter() {
            let w = result[top.id] + item.1;
            if w < result[item.0] {
                result[item.0] = w;
                assert!( ! visit[item.0] );

                heap.push(State::new(item.0, w));
            } 
        }
    }

    result
}


#[derive(Copy, Clone, Eq, PartialEq)]
struct State {
    id: usize,
    dist: usize
}

impl State {
    fn new(id: usize, dist: usize) -> Self {
        Self {
            id, dist
        }
    }
}

impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        other.dist.cmp(&self.dist)
    }
}

// `PartialOrd` 也需要实现。
impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

<!-- endtab -->


<!-- tab lang:cpp -->
#include <iostream>
#include <cstdio>
#include <cstring>
#define INF 0x7fffffff
using namespace std;
const int MAXN = 100005; // 点数的最大值
const int MAXM = 1000006;//边数的最大值
struct heap_node
{
    int n;
    int dist;
};
struct Edge
{
    int to,next,weight;
};
Edge edge[MAXM];
int head[MAXN],tot;
heap_node heap[MAXN];
int pointer[MAXN],heapsize;
int dist[MAXN],path[MAXN];
void init()
{
    tot = 0;
    memset(head,-1,sizeof head);
}
bool isempty()
{
    return heapsize < 1;
}
int pop()
{
    int ret,i,child;
    heap_node last;
    ret = heap[1].n;
    pointer[heap[1].n] = -1;
    last = heap[heapsize--];
    for(i=1; i<=heapsize/2; i=child)
    {
        child = i << 1;
        if(child < heapsize && heap[child+1].dist < heap[child].dist)
            child++;
        if(heap[child].dist >= last.dist)
            break;
        heap[i] = heap[child];
        pointer[heap[i].n] = i;
    }
    heap[i] = last;
    pointer[heap[i].n] = i;
    return ret;
}
void change(int v,int x)
{
    int i,father;
    heap_node tmp;

    i = pointer[v];
    tmp = heap[i];
    tmp.dist = x;
    father = i >> 1;
    while(father>=1)
    {
        if(heap[father].dist <= tmp.dist)
            break;
        heap[i] = heap[father];
        pointer[heap[i].n] = i;
        i = father;
        father >>= 1;
    }
    heap[i] = tmp;
    pointer[heap[i].n] = i;
}

void addedge(int u,int v,int w)
{
    //插入一条u->v的权重为w的边
    edge[tot].to = v;
    edge[tot].next = head[u];
    edge[tot].weight = w;
    head[u] = tot++;
}
void build_heap(int n)
{
    int i;

    heapsize = n;
    for(i=1;i<=n;i++)
    {
        heap[i].n = i;
        heap[i].dist = 0x7fffffff;
        pointer[i] = i;
        dist[i] = 0x7fffffff;
        path[i] = 0xffffffff;
    }
}

void Dijkstra(int n,int s)
{
    int v;
    build_heap(n);
    change(s,0);
    dist[s] = 0;
    while(!isempty())
    {
        v = pop();
        if(dist[v] == INF)
            break;
        for(int i=head[v]; i!=-1; i=edge[i].next)
        {
            int k = edge[i].to;
            if(pointer[k]!=-1&&dist[k] > dist[v] + edge[i].weight)
            {
                dist[k] = dist[v] + edge[i].weight;
                change(k,dist[k]);
                path[k] = v;
            }
        }
    }
}
int main()
{
    int n,m,s,f,g,w;

    while(scanf("%d%d%d",&n,&m,&s)!=-1)
    {
        init();
        for(int i=1;i<=m;i++)
        {
            scanf("%d%d%d",&f,&g,&w);
            addedge(f,g,w);
        }
        Dijkstra(n,s);
        for(int i=1;i<=n;i++)
            printf("%d ",dist[i]);
        putchar('\n');
    }
}
<!-- endtab -->

{% endcodetabs %}