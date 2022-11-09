---
title: llvm简明教程
date: 2022-06-08 14:39:06
tags:
  - llvm
categories:
  - llvm
---
{% poem author:辛弃疾 source:贺新郎·别茂嘉十二弟 %}
绿树听鹈鴂。更那堪、鹧鸪声住，杜鹃声切。啼到春归无寻处，苦恨芳菲都歇。算未抵、人间离别。马上琵琶关塞黑，更长门、翠辇辞金阙。看燕燕，送归妾。
将军百战身名裂。向河梁、回头万里，故人长绝。易水萧萧西风冷，满座衣冠似雪。正壮士、悲歌未彻。啼鸟还知如许恨，料不啼清泪长啼血。谁共我，醉明月。
{% endpoem %}
## 将C程序编译为llvm

输入的c代码：

```C
// main.c
int main() {
    return 0;
}
```

### 生成IR：

命令：
```bash
clang -Xclang -ast-dump -fsyntax-only main.c
```

结果：

```
TranslationUnitDecl 0x248a788 <<invalid sloc>> <invalid sloc>
|-TypedefDecl 0x248b020 <<invalid sloc>> <invalid sloc> implicit __int128_t '__int128'
| `-BuiltinType 0x248ad20 '__int128'
|-TypedefDecl 0x248b090 <<invalid sloc>> <invalid sloc> implicit __uint128_t 'unsigned __int128'
| `-BuiltinType 0x248ad40 'unsigned __int128'
|-TypedefDecl 0x248b398 <<invalid sloc>> <invalid sloc> implicit __NSConstantString 'struct __NSConstantString_tag'
| `-RecordType 0x248b170 'struct __NSConstantString_tag'
|   `-Record 0x248b0e8 '__NSConstantString_tag'
|-TypedefDecl 0x248b430 <<invalid sloc>> <invalid sloc> implicit __builtin_ms_va_list 'char *'
| `-PointerType 0x248b3f0 'char *'
|   `-BuiltinType 0x248a820 'char'
|-TypedefDecl 0x248b728 <<invalid sloc>> <invalid sloc> implicit __builtin_va_list 'struct __va_list_tag [1]'
| `-ConstantArrayType 0x248b6d0 'struct __va_list_tag [1]' 1 
|   `-RecordType 0x248b510 'struct __va_list_tag'
|     `-Record 0x248b488 '__va_list_tag'
`-FunctionDecl 0x24ea470 <main.c:2:1, line:4:1> line:2:5 main 'int ()'
  `-CompoundStmt 0x24ea588 <col:12, line:4:1>
    `-ReturnStmt 0x24ea578 <line:3:5, col:12>
      `-IntegerLiteral 0x24ea558 <col:12> 'int' 0
```

前端生成中间代码：`clang -S -emit-llvm main.c -o main.ll`

生成的main.ll文件

```llvm
; ModuleID = 'main.c'
source_filename = "main.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

; Function Attrs: noinline nounwind optnone uwtable
define dso_local i32 @main() #0 {
  %1 = alloca i32, align 4
  store i32 0, i32* %1, align 4
  ret i32 0
}

attributes #0 = { noinline nounwind optnone uwtable "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "unsafe-fp-math"="false" "use-soft-float"="false" }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{!"clang version 10.0.0-4ubuntu1 "}
```

优化main.ll: `opt main.ll -S -O3`，似乎没什么效果

直接用clang优化: `clang -S -emit-llvm -O3 main.c`

```llvm
; ModuleID = 'main.c'
source_filename = "main.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

; Function Attrs: norecurse nounwind readnone uwtable
define dso_local i32 @main() local_unnamed_addr #0 {
  ret i32 0
}

attributes #0 = { norecurse nounwind readnone uwtable "correctly-rounded-divide-sqrt-fp-math"="false" "disable-tail-calls"="false" "frame-pointer"="none" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="false" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "unsafe-fp-math"="false" "use-soft-float"="false" }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{!"clang version 10.0.0-4ubuntu1 "}
```

### 汇编IR

命令：

`llc main.ll -o main.s`

结果：

```asm
	.text
	.file	"main.c"
	.globl	main                    # -- Begin function main
	.p2align	4, 0x90
	.type	main,@function
