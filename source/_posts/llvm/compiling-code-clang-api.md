---
title: 使用clang API来编译代码
date: 2022-08-10 13:40:08
tags:
  - llvm
  - clang
categories:
  - llvm
---
这篇博客翻译自[https://fdiv.net/2012/08/15/compiling-code-clang-api](https://fdiv.net/2012/08/15/compiling-code-clang-api)。


朋友，你有尝试过使用clang吗？clang是一个开源的编译器，正处于活跃的开发当中。clang的目标是代替GCC来编译C、C++以及Objective-C。和GCC相比，clang更快，并且能够生成相对更快的代码，还可以输出更多有用的错误信息。

如果你想要以编程的方式来编译代码，clang是一个更好的选择。和GCC不同，clang既是一个工具也是一系列的API，这使得clang的源代码能够更容易被理解并复用。而且，Clang 是在 BSD 许可下分发的，对于我们这些从事与 GCC 的 GPL 许可不兼容的项目的人来说无疑是一个好消息。

Kosada正在进行一个很酷的项目，这个项目建立在clang以及其底层的llvm框架之上。在使用clang的过程当中，我看到了编写代码来完成其他代码的编译工作是多么的简单。真的，现在回想起来真的很简单。我写的代码很简单，但是我花了很多时间挖掘 Clang 源代码来弄清楚要写什么。所以这是我对 Clang 社区的第一个贡献：两个使用 Clang API 以编程方式构建代码的示例。这些示例编译的程序是 libcurl 示例之一，getinmemory.c。 我选择它是因为它演示了包含头文件和链接一个库。

这些示例参考了 Clang 源代码。 你可以在这里下载。 我使用的是 3.1 版。

您可以在此处下载示例代码。


## 将一个源文件编译为可执行文件的示例
你有一个`a.c`的源文件，现在将它编译并链接为一个可执行文件。

简单地说，你需要这样做：先创建一个`Driver`对象，并且传递一系列参数——这些参数和你使用命令行运行clang的参数相同。告诉driver构建一个`Compilation`对象并执行之。恭喜，你方才编译并链接了一个C源文件。

这基本上就是在命令行上运行 clang 时调用的代码所做的事情。在clang的源代码中，这些步骤出现在`tools/driver/driver.cpp`中。下面的例子(build_executable.cpp)是它的超简化版。

首先需要给`Driver`设置参数:
```cpp
// 源文件的路径
string inputPath = "getinmemory.c";
 
// 输出可执行文件的路径
string outputPath = "getinmemory";
 
// clang的路径 (比如 /usr/local/bin/clang)
llvm::sys::Path clangPath = llvm::sys::Program::FindProgramByName("clang");
 
// 需要传递给clang driver的参数:
//    clang getinmemory.c -lcurl -v
vector<const char *> args;
args.push_back(clangPath.c_str());
args.push_back(inputPath.c_str());
args.push_back("-l");
args.push_back("curl");
```
`Driver`需要一个`DiagnosticsEngine `来报告错误，创建一个吧。
```cpp
clang::TextDiagnosticPrinter *DiagClient = new clang::TextDiagnosticPrinter(llvm::errs(), clang::DiagnosticOptions());
clang::IntrusiveRefCntPtr<clang::DiagnosticIDs> DiagID(new clang::DiagnosticIDs());
clang::DiagnosticsEngine Diags(DiagID, DiagClient);
```
创建`Driver`自身:
```cpp
clang::driver::Driver TheDriver(args[0], llvm::sys::getDefaultTargetTriple(), outputPath, true, Diags);
```
`Driver`不知道如何完成编译和链接代码的繁重工作，而是更多的承担着项目管理者的角色。它找出需要完成的任务，并告诉 Clang 的其他部分或其他工具（如 ld）来完成这些任务。任务列表封装在一个`Compilation`对象中，构建并执行之。
```cpp
// Create the set of actions to perform
clang::OwningPtr<clang::driver::Compilation> C(TheDriver.BuildCompilation(args));
 
// Carry out the actions
int Res = 0;
const clang::driver::Command *FailingCommand = 0;
if (C)
    Res = TheDriver.ExecuteCompilation(*C, FailingCommand);
```
如果执行出错，可以打印错误:
```cpp
if (Res < 0)
    TheDriver.generateCompilationDiagnostics(*C, FailingCommand);
```
### 福利:打印编译的任务
如果您想知道 Compilation 对象中的那些“任务”到底是什么，您可以像这样打印它们:
```cpp
TheDriver.PrintActions(*C);
```
会得到类似如下的输出:
```
0: input, "getinmemory.c", c
1: preprocessor, {0}, cpp-output
2: compiler, {1}, assembler
3: assembler, {2}, object
4: input, "curl", object
5: linker, {3, 4}, image
6: bind-arch, "x86_64", {5}, image
```
### 福利: 打印"verbose"信息来帮助调试
无论是在命令行上还是通过 Clang API 运行 clang，您都可以通过传递 -v 标志打印额外的信息来帮助您进行调试。
```cpp      
args.push_back("-v");      // verbose
```
你会得到类似如下输出:
```
clang version 3.1 (branches/release_31)
Target: x86_64-apple-darwin10.8.0
Thread model: posix
 "/usr/local/Cellar/llvm/3.1/bin/clang" -cc1 -triple x86_64-apple-macosx10.6.0 -emit-obj -mrelax-all -disable-free -main-file-name getinmemory.c -pic-level 2 -mdisable-fp-elim -masm-verbose -munwind-tables -target-cpu core2 -target-linker-version 97.17 -v -resource-dir /usr/local/Cellar/llvm/3.1/bin/../lib/clang/3.1 -fmodule-cache-path /var/folders/l0/l0JTY1yrHVyI-wLWRDrCW++++TI/-Tmp-/clang-module-cache -fdebug-compilation-dir "/Users/jaymie/kosada/fdiv/Clang API" -ferror-limit 19 -fmessage-length 111 -stack-protector 1 -mstackrealign -fblocks -fobjc-dispatch-method=mixed -fobjc-default-synthesize-properties -fdiagnostics-show-option -fcolor-diagnostics -o /var/folders/l0/l0JTY1yrHVyI-wLWRDrCW++++TI/-Tmp-/getinmemory-azlq7U.o -x c getinmemory.c
clang -cc1 version 3.1 based upon LLVM 3.1 default target x86_64-apple-darwin10.8.0
#include "..." search starts here:
#include <...> search starts here:
 /usr/local/include
 /usr/local/Cellar/llvm/3.1/bin/../lib/clang/3.1/include
 /usr/include
 /System/Library/Frameworks (framework directory)
 /Library/Frameworks (framework directory)
End of search list.
 "/usr/bin/ld" -dynamic -arch x86_64 -macosx_version_min 10.6.0 -o getinmemory -lcrt1.10.6.o /var/folders/l0/l0JTY1yrHVyI-wLWRDrCW++++TI/-Tmp-/getinmemory-azlq7U.o -lcurl -lSystem
```


输出显示`Driver`正在调用 clang 进行编译和 ld 进行链接。 如您所见，除了我们传入的参数之外，`Driver`还为每次调用添加了自己的参数。-v 标志显示了编译器和链接器是如何被调用的。

### 福利: 构建一个C++文件
如果你正在编译的文件是 C++ 而不是 C，你可以告诉 Driver 像 clang++ 而不是 clang：
```cpp
TheDriver.CCCIsCXX = true;
```


