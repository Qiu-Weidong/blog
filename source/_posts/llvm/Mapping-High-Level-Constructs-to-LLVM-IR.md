---
title: 将高级语言的结构映射到LLVM IR
date: 2022-06-08 15:04:52
tags:
  - llvm 
categories:
  - llvm
---
本文翻译自 *Mapping High Level Constructs to LLVM IR*，原文连接[https://mapping-high-level-constructs-to-llvm-ir.readthedocs.io/en/latest/README.html](https://mapping-high-level-constructs-to-llvm-ir.readthedocs.io/en/latest/README.html)。

## 快速入门
在阅读本文档之前，你需要了解以下一些信息。
 - LLVM IR不是机器码，而是一种介于汇编语言和高级语言之间的一种中间语言。因此，它既具有部分高级语言的特点(如函数和强类型)，同时也具有部分汇编语言的特点(如分支和基本块)。
 - LLVM IR是强类型的，当出现错误的时候会告知用户。
 - LLVM IR不区分有符号整数和无符号整数。
 - LLVM IR假设二进制补码有符号整数，因此说 `trunc` 在有符号和无符号整数上同样适用。
 - 全局符号以 `@` 开头。
 - 局部符号以 `%` 开头。
 - 所有符号都必须声明或者定义。
 - 不要担心 LLVM IR 在表达某些东西时有时会显得有些冗长； 优化器将确保输出得到很好的优化，您经常会看到两个或三个 LLVM IR 指令被合并为一条机器代码指令。
 - 如有疑问，请参阅[Language Reference](http://llvm.org/docs/LangRef.html)。 如果Language Reference 与本文档有冲突，则本文档有误！ 请在 github 上提出问题。
 - 所有 LLVM IR 示例都没有数据布局和目标三元组。 您可以假设它通常是 x86 或 x86_64。
 - 本文档的原始版本是不久前编写的，因此 LLVM IR 的某些片段可能无法再与最新的 LLVM/clang 版本一起编译。 如果遇到这种情况，请在 github 提交错误报告。

## 常用工具
| 名称    | 功能      | 输入文件后缀 | 输出文件后缀 | 参数 |
| ------  | ------    | ------      | -----       | ------ | 
| clang   | C编译器   | .c          | .ll         | -emit-llvm -S |
| clang++ | C++编译器 | .cpp        | .ll         |-emit-llvm -S |
| opt|优化器|.bc/.ll|.bc| |
|llvm-dis|反汇编|.bc|.ll| |
|llc|IR编译器|.ll|.s| |

在您尝试生成或编写 LLVM IR 时，您可能希望将选项 `-fsanitize=undefined` 添加到 Clang/Clang++。 此选项使 Clang/Clang++ 在通常会输出 ud2 指令的地方插入运行时检查。 如果您碰巧生成未定义的 LLVM IR，这可能会为您节省一些麻烦。 请注意，此选项仅适用于 C 和 C++ 编译器。


