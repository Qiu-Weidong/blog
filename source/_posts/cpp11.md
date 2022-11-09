---
title: C++11的λ表达式
date: 2022-04-24 20:51:21
tags:
  - C++
  - λ表达式
categories:
  - C++
---
{% poem author:辛弃疾 source:贺新郎·甚矣吾衰矣 %}
甚矣吾衰矣。怅平生、交游零落，只今余几！白发空垂三千丈，一笑人间万事。问何物、能令公喜？我见青山多妩媚，料青山见我应如是。情与貌，略相似。
一尊搔首东窗里。想渊明、《停云》诗就，此时风味。江左沉酣求名者，岂识浊醪妙理。回首叫、云飞风起。不恨古人吾不见，恨古人不见吾狂耳。知我者，二三子。
{% endpoem %}
C++11中引入了λ表达式，它可以用来定义一个内联(inline)的函数，作为一个本地的对象或者一个参数。有了λ表达式，我们可以很方便的使用stl标准库。

## λ表达式的构成

	[...](...) mutable throwSpec -> returnType {...}
中括号当中是捕获列表(后面解释)，小括号当中是λ表达式的参数(和一般的函数参数一样，若没有参数可以省略)，大括号中是具体的代码。mutable、throwSpec和returnType都是可以省略的，同时，若returnType被省略，那么参数列表(也就是小括号)也可以省略。如果mutable省略，那么捕获列表当中的数据将不可更改，如果代码当中不会抛出异常，则throwSpec也可以不写，如果returnType被省略，编译器将自行推断返回的类型。
看下面的例子

```cpp
#include <iostream>

using std::cout;
using std::endl;
int main ()
{
    []{                                //1
        cout << "hello world!\n";      //2
    };                                 //3
    return 0;
}
```
上面的代码从注释1所在的行，到注释3所在的行定义了一个λ表达式，这个λ表达式很简单，没有需要捕获的值，因此捕获列表为空，也就是中括号当中的内容为空(注意，就算捕获列表为空，中括号也不能够省略)，这个函数也不需要参数，因此小括号也被省略掉了，捕获列表为空，那么显然捕获列表当中没有数据需要修改，所以mutable也被省略掉了，没有异常抛出，于是throwSpec被省略，没有返回值，于是returnType被省略。代码体中的代码也很简答，输出一个"hello world!\n"的字符串。
## λ表达式的定义和调用
λ表达式该如何来调用，最简单的方法就是直接在定义后面加上小括号，如下所示：
```cpp
#include <iostream>

using std::cout;
using std::endl;
int main ()
{
    []{                                //1
        cout << "hello world!\n";      //2
    }();                               //3
    return 0;
}
```
我们在注释3所在的行的右大括号和分号之间添加了一个小括号，运行，就可以输出hello world!了。

如果我们不想在定义它的时候就调用它，并且我们想要在不同的地方多次调用这个λ表达式，那么一个很直观的想法就是将它保存在一个变量当中，然后在需要的时候通过变量来调用。
我们如何来定义一个变量来保存λ表达式，或者说我们应该定义一个什么类型的变量来保存它？事实上，很少有人能够写出一个λ表达式的准确的类型，而λ表达式的类型往往又不重要，因此，我们可以使用C++11的关键字auto来让编译器帮助我们推断其类型，如下所示：
```cpp
#include <iostream>

using std::cout;
using std::endl;
int main ()
{
    auto lambda = []{                 //1
        cout << "hello world!\n";
    };

    lambda();                        //2
    lambda();                        //3
}
```
注释1所在的行我们定义了一个名为lambda的变量，它的类型我们通过auto让编译器自己推断，之后在注释2和注释3所在的行，我们都通过lambda变量来调用λ表达式，在任意地方，只要没有超出变量的生命周期，我们就可以任意次的调用它。

我们再来看看带参数的λ表达式
```cpp
#include <iostream>

using std::cout;
using std::endl;
int main ()
{
    auto add = [](int x,int y) -> int {  //1
    	return x+y;
    };
	cout << add(1,2) << endl;    //2
}
```
注释1所在的行当中，我们定义了带两个整型参数，并且返回一个整型的λ表达式，这个λ表达式返回两个参数相加的结果。然后在注释2所在的行，我们通过  *变量名(参数1,参数2)*的方式来调用该λ表达式，并将返回结果输出。注意，这里的返回类型可以省略，编译器自己可以为我们推断返回类型。

## 捕获列表
下面我们来讨论捕获列表，观察下面的代码
```cpp
#include <iostream>

using std::cout;
using std::endl;
int main ()
{
    int x = 47;
    
    auto lambda = [x]() {      //1
        cout << x << endl;     //2
    };

    lambda();                 //3
}
```
我们在main函数中定义了局部变量x，然后，注意到在注释1所在的行，中括号当中有x，说明这个x出现在了λ表达式的捕获列表当中，因此，我们可以在该λ表达式的代码体当中使用x。这里我们直接输出了x的值(注释2)，然后，在注释3所在的行调用λ表达式，我们运行程序，可以看到输出47，这与我们对x赋予的初始值是吻合的。

