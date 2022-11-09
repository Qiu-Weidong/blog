---
title: graphviz安装教程
date: 2022-04-30 21:53:34
tags:
  - graphviz
categories:
  - graphviz
---

## Linux下的安装
在linux下直接使用命令即可安装
```bash
# ubuntu
sudo apt install graphviz
# Fedora
sudo yum install graphviz
# Debian
sudo apt install graphviz
```
## windows下的安装
首先下载安装程序，下载地址: [https://graphviz.org/download/](https://graphviz.org/download/)。
找到对应的安装程序，笔者这里选择的是`graphviz-3.0.0 (64-bit) EXE installer [sha256]`。
下载后运行安装程序，当询问是否添加环境变量时选择添加当前用户。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/graphviz/添加环境变量.JPG)
然后一路下一步即可。

安装完成后，打开终端，输入命令
```cmd
dot -version
```
出现下图所示的结果，表明安装成功。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/graphviz/安装成功.JPG)
## 测试graphviz
新建一个文本文件，命名为`main.dot`。然后将下面的内容复制到`main.dot`。
```dot
digraph { 
    a -> b -> c -> d;
    b -> a ;
    a -> d;

}

```
然后运行下述命令生成图片:
```cmd
dot -Tpng main.dot -o main.png
```
生成的结果如下图所示:
![main.png](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/graphviz/main.png)
