---
title: 使用Hexo搭建个人博客
date: 2022-10-28 19:45:18
tags:
  - blog
  - hexo
categories:
  - hexo
---

这篇博客记载了我的个人博客的搭建过程。
## 准备
首先需要安装`git`和`node.js`。
## 建站
使用如下命令建站:
```powershell
npx hexo init 项目名称
```
进入项目所在的文件夹，使用以下命令安装所需依赖:
```powershell
npm install
```
使用命令`npx hexo s`预览效果。

## 使用butterfly主题
### 安装butterfly主题
以下内容详见[butterfly官网](https://butterfly.js.org/posts/21cfbf15/#%E5%AE%89%E8%A3%9D)
首先在博客的根目录里面克隆butterfly，命令如下:
```powershell
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```
在hexo根目录下的`_config.yml`文件中找到`theme`，并将其修改为butterfly。
安装pug和stylus插件:
```powershell
npm install hexo-renderer-pug hexo-renderer-stylus --save
```
在博客项目的根目录下新建文件`_config.butterfly.yml`，然后将`themes/butterfly/_config.yml`文件中的内容拷贝进去。
### 增添标签、分类等页面
首先新建一个页面:
```powershell
npx hexo n post tags
```
在`source/tags/index.md`中，添加一条`type: 'tags'`。
```markdown
---
title: 標簽
date: 2022-10-28 19:53:39
type: 'tags'
---
```
使用同样的方式添加分类和友情链接页面，只需要将`tags`改为`categories`和`link`。
使用普通页面作为图库页面。
修改`error_404`相关配置，添加404效果。
```yml
error_404:
  enable: true
  subtitle: '你仿佛来到了没有知识的荒原。'
  background: 'https://i.loli.net/2020/05/19/aKOcLiyPl2JQdFD.png'
```
### 配置语言、导航等
在`_config.yml`文件中：
```yml
title: xxx
subtitle: '个人博客'
description: '靡不有初, 鲜克有终'
keywords:
author: xxx
language: zh-CN # 也可以使用zh-TW
timezone: 'Asia/Shanghai'
```
在`_config.butterfly.yml`中：
```yml
menu:
  首页: / || fas fa-home
  归档: /archives/ || fas fa-archive
  标签: /tags/ || fas fa-tags
  分类: /categories/ || fas fa-folder-open
  图库: /gallery/ || fa fa-image
  书籍: /book/ || fa fa-book
  友情链接: /link/ || fas fa-link
  关于: /about/ || fas fa-heart
```

代码自动换行配置。
在`_config.butterfly.yml`中配置`code_word_wrap`为true并且在`_config.yml`中配置`prismjs`下的`line_number`为false。
代码高度限制，在`_config.butterfly.yml`中配置`highlight_height_limit`为300 。
### 配置社交图标
```yml
social:
  fab fa-github: https://github.com/xxxxx || Github
  fa-brands fa-zhihu : https://zhihu.com || 知乎
  fa-brands fa-bilibili: https://bilibili.com || bilibili
```
头像和网站图标等设置略。
### 配置顶部图像和文章封面
 - `index_img`: 首页的顶部图。
 - `default_top_img`: 缺省的顶部图。
 - `archive_img`: 归档页面的顶部图。
 - `tag_img`: 标签页面的顶部图。
 - `category_img`: 分类页面的顶部图。
配置`cover`下面的`default_cover`，添加所有想要的图片。
### 配置footer
配置`footer-bg`为footer的背景图片地址。
并配置`footer`下面的`custom_text`为footer的文字内容。
### 配置右下角按钮
配置`translate`，将`enable`配置为true。
### 配置访问人数
将`busuanzi`下面的选项都配置为true。
### 配置评论
首先配置`comments`下面的`use`为`gitalk`。
接下来配置`gitalk`
```yml
gitalk:
  enable: true
  client_id: xxxxxxx
  client_secret: xxxxxxxxx
  repo: xxxxxxxx
  owner: xxxxxx
  admin: xxxxxxx
  option:
```

### 配置标题字体
首先添加字体，在`themes/butterfly/source/css`文件夹下新家一个`font.css`文件，添加需要的字体。
```css
@font-face {
    font-family: '字体名称';
    font-display: swap;
    src: url('字体路径');
}
```
然后在`inject`下面配置css，
```yml
inject:
  head:
    - <link rel="stylesheet" href="/css/font.css">
```
然后配置字体
```yml
blog_title_font:
  font_link:
  font-family: 方正行楷繁体, 方正行楷简体, 华文行楷, FZXKB, FZXKJW, FZYBXSJW, XingKai
```
配置网站副标题
```yml
subtitle:
  enable: true
  # Typewriter Effect (打字效果)
  effect: true
  # Effect Speed Options (打字效果速度參數)
  startDelay: 300 # time before typing starts in milliseconds
  typeSpeed: 150 # type speed in milliseconds
  backSpeed: 50 # backspacing speed in milliseconds
  # loop (循環打字)
  loop: true
  # source 調用第三方服務
  # source: false 關閉調用
  # source: 1  調用一言網的一句話（簡體） https://hitokoto.cn/
  # source: 2  調用一句網（簡體） http://yijuzhan.com/
  # source: 3  調用今日詩詞（簡體） https://www.jinrishici.com/
  # subtitle 會先顯示 source , 再顯示 sub 的內容
  source: false
  # 如果關閉打字效果，subtitle 只會顯示 sub 的第一行文字
  sub:
    - 綠樹聽鵜鴂，更那堪、鷓鴣聲住，杜鵑聲切。
    - 啼到春歸無尋處，苦恨芳菲都歇。
    - 算未抵、人間離別。
    - 馬上琵琶關塞黑。更長門翠輦辭金闕。
    - 看燕燕，送歸妾。
    - 將軍百戰身名裂。向河梁、回頭萬裏，故人長絕。
    - 易水蕭蕭西風冷，滿座衣冠似雪。
    - 正壯士、悲歌未徹。
    - 啼鳥還知如許恨，料不啼清淚長啼血。
    - 誰共我，醉明月？
```

### 配置字数统计
```yml
wordcount:
  enable: true
  post_wordcount: true
  min2read: true
  total_wordcount: true
```
## 通用配置
### 添加脚注
```powershell
npm install hexo-reference --save
```
## 配置codetabs
首先，在`themes/butterfly/scripts/tag`目录下新建`codetabs.js`文件，内容如下
```javascript
/**
 * Tabs
 * transplant from hexo-theme-next
 * modify by Qiu Weidong
 */

'use strict'

function codeTabs(args, content) {
  let tab_name = args.length > 0 ? args[0] : 'tabs';
  const tabBlock = /<!--\s*tab (.*?)\s*-->\n([\w\W\s\S]*?)<!--\s*endtab\s*-->/g
  let match = tabBlock.exec(content);
  let id = 0;

  let tab_nav = '';
  let tab_content = '';

  while (match !== null) {
    const code_cfg = parseArgs(match[1].trim().split(' '));
    let code_content = renderCode(code_cfg, match[2]);
    id++;
    let tab_href = tab_name + '-' + id;
    const isActive = id === 1 ? ' active' : '';

    let lang = code_cfg.lang;
    let icon = `<i class="iconfont icon-${lang}"></i>`;
    tab_nav += `<li class="tab${isActive}"><button type="button" data-href="#${tab_href}">${icon + lang}</button></li>`
    tab_content += `<div class="tab-item-content${isActive}" id="${tab_href}">${code_content}</div>`
    match = tabBlock.exec(content);
  }
  return `<div class="tabs" id="${tab_name}">
             <ul class="nav-tabs">${tab_nav}</ul>
             <div class="tab-contents">${tab_content}</div>
           </div>`
}

const rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/\S+)\s+(.+)/i;
const rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/\S+)/i;
const rCaption = /\S[\S\s]*/;
function parseArgs(args) {
  const _else = [];
  const len = args.length;
  let lang,
    line_number, wrap;
  let firstLine = 1;
  const mark = [];
  for (let i = 0; i < len; i++) {
    const colon = args[i].indexOf(':');

    if (colon === -1) {
      _else.push(args[i]);
      continue;
    }

    const key = args[i].slice(0, colon);
    const value = args[i].slice(colon + 1);

    switch (key) {
      case 'lang':
        lang = value;
        break;
      case 'line_number':
        line_number = value === 'true';
        break;
      case 'first_line':
        if (!isNaN(value)) firstLine = +value;
        break;
      case 'wrap':
        wrap = value === 'true';
        break;
      case 'mark': {
        for (const cur of value.split(',')) {
          const hyphen = cur.indexOf('-');
          if (hyphen !== -1) {
            let a = +cur.substr(0, hyphen);
            let b = +cur.substr(hyphen + 1);
            if (Number.isNaN(a) || Number.isNaN(b)) continue;
            if (b < a) { // switch a & b
              const temp = a;
              a = b;
              b = temp;
            }

            for (; a <= b; a++) {
              mark.push(a);
            }
          }
          if (!isNaN(cur)) mark.push(+cur);
        }
        break;
      }
      default: {
        _else.push(args[i]);
      }
    }
  }

  const arg = _else.join(' ');
  // eslint-disable-next-line one-var
  let match, caption = '';

  if ((match = arg.match(rCaptionUrlTitle)) != null) {
    caption = `<span>${match[1]}</span><a href="${match[2]}">${match[3]}</a>`;
  } else if ((match = arg.match(rCaptionUrl)) != null) {
    caption = `<span>${match[1]}</span><a href="${match[2]}">link</a>`;
  } else if ((match = arg.match(rCaption)) != null) {
    caption = `<span>${match[0]}</span>`;
  }

  return {
    lang,
    firstLine,
    caption,
    line_number,
    mark,
    wrap
  };
}

const { escapeHTML } = require('hexo-util');

// Lazy require highlight.js & prismjs
let highlight, prismHighlight;
function renderCode(cfg, content) {
  const hljsCfg = hexo.config.highlight || {};
  const prismjsCfg = hexo.config.prismjs || {};

  // If neither highlight.js nor prism.js is enabled, return escaped code directly
  if (!hljsCfg.enable && !prismjsCfg.enable) {
    return `<pre><code>${escapeHTML(content)}</code></pre>`;
  }
  // rust 1  undefined undefined [] undefined
  // string number string undefined undefined object undefined
  const { lang, firstLine, caption, line_number, line_threshold, mark, wrap } = cfg;
  // firstLine = 1, caption = '', line_number = undefined, line_threshold = undefined, mark = [], wrap = undefined;
  // console.log(typeof(lang), typeof firstLine, typeof caption, typeof line_number, typeof line_threshold, typeof mark, typeof wrap);
  if (prismjsCfg.enable) {
    const shouldUseLineNumbers = typeof line_number !== 'undefined' ? line_number : prismjsCfg.line_number;
    let surpassesLineThreshold;

    if (typeof line_threshold !== 'undefined') {
      surpassesLineThreshold = content.split('\n').length > line_threshold;
    } else {
      surpassesLineThreshold = content.split('\n').length > (prismjsCfg.line_threshold || 0);
    }

    const prismjsOption = {
      lang,
      firstLine,
      caption,
      lineNumber: shouldUseLineNumbers && surpassesLineThreshold,
      mark,
      tab: prismjsCfg.tab_replace,
      isPreprocess: prismjsCfg.preprocess
    };

    if (!prismHighlight) prismHighlight = require('hexo-util').prismHighlight;

    content = prismHighlight(content, prismjsOption);
  } else {
    const shouldUseLineNumbers = typeof line_number !== 'undefined'
      ? line_number : hljsCfg.line_number;
    let surpassesLineThreshold;

    if (typeof line_threshold !== 'undefined') {
      surpassesLineThreshold
        = content.split('\n').length > line_threshold;
    } else {
      surpassesLineThreshold
        = content.split('\n').length > (hljsCfg.line_threshold || 0);
    }

    const hljsOption = {
      lang: typeof lang !== 'undefined' ? lang : '',
      firstLine,
      caption,
      gutter: shouldUseLineNumbers && surpassesLineThreshold,
      hljs: hljsCfg.hljs,
      mark,
      tab: hljsCfg.tab_replace,
      autoDetect: hljsCfg.auto_detect,
      wrap: typeof wrap === 'boolean' ? wrap : hljsCfg.wrap
    };

    if (!highlight) highlight = require('hexo-util').highlight;

    content = highlight(content, hljsOption);
  }

  content = content.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
  content = content.slice(0, 7) + ' style="margin: 0 0 0 " ' + content.slice(7);
  return content;


}

hexo.extend.tag.register('codetabs', codeTabs, { ends: true })

```
然后修改`themes/butterfly/source/_tags/tabs.styl`文件，将第54行注释掉
```styl
    > .tab-contents
      .tab-item-content
        position: relative
        display: none
        // padding: 36px 24px 将这一行注释掉
```
最后，修改`themes/butterfly/source/main.js`的第160行，
```javascript
// 修改前
if (highlightHeightLimit && item.offsetHeight > highlightHeightLimit + 30 ) {
// 修改为
if (highlightHeightLimit && item.offsetHeight > highlightHeightLimit + 30 
  || item.offsetHeight === 0) {
```