main:                                   # @main
	.cfi_startproc
# %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	movl	$0, -4(%rbp)
	xorl	%eax, %eax
	popq	%rbp
	.cfi_def_cfa %rsp, 8
	retq
.Lfunc_end0:
	.size	main, .Lfunc_end0-main
	.cfi_endproc
                                        # -- End function
	.ident	"clang version 10.0.0-4ubuntu1 "
	.section	".note.GNU-stack","",@progbits

```

### LLVM IR可读形式与比特形式的转换

可读形式转比特形式

`llvm-as main.ll -o main.bc`

比特形式转化为可读形式

`llvm-dis main.bc`

clang直接生成比特形式的llvm IR

`clang -c -emit-llvm main.c -o main.bc`

解释执行main.bc

`lli main.bc`


## 创建模型

```cpp
int main(int argc, const char ** argv) {
	std::unique_ptr<LLVMContext> theContext = std::make_unique<LLVMContext>();
    std::unique_ptr<Module> theModule = std::make_unique<Module>("hello llvm world!", *theContext);

    std::unique_ptr<IRBuilder<>> builder = std::make_unique<IRBuilder<>>(*theContext);

    theModule->setSourceFileName("main.c");
    theModule->setTargetTriple(sys::getDefaultTargetTriple());  
    
    // 检查模型是否有问题
    if (verifyModule(*theModule, &errs()))
        errs() << "module error!\n";
    // 输出二进制比特码
    std::error_code EC;
    raw_fd_ostream out("./main.bc", EC);
    WriteBitcodeToFile(*theModule, out);
    // 输出llvm ir
    raw_fd_ostream outer("./main.ll", EC);
    outer << *theModule << "\n";
}

```

## 定义一个全局变量

```cpp
llvm::Type *i32 = llvm::Type::getInt32Ty(*context);

// 定义一个全局变量
Module->getOrInsertGlobal("hello", i32);
llvm::GlobalVariable *gVar = Module->getNamedGlobal("hello");
gVar->setInitializer(llvm::Constant::getIntegerValue(i32, llvm::APInt(32, 17)));
gVar->setConstant(true); // 定义常量
```

## 定义一个结构体

```cpp
// 定义一个结构体
llvm::StructType * structty = llvm::StructType::create(*context, {i32, i32}, "Point");
// 创建一个全局结构体
Module->getOrInsertGlobal("foo", structty);
gVar = Module->getGlobalVariable("foo");
llvm::Constant * foo_constant = llvm::ConstantStruct::get(structty, {llvm::ConstantInt::get(i32, 13), llvm::ConstantInt::get(i32, 57)});
gVar->setInitializer(foo_constant);

// 在栈上创建一个结构体
StructType * structty = StructType::create(*theContext, {i32, i32}, "Point");
AllocaInst *point = builder->CreateAlloca(structty, nullptr, "point");
// 取出结构体的第一个元素并赋值
Value *ptr = builder->CreateGEP(structty, point, {builder->getInt32(0), builder->getInt32(1)}, "get");
builder->CreateStore(nine, ptr);
```

## 定义一个函数

```cpp
// 定义一个函数
llvm::FunctionType *functy = llvm::FunctionType::get(i32, {i32, i32}, false);
llvm::Function *func = llvm::Function::Create(functy, llvm::Function::ExternalLinkage, "Add", *Module);
// 函数的函数体
llvm::BasicBlock * BB = llvm::BasicBlock::Create(*context, "entry",func);

// 获取函数的两个参数
llvm::Argument * v1 = func->getArg(0);
llvm::Argument * v2 = func->getArg(1);
// 创建add指令
auto instAdd = llvm::BinaryOperator::Create(llvm::Instruction::Add, v1, v2, "add_qiu");
BB->getInstList().push_back(instAdd);
BB->getInstList().push_back(llvm::ReturnInst::Create(*context, instAdd));

