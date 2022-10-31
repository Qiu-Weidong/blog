---
title: codetabtest
date: 2022-10-29 21:12:31
tags:
categories:
---
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
