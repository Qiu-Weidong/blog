---
title: graphviz插件
date: 2022-12-30 15:43:44
tags:
categories:
---

{% graphviz %}
digraph { a -> b },,,
{% endgraphviz %}


{% graphviz %}
digraph { c -> d }
{% endgraphviz %}


{% graphviz %}
digraph { c -> b; a -> b; }
{% endgraphviz %}

{% graphviz %}
digraph { c -> b; a -> b; a -> k; a -> h; b -> h; }
{% endgraphviz %}