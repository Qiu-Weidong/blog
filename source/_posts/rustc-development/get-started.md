---
title: 开始
date: 2022-08-05 10:37:04
tags:
  - rust
categories:
  - rust
---
本文档翻译自[https://rustc-dev-guide.rust-lang.org/getting-started.html](https://rustc-dev-guide.rust-lang.org/getting-started.html)

本文档并不全面；它只关注最有用的一些东西，以方便快速入门。获取更多信息，请参阅[本章](https://rustc-dev-guide.rust-lang.org/building/how-to-build-and-run.html)以了解如何构建和运行编译器。

## 提出问题
rust编译器团队(即`t-compiler`)经常在[Zulip](https://rust-lang.zulipchat.com/#narrow/stream/131828-t-compiler)上划水，你可以很容易在这里找到问题的答案。

**请大胆提问!**很多人觉得提问会浪费专家的时间，但没有任何一个`t-compiler`的专家会这样认为，贡献者对我们来说十分重要。

还有，如果你不介意，请使用公共主题，这样别人也可以看到问题和答案，而且有可能将你的问题和答案整合到本文档中。
### 专家介绍
并非所有`t-compiler`专家都精通`rustc`的任何细节，毕竟这是一个很大的项目。要了解每个专家擅长的部分，可以查阅[专家映射表](https://github.com/rust-lang/compiler-team/blob/master/content/experts/map.toml)。

这个专家映射表并不完整，如果找不到要咨询的专家，也欢迎提问。

### 礼貌
我们确实要求您注意在您的问题中包含尽可能多的有用信息，但我们认识到，如果您不熟悉`Rust`，这可能会很困难。

只是在不提供任何上下文的情况下 ping 某人可能会有点烦人并且只会产生噪音，毕竟每一个`t-compiler`人员每天会收到很多的ping。

## 克隆并构建

### 系统要求
网络要连上。
首先需要有python，2或3都可以。至于硬件，最好有30G以上的硬盘空间、8G以上的内存以及2个以上的处理器。更好的电脑可以构建得更快。在接下来的章节中，将介绍几种策略来应对硬件能力不足的问题。

有关软件和硬件先决条件的更多详细信息，请参阅[本章](https://rustc-dev-guide.rust-lang.org/building/prerequisites.html)。

### 克隆源代码
就和一般的仓库一样克隆即可。
```bash
git clone https://github.com/rust-lang/rust.git
cd rust
```
### x.py介绍
`rustc`是一个[自举](https://rustc-dev-guide.rust-lang.org/building/bootstrapping.html)的编译器，这使得它比一般的rust程序更加复杂。这导致的后果是你不能使用Cargo来编译而必须使用特殊工具x.py。x.py用来取代Cargo的工作，如构建、测试、发布等等。

### 配置编译器
在仓库的顶层目录执行下属命令。
```bash
./x.py setup
```
这条命令将进行一些初始化，并引导你完成交互设置以创建主要配置文件config.toml。

有关配置的更多信息，请参阅[本章](https://rustc-dev-guide.rust-lang.org/building/how-to-build-and-run.html#create-a-configtoml)。

### 常用x.py命令
当你开发rustc、std、rustdoc以及其他的工具时，以下命令会经常使用到。

|命令|何时使用|
|---|---|
|./x.py check| 快速检查是否大多数目标已经编译; [rust-analizer](https://rustc-dev-guide.rust-lang.org/building/suggested.html#configuring-rust-analyzer-for-rustc)会自动帮你运行这条命令 |
|./x.py build| 构建rustc、std和rustdoc |
|./x.py test | 运行所有测试 |
|./x.py fmt | 格式化代码 |

这些命令中的每一个都有值得学习的选项和论据，特别是 ./x.py build 和 ./x.py test。 他们提供了许多编译或测试代码子集的方法，可以节省大量时间。

更多信息请查阅[build](https://rustc-dev-guide.rust-lang.org/building/how-to-build-and-run.html)、 [test](https://rustc-dev-guide.rust-lang.org/tests/intro.html)、 [rustdoc](https://rustc-dev-guide.rust-lang.org/rustdoc.html)。

### 为其他rust项目贡献代码
在 rust-lang/rust 存储库之外，您还可以为许多其他项目做出贡献，包括 clippy、miri、chalk 和许多其他项目。

这些仓库可能有自己的贡献指南和程序。 其中许多归工作组所有。 有关更多信息，请参阅这些仓库的自述文件中的文档。

### 通过其他方式贡献代码

略。




