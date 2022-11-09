---
title: SFML编译和安装
date: 2022-06-26 14:43:19
tags:
  - SFML
  - C++
categories:
  - [SFML]
  - [C++]
---
首先需要下载SFML的源代码。从[https://www.sfml-dev.org/files/SFML-2.5.1-sources.zip](https://www.sfml-dev.org/files/SFML-2.5.1-sources.zip)下载LLVM的源代码，并解压。或者直接从github上面克隆。
```powershell
git clone --config core.autocrlf=false https://github.com/SFML/SFML.git
```
选择合适的编译器，在windows系统下可以选择Visual C++，在linux上可以选择GNU编译器。这里以windows为例进行演示。为了使用Visual C++编译器，需要打开`developer powershell for VS 2022`作为终端，使用该终端的理由是该终端有相关的Visual C++环境变量。 
进入源代码目录，进行cmake相关配置。
```powershell
cmake -GNinja -Bbuild
```

然后进入新建的build目录，进行构建。
```powershell
cmake --build .
```
构建成功之后，使用管理员方式重新打开`developer powershell for VS 2022`，进行安装。
```powershell
ninja install
```
默认会安装在`C:\Program Files (x86)\SFML`目录下，将`C:\Program Files (x86)\SFML\bin`添加到环境变量。
最后测试是否安装成功。新建一个项目，添加一个C++源文件`main.cpp`。其内容如下所示。
```cpp
#include <SFML/Graphics.hpp>
#include <iostream>

int main()
{

    sf::RenderWindow window(sf::VideoMode(200, 200), "SFML works!");
    sf::CircleShape shape(100.f);
    shape.setFillColor(sf::Color::Green);

    while (window.isOpen())
    {
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        window.clear();
        window.draw(shape);
        window.display();
    }

    return 0;
}

```
再新建一个`CMakeLists.txt`文件，用来构建。内容如下所示。
```cmake
cmake_minimum_required(VERSION 3.4.0)
project(main LANGUAGES CXX)

find_package(SFML COMPONENTS audio network system window graphics REQUIRED CONFIG)


add_executable(main main.cpp)
target_link_libraries(main sfml-system sfml-window sfml-graphics sfml-audio sfml-network)
```
使用如下命令进行编译。
```
cmake -Bbuild -GNinja
cd build
cmake --build .
```
编译完成后，会在build目录下生成一个名为`main.exe`的可执行文件，运行之，可以看到一个小的窗口，窗口中有一个绿色的圆形，表示安装成功。

