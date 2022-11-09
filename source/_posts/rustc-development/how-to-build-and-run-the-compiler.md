---
title: 如何构建并运行编译器
date: 2022-08-05 11:18:01
tags:
  - rust
categories:
  - rust
---
由于构建需要用到`x.py`工具，因此请确保你的计算机上已经安装有python。

有关如何安装Python和其他先决条件的说明，请参阅下一页。

## 获取源代码
源代码放在仓库`rust-lang/rustc`中。包含编译器、标准库(core、alloc、test、proc_macro等)以及一堆工具(比如rustdoc、自举设施等等)。

第一步自然就是克隆rustc仓库:
```powershell
git clone https://github.com/rust-lang/rust.git
cd rust
```
还有 LLVM、clippy、miri 等子模块。构建工具会自动为您克隆和同步这些。 但是，如果您愿意，可以执行以下操作：
```powershell
# first time 将子模块下载下来
git submodule update --init --recursive

# subsequent times (to pull new commits)
git submodule update
```
## 创建config.toml文件
首先，运行 `./x.py setup`。 这将进行一些初始化并为您创建一个具有合理默认值的 config.toml。 这些默认值是通过配置文件设置间接指定的，该配置文件指向 `src/bootstrap/defaults` 中的 TOML 文件之一。

或者，您可以手动编写 `config.toml`。 有关所有可用设置及其说明，请参见 `config.toml.example`。 以下设置特别有趣，`config.toml.example` 有完整的解释。

你可能会修改如下一些设置(以及其他设置，如llvm.ccache):
```yml
[llvm]
# Whether to use Rust CI built LLVM instead of locally building it.
download-ci-llvm = true     # Download a pre-built LLVM?
assertions = true           # LLVM assertions on?
ccache = "/path/to/ccache"  # Use ccache when building LLVM?

[rust]
debug-logging = true        # Leave debug! and trace! calls in rustc?
incremental = true          # Build rustc with incremental compilation?

```
如果设置 download-ci-llvm = true，在某些情况下，例如更新 rustc 使用的 LLVM 版本时，您可能需要暂时禁用此功能。 有关更多信息，请参阅[更新llvm](https://rustc-dev-guide.rust-lang.org/backend/updating-llvm.html#feature-updates)部分。

如果您已经构建了 rustc 并且您更改了与 LLVM 相关的设置，那么您可能必须执行 `rm -rf build` 才能使后续配置更改生效。 请注意，`./x.py clean` 不会导致 LLVM 的重建。

## 什么是 `x.py`?
`x.py` 是用于在 rustc 存储库中编排工具的脚本。 它是可以构建文档、运行测试和编译 rustc 的脚本。 它是现在构建 rustc 的首选方式，它取代了以前的旧 makefile。 以下是利用 `x.py` 以有效处理各种常见任务的不同方法。

本章重点介绍提高生产力的基础知识，但如果您想了解有关 `x.py` 的更多信息，请在[此处](https://github.com/rust-lang/rust/blob/master/src/bootstrap/README.md)阅读其 README.md。 要了解有关引导过程以及为什么需要 `x.py` 的更多信息，请阅读[本章](https://rustc-dev-guide.rust-lang.org/building/bootstrapping.html)。

### 运行 `x.py` 稍微方便一些
在 `src/tools/x` 中有一个包含 `x.py` 的二进制文件，称为`x`。 它所做的只是运行 `x.py`，但它可以在系统范围内安装并从分支的任何子目录运行。 它还查找要使用的适当版本的 python。

你可以使用命令 `cargo install --path src/tools/x`来安装他。



