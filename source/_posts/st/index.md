---
title: 安装stringtemplate4
date: 2023-02-16 15:49:51
tags:
  - StringTemplate4
categories:
  - StringTemplate4
---
## 在 Java 中使用 StringTemplate

### 安装

您需要做的就是将 StringTemplate jar 及其依赖的 ANTLR jar 放入您的 `CLASSPATH` 中。 [下载 Java StringTemplate 4.3.4 binary jar](https://www.stringtemplate.org/download.html) 并放入您喜欢的 lib 目录，例如 UNIX 上的 `/usr/local/lib`。 添加到您的 `CLASSPATH`。 在 UNIX 上看起来像
 
```bash
$ export CLASSPATH="/usr/local/lib/ST-4.3.4.jar:$CLASSPATH"
```
 
Java 现在将看到执行 ST 所需的所有库。 参考 [StringTemplate 存储库](https://github.com/antlr/stringtemplate4)。

### hello world

这里有一个简单、完整的程序来测试您的安装。

```java
import org.stringtemplate.v4.*;
 
public class Hello {
    public static void main(String[] args) {
        ST hello = new ST("Hello, <name>");
        hello.add("name", "World");
        System.out.println(hello.render());
    }
}
```

以下是如何从命令行编译和运行它：

```bash
/tmp $ javac Hello.java
/tmp $ java 你好
Hello, World
```

### 加载模板组

#### 组文件

要加载组文件，请使用 STGroup 的 STGroupFile 子类：

```java
//加载文件名
STGroup g = new STGroupFile("test.stg");
```

这告诉 StringTemplate 在当前目录中查找 `test.stg`。 如果未找到，STGroupFile 将在 CLASSPATH 中查找。 您也可以使用相对路径。 下面在当前目录中查找子目录模板，如果没有找到，则在 CLASSPATH 的目录中查找。

```java
//加载相对文件名
STGroup g = new STGroupFile("templates/test.stg");
```

您还可以使用完全限定名称：

```java
// 加载完全限定的文件名
STGroup g = new STGroupFile("/usr/local/share/templates/test.stg");
```

#### 组目录

如上所述，组文件就像打包到单个文件中的模板目录（如基于文本的 jar）。 要将存储在目录中的模板作为单独的 .st 文件加载，请使用 STGroupDir 实例：

```java
// 加载模板的相对目录
STGroup g = new STGroupDir("templates");
```

如果在当前目录中找不到模板，StringTemplate 将在 CLASSPATH 中查找。 或者，您可以指定确切的完全限定名称：

```java
// 加载完全合格的模板目录
STGroup g = new STGroupDir("/usr/local/share/templates");
```

#### Group Strings

对于小 Group，有时在 Java 代码中使用字符串是有意义的：

```java
String g =
    "a(x) ::= <<foo>>\n"+
    "b() ::= <<bar>>\n";
STGroup group = new STGroupString(g);
ST st = group.getInstanceOf("a");
String expected = "foo";
String result = st.render();
assertEquals(expected, result);
```

#### URL/URI/路径泥潭

确保传递一个有效的文件名作为字符串或一个有效的 URL 对象。 文件/目录名称是相对的，如“foo.stg”、“foo”、“org/foo/templates/main.stg”或“org/foo/templates”，或者它们是绝对的，如“/tmp/foo”。 这是不正确的：

```
// 坏的
STGroup 模型STG = new STGroupFile(url.getPath());
```

因为它产生一个 jar 的文件路径，然后在里面：

```
文件：/somedirectory/AJARFILE.jar!/foo/main.stg
```

这不是有效的文件系统标识符。 要使用 URL 内容，请传入 URL 对象而不是字符串。 有关详细信息，请参阅[在 URL 和文件系统路径之间转换](https://maven.apache.org/plugin-developers/common-bugs.html#Converting_between_URLs_and_Filesystem_Paths)。

### API 文档

[Java API](https://www.stringtemplate.org/api/index.html)


