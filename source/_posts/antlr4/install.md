---
title: antlr4安装
date: 2022-07-02 09:26:35
tags:
  - antlr4 
categories:
  - antlr4
---
## Java安装
安装antlr4首先需要安装java环境。
### linux安装java
以Ubuntu系统为例，使用一条命令即可安装java。
```bash
sudo apt install openjdk-8-jdk
```
### windows安装java
首先从[官网](https://www.oracle.com/java/technologies/downloads/#jdk18-windows)下载java安装包。
## antlr4安装
略
## 命令行别名配置

## grun的常用选项
  - **tokens** 打印出记号流。
  - **tree** 以LISP风格的文本形式打印出语法分析树。
  - **gui** 在对话框中可视化地显示语法分析树。
  - **ps file** 在PostScript中生成一个可视化的语法分析树表示，并把它存储在file文件中。
  - **encoding** **encodingname** 指定输入文件的编码。
  - **trace** 在进入/退出规则前打印规则名字和当前的记号。
  - **diagnostics** 分析时打开诊断消息。此生成消息仅用于异常情况，如二义性输入短语。
  - **SLL** 使用更快但稍弱的分析策略。

grun的使用方式如下：
```bash
grun 语法名称 开始符号 选项
```

