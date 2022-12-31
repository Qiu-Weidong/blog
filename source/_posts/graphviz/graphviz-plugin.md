---
title: hexo-graphviz-tag插件
date: 2022-12-31 21:49:49
tags:
  - dot
  - graphviz
categories:
  - graphviz
---
<!-- 可以使用 color="transparent" 来隐藏边 -->
{% graphviz %}
digraph {
    rankdir = LR;


    e -> r [label="editor" style="dotted"];
    e -> b [label="example"];
    e -> b [label="erab"];
    r -> b [label="rob" color="transparent"];
    b -> t [label="bat"];
    b -> t [label="boycatt"];
    t -> c [label="tonic"];
    t -> e [label="terminate" dir="both"];
    c -> e [label="creme"];
}
{% endgraphviz %}

---
<!-- 支持中文 -->
{% graphviz  %}

digraph {
    v0 [label="张三"];
    v1 [label="李四"];
    v2 [label="王五"];

    v0:n -> v1:n [label="借钱"];
    v2:w -> v1:s [label="退钱"];
    v1 -> "赵七" ;
}

{% endgraphviz %}

---
<!-- 无向图 使用 -- 而不是 ->  -->
{% graphviz  %}

graph {
    v0 [label="张三"];
    v1 [label="李四"];
    v2 [label="王五" shape="box"];

    v0 -- v1 [label="借钱"];
    v2 -- v1 [label="退钱"];
}

{% endgraphviz %}

