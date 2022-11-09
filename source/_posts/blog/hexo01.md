---
title: hexo的butterfly主题美化——文字烟雾效果实现
date: 2022-05-22 14:30:50
tags:
  - 博客
  - hexo
  - butterfly
categories:
  - hexo
---
## 效果展示
当鼠标滑过下面的诗歌的时候，诗歌会变成烟雾。
{% poem smoke:true author:辛弃疾 source:青玉案 %}
东风夜放花千树，更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。
蛾儿雪柳黄金缕，笑语盈盈暗香去。众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。
{% endpoem %}
## GIF展示

## 实现方式
首先在路径`themes/butterfly/source/css`下面新建一个css文件`inject.css`，用于存放我们自己编写的css代码。`inject.css`文件中的代码如下所示。
{% codeblock lang:css inject.css %}
/* 自定义的css写在这里 */
.poem-container {
    font-family: '华文行楷', '方正行楷繁体', '方正行楷简体',  Xingkai SC;
    font-size: 1.2em;
    margin: 1.6em 20px;
    text-align: center;
    background-color: transparent;
    border-left: 0px;

}

blockquote  span{
    position: relative;
    display: inline-block;
    user-select: none;
    /* cursor: pointer; */
}

blockquote span.active{
    animation: smoke 4s linear forwards;
    transform-origin: bottom;
    user-select: text;
}

@keyframes smoke{
    0%{
        opacity: 1;
        filter: blur(0);
        transform: translateX(0) translateY(0) rotate(0deg) scale(1);
    }
    30%{
        opacity: 0;
        filter: blur(20px);
        transform: translateX(300px) translateY(-300px) rotate(720deg) scale(4);
    }
    100%{
        opacity: 1;
        transform: translateX(0) translateY(0) rotate(0deg) scale(1);
    
    }
}
{% endcodeblock %}
然后，在`_config.butterfly.yml`文件中找到`inject`配置项，并在`head`下面将新建的css文件导入。如下所示
{% codeblock lang:yml _config.butterfly.yml %}
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/css/inject.css">
  bottom:
    # - <script src="xxxx"></script>
{% endcodeblock %}

接下来，在路径`themes/butterfly/scripts/tag`下面新建`poem.js`文件，文件内容如下所示。
```javascript
'use strict'

function parseArgs(args) {
    let result = {
        author: '',
        source: '',
        smoke: false
    };

    for (let i in args) {
        let arg = args[i];
        let pair = arg.split(':');
        if (pair.length >= 2) {
            if (pair[0] == 'author') { result.author = pair[1]; }
            else if (pair[0] == 'source') { result.source = pair[1]; }
            else if (pair[0] == 'smoke') { result.smoke = pair[1] == 'true' ? true: false; }
        }
    }

    return result;
}

function poemTag(args, content) {
    args = parseArgs(args);

    let result = '<blockquote id="poem-container" class="poem-container">';
    result += hexo.render.renderSync({ text: content, engine: 'markdown' });
    if (args.author != '') {
        result += `<footer style="text-align: right"><strong>${args.author}</strong>`;
        if (args.source != '') {
            result += `<cite>《${args.source}》</cite>`
        }
        result += "</footer>"
    }
    result += '</blockquote>';
    if (args.smoke)
        result += '<script src="/js/smoke.js"></script>';

    return result;
}

hexo.extend.tag.register('poem', poemTag, { ends: true })

```
然后就可以使用标签插件poem来引用诗歌了。如下所示。
{% codeblock lang:markdown %} {% raw  %}
{% poem smoke:true author:辛弃疾 source:青玉案 %}
东风夜放花千树，更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。
蛾儿雪柳黄金缕，笑语盈盈暗香去。众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。
{% endpoem %} {% endraw %}
{% endcodeblock %}
`poem`标签插件有三个参数，`author`表示作者、`source`表示诗歌题目、`smoke`是一个bool值，表示是否使用烟雾效果。
