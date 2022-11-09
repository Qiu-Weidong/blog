---
title: 对象之间的关系
date: 2022-04-08 14:24:15
tags:
  - 设计模式
categories:
  - 设计模式
---

{% poem author:辛弃疾 source:水调歌头·和马叔度游月波楼 %}
客子久不到，好景为君留。西楼着意吟赏，何必问更筹？唤起一天明月，照我满怀冰雪，浩荡百川流。鲸饮未吞海，剑气已横秋。
野光浮，天宇迥，物华幽。中州遗恨，不知今夜几人愁？谁念英雄老矣？不道功名蕞尔，决策尚悠悠。此事费分说，来日且扶头！
{% endpoem %}

## 依赖关系
如果一个类A使用到了另一个类B，则这两个类具有依赖关系。例如A的方法的形参中存在B类、A的方法的返回值是B、A的方法中有B的局部变量或B的静态方法调用等。
{% codeblock lang:java %}
// 学生类
public class Student {
  private String name;
  private int id;
  public void study(Course course) { ... }
}
// 课程类
public class Course { 
  private String name;
  ...
}
{% endcodeblock %}
学生类的方法中使用到了课程类作为参数，这两个类具有依赖关系，可以用类图表示如下
{% mermaid 依赖关系 %}
classDiagram
  class Student
    Student: -string name
    Student: -integer id
    Student: +study(course)
  class Course
    Course: -string name
  Student ..> Course
{% endmermaid %}
## 关联关系
如果类A中有成员变量的类型是类B，则这两个类具有关联关系。如果类A中有成员变量类B，同时类B中也有成员变量类A，那么这两个类具有双向关联关系。
{% codeblock lang:java %}
// 汽车类
public class Car {
  private Engine engine;
  public void drive() { ... }
}
// 引擎类
public class Engine { 
  private String power;
  public void start() { ... }
}
{% endcodeblock %}
{% mermaid %}
classDiagram
  class Car
    Car: -Engine engine
    Car: +drive()
  class Engine
    Engine: -string power
    Engine: +start()
  Car --> Engine
{% endmermaid %}
## 聚合关系
聚合关系中，对象A拥有一组对象B，并扮演着容器或者是集合的角色。比如学校和学生的关系。
{% mermaid %}
classDiagram
  class School
  class Student
  School o-- Student
{% endmermaid %}
## 组合关系
组合关系与聚合关系类似，但组合关系中，对象B不能够脱离对象A而单独存在。例如，大学中有很多的院系，而这些院系不能够脱离大学而独自存在，因此，这两者是组合关系。
{% mermaid %}
classDiagram
  class 大学 
  class 院系
  大学 *-- 院系
{% endmermaid %}