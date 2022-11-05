---
title: 翻书效果实现
date: 2022-11-05 16:40:43
tags:
  - JavaScript
  - html
  - css
categories:
  - JavaScript
---
{% poem author:辛弃疾 source:青玉案·元夕 smoke:true %} 
春已归来，看美人头上，袅袅春幡。无端风雨，未肯收尽余寒。年时燕子，料今宵梦到西园。浑未办，黄柑荐酒，更传青韭堆盘。 
却笑东风，从此便熏梅染柳，更没些闲，闲时又来镜里，转变朱颜。清愁不断，问何人会解连环。生怕见花开花落，朝来塞雁先还。 
{% endpoem %}
## 效果预览
![翻书效果图](https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/images/turn2.gif)

## 实现代码
{% codetabs 翻书效果实现代码 %}
<!-- tab lang:html -->
<!doctype html>
<html>

<head>
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
	<script src='http://www.turnjs.com/lib/turn.min.js'></script>
	<script src="https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/pdfjs-dist/build/pdf.js"></script>

	<style type="text/css">
		body {
			background: #ccc;
		}

		#magazine {
			margin: auto;
			width: 75%;
		}

		#magazine .turn-page {
			background-color: #ccc;
			background-size: 100% 100%;
		}

		#magazine .loader {
			background-image: url(https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/images/loader.gif);
			width: 24px;
			height: 24px;
			display: block;
			position: absolute;
			top: 238px;
			left: 188px;
		}

		#magazine .odd {
			background-image: -webkit-linear-gradient(right, #FFF 95%, #ddd 100%);
			background-image: -moz-linear-gradient(right, #FFF 95%, #ddd 100%);
			background-image: -o-linear-gradient(right, #FFF 95%, #ddd 100%);
			background-image: -ms-linear-gradient(right, #FFF 95%, #ddd 100%);

		}

		#magazine .even {
			background-image: -webkit-linear-gradient(left, #FFF 95%, #ddd 100%);
			background-image: -moz-linear-gradient(left, #FFF 95%, #ddd 100%);
			background-image: -o-linear-gradient(left, #FFF 95%, #ddd 100%);
			background-image: -ms-linear-gradient(left, #FFF 95%, #ddd 100%);
		}
	</style>
</head>

<body>

	<div id="magazine">
	</div>


<script type="text/javascript" src="./bookturn.js">
</script>

</body>

</html>
<!-- endtab -->

<!-- tab lang:javascript -->

(function () {
    const url = 'https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/pdf/The Definitive ANTLR 4 Reference, 2nd Edition.pdf'; //你要放的pdf檔
    // const url = './周髀程式释注.pdf';
    if (!pdfjsLib ||/* !pdfjsViewer */ !pdfjsLib.getDocument) {
        return alert('Please build the pdfjs-dist library using\n  `gulp dist-install`');
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/pdfjs-dist/build/pdf.worker.min.js";

    // queue是一个 [number], 保存了等待渲染的页码。
    let pdfDoc = null, scale = 1.5;
    const container = document.getElementById('magazine');

    const CMAP_URL = "https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/pdfjs-dist/cmaps/";
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
        container.appendChild(cover);
        renderPage(1).then(canvas => {
            cover.appendChild(canvas);
            
            // 这里设置一下 #magazine 的长宽
            // 按照 pdf的长宽比例来设置#magazine的高度。
            const height = container.clientWidth / 2 * canvas.height / canvas.width;
            container.style.height = height + 'px';

            const cover2 = document.createElement('div');
            cover2.className = 'hard cover';
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

<!-- endtab -->
{% endcodetabs %}


