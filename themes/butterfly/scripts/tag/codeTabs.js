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
