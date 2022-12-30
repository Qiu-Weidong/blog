---
title: 单词接龙
date: 2022-06-08 14:31:24
katex: true
tags:
  - 图论
  - 欧拉回路
categories:
  - [数据结构与算法, 图论]
  - [数据结构与算法, 欧拉回路]
---
{% poem author:辛弃疾 source:西江月·遣兴 %}
昨夜松边醉倒，问松我醉何如。只疑松动要来扶，以手推松曰去。
{% endpoem %}
## 题目描述
洛谷链接 [https://www.luogu.com.cn/problem/U214783](https://www.luogu.com.cn/problem/U214783)
相信大家都玩过成语接龙的游戏，比如说**心心相印->印贼做父->父相伤害->......** 我们可以将它们拼接起来，如**心心相印贼做父相伤害**。

为了简化问题，避免处理宽字符，下面我们用英文单词来模拟这一过程。规定如果一个单词$a$的最后一个字符和另一个单词$b$的第一个字符相同，则可以将单词$b$接在单词$a$的后面。且拼接后的结果衔接部分只出现一次，并大写。

比如说单词 {% label abandon blue %} 和单词 {% label navie blue %} 就可以拼接，因为 {% label abandon blue %} 的最后一个字母与 {% label navie blue %} 的第一个字母相同，都为`n`。于是得到拼接后的结果为 {% label abandoNaive %} 。

下面给出$n$个单词，请判断这些单词是否能够拼接成一个环。要求每个单词都必须使用且只能使用一次。

本题采用spj。spj代码会在最后给出。
## 输入
第一个数单词个数$n$。

接下来$n$个单词，用空格隔开。
## 输出
一个字符串，表示拼接后的结果，如果不能拼接，请输出 {% label None red %} 。注意，由于连接成了一个环，输出的第一个字符和最后一个字符都应该大写且相同，表示它们是连接在一起的。

## 示例1
>**输入**:
48
i am voting for donald trump my father is a union worker and his has tripled under president trump usa voter thank you and remember that the stock market is getting ready to break its all time high next year will be the best ever vote vote vote
**输出**:
>None
## 示例2
>**输入**:
9
erab example terminate tonic creme editor rob boycatt bat  
**输出**:
>TerminatExamplEraBaToniCremEditoRoBoycatT
## 数据范围
$n \leq 1000$，每个单词的长度大于2且不超过15个字符
## hint
欧拉回路
## 问题分析
该问题可以转换为一个图论问题，将每个单词视为一条从该单词的第一个字母指向该单词的最后一个字母的有向边。例如，可以将 {% label abandon %} 视为从顶点`a`指向顶点`n`的一条有向边。这样，该问题就转换为了求经过所有边恰好一次的一条回路，这种问题在图论中被称为欧拉回路问题。
以示例2中的输入为例，可以得到如下的一个有向图

{% graphviz %}
digraph {
    rankdir = LR;
    e -> r [label="editor"];
    e -> b [label="example"];
    e -> b [label="erab"];
    r -> b [label="rob"];
    b -> t [label="bat"];
    b -> t [label="boycatt"];
    t -> c [label="tonic"];
    t -> e [label="terminate"];
    c -> e [label="creme"];
}
{% endgraphviz %}

## 具体实现
{% codeblock lang:cpp %}
#include <iostream>
#include <cctype>
#include <string>
#include <cstring>
#include <vector>
#include <set>
#include <map>
#include <list>
#include <cassert>
#include <algorithm>

using std::string;
using std::vector;
using std::list;
using std::multiset;
using std::map;

struct Edge
{
    int from, to;
    string word;
    Edge(int from=0, int to=0, const string & word = "") : from(from), to(to), word(word) {}
};
map<int, list<Edge> > graph;
int in[256], out[256];
vector<string> ans;

void add_edge(const string & word) {
    int from = *word.begin();
    int to = *word.rbegin();

    graph[from].push_back(Edge(from, to, word));
    out[from]++;
    in[to]++;
}

void dfs(int from) {
    if(graph.find(from) == graph.end()) return;

    auto & edges = graph[from];
    while(edges.size() > 0) {
        auto edge = edges.front();
        edges.pop_front();
        dfs(edge.to);
        ans.push_back(edge.word);
    }
}

// word-solitaire
string word_solitaire(const vector<string> & words) {
    memset(out, 0 , sizeof(out));
    memset(in, 0, sizeof(in));

    for(const string & word : words) {
        add_edge(word);
    }
    for(int i=0; i<256; i++) {
        if(in[i] != out[i]) return "None";
    }

    dfs(words[0][0]);
    std::reverse(ans.begin(), ans.end());

    string ret;
    // 将ans中的字符串拼接即可
    for(string & word : ans) {
        *word.begin() = toupper(*word.begin());
        ret.insert(ret.end(), word.begin(), word.end()-1);
    }
    ret.push_back(ret[0]);

    return ret;
}

bool check(const vector<string> & words, string & answer) {
    multiset<string> set;
    for(const auto & word : words) {
        set.insert(word);
    }

    auto st = answer.begin();
    // 第一个字母必须大写
    if(islower(*st)) return false;
    *st = tolower(*st);
    
    string hold = "";
    while(st != answer.end()) {
        while(st != answer.end() && islower(*st)) {
            hold += *st;
            st++;
        }
        if(st == answer.end()) return false; // 最后一个字母没有大写
        assert(isupper(*st));
        *st = tolower(*st);
        hold += *st;

        auto it = set.find(hold);
        if(it == set.end()) return false; // 不存在这个单词
        set.erase(it); // 删除这个单词

        hold.clear();
        hold += *st;
        st++;
    }

    return set.empty();
}

int main(int argc, char *argv[])
{

    vector<string> words = { "erab", "example", "terminate", "tonic", "creme", "editor", "rob", "boycatt", "bat" };
    string answer = "TerminatExamplEraBaToniCremEditoRoBoycatT";

    words.clear();
    int n;
    std::cin >> n;
    for(int i=0; i<n; i++) {
        string word;
        std::cin >> word;
        words.push_back(word);
    }
    answer = word_solitaire(words);

    std::cout << answer << std::endl;
    std::cout << check(words, answer) << std::endl;
}

{% endcodeblock %}
