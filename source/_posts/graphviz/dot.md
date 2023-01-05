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
需要注意的是，当使用 `dot -Tpng input.dot` 生成图片时候，一定要加上 `-o output.png` 指定输出文件。
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

其 antlr4 语法如下:

```antlr4
/*
 copy from https://github.com/antlr/grammars-v4.git
 */

grammar Dot;

graph_list: graph+ EOF;

graph: STRICT? ( GRAPH | DIGRAPH) id_? '{' stmt_list '}';

stmt_list: ( stmt ';'?)*;

stmt:
	node_stmt
	| edge_stmt
	| attr_stmt
	| id_ '=' id_
	| subgraph;

attr_stmt: ( GRAPH | NODE | EDGE) attr_list;

attr_list: ( '[' a_list? ']')+;

a_list: ( id_ ( '=' id_)? ','?)+;

edge_stmt: ( node_id | subgraph) edgeRHS attr_list?;

edgeRHS: ( edgeop ( node_id | subgraph))+;

edgeop: '->' | '--';

node_stmt: node_id attr_list?;

node_id: id_ port?;

port: ':' id_ ( ':' id_)?;

subgraph: ( SUBGRAPH id_?)? '{' stmt_list '}';

id_: ID | STRING | HTML_STRING | NUMBER;

// "The keywords node, edge, graph, digraph, subgraph, and strict are case-independent"

STRICT: [Ss] [Tt] [Rr] [Ii] [Cc] [Tt];

GRAPH: [Gg] [Rr] [Aa] [Pp] [Hh];

DIGRAPH: [Dd] [Ii] [Gg] [Rr] [Aa] [Pp] [Hh];

NODE: [Nn] [Oo] [Dd] [Ee];

EDGE: [Ee] [Dd] [Gg] [Ee];

SUBGRAPH: [Ss] [Uu] [Bb] [Gg] [Rr] [Aa] [Pp] [Hh];

/** "a numeral [-]?(.[0-9]+ | [0-9]+(.[0-9]*)? )" */ NUMBER:
	'-'? ('.' DIGIT+ | DIGIT+ ( '.' DIGIT*)?);

fragment DIGIT: [0-9];

/** "any double-quoted string ("...") possibly containing escaped quotes" */ STRING:
	'"' ('\\"' | .)*? '"';

/** "Any string of alphabetic ([a-zA-Z\200-\377]) characters, underscores
 ('_') or digits ([0-9]),
 not beginning with a digit"
 */
ID: LETTER ( LETTER | DIGIT)*;

fragment LETTER: [a-zA-Z\u0080-\u00FF_];

/** "HTML strings, angle brackets must occur in matched pairs, and
 unescaped newlines are
 allowed."
 */
HTML_STRING: '<' ( TAG | ~ [<>])* '>';

fragment TAG: '<' .*? '>';

COMMENT: '/*' .*? '*/' -> channel(HIDDEN);

LINE_COMMENT: '//' .*? '\r'? '\n' -> channel(HIDDEN);

/** "a '#' character is considered a line output from a C preprocessor (e.g.,
 # 34 to indicate
 line
 34 ) and discarded"
 */
PREPROC: '#' ~[\r\n]* -> channel(HIDDEN);

WS: [ \t\n\r]+ -> skip;
```

{% graphviz maxWidth:600 %}
digraph G {
	node [fillcolor="yellow:green" style=filled gradientangle=270] a0;
  node [fillcolor="lightgreen:red"] a1;
  node [fillcolor="lightskyblue:darkcyan"] a2;
  node [fillcolor="cyan:lightslateblue"] a3;

  // a4 会继承 a3的属性
  a4;
}
{% endgraphviz %}


