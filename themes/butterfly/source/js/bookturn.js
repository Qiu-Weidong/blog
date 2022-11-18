"use strict";

(function () {
    // 直接在这里设置一下 body 的背景颜色。
    document.body.style.background = '#ccc';
    const url = document.currentScript.getAttribute('url');
    if (!url || url === '') {
        return alert('no book url');
    }
    if (!pdfjsLib ||/* !pdfjsViewer */ !pdfjsLib.getDocument) {
        return alert('Please build the pdfjs-dist library using\n  `gulp dist-install`');
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/pdfjs-dist/build/pdf.worker.min.js";

    // queue是一个 [number], 保存了等待渲染的页码。
    let pdfDoc = null, scale = 1.5;
    const container = document.getElementById('magazine');

    const CMAP_URL = "https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/pdfjs-dist/cmaps/";
    const CMAP_PACKED = true;
    const ENABLE_XFA = true;
    let loadingTask = pdfjsLib.getDocument({
        url,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        enableXfa: ENABLE_XFA,
    });


    loadingTask.promise.then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;

        // 首先来个封面
        const cover = document.createElement('div');
        cover.className = 'hard cover';
        cover.style.width = "80%";
        cover.style.height = "80%";

        container.appendChild(cover);
        renderPage(1).then(canvas => {
            cover.appendChild(canvas);
            
            // 这里设置一下 #magazine 的长宽
            // 按照 pdf的长宽比例来设置#magazine的高度。
            const height = container.clientWidth / 2 * canvas.height / canvas.width;
            console.log(height);
            container.style.height = height + 'px';

            const cover2 = document.createElement('div');
            cover2.className = 'hard cover';
            cover2.style.width = "80%";
            cover2.style.height = "80%";
            
            container.appendChild(cover2);
            renderPage(2).then(canvas => {
                cover2.appendChild(canvas);

                $('#magazine').turn({
                    pages: pdfDoc.numPages,
                    display: 'double',
                    acceleration: true,
                    gradients: !$.isTouch,
                    elevation: 50,
                    when: {
                        // turned: function (e, page) {
                        // },

                        turning: function (e, page, view) {
                            const range = $(this).turn('range', page);
                            const start = range[0], end = range[1];
                            for (page = start; page <= end; page++) {
                                addPage(page, $(this));
                            }
                        },
                    }
                });
            });
        });
    });

    // 返回一个渲染好的canvas
    function renderPage(num) {
        return new Promise(function (resolve, _reject) {

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            pdfDoc.getPage(num).then(function (page) {
                let viewport = page.getViewport({ scale: scale, });
                // Support HiDPI-screens.
                let outputScale = window.devicePixelRatio || 1;

                canvas.width = Math.floor(viewport.width * outputScale);
                canvas.height = Math.floor(viewport.height * outputScale);
                canvas.style.width = "100%";

                let transform = outputScale !== 1
                    ? [outputScale, 0, 0, outputScale, 0, 0]
                    : null;

                // Render PDF page into canvas context
                let renderContext = {
                    canvasContext: ctx,
                    transform: transform,
                    viewport: viewport,
                };

                page.render(renderContext).promise.then(() => {
                    resolve(canvas);
                });
            });
        });
    }

    function addPage(page, book) {
        if (!book.turn('hasPage', page)) {
            const element = document.createElement('div');
            element.style.width = "80%";
            element.style.height = "80%";

            element.innerHTML = '<i class="loader"></i>';
            book.turn('addPage', element, page);
            renderPage(page).then(canvas => { element.innerHTML = ''; element.appendChild(canvas); }); 
        }
    }

    $(window).bind('keydown', function (e) {

        if (e.keyCode == 37)
            $('#magazine').turn('previous');
        else if (e.keyCode == 39)
            $('#magazine').turn('next');

    });
})();


/*
w 1116 * h 1578

1152/2 = 576

1116 = 576
1578    h 

h = 576 * 1578 / 1116; = container.clientWidth / 2 * canvas.height / canvas.width;
*/