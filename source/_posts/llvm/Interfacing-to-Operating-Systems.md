---
title: 操作系统接口
date: 2022-06-12 10:19:20
tags:
  - llvm 
categories:
  - llvm 
---

## POSIX操作系统接口
在 POSIX 上，C 运行时库的存在是不可避免的事实，因此直接调用此类 C 运行时函数非常有意义。
在 POSIX 上，创建 `Hello world` 程序真的很容易：
```llvm
declare i32 @puts(i8* nocapture) nounwind

@.hello = private unnamed_addr constant [13 x i8] c"hello world\0A\00"

define i32 @main(i32 %argc, i8** %argv) {
    %1 = getelementptr [13 x i8], [13 x i8]* @.hello, i32 0, i32 0
    call i32 @puts(i8* %1)
    ret i32 0
}
```
## windows操作系统接口
在 Windows 上，C 运行时库主要被认为仅与 C 和 C++ 语言相关，因此您拥有任何客户端应用程序都可以使用的过多（数千个）标准系统接口。
Windows 上的 `Hello world` 远没有 POSIX 上那么简单：
```llvm
target datalayout = "e-p:32:32:32-i1:8:8-i8:8:8-i16:16:16-i32:32:32-i64:64:64-f32:32:32-f64:64:64-f80:128:128-v64:64:64-v128:128:128-a0:0:64-f80:32:32-n8:16:32-S32"
target triple = "i686-pc-win32"

%struct._OVERLAPPED = type { i32, i32, %union.anon, i8* }
%union.anon = type { %struct.anon }
%struct.anon = type { i32, i32 }

declare dllimport x86_stdcallcc i8* @"\01_GetStdHandle@4"(i32) #1

declare dllimport x86_stdcallcc i32 @"\01_WriteFile@20"(i8*, i8*, i32, i32*, %struct._OVERLAPPED*) #1

@hello = internal constant [13 x i8] c"Hello world\0A\00"

define i32 @main(i32 %argc, i8** %argv) nounwind {
    %1 = call i8* @"\01_GetStdHandle@4"(i32 -11)    ; -11 = STD_OUTPUT_HANDLE
    %2 = getelementptr [13 x i8], [13 x i8]* @.hello, i32 0, i32 0
    %3 = call i32 @"\01_WriteFile@20"(i8* %1, i8* %2, i32 12, i32* null, %struct._OVERLAPPED* null)
    ; todo: Check that %4 is not equal to -1 (INVALID_HANDLE_VALUE)
    ret i32 0
}

attributes #1 = { "less-precise-fpmad"="false" "no-frame-pointer-elim"="true" "no-frame-pointer-elim-non-leaf"
"no-infs-fp-math"="fa lse" "no-nans-fp-math"="false" "stack-protector-buffer-size"="8" "unsafe-fp-math"="false"
"use-soft-float"="false"
}
```
