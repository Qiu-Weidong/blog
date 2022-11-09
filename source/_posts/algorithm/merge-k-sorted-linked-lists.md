---
title: 合并k个有序链表
date: 2022-06-08 14:20:25
katex: true
tags: 
  - leetcode
  - 链表
  - 优先队列
categories:
  - [数据结构与算法, 链表]
  - [数据结构与算法, 优先队列]
---
{% poem author:辛弃疾 source:清平乐·村居 %}
茅檐低小，溪上青青草。醉里吴音相媚好，白发谁家翁媪?
大儿锄豆溪东，中儿正织鸡笼。最喜小儿亡赖，溪头卧剥莲蓬。
{% endpoem %}
## 题目描述
leetcode链接: [https://leetcode-cn.com/problems/merge-k-sorted-lists/](https://leetcode-cn.com/problems/merge-k-sorted-lists/)

将k个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的k个链表的所有节点组成的。

## 示例1
>**输入**：lists = [[1,4,5],[1,3,4],[2,6]]
>**输出**：[1,1,2,3,4,4,5,6]
**解释**：链表数组如下：
    [
        1->4->5,
        1->3->4,
        2->6
    ]
将它们合并到一个有序链表中得到。
1->1->2->3->4->4->5->6

## 示例2
>**输入**：lists = []
**输出**：[]

## 示例3
>**输入**：lists = [[]]
**输出**：[]
## 数据范围
 - $k == lists.length$
 - $0 \leq k \leq 10^4$
 - $0 \leq lists[i].length \leq 500$
 - $-10^4 \leq lists[i][j] \leq 10^4$
 - $lists[i]$ 按 升序 排列
 - $lists[i].length$ 的总和不超过 $10^4$

## 链表定义及函数接口签名
{% codetabs 链表定义及函数接口签名 %}

<!-- tab lang:rust -->
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
  pub val: i32,
  pub next: Option<Box<ListNode>>
}

impl ListNode {
  #[inline]
  fn new(val: i32) -> Self {
    ListNode {
      next: None,
      val
    }
  }
}
impl Solution {
    pub fn merge_k_lists(list1: Option<Box<ListNode>>, list2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {

    }
}
<!-- endtab -->

<!-- tab lang:cpp -->
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* mergeKLists(ListNode* list1, ListNode* list2) {
        
    }
};
<!-- endtab -->

