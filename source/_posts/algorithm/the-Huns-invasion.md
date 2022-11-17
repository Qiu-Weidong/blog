---
title: 匈奴犯境
date: 2022-06-08 14:30:10
katex: true
tags:
  - 动态规划
categories:
  - [数据结构与算法, 动态规划]
---
{% poem author:辛弃疾 source:一剪梅·中秋元月 %}
忆对中秋丹桂丛，花在杯中，月也杯中。今宵楼上一尊同，云湿纱窗，雨湿纱窗。
浑欲乘风问化工，路也难通，信也难通。满堂唯有烛花红，杯且从容，歌且从容。
{% endpoem %}
## 题目描述
洛谷链接: [https://www.luogu.com.cn/problem/U135410](https://www.luogu.com.cn/problem/U135410)
本题采用spj，spj代码在最后给出。


中国某西域重镇遭到了匈奴的入侵，该城池有$n$道城门，于是，匈奴单于将军队分为了$n$个部分，每个部分攻打一个城门。匈奴军队单位时间攻城对城池造成的损失等于攻城的人数。

城内的中国将士力量薄弱，只能坚守，不能出战，守城的主帅向朝廷告急。由于该城池关系到丝绸之路的繁荣，皇帝决定派大军救援。但由于军队的集结和动员需要时间，于是命令附近的城池先派遣一队骑兵来协助，帮助城内的守军坚持到援军的到来。

前来协助的骑兵的力量不足以同时对抗匈奴大军，但面对每个城门下的匈奴攻城部队则有绝对的力量优势。并且由于匈奴**轻而不整,贪而无亲,胜不相让,败不相救**。于是当前来协助的骑兵歼灭一股攻城力量的时候，其他的攻城力量不会前来救援，而是继续攻城。

假设你是这队前来救援的骑兵的统帅，请你制定出战斗方案，使得在歼灭匈奴的同时，城池受到的损伤最小。

## 输入
首先两个整数$n$、$c$，表示城门数$n$和城墙的周长$c$。
接下来$n$行，每行$4$个数，分别表示第$i$个城门的坐标、攻打该城门的匈奴兵人数、前来协助的骑兵距离这道城门的距离、城门的编号

**PS**：骑兵的前进速度为每个单位时间移动单位距离，城墙采用自然坐标系，参考样例解释，骑兵战斗的时间可以忽略不计。


## 输出
一个整数，表示最小损害
接下来$n$个整数，每个整数表示一个城门的编号，表示战斗顺序。
## 样例
>**输入**:
>4 7
>
>0 3 2 1
4 7 1 3
5 3 3 0
2 4 1 2
>**输出**:
    49      
    3 0 1 2 
## 样例解释
如图，中间的图画代表城池，城池外面的折线箭头以及上面的 {% label 黑色 %} 数字代表坐标系，{% label 灰色 %} 的数字代表城门的编号，{% label 红色 red %} 的点表示攻城的匈奴军队，而 {% label 绿色 green %} 的点表示救援的骑兵。
![匈奴犯境](https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/images/FlZlzl6bQw-5Rp_HNQyTtwVetoIg.png)

**图①**中骑兵正在向$3$号城门奔袭，$3$号城门的距离是$1$，由于骑兵的前进速度为每个单位时间移动单位距离，于是，骑兵到达$3$号城门花费了$1$个单位时间，又因为匈奴军队单位时间攻城对城池造成的损失等于攻城的人数，因此在骑兵到达3号城门的时候，匈奴造成的损失为$(3+4+7+3) \times 1=17$。

然后骑兵赶到了$3$号城门，并歼灭了$3$号城门下的匈奴士兵。如**图②**所示。

然后骑兵前往$0$号城门，$3$号城门到$0$号城门的距离为$|5-4|=1$，于是，骑兵花费了$1$个时间单位，这期间匈奴兵造成的损失为$(3+4+3)*1=10$。

然后骑兵赶到了$0$号城门，并歼灭了$0$号城门下的匈奴士兵。如**图③**所示。

然后骑兵前往$1$号城门，$0$号城门到$1$号城门的距离为$2$，于是，骑兵花费了$2$个时间单位，这期间匈奴兵造成的损失为$(3+4)*2=14$。

然后骑兵赶到了$1$号城门，并歼灭了$1$号城门下的匈奴士兵。如**图④**所示。

然后骑兵前往$2$号城门，$1$号城门到$2$号城门的距离为$2$，于是，骑兵花费了$2$个时间单位，这期间匈奴兵造成的损失为$4*2=8$。

然后骑兵赶到了$2$号城门，并歼灭了$1$号城门下的匈奴士兵。如**图⑤**所示。

至此，所有的匈奴兵被歼灭，造成的损失一共为$17+10+14+8=49$
## 数据范围
$n \leq 1000$
## 具体实现代码
{% codetabs 具体实现 %}

<!-- tab lang:rust -->
struct Node {
    x: i32,
    w: i32,
    d: i32,
    id: i32,
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let mut s = input.trim().split(' ');
    let n: usize = s.next().unwrap().trim().parse().unwrap();
    let c: i32 = s.next().unwrap().trim().parse().unwrap();

    let mut a = Vec::new();
    for _ in 0..n {
        input.clear();
        std::io::stdin().read_line(&mut input).unwrap();
        while input.trim().len() <= 0 {
            std::io::stdin().read_line(&mut input).unwrap();
        }

        let mut s1 = input.trim().split(' ');
        let x: i32 = s1.next().unwrap().trim().parse().unwrap();
        let w: i32 = s1.next().unwrap().trim().parse().unwrap();
        let d: i32 = s1.next().unwrap().trim().parse().unwrap();
        let id: i32 = s1.next().unwrap().trim().parse().unwrap();

        a.push(Node { x, w, d, id });
    }

    // 按照坐标排序
    a.sort_by(|a, b| {
        if a.x < b.x {
            return std::cmp::Ordering::Less;
        } else if a.x == b.x {
            return std::cmp::Ordering::Equal;
        } else {
            return std::cmp::Ordering::Greater;
        }
    });

    let mut f : Vec<Vec<i64>> = vec![vec![0; n]; n];
    let mut g : Vec<Vec<i64>> = vec![vec![0; n]; n];
    let mut sum : Vec<i64> = vec![0; n];

    sum[0] = a[0].w as i64;
    for i in 1..n {
        sum[i] = sum[i - 1] + a[i].w as i64;
    }

    for i in 0..n {
        let tmp = sum[n - 1] * a[i].d as i64;
        f[i][i] = tmp;
        g[i][i] = tmp;
    }

    for len in 1..n {
        for i in 0..n {
            let j = (i + len) % n;
            f[i][j] = min(
                f[(i + 1) % n][j]
                    + dis(i, (i + 1) % n, c, &a) as i64 * enemy((i + 1) % n, j, n, &sum),
                g[(i + 1) % n][j] + dis(i, j, c, &a) as i64 * enemy((i + 1) % n, j, n, &sum),
            );
            g[i][j] = min(
                g[i][(j + n - 1) % n]
                    + dis((j + n - 1) % n, j, c, &a) as i64 * enemy(i, (j + n - 1) % n, n, &sum),
                f[i][(j + n - 1) % n]
                    + dis(i, j, c, &a) as i64 * enemy(i, (j + n - 1) % n, n, &sum),
            );
        }
    }

    let mut ans = min(f[0][n - 1], g[0][n - 1]);
    let mut l = 0;
    let mut r = n - 1;
    for i in 1..n {
        let t = min(f[i][i - 1], g[i][i - 1]);
        if t < ans {
            ans = t;
            l = i;
            r = i - 1;
        }
    }

    println!("{}", ans);

    if f[l][r] < g[l][r] {
        outputf(l, r, n, &a, c, &sum, &f, &g);
    } else {
        outputg(l, r, n, &a, c, &sum, &f, &g);
    }

    println!("");
}

fn enemy(i: usize, j: usize, n: usize, sum: &[i64]) -> i64 {
    if i > j {
        return sum[i - 1] - sum[j];
    } else if i == 0 {
        return sum[n - 1] - sum[j];
    } else {
        return sum[n - 1] - sum[j] + sum[i - 1];
    }
}

fn min(a: i64, b: i64) -> i64 {
    if a < b {
        a
    } else {
        b
    }
}
fn abs(x: i32) -> i32 {
    if x < 0 {
        -x
    } else {
        x
    }
}
fn dis(i: usize, j: usize, c: i32, a: &[Node]) -> i32 {
    if i <= j {
        abs(a[i].x - a[j].x)
    } else {
        c - abs(a[i].x - a[j].x)
    }
}
fn outputf(
    l: usize,
    r: usize,
    n: usize,
    a: &[Node],
    c: i32,
    sum: &Vec<i64>,
    f: &Vec<Vec<i64>>,
    g: &Vec<Vec<i64>>,
) {
    if r == l {
        print!("{} ", a[l].id);
        return;
    } else if f[(l + 1) % n][r] + dis(l, (l + 1) % n, c, a) as i64 * enemy((l + 1) % n, r, n, sum)
        < g[(l + 1) % n][r] + dis(l, r, c, a) as i64 * enemy((l + 1) % n, r, n, sum)
    {
        outputf((l + 1) % n, r, n, a, c, sum, f, g);
    } else {
        outputg((l + 1) % n, r, n, a, c, sum, f, g);
    }
    print!("{} ", a[l].id);
}
fn outputg(
    l: usize,
    r: usize,
    n: usize,
    a: &[Node],
    c: i32,
    sum: &Vec<i64>,
    f: &Vec<Vec<i64>>,
    g: &Vec<Vec<i64>>,
) {
    if r == l {
        print!("{} ", a[l].id);
        return;
    } else if g[l][(r + n - 1) % n]
        + dis((r + n - 1) % n, r, c, a) as i64 * enemy(l, (r + n - 1) % n, n, sum)
        < f[l][(r + n - 1) % n] + dis(l, r, c, a) as i64 * enemy(l, (r + n - 1) % n, n, sum)
    {
        outputg(l, (r + n - 1) % n, n, a, c, sum, f, g);
    } else {
        outputf(l, (r + n - 1) % n, n, a, c, sum, f, g);
    }
    print!("{} ", a[r].id);
}
<!-- endtab -->

<!-- tab lang:cpp -->
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <algorithm>
int n, c;
long long f[1005][1005];
long long g[1005][1005];
long long sum[1005];
struct node
{
    int x;
    int w;
    int d;
    int id;
};
node a[1005];

long long enemy(int i, int j)
{ // 计算当区间i-j的敌人都被消灭后，剩余的敌人数量
    if (i > j)
        return sum[i - 1] - sum[j];
    else if (i == 0)
        return sum[n - 1] - sum[j];
    else
        return sum[n - 1] - sum[j] + sum[i - 1];
}

inline long long min(long long a, long long b) { return a < b ? a : b; }
inline long long max(long long a, long long b) { return a > b ? a : b; }

void outputg(int l, int r);
int dis(int i, int j);
void outputf(int l, int r)
{
    if (r == l)
    {
        printf("%d ", a[l].id);
        return;
    }
    else if (f[(l + 1) % n][r] + dis(l, (l + 1) % n) * enemy((l + 1) % n, r) <
             g[(l + 1) % n][r] + dis(l, r) * enemy((l + 1) % n, r))
        outputf((l + 1) % n, r);
    else
        outputg((l + 1) % n, r);
    printf("%d ", a[l].id);
}
void outputg(int l, int r)
{
    if (r == l)
        {printf("%d ", a[l].id);
        return;}
    else if (g[l][(r + n - 1) % n] + dis((r + n - 1) % n, r) * enemy(l, (r + n - 1) % n) <
             f[l][(r + n - 1) % n] + dis(l, r) * enemy(l, (r + n - 1) % n))
        outputg(l, (r + n - 1) % n);
    else
        outputf(l, (r + n - 1) % n);
    printf("%d ", a[r].id);
}
int dis(int i,int j){
    if(i <= j) return abs(a[i].x - a[j].x);
    return c - abs(a[i].x - a[j].x);
}

int main()
{
    scanf("%d%d", &n, &c);
    for (int i = 0; i < n; i++)
    {
        scanf("%d%d%d%d", &a[i].x, &a[i].w, &a[i].d, &a[i].id);
    }
    // 按照坐标排序
    std::sort(a, a + n, [](const node &a, const node &b) {
        return a.x < b.x;
    });

    sum[0] = a[0].w;
    for (int i = 1; i < n; i++)
        sum[i] = sum[i - 1] + a[i].w;

    for (int i = 0; i < n; i++)
    {
        f[i][i] = g[i][i] = sum[n - 1] * a[i].d;
    }

    for (int len = 1; len < n; len++)
    {
        for (int i = 0; i < n; i++)
        {
            int j = (i + len) % n;
            f[i][j] = min(f[(i + 1) % n][j] + dis(i, (i + 1) % n) * enemy((i + 1) % n, j),
                          g[(i + 1) % n][j] + dis(i, j) * enemy((i + 1) % n, j));
            g[i][j] = min(g[i][(j + n - 1) % n] + dis((j + n - 1) % n, j) * enemy(i, (j + n - 1) % n),
                          f[i][(j + n - 1) % n] + dis(i, j) * enemy(i, (j + n - 1) % n));
        }
    }

    long long ans = min(f[0][n - 1], g[0][n - 1]);
    int l = 0;
    int r = n - 1;
    for (int i = 1; i < n; i++)
    {
        long long t = min(f[i][i - 1], g[i][i - 1]);
        if (t < ans)
        {
            ans = t;
            l = i;
            r = i - 1;
        }
    }

    printf("%lld\n", ans);
    if (f[l][r] < g[l][r])
        outputf(l, r);
    else
        outputg(l, r);
    putchar('\n');
}
<!-- endtab -->
{% endcodetabs %}
## spj代码
{% codeblock lang:cpp %}
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <algorithm>

struct node
{
    int x;
    int w;
    int d;
    int id;
};
node a[1005];
inline int min(int a, int b) { return a < b ? a : b; }
int n,c;
int dis(int i, int j)
{ // 计算第i个城门到第j个城门的最小距离
    int t = abs(a[i].x - a[j].x);
    return min(t, c - t);
}
bool visit[1005];
int main(int argc, char *argv[])
{
    if(argc != 4) return printf("0\nSPJ error\n"),0;
    FILE * f_in,*f_user,* f_std;
    if((f_in=fopen(argv[1],"r"))==0) return printf("0\nINPUT NOT READY"),0;
    if((f_std=fopen(argv[2],"r"))==0) return printf("0\nOUTPUT NOT READY"),0;
    if((f_user=fopen(argv[3],"r")) == 0) return printf("0\nNO OUTPUT FROM PROGRAM"),0;

    int sum = 0;
    fscanf(f_in, "%d%d", &n, &c);
    for (int i = 0; i < n; i++)
    {
        fscanf(f_in, "%d%d%d%d", &a[i].x, &a[i].w, &a[i].d, &a[i].id);
        sum += a[i].w;
    }
    fclose(f_in);
    std::sort(a, a + n, [](const node &a, const node &b) {
        return a.id < b.id;
    });

    int ans;
    fscanf(f_std, "%d", &ans);
    fclose(f_std);

    int user_ans;
    if (fscanf(f_user, "%d", &user_ans) == EOF || user_ans > ans) //如果大于标准结果，肯定错误
    {
        fclose(f_user);
        return printf("0\nWrong Answer"), 0;
    }
    // 小于或等于标准结果
    memset(visit,false,sizeof(visit));
    ans = 0;
    int x,y;
    if (fscanf(f_user, "%d", &x) == EOF || x >= n)
    {
        fclose(f_user);
        return printf("0\nWrong Answer"), 0;
    }
    visit[x] = true;
    ans += sum*a[x].d;
    sum -= a[x].w;
    for (int i = 1; i < n; i++)
    {
        if (fscanf(f_user, "%d", &y) == EOF || y >= n || visit[y])
        {
            fclose(f_user);
            return printf("0\nWrong Answer"), 0;
        }

        ans += dis(x,y)*sum;
        x = y;
        sum -= a[x].w;
    }
    fclose(f_user);
    // 如果最终的方案算出来的与用户自己输出的相符，则AC，否则Wrong Answer
    if(ans == user_ans){
        return printf("1\nAccept"),0;
    }
    else printf("0\nWrong Answer");
}

{% endcodeblock %}