如果我们想要修改捕获到的值，那么我们需要加上mutable，如下所示：
```cpp
#include <iostream>

using std::cout;
using std::endl;
int main ()
{
    int x = 47;
    
    auto lambda = [x]() mutable {        //1
        x += 10;                         //2
        cout << "in lambda, x = " << x << endl;
    };

    lambda();                           //3
    lambda();                           //4

    cout << "in main, x = " << x << endl;//5
}
```
我们对λ表达式加上了mutable(注释1)，于是，我们可以在λ表达式当中修改x的值(注释2)。我们调用λ表达式两次(注释3、注释4)，于是，λ表达式就将x的值增加10，并输出修改之后的x的值，第一次我们得到了57，第二次我们得到了67，这显然和我们的预期是符合的，最后我们在main函数中再次输出x的值(注释5)，得到了47，这是因为x是按值传递的，λ表达式修改的只能够是x的一个拷贝，并不会影响main函数当中的x的值。
## 等价的可调用对象
我们可以通过一个可调用对象来理解上面的λ表达式
```cpp
#include <iostream>

using std::cout;
using std::endl;
class lambda                    //1
{
private:
    int x;                      //2
public:
    lambda(int x) : x(x){}
    void operator()()           //3
    {
        x += 10;                         
        cout << "in lambda, x = " << x << endl;
    }
};
int main ()
{
    int x = 47;
    
    lambda l = lambda(x);  //4

    l();                  //5
    l();                  //6

    cout << "in main, x = " << x << endl;  //7
}
```
上述代码当中，我们定义了一个类来模拟前面的λ表达式(注释1)，这个类有一个私有的整型变量x (注释2)，相当于前面的λ表达式当中捕获列表里面捕获的x。然后我们重载了括号(注释3)，使得它成为了一个可调用对象，且这里面的代码与之前定义了λ表达式当中的代码相同。然后我们在main函数当中用x作为构造函数的参数来实例化一个lambda对象(注释4)，然后调用两次(注释5、注释6)，最后在main函数中输出x(注释7)，我们能够得到和上面一样的结果。

于是我们可以得出结论，一个λ表达式可以等价于一个可调用对象(事实上一个λ表达式就是一个对象)，这个可调用对象的成员变量就是λ表达式当中的捕获列表中的变脸(如果λ表达式中没有使用mutable，则可调用对象的成员变量需要加上const)，并且λ表达式中的函数参数以及具体代码都与可调用对象的operator()函数的参数和代码体相同。

之前讨论了捕获列表的按值传递，其实还可以按引用传递
```cpp
#include <iostream>

using std::cout;
using std::endl;

int main ()
{
    int x = 47;
    
    auto lambda = [&x]() mutable{      //1
        x += 10;
        cout << "in lambda, x = " << x << endl;    
    };

    lambda();
    lambda();

    cout << "in main, x = " << x << endl;
}
```
这段代码和之前唯一的不同就是捕获列表当中的x前面加上了&符号，变成了按引用传递，因此，最后main函数中的输出也被改变了。

## 捕获所有的变量。
如果要在λ表达式当中捕获所有当前域中可见的变量，可以在中括号中使用=，这样所有的变量都按值传递，而如果所有的变量都按引用传递，则在中括号中使用&
```cpp
#include <iostream>

using std::cout;
using std::endl;

int main ()
{
    int x = 47;
    int y = 10;
    int z = 23;
    
    auto lambda = [=]() mutable{    //1
        x += 10;
        y += 10;
        z += 10;
        cout << "in lambda, x = " << x << endl;    
        cout << "in lambda, y = " << y << endl;    
        cout << "in lambda, z = " << z << endl;    
    };

    lambda();
    lambda();

    cout << "in main, x = " << x << endl;
    cout << "in main, y = " << y << endl;
    cout << "in main, z = " << z << endl;
}
```
我们在中括号中使用了=(注释1)，于是，之前定义的x、y、z都被按值捕获了。
```cpp
#include <iostream>

using std::cout;
using std::endl;

int main ()
{
    int x = 47;
    int y = 10;
    int z = 23;
    
    auto lambda = [&]() mutable{    //1
        x += 10;
        y += 10;
        z += 10;
        cout << "in lambda, x = " << x << endl;    
        cout << "in lambda, y = " << y << endl;    
        cout << "in lambda, z = " << z << endl;    
    };

    lambda();
    lambda();

    cout << "in main, x = " << x << endl;
    cout << "in main, y = " << y << endl;
    cout << "in main, z = " << z << endl;
}
```
将=改为&(注释1)，x、y、z都被按引用捕获了。

λ表达式可以很方便地用于stl库，比如我们要对自己定义的一种数据结构排序，而我们又没有在这种数据结构中重载小于运算符，这时我们就可以用λ表达式写一个比较的方法，并将它作为参数传递到sort函数当中。