<!-- tab lang:java -->
public class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeKLists(ListNode list1, ListNode list2) {

    }
}
<!-- endtab -->
{% endcodetabs %}
## 问题分析
对于这个问题有两个思路，首先，可以使用之前合并两个链表的方法，来对这k个链表逐一合并，这种方式效率较低。
更好的方法可以参考合并两个链表的思路。首先准备一个空链表$result$用于返回结果。每次从$k$个链表中选出最小的元素并追加到$result$链表后面。由于链表都是升序排序，因此最小的元素一定是某一个链表的头节点。要在$k$个链表的头节点中选取最小的，用优先队列比较合适，即用一个有限队列来储存所有链表的头节点。找到最小节点之后，便将该节点从它所在的链表当中移除，并放入$result$链表。这个节点被从它原来的链表中移除之后，它的下一个节点便成为了其链表的头节点(如果它还存在下一个节点的话)，因此，需要将它的下一个节点加入优先队列。
重复上述步骤，直到优先队列为空即可。
## 具体实现-两两合并
{% codetabs 两两合并 %}
<!-- tab lang:rust 两两合并 -->
impl Solution {
    pub fn merge_k_lists(lists:  Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut lists = lists;
        let mut ret  = match lists.pop() {
            Some(val) => val,
            None => return None
        };

        for x in lists {
            ret = Solution::merge_two_lists(ret, x);
        }

        ret
    }
    pub fn merge_two_lists(
        list1: Option<Box<ListNode>>,
        list2: Option<Box<ListNode>>,
    ) -> Option<Box<ListNode>> {
        let mut head: Box<ListNode> = Box::new(ListNode::new(0));
        let mut list1 = list1;
        let mut list2 = list2;
        let mut cur = &mut head;

        while let (Some(li1), Some(li2)) = (list1.as_mut(), list2.as_mut()) {
            if li1.val < li2.val {
                let list1_next = li1.next.take();
                cur.next = list1;
                list1 = list1_next;
            } else {
                let list2_next = li2.next.take();
                cur.next = list2;
                list2 = list2_next;
            }
            cur = cur.next.as_mut().unwrap();
        }
        if let None = list1 {
            cur.next = list2;
        } else {
            cur.next = list1;
        }
        head.next
    }
}
<!-- endtab -->
<!-- tab lang:cpp 两两合并 -->
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if(lists.empty()) return nullptr;
        ListNode * ans = *lists.rbegin();
        lists.pop_back();

        for(auto list : lists) {
            ans = mergeTwoLists(ans, list);
        }
        return ans;
    
    }

    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode * ans = nullptr;
        if(list1 == nullptr && list2 == nullptr) return nullptr;
        else if(list1 == nullptr) return list2;
        else if(list2 == nullptr) return list1;
        else {
            if(list1->val < list2->val) {
                ans = list1;
                list1 = list1->next;
            }
            else {
                ans = list2;
                list2 = list2->next;
            }

            ListNode * p = ans;
            while(list1 != nullptr && list2 != nullptr) {
                if(list1->val < list2->val) {
                    p->next = list1;
                    list1 = list1->next;
                }
                else {
                    p->next = list2;
                    list2 = list2->next;
                }
                p = p->next; 
            }

            if(list1 != nullptr) p->next = list1;
            else p->next = list2;
        }

        return ans;
    }
};
<!-- endtab -->
<!-- tab lang:java 两两合并 -->
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if(lists.length <= 0) return null;

        ListNode ret = lists[0];
        for(int i=1; i<lists.length; i++) {
            ret = mergeTwoLists(ret, lists[i]);
        }
        return ret;
    }

    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode head = new ListNode();
        ListNode cur = head;

        while(list1 != null && list2 != null) {
            if(list1.val < list2.val) {
                cur.next = list1;
                list1 = list1.next;
            }
            else {
                cur.next = list2;
                list2 = list2.next;
            }
            cur = cur.next;
        }

        if(list1 != null) cur.next = list1;
        else cur.next = list2;

        return head.next;
    }
}
<!-- endtab -->
{% endcodetabs %}
## 具体实现-优先队列
在rust中，要对`ListNode`结构体使用优先队列，需要实现`Ord`和`PartialOrd`两个trait。
{% codetabs 优先队列 %}
<!-- tab lang:rust 优先队列 -->
use std::collections::BinaryHeap;
use std::cmp::Ord;
use std::cmp::Ordering;
impl PartialOrd for ListNode {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        if self.val < other.val
        {
            return Some(Ordering::Greater);
        }
        else if self.val > other.val {
            return Some(Ordering::Less);
        }
        Some(Ordering::Equal)
    }
}

impl Ord for ListNode {
    fn cmp(&self, other:&Self) -> Ordering {
        if self.val < other.val
        {
            return Ordering::Greater;
        }
        else if self.val > other.val {
            return Ordering::Less;
        }
        Ordering::Equal
    }
}
impl Solution {
    pub fn merge_k_lists(lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        let mut q : BinaryHeap<Box<ListNode>> = BinaryHeap::new();

        for list in lists {
            if let Some(list) = list {
                q.push(list);
            }
        }

        let mut head = Box::new(ListNode::new(0));
        
        let mut cur : &mut std::boxed::Box<ListNode> = &mut head;
        
        while !q.is_empty() {
            let mut top : Box<ListNode> = q.pop().unwrap();
            let top_next : Option<Box<ListNode>> = top.next.take();
            
            if let Some(next) = top_next {
                q.push(next);
            }
            cur.next = Some(top);
            cur = cur.next.as_mut().unwrap();
        }

        head.next
    }
}
<!-- endtab -->
<!-- tab lang:cpp 优先队列 -->
struct cmp {
     bool operator() (const ListNode * l1, const ListNode * l2) {
         return l1->val > l2->val;
     }
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        priority_queue<ListNode *, vector<ListNode *>, cmp> q;

        for(auto list : lists) { if(list == nullptr) continue; q.push(list); }
        ListNode head;
        ListNode * cur = &head;

        while(!q.empty()) {
            ListNode * t = q.top();
            q.pop();
            cur->next = t;
            cur = cur->next;
            if(t->next != nullptr) { q.push(t->next); }
            t->next = nullptr;
        }
        return head.next;
    }
};
<!-- endtab -->
<!-- tab lang:java 优先队列 -->
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        Queue<ListNode> q = new PriorityQueue<>( (l1, l2) -> l1.val - l2.val );

        for(var list : lists) {
            if(list == null) continue;
            q.add(list);
        }

        ListNode head = new ListNode();
        ListNode cur = head;

        while(!q.isEmpty()) {
            ListNode top = q.poll();
            cur.next = top;
            cur = cur.next;
            if(top.next != null) q.add(top.next);
        }

        return head.next;
    }
}
<!-- endtab -->
{% endcodetabs %}