// 定义main函数来调用add函数
llvm::FunctionType * functy2 = llvm::FunctionType::get(i32, false);
llvm::Function * main = llvm::Function::Create(functy2,llvm::Function::ExternalLinkage, "main", *Module);
BB = llvm::BasicBlock::Create(*context, "entry", main);
llvm::CallInst * callinst = llvm::CallInst::Create(func,{load, load2}, "call", BB);
BB->getInstList().push_back(llvm::ReturnInst::Create(*context, callinst));
```

## 控制流

### if-else

```cpp
// 定义一个函数签名 int (int , int)
FunctionType *funcTy = FunctionType::get(i32, {i32, i32}, false);

// 定义一个函数 int Min(int a, int b) ;
Function *min_func = Function::Create(funcTy, Function::ExternalLinkage, "Min", *theModule);
BasicBlock *entry = BasicBlock::Create(*theContext, "entry", min_func);
BasicBlock *then = BasicBlock::Create(*theContext, "then", min_func);
BasicBlock *elseBB = BasicBlock::Create(*theContext, "else", min_func);

// 获取函数的两个参数
Argument *arg0 = min_func->getArg(0);
Argument *arg1 = min_func->getArg(1);

builder->SetInsertPoint(entry);

// 插入一条比较指令
Value *cmp = builder->CreateICmpSLT(arg0, arg1, "icmpslt");
builder->CreateCondBr(cmp, then, elseBB);

builder->SetInsertPoint(then);
builder->CreateRet(arg0);

builder->SetInsertPoint(elseBB);
builder->CreateRet(arg1);
```
等价的C语言描述
```C
// 等价的C语言描述
int Min(int a, int b) {
    if(a < b)
        return a;
    else return b;
}
```

### switch

```cpp
// 创建一条switch语句
FunctionType *switchFunTy = FunctionType::get(i32, {i32}, false);
Function *switchFunc = Function::Create(switchFunTy, Function::ExternalLinkage, "switchFunc", *theModule);
BasicBlock *switchBB = BasicBlock::Create(*theContext, "entry", switchFunc);

BasicBlock *ABB = BasicBlock::Create(*theContext, "A", switchFunc);
BasicBlock *BBB = BasicBlock::Create(*theContext, "B", switchFunc);
BasicBlock *CBB = BasicBlock::Create(*theContext, "C", switchFunc);
BasicBlock *defaultBB = BasicBlock::Create(*theContext, "default", switchFunc);
BasicBlock *endBB = BasicBlock::Create(*theContext, "end", switchFunc);
builder->SetInsertPoint(switchBB);
Argument *arg = switchFunc->getArg(0);
AllocaInst * retval = builder->CreateAlloca(i32, nullptr, "retval");
SwitchInst *switchInst = builder->CreateSwitch(arg, defaultBB, 3);

switchInst->addCase(Zero, ABB);
switchInst->addCase(two, CBB);
switchInst->addCase(nine, BBB);

ConstantInt *sex = ConstantInt::get(int32, 6);
ConstantInt *twnty = ConstantInt::get(int32, 20);
ConstantInt *aaa = ConstantInt::get(int32, 37);

builder->SetInsertPoint(ABB);
builder->CreateStore(sex, retval);
builder->CreateBr(endBB);

builder->SetInsertPoint(BBB);
builder->CreateStore(twnty, retval);
builder->CreateBr(endBB);

builder->SetInsertPoint(CBB);
builder->CreateStore(aaa, retval);
builder->CreateBr(endBB);

builder->SetInsertPoint(defaultBB);
builder->CreateStore(Zero, retval);
builder->CreateBr(endBB);

builder->SetInsertPoint(endBB);
LoadInst * r = builder->CreateLoad(retval, "load");
builder->CreateRet(r);
```

等价的C语言

```C
int switchFunc(int x) {
    int retval;
    switch(x) {
        case 0:
            retval = 6;
            break;
        case 2:
            retval = 37;
            break;
        case 9:
            retval = 20;
            break;
        default:
            retval = 0;
            break;
    }
    return retval;
}
```

### select

上述Min函数的select实现

```cpp
// 定义一个函数 int Min(int a, int b) ;
Function *min_func = Function::Create(funcTy, Function::ExternalLinkage, "Min", *theModule);
BasicBlock *entry = BasicBlock::Create(*theContext, "entry", min_func);

