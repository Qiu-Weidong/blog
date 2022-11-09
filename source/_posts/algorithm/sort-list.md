---
title: 链表排序
date: 2022-06-08 14:28:01
katex: true
tags: 
  - leetcode
  - 链表
  - 分治
  - 排序
categories:
  - [数据结构与算法, 链表]
  - [数据结构与算法, 排序]
  - [数据结构与算法, 分治]
---
{% poem author:辛弃疾 source:鹧鸪天·代人赋 %}
晚日寒鸦一片愁。柳塘新绿却温柔。若教眼底无离恨，不信人间有白头。
肠已断，泪难收。相思重上小红楼。情知已被山遮断，频倚阑干不自由。
{% endpoem %}
## 题目描述
leetcode链接: [https://leetcode-cn.com/problems/insertion-sort-list/](https://leetcode-cn.com/problems/insertion-sort-list/)

简而言之，就是对链表进行排序
## 示例1
>**输入**：[4,2,1,3]
**输出**：[1,2,3,4]

## 示例2
>**输入**：head = [-1,5,3,4,0]
**输出**：[-1,0,3,4,5]


## 链表定义以及接口函数签名
{% codetabs 链表定义以及接口函数签名 %}
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
    pub fn insertion_sort_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {

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
    ListNode* insertionSortList(ListNode* head) {
        
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
    public ListNode insertionSortList(ListNode head) {

    }
}
<!-- endtab -->
{% endcodetabs %}

## 问题分析
可以使用插入排序的方法，每次从原链表中取出一个元素，然后插入到结果链表中的适当位置。
同时，参考合并两个有序链表的方法，可以设计出归并排序。即将链表分为两段，递归地对这两端链表进行排序，然后使用合并两个有序链表的方法对其进行排序即可。归并排序的时间复杂度为$O(logn)$。
## 具体实现-插入排序
{% codetabs 插入排序 %}
<!-- tab lang:cpp -->
class Solution {
public:
    ListNode* insertionSortList(ListNode* head) {
        ListNode ret_head(0x80000000);

        while(head) {
            ListNode * cur = head;
            head = head->next;
            cur->next = nullptr;

            ListNode * p = &ret_head;
            while(p->next != nullptr && p->next->val < cur->val) p = p->next;
            cur->next = p->next;
            p->next = cur;

        }

        return ret_head.next;
    }
};
<!-- endtab -->
<!-- tab lang:java -->
class Solution {
    public ListNode insertionSortList(ListNode head) {
        ListNode ret_head = new ListNode(0x80000000);

        while(head != null) {
            ListNode cur = head;
            head = head.next;
            cur.next = null;

            ListNode p = ret_head;
            while(p.next != null && p.next.val < cur.val) p = p.next;
            cur.next = p.next;
            p.next = cur;
        }
        return ret_head.next;
    }
}
<!-- endtab -->
<!-- tab lang:rust -->
impl Solution {
    pub fn insertion_sort_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let mut ret_head = Box::new(ListNode::new(-2147483648i32));
        let mut head = head;

        while let Some(current) = head.as_mut() {
            // 先把current的next取出来
            let current_next: Option<Box<ListNode>> = current.next.take();
            // current : &mut Box<ListNode>
            let mut p = &mut ret_head;

            while p.next != None && p.next.as_ref().unwrap().val < current.val {
                p = p.next.as_mut().unwrap();
            }
            // 把current插入到p的后面
            let p_next = p.next.take();
            // p.next = Some(current);
            current.next = p_next;
            p.next = head;

            head = current_next;
        }

        ret_head.next
    }
}
<!-- endtab -->
{% endcodetabs %}
## 具体实现-归并排序
{% codetabs 归并排序 %}
<!-- tab lang:rust -->
impl Solution {
    pub fn insertion_sort_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        if head == None {
            return None;
        }
        let li = head.as_ref().unwrap();
        if li.next == None {
            return head;
        }

        let mut head = head;

        let mut n = 0;
        let mut p = &head;

        while let Some(li) = p {
            n += 1;
            p = &li.next;
        }
        // 找到 cur

        let mut cur = head.as_mut().unwrap();
        let mid = n / 2 - 1;

        for _ in 0..mid {
            cur = cur.next.as_mut().unwrap();
        }

        let hold = cur.next.take();
        let mut left = Solution::insertion_sort_list(head);
        let mut right = Solution::insertion_sort_list(hold);

        let mut head = Box::new(ListNode::new(0));
        let mut cur = &mut head;

        while let (Some(li1), Some(li2)) = (left.as_mut(), right.as_mut()) {
            if li1.val < li2.val {
                let hold = li1.next.take();
                cur.next = left;
                left = hold;
            } else {
                let hold = li2.next.take();
                cur.next = right;
                right = hold;
            }
            cur = cur.next.as_mut().unwrap();
        }

        if let Some(li) = left {
            cur.next = Some(li);
        } else {
            cur.next = right;
        }

        head.next
    }
}

<!-- endtab -->

<!-- tab lang:cpp -->
class Solution
{
public:
    ListNode *insertionSortList(ListNode *head)
    {
        if (head->next == nullptr)
            return head;

        int n = 0;
        for (ListNode *cur = head; cur != nullptr; cur = cur->next)
        {
            n++;
        }
        int m = n / 2;
        ListNode *mid = head;
        for (int i = 0; i < m - 1; i++)
        {
            mid = mid->next;
        }
        ListNode *hold = mid->next;
        mid->next = nullptr;
        mid = hold;

        ListNode *left = insertionSortList(head);
        ListNode *right = insertionSortList(mid);

        ListNode *ans = nullptr;
        if (left->val > right->val)
        {
            ans = right;
            right = right->next;
        }
        else
        {
            ans = left;
            left = left->next;
        }

        ListNode *cur = ans;
        while (left != nullptr && right != nullptr)
        {
            if (left->val > right->val)
            {
                cur->next = right;
                right = right->next;
            }
            else
            {
                cur->next = left;
                left = left->next;
            }
            cur = cur->next;
        }

        if (left != nullptr)
            cur->next = left;
        else
            cur->next = right;
        return ans;
    }
};
<!-- endtab -->

<!-- tab lang:java -->
class Solution {
    public ListNode insertionSortList(ListNode head) {
        if(head.next == null) return head;

        int n = 0;
        for(ListNode cur=head; cur != null; cur = cur.next) {
            n++;
        }

        int m = n / 2;
        ListNode mid = head;
        for (int i = 0; i < m - 1; i++)
        {
            mid = mid.next;
        }
        ListNode hold = mid.next;
        mid.next = null;
        mid = hold;

        ListNode left = insertionSortList(head);
        ListNode right = insertionSortList(mid);

        head = new ListNode(0);
        ListNode cur = head;
        while(left != null && right != null) {
            if(left.val < right.val) {
                cur.next = left;
                left = left.next;
            }
            else {
                cur.next = right;
                right = right.next;
            }
            cur = cur.next;
        }

        if(left != null) cur.next = left;
        else cur.next = right;

        return head.next;
    }
}
<!-- endtab -->
{% endcodetabs %}