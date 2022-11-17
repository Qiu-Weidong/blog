---
title: Hexo实现pdf电子书阅读器
date: 2022-08-20 20:51:21
tags:
  - 博客
  - hexo
  - butterfly
categories:
  - hexo 
---
## 效果预览
点击文档右侧或左侧可以翻页。
<!-- 直接在这里面写html -->

<!-- <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js'></script> -->
<script src="/js/pdf.js"></script>
<!-- 導入需要的css -->
<link rel="stylesheet" href="/css/book.css">

<div class="book-viewer">

<div class="read-wrapper">
  <canvas id="the-book" style="width:100%"></canvas>
  <!-- 在这里添加覆盖层，以便翻页 -->
  <div class="mask">
    <div class="prev-page" id="prev"></div>
    <!-- <div class="menu"></div> -->
    <div class="next-page" id="next"></div>
  </div>
</div>

<div class="read-footer">
    <div class="footer-prev">
        <div id="prev-btn" class="btn-beautify larger green outline" target="_blank" rel="noopener" title="上一页" style="cursor: pointer;"><i class="far fa-hand-point-left"></i><span>上一页</span></div>
    </div>
    <div class="footer-next">
        <div id="next-btn" class="btn-beautify larger green outline" target="_blank" rel="noopener" title="下一页" style="cursor: pointer;"><i class="far fa-hand-point-right"></i><span>下一页</span></div>
    </div>
</div>

</div>
<script>
    var url = 'https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/pdf/周髀程式释注.pdf'
</script>
<script src="/js/book.js" ></script>

## 具体实现
在`themes/butterfly/source/css`文件夹下面新建文件`book.css`，文件内容如下:
```css
/* 一些book需要的css寫在這裏 */
.book-viewer {
    position: relative;


}
.book-viewer .read-wrapper .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
}

.book-viewer .read-wrapper .mask .prev-page {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 30%;
    height: 100%;    
}
.book-viewer .read-wrapper .mask .next-page {
    position: absolute;
    top: 0%;
    right: 0%;
    width: 30%;
    height: 100%;  
}


```
接下来，下载`pdf.js`和`pdf.worker.js`，下载链接为[https://mozilla.github.io/pdf.js/getting_started/#download](https://mozilla.github.io/pdf.js/getting_started/#download)。然后将这两个文件拷贝到`themes/butterfly/source/js`文件夹下。
还是在`themes/butterfly/source/js`文件夹下，创建一个新文件`book.js`。内容如下:
```js
(function book() {
  // var url = '你要展示的pdf文件路径'; //這邊是要秀的pdf
  var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    canvas = document.getElementById('the-book'), // 抓html ID
    ctx = canvas.getContext('2d');

  /**
   * Get page info from document, resize canvas accordingly, and render page.
   * @param num Page number.
   */
  function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function (page) {
      // 直接按照783来配scale
      var viewport = page.getViewport({ scale: 2 });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function () {
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });
  }

  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  /**
   * Displays previous page.
   */
  function onPrevPage() {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  }
  document.getElementById('prev').addEventListener('click', onPrevPage);

  /**
   * Displays next page.
   */
  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  }
  document.getElementById('next').addEventListener('click', onNextPage);

  /**
   * Asynchronously downloads PDF.
   */
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.js';
  pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
    pdfDoc = pdfDoc_; /*PDFDocumentProxy*/
    renderPage(pageNum);
  });
})();
```

最后，使用`npx hexo n xxx`命令创建一个新的博客文档，添加如下代码:
```html
<script src="/js/pdf.js"></script>
<!-- 導入需要的css -->
<link rel="stylesheet" href="/css/book.css">

<div class="book-viewer">

<div class="read-wrapper">
  <canvas id="the-book" style="width:100%"></canvas>
  <!-- 在这里添加覆盖层，以便翻页 -->
  <div class="mask">
    <div class="prev-page" id="prev"></div>
    <!-- <div class="menu"></div> -->
    <div class="next-page" id="next"></div>
  </div>
</div>

<div class="read-footer">
    <div class="footer-prev">
        <div id="prev-btn" class="btn-beautify larger green" target="_blank" rel="noopener" title="上一页"><i class="far fa-hand-point-left"></i><span>上一页</span></div>
    </div>
    <div class="footer-next">
        <div id="next-btn" class="btn-beautify larger green" target="_blank" rel="noopener" title="下一页"><i class="far fa-hand-point-right"></i><span>下一页</span></div>
    </div>
</div>

</div>
<script>
    var url = 'https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/pdf/周髀程式释注.pdf'
</script>
<script src="/js/book.js" ></script>
```
<!-- {% btn 'https://butterfly.js.org/',Butterfly,far fa-hand-point-right,outline larger %} -->