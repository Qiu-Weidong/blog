
"use strict";

(function () {
    const url = document.currentScript.getAttribute('url');
    const turn_direction = document.currentScript.getAttribute('turn') || 'left'; // 默认向左翻书
    if (!url || url === '') return;
    if (!pdfjsLib ||/* !pdfjsViewer */ !pdfjsLib.getDocument) {
        return alert('Please build the pdfjs-dist library using\n  `gulp dist-install`');
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/pdfjs-dist/build/pdf.worker.min.js";

    let pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 2.0,
        canvas = document.getElementById('book-canvas'),
        ctx = canvas.getContext('2d');

    function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport({ scale: scale, });
            // Support HiDPI-screens.
            var outputScale = window.devicePixelRatio || 1;

            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = "100%";

            var transform = outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : null;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: ctx,
                transform: transform,
                viewport: viewport,
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

    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    function onPrevPage() {
        if (pageNum <= 1) {
            return alert('已经是第一页了');
        }
        pageNum--;
        queueRenderPage(pageNum);
    }
    
    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return alert('已经是最后一页了') ;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }

    if(turn_direction !== 'right') {
        document.getElementById('prev').addEventListener('click', onPrevPage);
        document.getElementById('next').addEventListener('click', onNextPage);
    }
    else {
        document.getElementById('next').addEventListener('click', onPrevPage);
        document.getElementById('prev').addEventListener('click', onNextPage);
    }
    
    /**
     * Asynchronously downloads PDF.
     */
    const CMAP_URL = "https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/pdfjs-dist/cmaps/";
    const CMAP_PACKED = true;
    const ENABLE_XFA = true;
    var loadingTask = pdfjsLib.getDocument({
        url,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        enableXfa: ENABLE_XFA,
    });
    loadingTask.promise.then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        renderPage(pageNum);
    });
})();


