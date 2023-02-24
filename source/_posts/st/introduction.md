---
title: stringtemplate4简介
date: 2023-02-16 16:51:05
tags:
  - StringTemplate4
categories:
  - StringTemplate4
---

首先，要了解有关 StringTemplate 理念的更多信息，您可以查看可读性很强的学术论文在模板引擎中执行严格的[模型-视图分离](https://www.cs.usfca.edu/~parrt/papers/mvc.templates.pdf)

大多数发出源代码或其他文本输出的程序都是散布着打印语句的非结构化生成逻辑块。 主要原因是缺乏合适的工具和形式主义。 正确的形式主义是输出语法，因为你不是在生成随机字符——你是在用输出语言生成句子。 这类似于使用语法来描述输入句子的结构。 大多数程序员不会手动构建解析器，而是使用解析器生成器。 同样，我们需要某种形式的解析器生成器来生成文本。 输出语法最方便的体现是模板引擎，例如StringTemplate。

模板引擎只是一个使用模板发出文本的代码生成器，模板实际上只是带有“孔”的文档，您可以在其中粘贴称为属性的值。 属性可以是一个程序对象，例如字符串或 VarSymbol 对象、一个模板实例，或者是一个包含其他序列的属性序列。 模板引擎是用于生成结构化文本的特定领域语言。 StringTemplate 将您的模板分解为文本块和属性表达式，它们默认包含在尖括号中（但您可以使用任何您想要的单个字符开始和结束分隔符）。 StringTemplate 忽略属性表达式之外的所有内容，将其视为要吐出的文本。 为了评估模板并生成文本，我们使用方法调用“渲染”它：

```java
ST.render()
```


例如，以下模板有两个块，一个文字和一个对属性 `name` 的引用：

```
Hello, <name>
```

在代码中使用模板非常容易。 下面是打印 Hello, World 的必要示例：

```java
import org.stringtemplate.v4.*;
...
ST hello = new ST("Hello, <name>");
hello.add("name", "World");
System.out.println(hello.render());
```

StringTemplate 不是“系统”或“引擎”或“服务器”。 它被设计为嵌入到其他应用程序中，并作为一个小型库分发，除了 ANTLR（用于解析 StringTemplate 模板语言）之外没有任何外部依赖项。


## 模板组

StringTemplate4的主要类是 ST、STGroupDir 和 STGroupFile。 
您可以直接在代码中创建模板，可以从目录加载模板，还可以加载包含模板集合的文件（模板组文件）。 组文件的行为类似于模板目录的 zip 或 jar。

例如，假设我们在 /tmp 目录下的文件 decl.st 和 init.st 中有两个模板：

```
// file /tmp/decl.st
decl(type, name, value) ::= "<type> <name><init(value)>;"
```

```
```



