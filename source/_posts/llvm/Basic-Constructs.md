---
title: 基本结构
date: 2022-06-09 14:09:58
tags:
  - llvm
categories:
  - llvm
---
在本章中，我们将了解几乎所有命令式/OOP 语言中最基本和最简单的结构。

## 全局变量
全局变量在 LLVM IR 中实现起来很简单。
```cpp
int variable = 21;

int main()
{
    variable = variable * 2;
    return variable;
}
```
转换为
```llvm
@variable = global i32 21

define i32 @main() {
    %1 = load i32, i32* @variable  ; load the global variable
    %2 = mul i32 %1, 2
    store i32 %2, i32* @variable   ; store instruction to write to global variable
    ret i32 %2
}
```
全局变量以 `@` 字符为前缀。 您可以看到，诸如 main 之类的函数也是 LLVM 中的全局变量。 请注意，LLVM 将全局变量视为指针； 因此，在访问全局变量的值时，必须使用 load 指令显式对全局变量进行解引用，同样，您必须使用 store 指令显式存储全局变量的值。 在这方面，LLVM IR 比 C 更接近于汇编。
## 局部变量
LLVM中有两种局部变量。
 - 临时变量或寄存器变量
 - 栈上分配的局部变量

寄存器变量可以通过为变量引入一个新符号的方式来实现。
```llvm
%reg = add i32 4, 2
```
栈上分配的局部变量可以使用`alloca`指令来实现。
```llvm
%stack = alloca i32
```
几乎每条指令都会返回一个值，该值通常分配给一个临时变量。 由于 LLVM IR 的 SSA 形式，临时变量只能分配一次。 以下代码片段会产生错误：
```llvm
%tmp = add i32 4, 2
%tmp = add i32 4, 1  ; Error here
```
为了满足SSA，可以对以上代码做如下修改。
```llvm
%tmp.0 = add i32 4, 2
%tmp.1 = add i32 4, 1  ; fine now
```
还可以进一步简化，如下所示。
```llvm
%0 = add i32 4, 2
%1 = add i32 4, 1
```
llvm允许定义任意多的局部变量，但机器上真实的寄存器数量却是有限的，因此，一些临时寄存器变量可能会被放在堆栈上。

请注意 `alloca` 产生一个指向已分配类型的指针。 与 LLVM 中的一般情况一样，您必须显式使用加载或存储指令来分别读取或写入值。

alloca 的使用允许一个巧妙的技巧，在某些情况下可以简化您的代码生成器。 诀窍是在堆栈上显式分配所有可变变量，包括参数，用适当的初始值初始化它们，然后在堆栈上进行操作，就好像这是您的最终目标一样。 诀窍是在优化阶段对您的代码运行“内存到寄存器提升”的pass。 这将使 LLVM 尽可能多地在寄存器中存储堆栈变量。 这样，您不必确保生成的程序是 SSA 形式，而是可以生成代码，而不必担心代码生成的这一方面。

## 常量
llvm中有两种类型的常量。
 - 不占用内存的常量。
 - 占用内存的常量。

