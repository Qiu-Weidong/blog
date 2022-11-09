---
title: 面向对象的结构
date: 2022-06-12 10:02:07
tags:
  - llvm 
categories:
  - llvm 
---
在本章中，我们将研究各种面向对象的结构，并了解它们如何映射到 LLVM IR。
## 类
一个类只不过是一个结构，它具有一组相关的函数，这些函数接受一个隐式的第一个参数，即指向该结构的指针。 因此，将一个类映射到 LLVM IR 非常简单：
```cpp
#include <stddef.h>

class Foo
{
public:
    Foo()
    {
        _length = 0;
    }

    size_t GetLength() const
    {
        return _length;
    }

    void SetLength(size_t value)
    {
        _length = value;
    }

private:
    size_t _length;
};
```
我们首先将这段代码转换成两个独立的部分：
 - 结构定义
 - 一系列的方法定义，包括构造函数

```llvm
; The structure definition for class Foo.
%Foo = type { i32 }

; The default constructor for class Foo.
define void @Foo_Create_Default(%Foo* %this) nounwind {
    %1 = getelementptr %Foo, %Foo* %this, i32 0, i32 0
    store i32 0, i32* %1
    ret void
}

; The Foo::GetLength() method.
define i32 @Foo_GetLength(%Foo* %this) nounwind {
    %1 = getelementptr %Foo, %Foo* %this, i32 0, i32 0
    %2 = load i32, i32* %1
    ret i32 %2
}

; The Foo::SetLength() method.
define void @Foo_SetLength(%Foo* %this, i32 %value) nounwind {
    %1 = getelementptr %Foo, %Foo* %this, i32 0, i32 0
    store i32 %value, i32* %1
    ret void
}
```
保证当对象创建的时候构造函数被调用一次。
```llvm
%foo = alloca %Foo
call void @Foo_Create_Default(%Foo* %foo)
```
## 虚函数
虚函数只不过是编译器控制的函数指针。 每个虚函数都记录在 `vtable` 中，它是给定类所需的所有函数指针的结构：
```cpp
class Foo
{
public:
    virtual int GetLengthTimesTwo() const
    {
        return _length * 2;
    }

    void SetLength(size_t value)
    {
        _length = value;
    }

private:
    int _length;
};

int main()
{
    Foo foo;
    foo.SetLength(4);
    return foo.GetLengthTimesTwo();
}
```
转换为llvm：
```llvm
%Foo_vtable_type = type { i32(%Foo*)* }

%Foo = type { %Foo_vtable_type*, i32 }

define i32 @Foo_GetLengthTimesTwo(%Foo* %this) nounwind {
    %1 = getelementptr %Foo, %Foo* %this, i32 0, i32 1
    %2 = load i32, i32* %1
    %3 = mul i32 %2, 2
    ret i32 %3
}

@Foo_vtable_data = global %Foo_vtable_type {
    i32(%Foo*)* @Foo_GetLengthTimesTwo
}

define void @Foo_Create_Default(%Foo* %this) nounwind {
    %1 = getelementptr %Foo, %Foo* %this, i32 0, i32 0
    store %Foo_vtable_type* @Foo_vtable_data, %Foo_vtable_type** %1
    %2 = getelementptr %Foo, %Foo* %this, i32 0, i32 1
    store i32 0, i32* %2
    ret void
}

define void @Foo_SetLength(%Foo* %this, i32 %value) nounwind {
    %1 = getelementptr %Foo, %Foo* %this, i32 0, i32 1
    store i32 %value, i32* %1
    ret void
}

define i32 @main(i32 %argc, i8** %argv) nounwind {
    %foo = alloca %Foo
    call void @Foo_Create_Default(%Foo* %foo)
    call void @Foo_SetLength(%Foo* %foo, i32 4)
    %1 = getelementptr %Foo, %Foo* %foo, i32 0, i32 0
    %2 = load %Foo_vtable_type*, %Foo_vtable_type** %1
    %3 = getelementptr %Foo_vtable_type, %Foo_vtable_type* %2, i32 0, i32 0
    %4 = load i32(%Foo*)*, i32(%Foo*)** %3
    %5 = call i32 %4(%Foo* %foo)
    ret i32 %5
}
```
请注意，一些 C++ 编译器将 `_vtable` 存储在结构中的负偏移量处，这样 `memset(this, 0, sizeof(*this))` 之类的东西就可以工作，即使在 OOP 上下文中应始终避免使用此类命令。
### RUST trait和虚函数表
与 C++ 相比，Rust 确实具有完全不同的对象模型。 但是，当涉及到动态调度的低级细节时，它们非常相似。 我们将探讨 [rust 文档](https://doc.rust-lang.org/book/ch17-02-trait-objects.html)中的一个示例，以及 rustc 编译器发出什么样的 llvm IR。 rust 和 C++ 都使用虚拟方法表进行动态调度。 但是，在 rust 中，高级语言中没有虚拟方法之类的东西。 相反，我们可以为我们的数据类型实现trait，然后实现一个接口，该接口接受所有实现此特征的数据类型并动态分派到正确的特征实现(即下面示例中的 `dyn trait` 语法)。 为了便于参考，这里给出了完整的示例：
```rust
pub trait Draw {
    fn draw(&self);
}

pub struct Screen {
    pub components: Vec<Box<dyn Draw>>,
}

impl Screen {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw();
        }
    }
}

pub struct Button {
    pub width: u32,
    pub height: u32,
    pub label: String,
}

impl Draw for Button {
    fn draw(&self) {
        // code to actually draw a button
    }
}

pub struct SelectBox {
    width: u32,
    height: u32,
    options: Vec<String>,
}

impl Draw for SelectBox {
    fn draw(&self) {
        // code to actually draw a select box
    }
}

fn main() {
    let screen = Screen {
        components: vec![
            Box::new(SelectBox {
                width: 75,
                height: 10,
                options: vec![
                    String::from("Yes"),
                    String::from("Maybe"),
                    String::from("No"),
                ],
            }),
            Box::new(Button {
                width: 50,
                height: 10,
                label: String::from("OK"),
            }),
        ],
    };

    screen.run();
}

```
在这里，编译器必须在运行时动态决定执行哪个函数。 编译器只知道存储在向量中的对象满足 Draw trait。 将对象包装在 `Box` 中本质上是将对象放在堆上(有点类似于 C++ 中的 `unique_ptr`)并有效地允许我们放置 trait 对象(即本例中的 `dyn Drawable` ) 在向量中。
```llvm
; test::Screen::run
; Function Attrs: nonlazybind uwtable
define void @"Screen::run"(%Screen* %self) {
start:

;; (omitting the initial prologue and setup code)
;; this is the start of the for loop in Screen::run calling the next method
;; on the iterator for the first time and checking whether it is None (or
;; null in llvm here)
;; %5 contains the pointer to the first component in the vector here
  %6 = icmp eq i64* %5, null
  br i1 %6, label %end, label %forloop

end:                                              ; preds = %forloop, %start
  ret void

forloop:                                          ; preds = %start, %forloop
  %7 = phi i64* [ %next_component, %forloop ], [ %5, %start ]
;; here the boxed pointer is retrieved and dereferenced to retrieve the
;; vtable pointer
  %8 = bitcast i64* %7 to {}**
  %self_ptr = load {}*, {}** %8
  %9 = getelementptr inbounds i64, i64* %7, i64 1
  %vtable_ptr = bitcast i64* %9 to void ({}*)***
  %vtable = load void ({}*)**, void ({}*)*** %vtable_ptr
;; 3 is the index into the vtable struct, which refers to the draw implementation for this particular struct
  %trait_method_ptr = getelementptr inbounds void ({}*)*, void ({}*)** %vtable, i64 3
  %trait_method = load void ({}*)*, void ({}*)** %vmethod
;; indirect call to trait method
  call void %trait_method({}* %self_ptr)

;; retrieve the next object
  %next_component = call i64* @"<core::slice::iter::Iter<T> as core::iter::traits::iterator::Iterator>::next"({ i64*, i64* }* %iter)
  %14 = icmp eq i64* %next_component, null
  br i1 %14, label %end, label %forloop
}
```
在 llvm 模块的全局变量中，我们可以看到如下所示的 虚函数表。 `Button` 和 `SelectBox` 都有关联的虚函数表。
```llvm
@vtable.screen = private unnamed_addr constant
  ;; the Type of the constant vtable structure
  { void (%SelectBox*)*, i64, i64, void (%SelectBox*)* }
  {
    ;; first entry is the function to drop the object
    void (%SelectBox*)* @"core::ptr::drop_in_place<test::SelectBox>",  ;; destructor
    i64 32, ;; size
    i64 8,  ;; alignment
    ;; last in the vtable is the pointer to the SelectBox::draw implementation
    void (%SelectBox*)* @"<test::SelectBox as test::Draw>::draw"
  }

;; the vtable for Button is structured basically the same
@vtable.button = private unnamed_addr constant
    { void (%Button*)*, i64, i64, void (%Button*)* }
    {
        void (%Button*)* @"core::ptr::drop_in_place<test::Button>",
        i64 32, i64 8,
        void (%Button*)* @"<test::Button as test::Draw>::draw"
    }
```
旧版本的 rust 书还对 rust 中的 vtables 如何工作进行了出色的简洁描述。 似乎较新的版本在内部遵循相同的模式，尽管这已从官方 rust book 中删除。
这篇[博文](https://alschwalm.com/blog/static/2017/03/07/exploring-dynamic-dispatch-in-rust/)更详细地解释了虚函数表和动态调度以及它们在 rust 与 C++ 中的区别。

## 单继承
单继承非常简单：每个“结构”(类)在内存中按声明顺序依次排列。
```cpp
class Base
{
public:
    void SetA(int value)
    {
        _a = value;
    }

private:
    int _a;
};

class Derived: public Base
{
public:
    void SetB(int value)
    {
        SetA(value);
        _b = value;
    }

protected:
    int _b;
}
```

在这里，`a` 和 `b` 将在内存中彼此跟随，因此从类继承只需将基类声明为继承类中的第一个成员：

```llvm
%Base = type {
    i32         ; '_a' in class Base
}

define void @Base_SetA(%Base* %this, i32 %value) nounwind {
    %1 = getelementptr %Base, %Base* %this, i32 0, i32 0
    store i32 %value, i32* %1
    ret void
}

%Derived = type {
    i32,        ; '_a' from class Base
    i32         ; '_b' from class Derived
}

define void @Derived_SetB(%Derived* %this, i32 %value) nounwind {
    %1 = bitcast %Derived* %this to %Base*
    call void @Base_SetA(%Base* %1, i32 %value)
    %2 = getelementptr %Derived, %Derived* %this, i32 0, i32 1
    store i32 %value, i32* %2
    ret void
}
```
如上，为派生类声明一个基类的成员变量即可。

然后编译器必须在派生类被引用为其基类时插入适当的类型转换，如上所示，使用 `bitcast` 运算符。
## 多继承
多重继承也没有那么难，只是在每个派生类内部按顺序排列多个继承的“结构”，同时考虑到多次继承的数据成员的重复性。
{% note warning modern %}
**警告**：本章目前完全是伪造的，因为它基本上将非虚拟多重继承视为虚拟。 如果您想完成它，请随时分叉和修复。 问题是 SetB() 和 SetC() 设置器需要以某种方式考虑 BaseB::SetB() 考虑中使用的每个活动数据成员的偏移量。
{% endnote %}

```cpp
class BaseA
{
public:
    void SetA(int value)
    {
        _a = value;
    }

private:
    int _a;
};

class BaseB: public BaseA
{
public:
    void SetB(int value)
    {
        SetA(value);
        _b = value;
    }

private:
    int _b;
};

class Derived:
    public BaseA,
    public BaseB
{
public:
    void SetC(int value)
    {
        SetB(value);
        _c = value;
    }

private:
    // Derived now has two '_a' members and one '_b' member.
    int _c;
};
```
等价的llvm ir：
```llvm
%BaseA = type {
    i32         ; '_a' from BaseA
}

define void @BaseA_SetA(%BaseA* %this, i32 %value) nounwind {
    %1 = getelementptr %BaseA, %BaseA* %this, i32 0, i32 0
    store i32 %value, i32* %1
    ret void
}

%BaseB = type {
    i32,        ; '_a' from BaseA
    i32         ; '_b' from BaseB
}

define void @BaseB_SetB(%BaseB* %this, i32 %value) nounwind {
    %1 = bitcast %BaseB* %this to %BaseA*
    call void @BaseA_SetA(%BaseA* %1, i32 %value)
    %2 = getelementptr %BaseB, %BaseB* %this, i32 0, i32 1
    store i32 %value, i32* %2
    ret void
}

%Derived = type {
    i32,        ; '_a' from BaseA
    i32,        ; '_a' from BaseB
    i32,        ; '_b' from BaseB
    i32         ; '_c' from Derived
}

define void @Derived_SetC(%Derived* %this, i32 %value) nounwind {
    %1 = bitcast %Derived* %this to %BaseB*
    call void @BaseB_SetB(%BaseB* %1, i32 %value)
    %2 = getelementptr %Derived, %Derived* %this, i32 0, i32 2
    store i32 %value, i32* %2
    ret void
}
```
然后，只要将 `baseB` 作为 `BaseB` 的实例引用，编译器就会提供所需的类型转换和指针算术。 请注意，它所需要的只是从一个类到另一个类的位转换以及对 `getelementptr` 的最后一个参数的调整。
## 虚拟继承
虚拟继承实际上非常简单，因为它要求将相同的基类合并到一个实例中。
```cpp
class BaseA
{
public:
    int a;
};

class BaseB: public BaseA
{
public:
    int b;
};

class BaseC: public BaseA
{
public:
    int c;
};

class Derived:
    public virtual BaseB,
    public virtual BaseC
{
    int d;
};
```

`Derived` 将只包含一个 `BaseA` 实例，即使它的继承图指示它应该有两个实例。 结果如下所示：
```cpp
class Derived
{
public:
    int a;
    int b;
    int c;
    int d;
};
```
因此，`a` 的第二个实例被默默地忽略，因为它会导致 `BaseA` 的多个实例存在于 `Derived` 中，这显然会导致很多混乱和歧义。

## 接口
接口只不过是没有数据成员的基类，其中所有方法都是纯虚拟的（即没有主体）。

因此，我们已经描述了如何将接口转换为 LLVM IR——其完成方式与将虚拟成员函数转换为 LLVM IR 完全相同。
## 装箱和拆箱
装箱是将非对象原始值转换为对象的过程。 听起来很简单。 您创建一个包装类，您可以用非对象值实例化和初始化它：

拆箱是装箱的反面：您通过从盒子对象中检索装箱值将完整对象降级为纯标量值。

重要的是要注意，对装箱值的更改不会影响原始值，反之亦然。 下面的代码说明了这两个步骤：
```llvm
@Boxee = global i32 17

%Integer = type { i32 }

define void @Integer_Create(%Integer* %this, i32 %value) nounwind {
    ; you might set up a vtable and associated virtual methods here
    %1 = getelementptr %Integer, %Integer* %this, i32 0, i32 0
    store i32 %value, i32* %1
    ret void
}

define i32 @Integer_GetValue(%Integer* %this) nounwind {
    %1 = getelementptr %Integer, %Integer* %this, i32 0, i32 0
    %2 = load i32, i32* %1
    ret i32 %2
}

define i32 @main() nounwind {
    ; box @Boxee in an instance of %Integer
    %1 = load i32, i32* @Boxee
    %2 = alloca %Integer
    call void @Integer_Create(%Integer* %2, i32 %1)

    ; unbox @Boxee from an instance of %Integer
    %3 = call i32 @Integer_GetValue(%Integer* %2)

    ret i32 0
}
```

## 类等价测试
有两种方式完成类等价测试：
 - 如果可以保证每个类都有一个唯一的 `vtable`，则可以简单地比较指向 `vtable` 的指针。
 - 如果您不能保证每个类都有一个唯一的 `vtable`(因为链接器可能已合并了不同的 `vtable`)，则需要向 `vtable` 添加一个唯一字段，以便您可以进行比较。

第一个变体大致如下(假设相同的字符串不会被编译器合并，大多数情况下都是这样)：
```
bool equal = (typeid(first) == typeid(other));
```


