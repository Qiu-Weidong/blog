---
title: 最小圆覆盖
date: 2022-06-08 14:23:45
katex: true
tags:
  - 计算几何
categories:
  - [数据结构与算法, 计算几何]
---
{% poem author:李煜 source:虞美人·春花秋月何时了 %}
春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。
雕栏玉砌应犹在，只是朱颜改。问君能有几多愁？恰似一江春水向东流。
{% endpoem %}

## 题目描述
题目链接: [https://www.luogu.com.cn/problem/P1742](https://www.luogu.com.cn/problem/P1742)
给出$N$个点，画一个最小的包含所有点的圆。
## 示例
>**输入**: 首先输入一个整数$N$，表示点的个数。接下来$N$行，每行两个数$x_i$、$y_i$，表示第$i$个点的坐标。
>>6
8.0 9.0
4.0 7.5
1.0 2.0
5.1 8.7
9.0 2.0
4.5 1.0

>**输出**: 首先输出一个浮点数，表示半径。接下来两个浮点数，表示圆心坐标。
>>5.0000000000
5.0000000000 5.0000000000
## 数据范围
$1 \leq N \leq 10^5, \lvert x_i \rvert, \lvert y_i \rvert \leq 10^4$

## 具体代码
{% codetabs 具体代码实现 %}
<!-- tab lang:rust -->

#[derive(Clone, Debug, Copy)]
struct Point {
    x: f64,
    y: f64,
}

#[derive(Clone, Debug, Copy)]
struct Circle {
    center: Point,
    radius: f64,
}

impl Circle {
    fn contains(self, point: Point) -> bool {
        (self.center.x - point.x) * (self.center.x - point.x)
            + (self.center.y - point.y) * (self.center.y - point.y)
            <= self.radius * self.radius
    }
    fn from_two_points(p1: Point, p2: Point) -> Self {
        let x = (p1.x + p2.x) / 2.0;
        let y = (p1.y + p2.y) / 2.0;
        let radius = 0.5 * ((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)).sqrt();
        let center = Point { x, y };
        Circle { center, radius }
    }

    fn from_three_points(p1: Point, p2: Point, p3: Point) -> Self {
        let t1 = p1.x + p2.x; //x1+x2
        let t2 = p1.x - p2.x; // x1-x2
        let t3 = p3.x + p2.x; //x3+x2
        let t4 = p3.x - p2.x; //x3-x2
        let t5 = p1.y + p2.y; //y1+y2
        let t6 = p1.y - p2.y; //y1-y2
        let t7 = p3.y + p2.y; //y3+y2
        let t8 = p3.y - p2.y; //y3-y2

        let t = 2.0 * (t2 * t8 - t4 * t6); // 分母
        let t9 = t1 * t2 + t5 * t6;
        let t10 = t3 * t4 + t7 * t8;

        let x = (t9 * t8 - t10 * t6) / t;
        let y = (t10 * t2 - t9 * t4) / t;
        let radius = ((p1.x - x) * (p1.x - x) + (p1.y - y) * (p1.y - y)).sqrt();
        Circle {
            center: Point { x, y },
            radius,
        }
    }
}

fn min_span_circle(points : &[Point]) -> Circle {
    if points.len() <= 0 {
        return Circle { center : Point {x : 0.0, y : 0.0}, radius: 0.0 }
    }
    else if points.len() <= 1 {
        let x = points[0].x;
        let y = points[0].y;
        return Circle { center : Point {x, y}, radius: 0.0 }
    }
    else if points.len() <= 2 {
        return Circle::from_two_points(points[0], points[1]);
    }
    let mut circle = Circle::from_two_points(points[0], points[1]);
    
    for i in 2..points.len() {
        if !circle.contains(points[i]) {
            circle = min_span_circle_1(&points[..i], points[i]);
        }
    }
    circle
}

fn min_span_circle_1(points : &[Point], point : Point) -> Circle {
    if points.len() <= 0 {
        return Circle { center : Point {x : 0.0, y : 0.0}, radius: 0.0 }
    }
    let mut circle = Circle::from_two_points(points[0], point);
    for i in 1..points.len() {
        if !circle.contains(points[i]) {
            circle = min_span_circle_2(&points[..i], point, points[i]);
        }
    }
    circle
}
fn min_span_circle_2(points : &[Point], p1 : Point, p2 : Point) -> Circle {
    let mut circle = Circle::from_two_points(p1, p2);
    for point in points.iter() {
        if !circle.contains(*point) {
            circle = Circle::from_three_points(p1, p2, *point);
        }
    }
    circle
}
fn main() {
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    let n : i32 = input.trim().parse().unwrap();

    let mut points : Vec<Point> = Vec::new();

    for _ in 0..n {
        input.clear();
        std::io::stdin().read_line(&mut input).unwrap();
        let mut s = input.trim().split(' ');
        let x : f64 = s.next().unwrap().trim().parse().unwrap();
        let y : f64 = s.next().unwrap().trim().parse().unwrap();

        points.push(Point {x, y});
    }

    let circle = min_span_circle(&points[..]);
    println!("{} {} {}", circle.radius, circle.center.x, circle.center.y);
}


<!-- endtab -->

<!-- tab lang:cpp -->
#include <cstdio>
#include <cmath>
#include <ctime>
#include <algorithm>

struct Point
{
    double x;
    double y;
    Point(double x=0,double y=0):x(x),y(y){}
};
struct Circle
{
    Point center;
    double radius_square;
    Circle(const Point & point,double radius):center(point),radius_square(radius){}
    Circle():center(Point(0,0)),radius_square(0){}

};
Circle circumcircle(const Point & p1,const Point & p2,const Point & p3);
Circle circumcircle(const Point & p1,const Point & p2);
bool contains(const Circle & circle,const Point & point);

Circle minSpanCircle(const Point & p1,const Point & p2,const Point * points,int k);//固定了两个点的最小圆覆盖
Circle minSpanCircle(const Point & p,const Point * points,int k);//固定了一个点的最小覆盖圆
Circle minSpanCircle(const Point * points,int k);//前k个点的最小覆盖圆


Point points[100005];
using namespace std;

int main()
{
    int n;
    scanf("%d",&n);
    for(int i=0;i<n;i++)
        scanf("%lf%lf",&points[i].x,&points[i].y);
    srand(unsigned(time(0)));
    random_shuffle(points,points+n);
    Circle circle = minSpanCircle(points,n);
    printf("%.10f\n%.10f %.10f",sqrt(circle.radius_square),circle.center.x,circle.center.y);
    return 0;
}

Circle circumcircle(const Point & p1,const Point & p2)
{
    double radius_square = 0.25*((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
    return Circle(Point((p1.x+p2.x)/2,(p1.y+p2.y)/2),radius_square);
}
Circle circumcircle(const Point & p1,const Point & p2,const Point & p3)
{
    double t1 = p1.x + p2.x;//x1+x2
    double t2 = p1.x - p2.x; // x1-x2
    double t3 = p3.x + p2.x;//x3+x2
    double t4 = p3.x - p2.x;//x3-x2
    double t5 = p1.y + p2.y;//y1+y2
    double t6 = p1.y - p2.y;//y1-y2
    double t7 = p3.y + p2.y;//y3+y2
    double t8 = p3.y - p2.y;//y3-y2

    double t = 2.0*(t2*t8-t4*t6); // 分母
    double t9 = t1*t2+t5*t6;
    double t10 = t3*t4+t7*t8;

    double x = (t9*t8-t10*t6)/t;
    double y = (t10*t2-t9*t4)/t;
    double radius_square = (p1.x-x)*(p1.x-x)+(p1.y-y)*(p1.y-y);
    return Circle(Point(x,y),radius_square);
}

Circle minSpanCircle(const Point & p1,const Point & p2,const Point * points,int k)//固定了两个点的最小圆覆盖
{
    Circle circle = circumcircle(p1,p2);
    for(int i=0;i<k;i++)
    {
        if(!contains(circle,points[i]))//如果points[i]不在圆内，
            circle = circumcircle(p1,p2,points[i]);//那么就作三个点的外接圆
    }
    return circle;
}
Circle minSpanCircle(const Point & p,const Point * points,int k)//固定了一个点，求points中的前k个点的最小覆盖圆
{
    if(k <= 0)
        return Circle(p,0);
    Circle circle = circumcircle(p,points[0]);

    for(int i=1;i<k;i++)
    {
        if(!contains(circle,points[i])) // 如果没有包含第i个点
            circle = minSpanCircle(p,points[i],points,i);
    }
    return circle;
}
Circle minSpanCircle(const Point * points,int k) //求points中前k个点的最小覆盖圆
{
    if(k <= 0)
        return Circle();
    else if(k <= 1)
        return Circle(points[0],0);
    else if(k <= 2)
        return circumcircle(points[0],points[1]);

    Circle circle = circumcircle(points[0],points[1]);
    for(int i=2;i<k;i++)
    {
        if(!contains(circle,points[i]))
            circle = minSpanCircle(points[i],points,i);
        //printf("i=%d,circle.radius=%.3f,circle.x=%.3f,circle.y=%.3f\n",i,sqrt(circle.radius_square),circle.center.x,circle.center.y);
    }
    return circle;
}
bool contains(const Circle & circle,const Point & point)
{
    return (point.x-circle.center.x)*(point.x-circle.center.x)
        + (point.y-circle.center.y)*(point.y-circle.center.y)
        <= circle.radius_square;
}

<!-- endtab -->
{% endcodetabs %}