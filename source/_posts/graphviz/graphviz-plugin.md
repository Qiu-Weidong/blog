---
title: graphviz插件
date: 2022-12-30 15:43:44
tags:
categories:
---

下图是一个有向图。
{% graphviz %}
digraph { 
    a -> b 
},
{% endgraphviz %}
INFO  ---- START COPYING TAG CLOUD FILES ----
INFO  ---- END COPYING TAG CLOUD FILES ----

{% graphviz 来点参数 %}
digraph { c -> d; c -> b; }
{% endgraphviz %}

INFO  Validating config
INFO  
      #####  #    # ##### ##### ###### #####  ###### #      #   #    
      #    # #    #   #     #   #      #    # #      #       # #     
      #####  #    #   #     #   #####  #    # #####  #        #     
      #    # #    #   #     #   #      #####  #      #        #      
      #    # #    #   #     #   #      #   #  #      #        #    
      #####   ####    #     #   ###### #    # #      ######   #
{% graphviz 参数 %}
digraph { c -> b; a -> b; }
{% endgraphviz %}

{% graphviz %}
digraph { c -> b; a -> b; a -> k; a -> h; b -> h; }
{% endgraphviz %}


![图片描述](https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/images/%E5%A3%81%E7%BA%B8/leosng.jpg)
