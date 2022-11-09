---
title: 合并两个有序链表
date: 2022-06-08 14:21:26
katex: true
tags: 
  - leetcode
  - 链表
categories:
  - 数据结构与算法
  - 链表
---
{% poem author:辛弃疾 source:菩萨蛮·书江西造口壁 %}
郁孤台下清江水，中间多少行人泪。西北望长安，可怜无数山。
青山遮不住，毕竟东流去。江晚正愁予，山深闻鹧鸪。
{% endpoem %}

## 题目描述
leetcode链接: [https://leetcode-cn.com/problems/merge-two-sorted-lists/](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

将两个升序链表合并为一个新的**升序**链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

## 示例1
>**输入**：l1 = [1,2,4], l2 = [1,3,4]
**输出**：[1,1,2,3,4,4]

## 示例2
>**输入**：l1 = [], l2 = []
**输出**：[]

## 示例3
>**输入**：l1 = [], l2 = [0]
**输出**：[0]

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
    pub fn merge_two_lists(list1: Option<Box<ListNode>>, list2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {

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
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        
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
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {

    }
}
<!-- endtab -->
{% endcodetabs %}
## 数据范围
 - 两个链表的节点数目范围是 [0, 50]
 - $-100 \leq Node.val \leq 100$
 - $l_1$ 和 $l_2$ 均按 **非递减顺序** 排列

## 问题分析
首先准备一个空的链表，用于返回结果，不妨称这个链表为$result$。
我们的目的是得到一个有序的升序链表，那么我们需要每次从$l_1$和$l_2$中选择最小的元素，将这个最小的元素从原来的链表当中删除，并放入$result$链表当中。由于$l_1$和$l_2$都是有序链表，这个元素一定是$l_1$和$l_2$头节点的较小值。
重复这个步骤，直到$l_1$或$l2$其中一个链表为空。此时，将不为空的链表附加到$result$的后面即可。




## 具体实现
这里给出了rust、java和cpp的实现，代码逻辑是相似的，首先创建一个结果链表的头节点`head`，这个头节点并不包含数据，只是为了我们编码方便。因此，最后的返回语句返回的是`head.next`。
接下来是一个while循环，该循环直到其中一个链表为空才停止。在该循环体内，我们不断找出剩余元素中的最小的元素(即两个链表头节点中较小的一个)，并将其从原来的链表中移除，然后放入我们的结果链表中。
最后，将不为空的链表附加到结果链表中。

{% codetabs 具体实现 %}
<!-- tab lang:rust -->
impl Solution {
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
                // 先把list1的next take出来
                let list1_next = li1.next.take();
                // cur->next = list1
                cur.next = list1;

                // list1 = list1->next
                list1 = list1_next;
            } else {
                // 先把list2的next take出来
                let list2_next = li2.next.take();
                // cur->next = list2
                cur.next = list2;

                // list2 = list2->next
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

<!-- tab lang:cpp -->
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode head;
        ListNode * cur = &head;

        while(list1 != nullptr && list2 != nullptr) {
            if(list1->val < list2->val) {
                cur->next = list1;
                list1 = list1->next;
            }
            else {
                cur->next = list2;
                list2 = list2->next;
            }

            cur = cur->next;
        }

        if(list1 != nullptr) cur->next = list1;
        else cur->next = list2;

        return head.next;
    }
};
<!-- endtab -->

<!-- tab lang:java -->
class Solution {
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