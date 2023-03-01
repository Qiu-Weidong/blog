---
title: 课程表
date: 2022-06-08 14:09:47
katex: true
tags:
  - leetcode
  - 图论
  - 拓扑排序
categories:
  - [数据结构与算法, 图论]
  - [数据结构与算法, 拓扑排序]
---
{% poem author:蒋捷 source:虞美人·听雨 %}
少年听雨歌楼上，红烛昏罗帐。壮年听雨客舟中，江阔云低，断雁叫西风。
而今听雨僧庐下，鬓已星星也。悲欢离合总无情，一任阶前点滴到天。
{% endpoem %}
## 题目描述
leetcode链接: 
 - [https://leetcode-cn.com/problems/course-schedule-ii/](https://leetcode-cn.com/problems/course-schedule-ii/)
 - [https://leetcode-cn.com/problems/course-schedule/](https://leetcode-cn.com/problems/course-schedule/) 

假设你总共有$numCourses$门课需要选，每门课的编号取值范围为$[0, numCourses - 1]$。给你一个数组$prerequisites$ ，其中 $prerequisites[i] = [a_i, b_i]$ ，表示在选修课程$a_i$前 必须先选修$b_i$ 。

例如，想要学习课程 $0$ ，你需要先完成课程 $1$ ，我们用一个匹配来表示：$[0,1]$ 。
返回你为了学完所有课程所安排的学习顺序。可能会有多个正确的顺序，你只要返回**任意一种**就可以了。如果不可能完成所有课程，返回一个空数组 。

本题的一个简化版本是判断是否可能完成所有课程的学习？如果可以，返回 {% label true blue %} ；否则，返回 {% label false red %} 。
## 示例
>输入：numCourses = 2, prerequisites = [[1,0]]
输出：[0,1]
解释：总共有 2 门课程。要学习课程 1，你需要先完成课程 0。因此，正确的课程顺序为 [0,1] 。

>输入：numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
输出：[0,2,1,3]
解释：总共有 4 门课程。要学习课程 3，你应该先完成课程 1 和课程 2。并且课程 1 和课程 2 都应该排在课程 0 之后。
因此，一个正确的课程顺序是 [0,1,2,3] 。另一个正确的排序是 [0,2,1,3] 。

>输入：numCourses = 1, prerequisites = []
输出：[0]


## 问题分析
我们可以将本问题转换为一个图论的问题。具体的说是图论中的拓扑排序问题。
我们将课程之间的关系转换为一个有向图。每门课程都是图的顶点。如果学习课程$a$需要先完成课程$b$，那么添加一条$b$到$a$的有向边。
此外，还需要记录每个顶点的入度。入度为$0$的顶点，表示该顶点对应的课程没有前置课程，可以学习。
遍历所有课程，并准备一个队列，将所有入度为零的课程添加到队列中，表示这些课程可以学习。
每次从队列中取出一个值，并学习对应的课程，学习完成后，该课程的后置课程的入度需要减一，表示该课程已经学习完成。如果发现有入度为$0$的课程，则加入队列。
重复这个步骤，直到队列为空。
如果还剩余课程没有学习，则表示不能完成所有课程。


以示例二为例，可以得到如下的有向图:
{% graphviz %}
digraph {
  rankdir = LR;
  0 -> 1;
  0 -> 2;
  1 -> 3;
  2 -> 3;
}
{% endgraphviz %}
## 具体代码
返回具体学习顺序的代码。
{% codetabs 具体实现代码 %}
<!-- tab lang:rust -->
use std::collections::VecDeque;
struct Edge {
  to : u32,
  next: i32
}

struct Graph {
  head : Vec<i32>,
  edges : Vec<Edge>,
  cnt : Vec<u32>
}

impl Graph {
  fn new(num_courses : u32) -> Self {
    let graph = Graph {
      head : [-1].repeat(num_courses as usize),
      edges : Vec::new(),
      cnt:[0].repeat(num_courses as usize)
    };

    graph
  }

  fn addedge(&mut self, u:u32, v:u32) {
    let edge = Edge {
      to : v,
      next : self.head[u as usize]
    };
    
    self.head[u as usize] = self.edges.len() as i32;
    self.edges.push(edge);
    self.cnt[v as usize] += 1;
  }

}


impl Solution {
    pub fn find_order(num_courses: i32, prerequisites: Vec<Vec<i32>>) -> Vec<i32> {
        let mut graph = Graph::new(num_courses as u32);
        let mut result = Vec::new();

        for pair in prerequisites {
            graph.addedge(pair[1] as u32 , pair[0] as u32);
        }

        let mut q : VecDeque<u32> = VecDeque::new();

        for i in 0..graph.cnt.len() {
            if graph.cnt[i] == 0 {
                q.push_back(i as u32);
            }
        }

        while !q.is_empty() {
            let u = q.pop_front().unwrap();
            result.push(u as i32);

            let mut cur = graph.head[u as usize];
            while cur != -1 {
                let v = graph.edges[cur as usize].to;
                graph.cnt[v as usize] -= 1;
                if graph.cnt[v as usize] == 0 {
                    q.push_back(v);
                }
                cur = graph.edges[cur as usize].next;
            }
        }

        if result.len() < num_courses as usize { result.clear(); }
        result
    }
}
<!-- endtab -->

<!-- tab lang:cpp -->
int cnt[100005];

struct Edge {
    int to, next;
} edges[5005];
int head[100005], total;

void init() {
    memset(head, -1, sizeof(head));
    memset(cnt, 0, sizeof(cnt));
    total = 0;
}

void addedge(int u, int v) {
    edges[total].to = v;
    edges[total].next = head[u];
    head[u] = total++;
}

class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        init();
        vector<int> result;

        for(auto & vec : prerequisites) {
            addedge(vec[1], vec[0]);
            cnt[vec[0]]++;
        }

        queue<int> stack;
        for(int i=0; i<numCourses;i++) {
            if(cnt[i] == 0) stack.push(i);
        }

        while(!stack.empty()) {
            
            int u = stack.front();
            result.push_back(u);
            stack.pop();

            for(int i=head[u];i!=-1;i=edges[i].next) {
                int v = edges[i].to;
                cnt[v]--;
                if(cnt[v] == 0) {
                    stack.push(v);
                }
            }
        }

        if(result.size() < numCourses) result.clear();

        return std::move(result);

        
    }
};
<!-- endtab -->
{% endcodetabs %}
返回是否能修完课程的代码
{% codetabs 能否修完课程 %}

