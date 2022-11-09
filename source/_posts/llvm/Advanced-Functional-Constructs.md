---
title: 高级结构
date: 2022-06-12 10:12:38
tags:
  - llvm 
categories:
  - llvm 
---

在本章中，我们将研究各种非常有用且使用越来越广泛的非 OOP 结构。
## λ函数
lambda 函数是一个匿名函数，它可以自由引用包含它的函数中的局部变量(包括参数变量)。 除了编译器负责为 lambda 函数生成内部名称以外，Lambda 的实现与 Pascal 的嵌套函数一样。 有几种不同的方法可以实现 lambda 函数(更多相关信息，请参阅 [Wikipedia on Nested Functions](https://mapping-high-level-constructs-to-llvm-ir.readthedocs.io/en/latest/advanced-constructs/en.wikipedia.org/wiki/Nested_function))。
```cpp
int foo(int a)
{
  auto function = [a](int x) { return x + a; };
  return function(10);
}
```
这里的问题是 lambda 函数引用了调用者的一个局部变量 `a`。 这可以通过将局部变量作为隐式参数传递给 lambda 函数来轻松解决：
```llvm
define internal i32 @lambda(i32 %a, i32 %x) {
	%1 = add i32 %a, %x
	ret i32 %1
}

define i32 @foo(i32 %a) {
	%1 = call i32 @lambda(i32 %a, i32 10)
	ret i32 %1
}
```
或者，如果 lambda 函数使用多个变量，您可以将它们包装在一个结构中，然后将该结构体的指针传递给 lambda 函数：
```cpp
extern int integer_parse();

int foo(int a, int b)
{
  int c = integer_parse();
  auto function = [a, b, c](int x) { return (a + b - c) * x; };
  return function(10);
}
```
转换为llvm：
```llvm
; ModuleID = 'lambda_func_1_cleaned.ll'
source_filename = "lambda_func_1_cleaned.ll"
target datalayout = "e-m:e-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

%lambda_args = type { i32, i32, i32 }

declare i32 @integer_parse()

define i32 @lambda(%lambda_args* %args, i32 %x) {
  %1 = getelementptr %lambda_args, %lambda_args* %args, i32 0, i32 0
  %a = load i32, i32* %1
  %2 = getelementptr %lambda_args, %lambda_args* %args, i32 0, i32 1
  %b = load i32, i32* %2
  %3 = getelementptr %lambda_args, %lambda_args* %args, i32 0, i32 2
  %c = load i32, i32* %3
  %4 = add i32 %a, %b
  %5 = sub i32 %4, %c
  %6 = mul i32 %5, %x
  ret i32 %6
}

define i32 @foo(i32 %a, i32 %b) {
  %args = alloca %lambda_args
  %1 = getelementptr %lambda_args, %lambda_args* %args, i32 0, i32 0
  store i32 %a, i32* %1
  %2 = getelementptr %lambda_args, %lambda_args* %args, i32 0, i32 1
  store i32 %b, i32* %2
  %c = call i32 @integer_parse()
  %3 = getelementptr %lambda_args, %lambda_args* %args, i32 0, i32 2
  store i32 %c, i32* %3
  %4 = call i32 @lambda(%lambda_args* %args, i32 10)
  ret i32 %4
}
```
显然，你可以做一些灵活的变化：
 - 您可以将所有隐式参数作为显式参数传递。
 - 您可以在结构中将所有隐式参数作为显式参数传递。
 - 您可以传入一个指向调用者帧的指针，并让 lambda 函数从输入帧中提取参数和局部变量。
## 生成器
生成器是一个函数，它以某种方式重复生成一个值，使得函数的状态在函数的重复调用中保持不变； 这包括函数在产生值时的局部偏移量。

实现生成器最直接的方法是将其所有状态变量（参数、局部变量和返回值）包装到一个 ad-hoc 结构中，然后将该结构的地址传递给生成器。

待续...