// 获取函数的两个参数
Argument *arg0 = min_func->getArg(0);
Argument *arg1 = min_func->getArg(1);

builder->SetInsertPoint(entry);

// 插入一条比较指令
Value *cmp = builder->CreateICmpSLT(arg0, arg1, "icmpslt");
Value *tmp = builder->CreateSelect(cmp, arg0, arg1, "select");
builder->CreateRet(tmp);
```

转换后的llvm

```llvm
define i32 @Min(i32 %0, i32 %1) {
entry:
  %icmpslt = icmp slt i32 %0, %1
  %select = select i1 %icmpslt, i32 %0, i32 %1
  ret i32 %select
}
```

### PHI

```cpp
Function * max_func = Function::Create(funcTy, Function::PrivateLinkage, "Max", *theModule);
entry = BasicBlock::Create(*theContext, "entry", max_func);
BasicBlock * then = BasicBlock::Create(*theContext, "then", max_func);
BasicBlock * elseBB = BasicBlock::Create(*theContext, "else", max_func);
BasicBlock * endBB = BasicBlock::Create(*theContext, "end", max_func);

arg0 = max_func->getArg(0);
arg1 = max_func->getArg(1);
builder->SetInsertPoint(entry);
Value * cmpgt = builder->CreateICmpSGT(arg0, arg1, "cmp");
builder->CreateCondBr(cmpgt, then, elseBB);

builder->SetInsertPoint(then);
builder->CreateBr(endBB);
builder->SetInsertPoint(elseBB);
builder->CreateBr(endBB);

builder->SetInsertPoint(endBB);
PHINode * phi = builder->CreatePHI(i32, 2, "phi");
phi->addIncoming(arg0, then);
phi->addIncoming(arg1, elseBB);
builder->CreateRet(phi);
```

### 循环

以阶乘函数为例子，C语言代码如下：

```C
int factorial(int n) {
    int ret = 1;
    for(int i=1;i<=n;i++) ret *= i;
    return ret;
}
```

首先转换为

```C
int factorial(int n) {
    if(n < 1) return 1;
    int i = 1;
    int ret = 1;
    do {
        ret *= i;
        i++;
    }while(i<=n);
    return ret;
}
```

代码如下：

```cpp
FunctionType *funcTy = FunctionType::get(i32, {i32}, false);

Function * factorial = Function::Create(funcTy, Function::InternalLinkage, "factorial", *theModule);
BasicBlock * entry = BasicBlock::Create(*theContext, "entry", factorial);
BasicBlock * loop = BasicBlock::Create(*theContext, "loop", factorial);
BasicBlock * end = BasicBlock::Create(*theContext, "end", factorial);

Argument * n = factorial->getArg(0);
builder->SetInsertPoint(entry);
Value * cmp = builder->CreateICmpSLT(n, one, "cmp");
builder->CreateCondBr(cmp, end, loop);

builder->SetInsertPoint(loop);
PHINode *i = builder->CreatePHI(i32, 2, "i");
PHINode *ret = builder->CreatePHI(i32, 2, "ret");

i->addIncoming(one, entry);
Value * nexti = builder->CreateAdd(i, one, "nexti");
i->addIncoming(nexti, loop);


ret->addIncoming(one, entry);
Value * nextret = builder->CreateMul(ret, i, "nextret");
ret->addIncoming(nextret, loop);

cmp = builder->CreateICmpSLE(nexti, n);
builder->CreateCondBr(cmp, loop, end);

builder->SetInsertPoint(end);
PHINode * phi = builder->CreatePHI(i32, 2);
phi->addIncoming(one, entry);
phi->addIncoming(nextret, loop);
builder->CreateRet(phi);
```


