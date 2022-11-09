---
title: 结语
date: 2022-06-12 10:21:07
tags:
  - llvm 
categories:
  - llvm 
---
请记住，通过使用 `clang/clang++` 编译器的 `-emit-llvm` 选项可以学到很多东西。 这使您有机会看到实时生产编译器的运行情况以及它如何精确地执行操作。

如果您通过这种方式发现了一些新内容，或者本文档中有任何错误，或者您需要比此处提供的更多信息，请在 `Github` 上创建 `issue`。
## 延申阅读
本章列出了一些读者可能感兴趣的资源：
 - LLVM documentation [http://llvm.org/docs/](http://llvm.org/docs/)
 - Modern Compiler Implementation in Java, 2nd Edition.
 - Eli Bendersky’s collection of code examples for using LLVM/clang, [https://github.com/eliben/llvm-clang-samples](https://github.com/eliben/llvm-clang-samples)
 - "How Clang Compiles a Function" by John Regehr, June 2018, [https://blog.regehr.org/archives/1605](https://blog.regehr.org/archives/1605)
## 贡献
如果您想为本文档做出贡献，您可以：
 - 在github上创建[issue](https://github.com/f0rki/mapping-high-level-constructs-to-llvm-ir/issues)
 - fork并修改本文档。我们很乐意合并任何拉取请求或接受补丁。
## 致谢
对以下贡献者表示由衷的感谢：
 - Michael Rodler (current maintainer and back-porter from MeWeb markup to GitHub markdown).
 - Mikael Egevig (original author of the document itself - under the name of Mikael Lyngvig).
 - Dirkjan Ochtman (basically all the generator-related stuff by giving me some crucial samples).
 - Eli Bendersky (for small grammar fixes and mention of opt’s .bc output).
 - Sean Silva (for using proper C++11 lambda syntax in lambda samples).
 - Isaac Dupree (for correction the name of ‘@’: It is “at-sign”, not “ampersand”).
 - Wilfred Hughes (i became index and addition of separator between generator C++ and LLVM IR code).
 - Kenneth Ho (correction to C++11 lambda example and C++ exception handling sample).
 - Xing GUO (correction to various typos, updates to LLVM 8 syntax)
上面有你的名字吗，如果没有，那么欢迎为本文档做出贡献吧！