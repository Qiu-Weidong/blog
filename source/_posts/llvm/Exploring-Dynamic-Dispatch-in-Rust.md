---
title: 探索 Rust 中的动态调度
date: 2022-06-14 15:44:20
tags:
  - llvm 
  - rust 
categories:
  - [llvm]
  - [rust] 
---
本文档翻译自博客[Exploring Dynamic Dispatch in Rust](https://alschwalm.com/blog/static/2017/03/07/exploring-dynamic-dispatch-in-rust/)

我是 `rust` 世界的新手(尽管到目前为止我很喜欢 `rust` )，所以如果我犯了技术错误，请告诉我，我会尽力纠正它们。 现在让我们开始吧。
我研究动态调度的真正动机可以在下面的代码片段中看到。 假设我想创建一个包含特征对象向量的结构 `CloningLab`(在本例中为 `Mammal`)：
```rust
struct CloningLab {
    subjects: Vec<Box<Mammal>>,
}

trait Mammal {
    fn walk(&self);
    fn run(&self);
}

#[derive(Clone)]
struct Cat {
    meow_factor: u8,
    purr_factor: u8
}

impl Mammal for Cat {
    fn walk(&self) {
        println!("Cat::walk");
    }
    fn run(&self) {
        println!("Cat::run")
    }
}
```


这工作正常。 您可以遍历主题向量并按照您的预期调用 run 或 walk。 但是，当您尝试向 trait 对象添加额外的 trait 时，代码就会崩溃，例如：

```rust
struct CloningLab {
    subjects: Vec<Box<Mammal + Clone>>,
}

impl CloningLab {
    fn clone_subjects(&self) -> Vec<Box<Mammal + Clone>> {
        self.subjects.clone()
    }
}
```

会输出以下的错误信息：
```
error[E0225]: only the builtin traits can be used as closure or object bounds
 --> test1.rs:3:32
  |
3 |     subjects: Vec<Box<Mammal + Clone>>,
  |                                ^^^^^ non-builtin trait used as bounds
```
我发现这很令人惊讶。 在我看来，具有多个边界的特征对象类似于 C++ 中的多重继承。 我希望该对象对每个“基础”都有多个 vpointer，并通过适当的 vpointer 进行调度。 鉴于 rust 仍然是一门年轻的语言，我可以理解为什么开发人员可能不想立即引入这种复杂性（永远被糟糕的设计所困将是高昂的代价而回报却很少），但我想弄清楚如何 这样的系统可能工作（或不工作）。





