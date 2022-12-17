---
title: beautifulsoup使用
date: 2022-12-12 09:53:57
tags:
  - python
  - beautifulsoup
  - html
categories:
  - python
---
## 导入BeautifulSoup
```python
from bs4 import BeautifulSoup
```
## 构造BeautifulSoup对象
```python
soup = BeautifulSoup(html_str, 'lxml')
# 也可以使用文件
soup = BeautifulSoup(open('index.html'), 'lxml)
```
## 节点选择器选择元素
直接使用 `.标签名` 即可。返回对象的类型是 `bs4.element.Tag`。
```html
<html>
    <body>
        <div>
            <div>内容</div>
        </div>
        <div></div>
    </body>
</html>
```
对上述html代码进行操作
```python
# html_str的内容如上
soup = BeautifulSoup(html_str, 'lxml')
result = soup.div
print(result)
```
输出结果为
```
<div>
<div>内容</div>
</div>
```
只会对第一个 div 进行选择。

将输入 html 字符串修改如下：
```html
<html>
    <body>
        <div>
            <div>内容</div>
            <a>内层链接</a>
        </div>
        <div></div>
        <a>外层链接</a>
    </body>
</html>
```

```python
# 对 a 标签进行选择
print(soup.a)
```
输出如下：
```
<a>内层链接</a>
```
因此，会选择先出现的标签，即便深度更深。

## 获取对象属性
假设 tag 是一个 `bs4.element.Tag` 类型的对象，那么 `tag.name` 可以获取标签的名称，div 标签的名称就是 "div"，span 标签的名称就是 "span"。`BeautifulSoup` 对象的名称是 "[document]" 。

可以使用 `tag.attrs` 获取 `id`、`class`、`href`等属性，需要注意的是，获取到的 `class` 是一个列表。
```html
<html>
    <body>
        <a href='https:hello.com' class='world' id='soup' />
    </body>
</html>
```

```python
print(soup.a.attrs)

# 输出
# {'href': 'https:hello.com', 'class': ['world'], 'id': 'soup'}
```

可以使用 `tag.string` 来获取标签中的内容。如果要同时获取子标签中的内容，可以使用 `tag.text`。可以使用 `tag.strings`获取到截断了的字符串列表。
```html
<html>
    <body>
        <div>我在<span>哪里</span>，我是谁<span>，我要到<a>哪里去</a></span>，何去何从？</div>
    </body>
</html>
```

```python
print(soup.div.string)
# 输出结果为None，因为有子标签

print(soup.div.span.string)
# 输出结果为 '哪里'

print(soup.div.text)
# '我在哪里，我是谁，我要到哪里去，何去何从？'

print(list(soup.div.strings))
# ['我在', '哪里', '，我是谁', '，我要到', '哪里去', '，何去何从？']
```

## 子节点获取
可以使用 `tag.contents` 或 `tag.children` 获取所有子节点。`tag.contents` 的结果是一个列表，`tag.children` 的返回结果是一个可迭代对象。结果中有 `bs4.element.Tag` 和 `bs4.element.NavigableString`。
需要注意的是，获取到的都是直接子节点，不会递归查找其孙子节点。
还是上面的 html 作为输入。
```python
# enumerate 可以在遍历的时候添加序号
for i, child in enumerate(soup.div):
    print(i, child)

for i, child in enumerate(soup.div.children):
    print(i, child)

for i, child in enumerate(soup.div.contents):
    print(i, child)

# 输出
# 0 我在
# 1 <span>哪里</span>
# 2 ，我是谁
# 3 <span>，我要到<a>哪里去</a></span>
# 4 ，何去何从？
```
## 子孙节点获取
使用 `tag.descendants` 可以递归地获取子孙节点。
```python
# 还是上面的 html
for i, descendant in enumerate(soup.div.descendants):
    print(i, descendant)
# 输出
# 0 我在
# 1 <span>哪里</span>
# 2 哪里
# 3 ，我是谁
# 4 <span>，我要到<a>哪里去</a></span>
# 5 ，我要到
# 6 <a>哪里去</a>
# 7 哪里去
# 8 ，何去何从？
```

## 父节点获取
使用 `tag.parent` 可以获取父节点
```python
print(soup.a.parent)
# 输出
# <span>，我要到<a>哪里去</a></span>
```

## 兄弟节点获取
使用如下的 html
```html
<html>
  <body>
    <div>块</div>
    <p>段落</p>
    <div>
      <span>雷达</span>
    </div>
    分阿勒里
    <p>再来个段落</p>
  </body>
</html>
```

使用 `tag.next_sibling` 可以获取当前标签的下一个标签。
```python
cursor: element.Tag = soup.div
print(cursor)
# <div>块</div>


while cursor is not None:
    print(cursor)
    cursor = cursor.next_sibling
    print('-------------------')
# <div>块</div>
# -------------------


# -------------------
# <p>段落</p>
# -------------------


# -------------------
# <div>
# <span>雷达</span>
# </div>
# -------------------

#     分阿勒里

# -------------------
# <p>再来个段落</p>
# -------------------


# -------------------
```
可以使用 `tag.next_siblings` 获取当前标签后面的所有标签。

`tag.previous_sibling` 和 `tag.previous_siblings` 也是类似，只不过获取的是当前标签之前的。


## CSS选择器
可以使用 `tag.select` 函数进行css选择。select的返回值是一个list。
使用下面的 html
```html
<html>
  <body>
    <div class="container">
      container
      <span class="sub-container">subcontainer</span>
      <a class="href-style">链接1</a>
      <a class="href-style">链接2</a>
      <a class="href-style">链接3</a>
      <a class="href-style">链接4</a>
      <div id="list">
        <ul>
            <li>位于第一个ul中</li>
        </ul>
        <ul>
            <li>位于第二个ul中</li>
        </ul>
      </div>
    </div>
  </body>
</html>
```


```python
print(soup.select(".container .sub-container"))
# 返回结果是一个列表
# [<span class="sub-container">subcontainer</span>]

print(soup.select(".container a"))
# [<a class="href-style">链接1</a>, <a class="href-style">链接2</a>, <a class="href-style">链接3</a>, <a class="href-style">链接4</a>]

print(soup.select("#list li"))
# [<li>位于第一个ul中</li>, <li>位于第二个ul中</li>]
```

## 方法选择