<!-- tab lang:rust -->
use std::collections::VecDeque;
struct Edge {
  to : u32,
  next: i32
}

struct Graph {
  head : Vec<i32>,
  edges : Vec<Edge>,
  cnt : Vec<u32>
}

impl Graph {
  fn new(num_courses : u32) -> Self {
    let graph = Graph {
      head : [-1].repeat(num_courses as usize),
      edges : Vec::new(),
      cnt:[0].repeat(num_courses as usize)
    };

    graph
  }

  fn addedge(&mut self, u:u32, v:u32) {
    let edge = Edge {
      to : v,
      next : self.head[u as usize]
    };
    
    self.head[u as usize] = self.edges.len() as i32;
    self.edges.push(edge);
    self.cnt[v as usize] += 1;
  }

}


impl Solution {
    pub fn can_finish(num_courses: i32, prerequisites: Vec<Vec<i32>>) -> bool {
        let mut graph = Graph::new(num_courses as u32);
  let mut result = Vec::new();

  for pair in prerequisites {
    graph.addedge(pair[1] as u32 , pair[0] as u32);
  }

  let mut q : VecDeque<u32> = VecDeque::new();

  for i in 0..graph.cnt.len() {
    if graph.cnt[i] == 0 {
      q.push_back(i as u32);
    }
  }

  while !q.is_empty() {
    let u = q.pop_front().unwrap();
    result.push(u as i32);

    let mut cur = graph.head[u as usize];
    while cur != -1 {
      let v = graph.edges[cur as usize].to;
      graph.cnt[v as usize] -= 1;
      if graph.cnt[v as usize] == 0 {
        q.push_back(v);
      }
      cur = graph.edges[cur as usize].next;
    }
  }

   result.len() >= num_courses as usize
    }
}
<!-- endtab -->

<!-- tab lang:cpp -->
int cnt[100005];

struct Edge {
    int to, next;
} edges[5005];
int head[100005], total;

void init() {
    memset(head, -1, sizeof(head));
    memset(cnt, 0, sizeof(cnt));
    total = 0;
}

void addedge(int u, int v) {
    edges[total].to = v;
    edges[total].next = head[u];
    head[u] = total++;
}

class Solution {
    
    
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        init();
        for(auto & vec : prerequisites) {
            addedge(vec[1], vec[0]);
            cnt[vec[0]]++;
        }

        queue<int> stack;
        for(int i=0; i<numCourses;i++) {
            if(cnt[i] == 0) stack.push(i);
        }

        int done = 0;
        while(!stack.empty()) {
            
            int u = stack.front();
            // std::cout << u << std::endl;
            stack.pop();
            done++;

            for(int i=head[u];i!=-1;i=edges[i].next) {
                int v = edges[i].to;
                cnt[v]--;
                // std::cout << cnt[v] << std::endl;
                if(cnt[v] == 0) {
                    stack.push(v);
                }
            }
        }

        return done >= numCourses;
    }
};
<!-- endtab -->
{% endcodetabs %}
