---
title: hexo-graphviz-tag插件
date: 2022-12-31 21:49:49
tags:
  - dot
  - graphviz
categories:
  - graphviz
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.

Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.

{% graphviz title:mygraph maxWidth:300 align:right %}
digraph {
  rankdir = LR;
  node [shape=circle]
  a -> b;
  b -> d;
  c -> b;
  d -> a;
  d -> c;
  a -> c;
  b -> e;
}
{% endgraphviz %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.

Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.

{% graphviz mygraph %}
digraph {
  rankdir = LR;
  node [shape=circle]
  a -> b;
  b -> c;
  c -> d;
  d -> e;
}
{% endgraphviz %}

<!-- 可以使用 color="transparent" 来隐藏边 -->
{% graphviz title:图像标题 align:right maxWidth:40em %}
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
{% graphviz  只有标题 %}

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
{% graphviz align:left max-width:300 title:左对齐 %}
graph {
    v0 [label="张三"];
    v1 [label="李四"];
    v2 [label="王五" shape="box"];

    v0 -- v1 [label="借钱"];
    v2 -- v1 [label="退钱"];
}

{% endgraphviz %}


