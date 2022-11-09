---
title: dot语言介绍
date: 2022-05-07 08:10:25
katex: true
tags:
  - dot
  - graphviz
categories:
  - graphviz
---
## dot的语法
dot的语法定义如下所示:
<pre>
graph	    :	[ <b>strict</b> ]  (<b>graph</b> | <b>digraph</b>)  [ ID ]  '<b>{</b>'  stmt_list  '<b>}</b>'  
stmt_list   :	[ stmt [ '<b>;</b>' ] stmt_list ]
stmt	    :	node_stmt
            |	edge_stmt
            |  	attr_stmt
            |	ID '<b>=</b>' ID
            |	subgraph
attr_stmt   :	(<b>graph</b> | <b>node</b> | <b>edge</b>) attr_list
attr_list   :	'<b>[</b>' [ a_list ] '<b>]</b>' [ attr_list ]
a_list	    :	ID '<b>=</b>' ID [ ('<b>;</b>' | '<b>,</b>') ] [ a_list ]
edge_stmt   :	(node_id | subgraph) edgeRHS [ attr_list ]
edgeRHS     :	edgeop (node_id | subgraph) [ edgeRHS ]
node_stmt   :	node_id [ attr_list ]
node_id     :	ID [ port ]
port        :	'<b>:</b>' ID [ '<b>:</b>' compass_pt ]
            |	'<b>:</b>' compass_pt
subgraph    :	[ <b>subgraph</b> [ ID ] ] '<b>{</b>' stmt_list '<b>}</b>'
compass_pt  :	(n | ne | e | se | s | sw | w | nw | c | _)
</pre>
加粗表示终结符、没有加粗表示非终结符。关键字**node**、**edge**、**graph**、**digraph**、**subgraph**以及**strict**不区分大小写。