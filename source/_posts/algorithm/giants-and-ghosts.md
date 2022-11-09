---
title: 巨人和鬼
date: 2022-06-08 14:15:59
katex: true
tags:
  - 分治
  - 几何
  - 计算几何
categories:
  - [数据结构与算法, 分治]
  - [数据结构与算法, 计算几何]
---
{% poem author:纳兰容若 source:书堂春 %}
一生一代一双人，争教两处销魂。相思相望不相亲，天为谁春？
浆向蓝桥易乞，药成碧海难奔。若容相访饮牛津，相对忘贫。
{% endpoem %}
## 题目描述
洛谷链接: [https://www.luogu.com.cn/problem/U214788](https://www.luogu.com.cn/problem/U214788)
有$n$个巨人和$n$个鬼正在战斗。每个巨人都配备了质子炮，可以发射质子流来消灭鬼。质子流沿直线行进，击中鬼之后就会消失。
由于质子流威力巨大，一旦两束质子流发生碰撞，后果不堪设想。因此，巨人必须谨慎地选择鬼作为射击目标，以便保证质子流不会发生碰撞。
已知巨人和鬼的坐标没有三者是共线的，求可行的射击方案。

## 输入
第一行一个正整数$n$，表示巨人和鬼的个数。
接下来$n$行，每行三个数，第一个数表示该巨人的$id$，后两个是浮点数，分别表示该巨人的$x$坐标和$y$坐标。
接下来$n$行，每行三个数，分别表示鬼的$id$，鬼的$x$坐标和$y$坐标。
## 输出
输出$n$行，每行两个整数$giant_i$， $ghost_i$，表示$id$为$giant_i$的巨人的射击目标是$id$为$ghost_i$的鬼。

## 样例
>**输入**
>>2
0 0.00 0.00 
1 1.00 0.00 
0 0.00 1.00 
1 2.00 2.00 

>**输出**
>>0 0
1 1

## 数据范围

$
n \leq 2100
$

## 具体实现
{% codetabs 具体实现代码 %}
<!-- tab lang:cpp -->
#include <vector>
#include <iostream>
#include <algorithm>
#include <cassert>

using std::pair;
using std::vector;

struct giant_ghost
{
    double x;
    double y;
    bool is_giant;
    int id;
};

vector<giant_ghost> giants_ghosts;
vector<pair<int, int>> ans;

void giants_and_ghosts(int l, int r)
{
    if (l > r)
        return;
    assert((r - l) % 2 != 0);
    if (r - l == 1)
    {
        assert(giants_ghosts[l].is_giant || giants_ghosts[r].is_giant);
        assert(!(giants_ghosts[l].is_giant && giants_ghosts[r].is_giant));
        if (giants_ghosts[l].is_giant)
        {
            ans.push_back(std::make_pair(giants_ghosts[l].id, giants_ghosts[r].id));
        }
        else
        {
            ans.push_back(std::make_pair(giants_ghosts[r].id, giants_ghosts[l].id));
        }
        return;
    }

    int index = l;
    giant_ghost left = giants_ghosts[l];

    for (int i = l + 1; i <= r; i++)
    {
        if (giants_ghosts[i].y < left.y || giants_ghosts[i].y == left.y && giants_ghosts[i].x < left.x)
        {
            index = i;
            left = giants_ghosts[i];
        }
    }

    left = giants_ghosts[l];
    giants_ghosts[l] = giants_ghosts[index];
    giants_ghosts[index] = left;
    left = giants_ghosts[l];

    std::sort(giants_ghosts.begin() + 1 + l, giants_ghosts.begin() + 1 + r, [&left](const giant_ghost &g1, const giant_ghost &g2)
              {
        double x1 = g1.x - left.x;
        double y1 = g1.y - left.y;

        double x2 = g2.x - left.x;
        double y2 = g2.y - left.y;
        // (1, 0) x (0, 1) = 1
        return x1 * y2 - x2 * y1 > 0; });

    int giant_cnt = left.is_giant ? 1 : 0;
    int ghost_cnt = left.is_giant ? 0 : 1;
    index = l;

    do
    {
        index++;
        assert(index <= r);
        if(giants_ghosts[index].is_giant) giant_cnt++;
        else ghost_cnt++;
    } while (giant_cnt != ghost_cnt);

    // l和index匹配
    if(giants_ghosts[l].is_giant) ans.push_back(std::make_pair(giants_ghosts[l].id, giants_ghosts[index].id));
    else ans.push_back(std::make_pair(giants_ghosts[index].id, giants_ghosts[l].id));

    giants_and_ghosts(l+1, index-1);
    giants_and_ghosts(index+1, r);
}

int main(int argc, const char **argv)
{
    int n;
    std::cin >> n;

    for (int _ = 0; _ < n; _++)
    {
        giant_ghost tp;
        std::cin >> tp.id >> tp.x >> tp.y;
        tp.is_giant = true;
        giants_ghosts.push_back(tp);
    }

    for (int _ = 0; _ < n; _++)
    {
        giant_ghost tp;
        std::cin >> tp.id >> tp.x >> tp.y;
        tp.is_giant = false;
        giants_ghosts.push_back(tp);
    }

    giants_and_ghosts(0, giants_ghosts.size()-1);

    for(const auto & pair : ans) {
        std::cout << pair.first << " " << pair.second << std::endl;
    }
}
<!-- endtab -->
<!-- tab lang:rust -->
#[derive(Clone, Copy)]
struct GiantGhost {
    x : f64,
    y : f64,
    is_giant: bool,
    id: i32
}

fn giants_and_ghosts(giants_ghosts : &mut [GiantGhost]) {
    if giants_ghosts.len() <= 0 {
        return;
    }

    assert_eq!(giants_ghosts.len() % 2, 0);
    if giants_ghosts.len() == 2 {
        assert!(giants_ghosts[0].is_giant || giants_ghosts[1].is_giant);
        assert!(!(giants_ghosts[0].is_giant && giants_ghosts[1].is_giant));


        if giants_ghosts[0].is_giant {
            println!("{} {}", giants_ghosts[0].id, giants_ghosts[1].id);
        }
        else {
            println!("{} {}", giants_ghosts[1].id, giants_ghosts[0].id);
        }
        return;
    }

    let mut index = 0;
    let mut left = giants_ghosts[0];

    for i in 1..giants_ghosts.len() {
        if giants_ghosts[i].y < left.y || giants_ghosts[i].y == left.y && giants_ghosts[i].x < left.x {
            index = i;
            left = giants_ghosts[i];
        }
    }

    left = giants_ghosts[0];
    giants_ghosts[0] = giants_ghosts[index];
    giants_ghosts[index] = left;
    left = giants_ghosts[0];

    let slice = &mut giants_ghosts[1..];
    slice.sort_by(|g1, g2| {
        let x1 = g1.x - g2.x;
        let y1 = g1.y - g2.y;
        let x2 = g2.x - left.x;
        let y2 = g2.y - left.y;

        let ans = x1 * y2 - x2 * y1;
        if ans == 0.0 {
            return std::cmp::Ordering::Equal;
        }
        else if ans > 0.0 {
            return std::cmp::Ordering::Less;
        }
        else {
            return std::cmp::Ordering::Greater;
        }
    });

    let mut giant_cnt = if left.is_giant { 1 } else { 0 };
    let mut ghost_cnt = if left.is_giant { 0 } else { 1 };
    index = 0;

    loop {
        index += 1;
        assert!(index < giants_ghosts.len());
        if giants_ghosts[index].is_giant { giant_cnt += 1; }
        else { ghost_cnt += 1; }

        if giant_cnt == ghost_cnt { break; }
    } 


    if giants_ghosts[0].is_giant {
        println!("{} {}", giants_ghosts[0].id, giants_ghosts[index].id);
    }
    else {
        println!("{} {}", giants_ghosts[index].id, giants_ghosts[0].id);
    }

    if 1 < index-1 {
        giants_and_ghosts(&mut giants_ghosts[1..index]);
    }
    if index + 1 < giants_ghosts.len() {
        giants_and_ghosts(&mut giants_ghosts[(index+1)..]);
    }
}
fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n : i32 = input.trim().parse().unwrap();

    let mut giants_ghosts : Vec<GiantGhost> = Vec::new();
    for _ in 0..n {
        input.clear();
        std::io::stdin().read_line(&mut input).unwrap();
        while input.trim().len() <= 0 {
            std::io::stdin().read_line(&mut input).unwrap();
        }
        let mut s = input.trim().split(' ');
        let id : i32 = s.next().unwrap().trim().parse().unwrap();
        let x : f64 = s.next().unwrap().trim().parse().unwrap();
        let y : f64 = s.next().unwrap().trim().parse().unwrap();
        

        giants_ghosts.push(GiantGhost {x, y,is_giant:true, id});
    }

    for _ in 0..n {
        input.clear();
        std::io::stdin().read_line(&mut input).unwrap();
        while input.trim().len() <= 0 {
            std::io::stdin().read_line(&mut input).unwrap();
        }
        let mut s = input.trim().split(' ');

        let id : i32 = s.next().unwrap().trim().parse().unwrap();
        let x : f64 = s.next().unwrap().trim().parse().unwrap();
        let y : f64 = s.next().unwrap().trim().parse().unwrap();
        

        giants_ghosts.push(GiantGhost {x, y,is_giant:false, id});
    }

    giants_and_ghosts(&mut giants_ghosts[..]);
    // println!("hello world! {}", input)
    // let x = &giants_ghosts[1..1];
}
<!-- endtab -->
{% endcodetabs %}