前者总是由编译器内联扩展，因为没有与它们等效的 LLVM IR。 换句话说，编译器只需将常量值插入计算中使用的任何位置：
```llvm
%1 = add i32 %0, 17     ; 17 is an inlined constant
```
后者可以使用`constant`关键字来定义。
```llvm
@hello = internal constant [6 x i8] c"hello\00"
%struct = type { i32, i8 }
@struct_constant = internal constant %struct { i32 16, i8 4 }
```
这样的常量实际上是一个全局变量，它的可见性可以用 `private` 或 `internal` 来限制，这样它在当前模块之外是不可见的。
### 常量表达式
常量表达式的一个例子是 sizeof 风格的计算。 尽管编译器应该知道所有正在使用的东西的确切大小（对于静态检查的语言），但有时让 LLVM 为您计算出结构的大小会很方便。 这是通过以下一小段代码完成的：
```llvm
%Struct = type { i8, i32, i8* }
@Struct_size = constant i32 ptrtoint (%Struct* getelementptr (%Struct, %Struct* null, i32 1) to i32)
```
@Struct_size 现在将包含结构 %Struct 的大小。 诀窍是计算从零开始的数组中第二个元素的偏移量，从 null 开始，这样就可以得到结构的大小。
## 结构体
LLVM IR 已经包含了结构的概念，所以没有太多需要我们做的。
```C
struct Foo
{
  size_t x;
  double y;
};
```
只需丢弃实际的字段名称，然后用从零开始的数字进行索引：
```llvm
%Foo = type {
    i64,       ; index 0 = x
    double     ; index 1 = y
}
```
### 嵌套结构
嵌套结构也很简单。 它们的组成方式与 C/C++ 中的`struct`完全相同。
```C
struct FooBar
{
    Foo x;
    char* c;
    Foo* y;
}
```
```llvm 
%FooBar = type {
    %Foo,         ; index 0 = x
    i8*,          ; index 1 = c
    %Foo*         ; index 2 = y
}
```
### 不完整的结构类型
不完整类型对于隐藏给定结构具有哪些字段的详细信息非常有用。 可以制作一个设计良好的 C 接口，使结构的细节不会透露给客户端，因此客户端无法检查或修改结构内部的私有成员：
```c
void Bar(struct Foo *);
```
转换为llvm
```llvm 
%Foo = type opaque
declare void @Bar(%Foo)
```
### 访问结构成员
如前所述，在 LLVM IR 中，结构成员是通过索引而不是名称来引用的。 并且您在任何时候都不需要也不应该自己计算给定结构成员的偏移量。 getelementptr（简写为 GEP）指令可用于计算指向任何结构成员的指针，而没有开销（getelementptr 指令通常会缩放到实际的加载或存储指令中）。
现在假设我们有如下的C++结构体：
```cpp
struct Foo
{
    int a;
    char *b;
    double c;
};
```
这非常直接地映射到以下 LLVM 类型。 GEP 索引值见注释。
```llvm
%Foo = type {
    i32,        ; 0: a
    i8*,        ; 1: b
    double      ; 2: c
}
```
现在我们在堆栈上分配对象并访问成员 `b`，它位于索引 1 处，在 C++ 中具有 `char*` 类型。
```cpp
Foo foo;
char **bptr = &foo.b;
```
首先，在堆栈上使用 `alloca` 指令分配对象。 使用 GEP 指令计算成员`b`的指针。
```llvm
%foo = alloca %Foo
; char **bptr = &foo.b
%1 = getelementptr %Foo, %Foo* %foo, i32 0, i32 1
```
现在让我们看看如果我们创建一个 `Foo` 对象数组会发生什么。 考虑以下 C++ 片段：
```cpp
Foo bar[100];
bar[17].c = 0.0;
```
它将大致转换为以下 LLVM IR。 首先分配一个指向 100 个 Foo 对象的指针。 然后使用 GEP 指令检索数组中第 17 个条目的第二个元素。 这是在一条 GEP 指令中完成的：
```llvm 
; Foo bar[100]
%bar = alloca %Foo, i32 100
; bar[17].c = 0.0
%2 = getelementptr %Foo, %Foo* %bar, i32 17, i32 2
store double 0.0, double* %2
```
请注意，较新版本的 clang 将生成直接使用对数组类型的内置支持的代码。 这显式地将数组的长度与分配的对象相关联。 GEP 指令也可以有两个以上的索引来计算嵌套对象深处的地址。
```llvm
%bar = alloca [100 x %Foo]
%p = getelementptr [100 x %Foo], [100 x %Foo]* %bar, i64 0, i64 17, i32 2
store double 0.000000e+00, double* %p, align 8
```
强烈建议阅读有关 GEP 指令的 LLVM [文档](https://llvm.org/docs/LangRef.html#getelementptr-instruction)


## 类型转换
llvm中有9中不同的类型转换
 - Bitwise (类型转换)
 - 零扩展 (无符号数扩展)
 - 符号扩展 (有符号数扩展)
 - 截断
 - 浮点数扩展
 - 浮点数截断
 - 指针转换为整数
 - 整数转换为指针
 - Address-space casts (pointer casts)
### Bitwise Casts
按位强制转换 (`bitcast`) 重新解释给定的位模式，而不更改操作数中的任何位。 例如，您可以将指向字节的指针位转换为指向某个结构的指针，如下所示：
```C
typedef struct
{
    int a;
} Foo;

extern void *malloc(size_t size);
extern void free(void *value);

void allocate()
{
    Foo *foo = (Foo *) malloc(sizeof(Foo));
    foo.a = 12;
    free(foo);
}
```
转换为llvm：
```llvm
%Foo = type { i32 }

declare i8* @malloc(i32)
declare void @free(i8*)

define void @allocate() nounwind {
    %1 = call i8* @malloc(i32 4)
    %foo = bitcast i8* %1 to %Foo*
    %2 = getelementptr %Foo, %Foo* %foo, i32 0, i32 0
    store i32 12, i32* %2
    call void @free(i8* %1)
    ret void
}
```
### 零扩展
要向上转换一个无符号值，如下例所示：
```C
uint8 byte = 117;
uint32 word;

void main()
{
    /* The compiler automatically upcasts the byte to a word. */
    word = byte;
}
```
你可以使用`zext`指令来实现零扩展
```llvm
@byte = global i8 117
@word = global i32 0

define void @main() nounwind {
    %1 = load i8, i8* @byte
    %2 = zext i8 %1 to i32
    store i32 %2, i32* @word
    ret void
}
```
### 符号扩展
要向上转换有符号值，请将 `zext` 指令替换为 `sext` 指令，其他所有操作都与上一节中一样：
```llvm
@char = global i8 -17
@int  = global i32 0

define void @main() nounwind {
    %1 = load i8, i8* @char
    %2 = sext i8 %1 to i32
    store i32 %2, i32* @int
    ret void
}
```
### 截断
有符号和无符号整数都使用相同的指令 `trunc` 来减小相关数字的大小。 这是因为 LLVM IR 假定所有有符号整数值都是二进制补码格式，因此 `trunc` 足以处理这两种情况：
```llvm
@int = global i32 -1
@char = global i8 0

define void @main() nounwind {
    %1 = load i32, i32* @int
    %2 = trunc i32 %1 to i8
    store i8 %2, i8* @char
    ret void
}
```
### 浮点数扩展 
浮点数可以使用 `fpext` 指令进行扩展：
```C
float small = 1.25;
double large;

void main()
{
    /* The compiler inserts an implicit float upcast. */
    large = small;
}
```
```llvm
@small = global float 1.25
@large = global double 0.0

define void @main() nounwind {
    %1 = load float, float* @small
    %2 = fpext float %1 to double
    store double %2, double* @large
    ret void
}
```
### 浮点数截断 
同样地，浮点数可以使用`fptrunc`指令截断：
```llvm
@large = global double 1.25
@small = global float 0.0

define void @main() nounwind {
    %1 = load double, double* @large
    %2 = fptrunc double %1 to float
    store float %2, float* @small
    ret void
}
```
### 指针转换为整数 
指针不支持算术，在进行系统编程时有时需要。 LLVM 支持使用 `ptrtoint` 指令将指针类型转换为整数类型，[ptrtoint指令参考](https://llvm.org/docs/LangRef.html#ptrtoint-to-instruction)
### 整数转换为指针 
`inttoptr` 指令可以将整数转换为指针，[参考](https://llvm.org/docs/LangRef.html#inttoptr-to-instruction)
### Address-space casts
## 函数定义和声明
函数编译为llvm取决于一系列因素，包括使用的调用约定、函数是否具有异常感知能力以及函数是否在模块外公开可用。
### 简单公有函数
最基本的函数：
```c
int Bar(void)
{
    return 17;
}
```
转换为llvm：
```llvm
define i32 @Bar() nounwind {
    ret i32 17
}
```
### 简单私有函数
`static`函数是模块私有的函数，不能从外部引用：
```llvm
define private i32 @Foo() nounwind {
    ret i32 17
}
```
{% note blue 'fas fa-bullhorn' simple %}
请注意，llvm中的`public`和`private`并不能直接映射到 `C++` 中的`public`和`private`。 否则，一个 LLVM 模块中的两个 C++ 类可以相互调用私有方法，因为它们只是 LLVM 的模块级私有函数，而不是C++类的私有函数。
{% endnote %}
### 函数原型
一个函数原型的声明可以转换为llvm中的`declare`声明：
```C
int Bar(int value);
```
```llvm
declare i32 @Bar(i32 %value)
; 省略参数名称
declare i32 @Bar(i32)
```
### 具有可变数量参数的函数
要调用所谓的 vararg 函数，首先需要使用省略号 (...) 定义或声明它，然后需要使用特殊的函数调用语法，允许您显式列出参数的类型 被调用的函数。 这种“hack”的存在是为了允许覆盖对函数的调用，例如具有可变参数的函数。 请注意，您只需要指定一次返回类型，而不是两次，如果它是一个真正的强制转换：
```llvm
declare i32 @printf(i8*, ...) nounwind

@.textstr = internal constant [20 x i8] c"Argument count: %d\0A\00"

define i32 @main(i32 %argc, i8** %argv) nounwind {
    ; printf("Argument count: %d\n", argc)
    %1 = call i32 (i8*, ...) @printf(i8* getelementptr([20 x i8], [20 x i8]* @.textstr, i32 0, i32 0), i32 %argc)
    ret i32 0
}
```
### 函数重载
函数重载其实不是在 LLVM IR 层面上处理的，而是在源语言上处理的。 函数名称是错位的，因此它们会在函数名称中编码参数和返回值的类型。 对于 C++ 示例：
```cpp
int function(int a, int b) {
    return a + b;
}

double function(double a, double b, double x) {
    return a*b + x;
}
```
转换为llvm后，这是两个完全不同的函数，拥有不同的名称。
```llvm
define i32 @_Z8functionii(i32 %a, i32 %b) #0 {
; [...]
  ret i32 %5
}

define double @_Z8functionddd(double %a, double %b, double %x) #0 {
; [...]
  ret double %8
}
```


### 结构体作为参数和返回值并按值传递
类或结构通常按值传递，在传递对象时隐式克隆对象。 
```cpp
struct Point {
    double x;
    double y;
    double z;
};

Point add_points(Point a, Point b) {
  Point p;
  p.x = a.x + b.x;
  p.y = a.y + b.y;
  p.z = a.z + b.z;
  return p;
}
```
上面这个例子将会被编译为下面的llvm：
```llvm
%struct.Point = type { double, double, double }

define void @add_points(%struct.Point* noalias sret %agg.result,
                        %struct.Point* byval align 8 %a,
                        %struct.Point* byval align 8 %b) #0 {
; there is no alloca here for Point p;
; p.x = a.x + b.x;
  %1 = getelementptr inbounds %struct.Point, %struct.Point* %a, i32 0, i32 0
  %2 = load double, double* %1, align 8
  %3 = getelementptr inbounds %struct.Point, %struct.Point* %b, i32 0, i32 0
  %4 = load double, double* %3, align 8
  %5 = fadd double %2, %4
  %6 = getelementptr inbounds %struct.Point, %struct.Point* %agg.result, i32 0, i32 0
  store double %5, double* %6, align 8
; p.y = a.y + b.y;
  %7 = getelementptr inbounds %struct.Point, %struct.Point* %a, i32 0, i32 1
  %8 = load double, double* %7, align 8
  %9 = getelementptr inbounds %struct.Point, %struct.Point* %b, i32 0, i32 1
  %10 = load double, double* %9, align 8
  %11 = fadd double %8, %10
  %12 = getelementptr inbounds %struct.Point, %struct.Point* %agg.result, i32 0, i32 1
  store double %11, double* %12, align 8
; p.z = a.z + b.z;
  %13 = getelementptr inbounds %struct.Point, %struct.Point* %a, i32 0, i32 2
  %14 = load double, double* %13, align 8
  %15 = getelementptr inbounds %struct.Point, %struct.Point* %b, i32 0, i32 2
  %16 = load double, double* %15, align 8
  %17 = fadd double %14, %16
  %18 = getelementptr inbounds %struct.Point, %struct.Point* %agg.result, i32 0, i32 2
  store double %17, double* %18, align 8
; there is no real returned value, because the previous stores directly wrote
; to the caller allocated value via %agg.result
  ret void
}
```
我们可以看到该函数现在实际上返回了 `void` 并且添加了另一个参数。 第一个参数是指向结果的指针，由调用者分配。 该指针具有 `noalias` 属性，因为该函数的两个参数都不可能指向它。 `sret` 属性表明这是返回值。
参数具有 `byval` 属性，这表明它们是按值传递的结构。
让我们看看这个函数是如何被调用的。
```cpp
int main() {
  Point a = {1.0, 3.0, 4.0};
  Point b = {2.0, 8.0, 5.0};
  Point c = add_points(a, b);
  return 0;
}
```
编译得到的llvm
```llvm
define i32 @main() #1 {
; these are the a, b, c in the scope of main
  %a = alloca %struct.Point, align 8
  %b = alloca %struct.Point, align 8
  %c = alloca %struct.Point, align 8
; these are copies, which are passed as arguments
  %1 = alloca %struct.Point, align 8
  %2 = alloca %struct.Point, align 8
; copy the global initializer main::a to %a
  %3 = bitcast %struct.Point* %a to i8*
  call void @llvm.memcpy.p0i8.p0i8.i64(i8* %3, i8* bitcast (%struct.Point* @main.a to i8*), i64 24, i32 8, i1 false)
; copy the global initializer main::b to %b
  %4 = bitcast %struct.Point* %b to i8*
  call void @llvm.memcpy.p0i8.p0i8.i64(i8* %4, i8* bitcast (%struct.Point* @main.b to i8*), i64 24, i32 8, i1 false)
; clone a to %1
  %5 = bitcast %struct.Point* %1 to i8*
  %6 = bitcast %struct.Point* %a to i8*
  call void @llvm.memcpy.p0i8.p0i8.i64(i8* %5, i8* %6, i64 24, i32 8, i1 false)
; clone b to %1
  %7 = bitcast %struct.Point* %2 to i8*
  %8 = bitcast %struct.Point* %b to i8*
  call void @llvm.memcpy.p0i8.p0i8.i64(i8* %7, i8* %8, i64 24, i32 8, i1 false)
; call add_points with the cloned values
  call void @add_points(%struct.Point* sret %c, %struct.Point* byval align 8 %1, %struct.Point* byval align 8 %2)
  ; [...]
}
```
我们可以看到调用者，在我们的例子中是 `main`，为返回值 `%c` 分配空间，并且确保在通过引用实际传递参数之前克隆参数 `a` 和 `b` 。
### 异常感知函数
意识到自己是更大的异常处理方案的一部分的函数称为异常感知函数。 根据所采用的异常处理类型，该函数可以返回一个指向异常实例的指针，创建一个 `setjmp`/`longjmp` 帧，或者简单地指定 `uwtable` (用于 UnWind Table) 属性。 这些案例都将在下面的异常处理一章中详细介绍。
### 函数指针 
llvm中的函数指针和C/C++中类似：
```C
int (*Function)(char *buffer);
```
```llvm
@Function = global i32(i8*)* null
```
## 联合体
近年来，联合体越来越少见，使用起来非常危险。 尤其是没有选择器字段来指示联合的哪些变体有效的 C 变体。 有些人可能仍然有使用联合体的传统理由。 事实上，LLVM 根本不支持联合体：
```C
union Foo
{
    int a;
    char *b;
    double c;
};

Foo Union;
```
转换为llvm后：
```llvm
%union.Foo = type { double }
@Union = %union.Foo { 0.0 }
```
发生甚么事了？ 其他联合体成员去哪儿了？ 答案是在 LLVM 中没有联合。 只有结构体，结构体成员可以转换为前端想要将结构体成员转换为的任何类型。 因此，要从 LLVM IR 访问上述联合，您将使用 `bitcast` 指令将指向 "联合体" 的指针转换为您想要的任何指针：
```llvm
%1 = bitcast %union.Foo* @Union to i32*
store i32 1, i32* %1
%2 = bitcast %union.Foo* @Union to i8**
store i8* null, i8** %2
```
这可能看起来很奇怪，但事实是联合体只不过是一块使用不同的隐式指针强制转换访问的内存。 处理联合体时没有类型安全。
如果你想在你的前端语言中支持联合，你应该简单地分配联合的总大小（即最大成员的大小），然后根据需要生成代码来重新解释分配的内存。
### 带标记联合体
在 C 中处理联合时，通常会添加另一个表示联合内容的字段，因为不小心将 `double` 的字节解释为 `char*` 会产生灾难性的后果。
许多现代编程语言都具有类型安全的标记联合。 Rust 有枚举类型，可以选择包含值。 C++ 自 C++17 起具有变体类型。
考虑以下简短的 `rust` 程序，它定义了一个可以容纳三种不同原始类型的 `enum` 类型。
```rust
enum Foo {
    ABool(bool),
    AInteger(i32),
    ADouble(f64),
}

fn main() {
    let x = Foo::AInteger(42);
    let y = Foo::ADouble(1337.0);
    let z = Foo::ABool(true);

    if let Foo::ABool(b) = x {
        println!("A boolean! {}", b)
    }
    if let Foo::ABool(b) = y {
        println!("A boolean! {}", b)
    }
    if let Foo::ABool(b) = z {
        println!("A boolean! {}", b)
    }
}
```
`rustc` 生成类似于以下 LLVM IR 的内容来初始化 `Foo` 变量。
```llvm
; basic type definition
%Foo = type { i8, [8 x i8] }
; Variants of Foo
%Foo_ABool = type { i8, i8 }       ; tagged with 0
%Foo_AInteger = type { i8, i32 }   ; tagged with 1
%Foo_ADouble = type { i8, double } ; tagged with 2

; allocate the first Foo
%x = alloca %Foo
; pointer to the first element of type i8 (the tag)
%0 = getelementptr inbounds %Foo, %Foo* %x, i32 0, i32 0
; set tag to '1'
store i8 1, i8* %0
; bitcast Foo to the right Foo variant
%1 = bitcast %Foo* %x to %Foo_AInteger*
; store the constant '42'
%2 = getelementptr inbounds %Foo_AInteger, %Foo_AInteger* %1, i32 0, i32 1
store i32 42, i32* %2

; allocate and initialize the second Foo
%y = alloca %Foo
%3 = getelementptr inbounds %Foo, %Foo* %y, i32 0, i32 0
; this time the tag is '2'
store i8 2, i8* %3
; cast to variant and store double constant
%4 = bitcast %Foo* %y to %Foo_ADouble*
%5 = getelementptr inbounds %Foo_ADouble, %Foo_ADouble* %4, i32 0, i32 1
store double 1.337000e+03, double* %5
```
要检查给定的 `Foo` 对象是否是某个变体，必须检索标签并将其与所需值进行比较。
```llvm
%9 = getelementptr inbounds %Foo, %Foo* %x, i32 0, i32 0
%10 = load i8, i8* %9
; check if tag is '0', which identifies the variant Foo_ABool
%11 = icmp i8 %10, 0
br i1 %11, label %bb1, label %bb2

bb1:
  ; cast to variant
  %12 = bitcast %Foo* %x to %Foo_ABool*
  ; retrieve boolean
  %13 = getelementptr inbounds %Foo_ABool, %Foo_ABool* %12, i32 0, i32 1
  %14 = load i8, i8* %13,
  %15 = trunc i8 %14 to i1
  ; <...>
```