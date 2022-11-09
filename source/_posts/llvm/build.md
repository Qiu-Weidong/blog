---
title: 编译LLVM
date: 2022-05-01 22:49:21
tags:
  - llvm
  - Visual Studio
  - clang
categories:
  - llvm
description: 在windows和linux下编译LLVM和clang。
---
## Windows下编译LLVM
### 安装Visual Studio
首先需要下载`Visual Studio Installer`的安装程序`VisualStudioSetup.exe`，下载链接: [https://visualstudio.microsoft.com/zh-hans/downloads/](https://visualstudio.microsoft.com/zh-hans/downloads/)。选择社区版，点击`免费下载`。

下载后，双击运行`VisualStudioSetup.exe`。一路下一步即可安装`Visual Studio Installer`。

接下来，点击任务栏左侧的搜索图标，搜索`Visual Studio Installer`，找到并启动。然后点击`可用`标签，在列表中找到社区版的`Visual Studio`，写这篇博客的时候，最新的Visual Studio版本是`Visual Studio Community 2022`，点击安装，即可进入相关配置界面。

根据需要选择工作负荷和组件。对于编译LLVM的需求来说，需要安装`使用C++的桌面开发`这个工作负荷。勾选后，点击安装，即可进行安装，等待安装完成即可。

安装完成之后，再次点击任务栏左侧的搜索图标，搜索`Developer Powershell for VS 2022`，并启动它。也可以点击开始菜单，滚动到字母`V`，找到`Visual Studio 2022`文件夹，点击展开，找到`Developer Powershell for VS 2022`，点击打开。

`Developer Powershell for VS 2022`类似windows上的`Powershell`工具，不同之处在于`Developer Powershell for VS 2022`添加了`Visual Studio`的相关工具到环境变量。例如，对于`Visual Studio`中的`cl`工具，如果在普通的`Powershell`里面输入`cl`命令，会提示`无法将"cl"项识别为 cmdlet、函数、脚本文件或可运行程序的名称`，而在`Developer Powershell for VS 2022`则会输出如下信息:
```powershell
用于 x86 的 Microsoft (R) C/C++ 优化编译器 19.31.31107 版
版权所有(C) Microsoft Corporation。保留所有权利。

用法: cl [ 选项... ] 文件名... [ /link 链接选项... ]
```
因此，我们采用`Developer Powershell for VS 2022`作为编译LLVM的终端工具。

### 下载LLVM源码
使用`git`下载LLVM源代码，注意要禁用自动转译行结束符。
```powershell
git clone --config core.autocrlf=false https://github.com/llvm/llvm-project.git
```
或者点击链接[https://github.com/llvm/llvm-project/releases](https://github.com/llvm/llvm-project/releases)，直接下载需要版本的源代码。在编写这篇博客的时候，LLVM的最新版本是14.0.3 。

### 编译LLVM
打开`Developer Powershell for VS 2022`，进入到LLVM源码目录，这个源码目录是指有clang、llvm等子目录的目录。
新建一个文件夹用来存放编译结果，并进入新建的目录:
```powershell
mkdir build
cd build
```

使用`cmake`来生成相关的构建文件:
```powershell
cmake -G Ninja -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_TARGETS_TO_BUILD="X86" -DLLVM_ENABLE_PROJECTS="clang"  -DLLVM_OPTIMIZED_TABLEGEN=ON ../llvm
```

其中`-G Ninja`参数表示生成`Ninja`系统的构建文件，采用`Ninja`系统会有比较快的编译速度。如果要使用其他的构建系统，只需要在`-G`参数的后面指定要使用的系统即可。可选的构建系统有`Unix Makefiles`、`Visual Studio 15 VS2017`、`Visual Studio 16 VS2019`、`Xcode`等等。

`-DCMAKE_BUILD_TYPE=RELEASE`表示生成Release版本的LLVM，这种构建方式会进行优化，并且生成的目标文件体积会更小。如果不想生成数十GB的目标文件，请采用Release构建方式。如果需要调试，那么可以选用Debug构建方式。此外，还有RELWITHDEBINFO和MINSIZEREL方式的构建，RELWITHDEBINFO方式是使用调试符号的发布构建，而MINSIZEREL则是以优化文件大小为主的构建。

`-DLLVM_TARGETS_TO_BUILD="X86"`表示编译的目标平台是X86平台。如果你的电脑不是X86架构，或者你需要编译的LLVM在其他的机器上使用，请将它设置为相应的架构。可选的目标机器有**AArch64、AMDGPU、ARM、BPF、Hexagon、Lanai、Mips、MSP430、NVPTX、PowerPC、RISCV、Sparc、SystemZ、WebAssembly、X86、XCore**。

`-DLLVM_ENABLE_PROJECTS="clang"`表示我们除了编译LLVM以外，还要编译clang。如果还需要编译其他工具，则在后面添加，并用分号分割。比如，要编译clang和lldb，则需要设置为`-DLLVM_ENABLE_PROJECTS="clang;lldb"`。

`-DLLVM_OPTIMIZED_TABLEGEN=ON`表示对TABLEGEN开启优化，对于调试模式，这有利于提高编译速度。

另外一些可能需要修改的配置如下所示:

 - LLVM_ENABLE_EH=ON: 如果要启用异常，则配置

 - LLVM_ENABLE_RTTI=ON: 如果要启用RTTI

生成了构建文件之后，接下来进入编译。
{% note info simple %}
建议关闭所有的应用程序，只保留`Developer Powershell for VS 2022`。因为Ninja会使用几乎所有的CPU核，可能导致其他应用卡顿，这也是我们使用`Developer Powershell for VS 2022`而不是`Visual Studio IDE`来编译的原因。
{% endnote %}

运行编译命令:
```powershell
ninja 
```
经过漫长的等待，如果没有报错，则表示编译成功，进入安装过程。
使用以下命令测试是否成功编译:
```powershell
bin/clang --version
```
如果得到以下输出，表示clang编译成功。
```powershell
clang version 14.0.3
Target: i686-pc-windows-msvc
Thread model: posix
InstalledDir: path-to-llvm-source-code\build\bin
```
### 安装LLVM
以管理员方式重新打开`Developer Powershell for VS 2022`，并切换到之前的build目录。运行安装命令:
```powershell
ninja install
```
成功将llvm安装到我们的电脑里面。安装路径在`C:\Program Files (x86)\LLVM`或者`C:\Program Files\LLVM`。找到安装目录，将`C:\Program Files (x86)\LLVM\bin`和`C:\Program Files (x86)\LLVM\lib`添加到环境变量。并使用以下命令进行测试:
```powershell
clang --version
```
如果能得到相关clang的版本信息，则表示安装成功。
### 测试clang
新建一个cpp文件main.cpp。
```cpp
#include <iostream>

int main(int argc, const char ** argv) {
    std::cout << "Hello Clang World!" << std::endl;
}
```
使用clang编译该文件:
```powershell
clang main.cpp -o main.exe
```
编译得到可执行文件main.exe，运行它，得到输出:
```powershell
Hello Clang World!
```
## Linux下编译LLVM
### 安装编译器
需要安装gcc、g++、ninja、cmake等工具，一般linux系统会自带，如果没有，则使用apt安装即可，命令如下:
```bash
sudo apt install–y gcc g++ cmake ninja-build
```
### 下载LLVM源代码
这部分和windows下类似，使用如下所示git命令:
```bash
git clone https://github.com/llvm/llvm-project.git
```
同样地，也可以到[https://github.com/llvm/llvm-project/releases](https://github.com/llvm/llvm-project/releases)去下载相应代码。
### 编译LLVM
同windows下一样，进入源代码目录，新建build文件夹，然后进入build。
```bash
mkdir build
cd build
```
使用**cmake**来生成构建文件，推荐使用`Ninja`。
```bash
cmake -G Ninja -DCMAKE_BUILD_TYPE=RELEASE -DLLVM_TARGETS_TO_BUILD="X86" -DLLVM_ENABLE_PROJECTS="clang"  -DLLVM_OPTIMIZED_TABLEGEN=ON ../llvm
```
相关配置前面已经说明，这里不再重复。

接下来运行编译命令:
```bash
ninja
```

### 安装LLVM
编译完成后，执行安装命令即可:
```bash
sudo ninja build
```