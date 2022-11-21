---
title: Hexo中butterfly主题添加标签云效果
date: 2022-11-01 17:11:34
tags:
  - hexo
  - butterfly
  - blog
categories:
  - [hexo, butterfly]
---
## 效果展示
<div class="tag-cloud-list is-center"><script type="text/javascript" charset="utf-8" src="/js/tagcloud.js"></script><script type="text/javascript" charset="utf-8" src="/js/tagcanvas.js"></script><canvas id="resCanvas" align="center" width="785" height="785" style="width:100%;"><a href="/tags/blog/" style="font-size: 20px;">blog</a> <a href="/tags/butterfly/" style="font-size: 20px;">butterfly</a> <a href="/tags/hexo/" style="font-size: 20px;">hexo</a> <a href="/tags/%E5%A4%A7%E6%98%8E/" style="font-size: 10px;">大明</a> <a href="/tags/%E7%AC%91%E8%AF%9D/" style="font-size: 10px;">笑话</a> <a href="/tags/%E8%8B%8F%E8%81%94%E7%AC%91%E8%AF%9D/" style="font-size: 10px;">苏联笑话</a></canvas></div>

## gif效果展示
![标签云gif效果](https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/images/tagcloud.gif)
## 配置方式
首先，安装`hexo-tag-cloud`插件。
```shell
npm install hexo-tag-cloud -S
```
然后修改`theme/butterfly/layout/includes/page/tags`文件
```pug
.tag-cloud-list.is-center
  !=cloudTags({source: site.tags, minfontsize: 1.2, maxfontsize: 2.1, limit: 0, unit: 'em'})

.tag-cloud-list.is-center
  script(type="text/javascript" charset="utf-8" src="/js/tagcloud.js")
  script(type="text/javascript" charset="utf-8" src="/js/tagcanvas.js")
  canvas#resCanvas(align='center', width="785", height="785", style='width:100%;')
    != tagcloud()
```

