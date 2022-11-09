---
title: llvm的一个小示例
date: 2022-08-06 15:44:00
tags:
  - llvm 
categories:
  - llvm 
---
C语言代码如下：
```c
#include <stdio.h>


int main(int argc, const char ** argv) {
    printf("hello world!\n");
    return 0;
}
```
生成llvmIR的代码如下：
```cpp 
#include "llvm/IR/Module.h"
#include "llvm/IR/LLVMContext.h"
#include "llvm/IR/IRBuilder.h"
#include "llvm/IR/Function.h"
#include "llvm/IR/GlobalVariable.h"
#include "llvm/Support/raw_ostream.h"
#include "llvm/Support/Casting.h"
// #include "llvm/IR/GetElementPtrTypeIterator.h"

// clang++ main.cpp `llvm-config --cxxflags --ldflags --system-libs --libs core` -fno-rtti -o main
using namespace llvm;

int main(int argc, const char ** argv) {
    LLVMContext context;
    Module m("hello", context);
    IRBuilder<> builder(context);

    FunctionType *main_type = FunctionType::get(
        builder.getInt32Ty(), false
    );
    Function *main_func = Function::Create(main_type, GlobalValue::ExternalLinkage, "main", m);

    FunctionType *print_type = FunctionType::get(builder.getInt32Ty(), { builder.getInt8PtrTy() }, true );
    Function *print = Function::Create(
        print_type,
        GlobalValue::ExternalLinkage, "printf", m
    );

    BasicBlock *block = BasicBlock::Create(context, "entry", main_func);
    builder.SetInsertPoint(block);

    std::string value = "hello world!\n";
    Type *str_type = ArrayType::get(builder.getInt8Ty(), value.size() + 1);
    GlobalVariable *str = dyn_cast<GlobalVariable>(m.getOrInsertGlobal(".str", str_type));
    str->setInitializer(ConstantDataArray::getString(context, value));
    
    Value * str_value = builder.CreateGEP(str->getValueType(), str, { builder.getInt32(0), builder.getInt32(0) });
    
    builder.CreateCall(print, { str_value });
    builder.CreateRet(builder.getInt32(0));

    m.print(errs(), nullptr);
    return 0;
}
```


最终输出的llvm如下：
```llvm 
; ModuleID = 'hello'
source_filename = "hello"

@.str = global [14 x i8] c"hello world!\0A\00"

define i32 @main() {
entry:
  %0 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @.str, i32 0, i32 0))
  ret i32 0
}

declare i32 @printf(i8*, ...)
```

通过函数指针来进行调用:
```cpp
#include "llvm/IR/Module.h"
#include "llvm/IR/LLVMContext.h"
#include "llvm/IR/IRBuilder.h"
#include "llvm/IR/Function.h"
#include "llvm/IR/GlobalVariable.h"
#include "llvm/Support/raw_ostream.h"
#include "llvm/Support/Casting.h"
// #include "llvm/IR/GetElementPtrTypeIterator.h"

// clang++ main.cpp `llvm-config --cxxflags --ldflags --system-libs --libs core` -fno-rtti -o main
using namespace llvm;

int main(int argc, const char ** argv) {
    LLVMContext context;
    Module m("hello", context);
    IRBuilder<> builder(context);

    FunctionType *main_type = FunctionType::get(
        builder.getInt32Ty(), false
    );
    Function *main_func = Function::Create(main_type, GlobalValue::ExternalLinkage, "main", m);

    FunctionType *print_type = FunctionType::get(builder.getInt32Ty(), { builder.getInt8PtrTy() }, true );
    Function *print = Function::Create(
        print_type,
        GlobalValue::ExternalLinkage, "printf", m
    );

    BasicBlock *block = BasicBlock::Create(context, "entry", main_func);
    builder.SetInsertPoint(block);

    std::string value = "hello world!\n";
    Type *str_type = ArrayType::get(builder.getInt8Ty(), value.size() + 1);
    GlobalVariable *str = dyn_cast<GlobalVariable>(m.getOrInsertGlobal(".str", str_type));
    str->setInitializer(ConstantDataArray::getString(context, value));
    
    Value * str_value = builder.CreateGEP(str->getValueType(), str, { builder.getInt32(0), builder.getInt32(0) });
    
    Type * func_pointer_type = PointerType::getUnqual(print_type);
    AllocaInst *func_ptr = builder.CreateAlloca(
        func_pointer_type
    );
    builder.CreateStore(print, func_ptr) ;

    Value *load = builder.CreateLoad(func_ptr->getAllocatedType(), func_ptr);
    
    builder.CreateCall(load, { str_value });
    builder.CreateRet(builder.getInt32(0));

    m.print(errs(), nullptr);
    return 0;
}
```
## 直接输出llvm字节码
```cpp
// m为Module
std::error_code EC;
ToolOutputFile Out("main.bc", EC, sys::fs::OF_None);
WriteBitcodeToFile(m, Out.os());

Out.keep();
```
## 将llvm IR输出到文件
```cpp
// m为Module
std::error_code EC;
ToolOutputFile Out("main.ll", EC, sys::fs::OF_None);
m.print(Out.os(), nullptr);

Out.keep();
```
## 链接多个llvm::Module
```cpp
#include "llvm/IR/Module.h"
#include "llvm/IR/LLVMContext.h"
#include "llvm/IR/IRBuilder.h"
#include "llvm/IR/Function.h"
#include "llvm/IR/GlobalVariable.h"
#include "llvm/Support/raw_ostream.h"
#include "llvm/Support/Casting.h"
#include "llvm/Support/ToolOutputFile.h"
#include "llvm/Bitcode/BitcodeWriter.h"
#include "llvm/Linker/Linker.h"
// #include "llvm/IR/GetElementPtrTypeIterator.h"

// clang++ main.cpp `llvm-config --cxxflags --ldflags --system-libs --libs core` -fno-rtti -o main
using namespace llvm;

int main(int argc, const char **argv)
{
    LLVMContext context;
    std::unique_ptr<Module> m = std::make_unique<Module>("hello", context);
    IRBuilder<> builder(context);

    FunctionType *main_type = FunctionType::get(
        builder.getInt32Ty(), false);
    Function *main_func = Function::Create(main_type, GlobalValue::ExternalLinkage, "main", *m);

    FunctionType *add_type = FunctionType::get(
        builder.getInt32Ty(), { builder.getInt32Ty(), builder.getInt32Ty() }, false
    );
    Function *add_func = Function::Create(add_type, GlobalValue::ExternalLinkage, "add", *m);

    BasicBlock *block = BasicBlock::Create(context, "entry", main_func);
    builder.SetInsertPoint(block);

    Value *ret = builder.CreateCall(add_func, { builder.getInt32(3), builder.getInt32(6)  });

    builder.CreateRet(ret);

    // m.print(errs(), nullptr);

    std::unique_ptr<Module> m2 = std::make_unique<Module>("add", context);
    add_func = Function::Create(add_type, GlobalValue::ExternalLinkage, "add", *m2);
    block = BasicBlock::Create(context, "entry", add_func);
    builder.SetInsertPoint(block);
    Value *v1 = add_func->getArg(0);
    Value *v2 = add_func->getArg(1);
    ret = builder.CreateNSWAdd(v1, v2);
    builder.CreateRet(ret);


    Module dest("dest", context);
    Linker linker(dest);
    
    linker.linkInModule(std::move(m), Linker::Flags::OverrideFromSrc);

    linker.linkInModule(std::move(m2), Linker::Flags::OverrideFromSrc);

    dest.print(errs(), nullptr);

    return 0;
}
```
