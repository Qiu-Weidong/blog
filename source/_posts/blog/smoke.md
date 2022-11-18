---
title: 文字烟雾效果的实现
date: 2022-04-30 10:52:47
tags:
  - 前端
  - JavaScript
  - html
categories:
  - 前端
description: 这篇博客使用css实现了文字变成烟雾的效果
---



## 效果预览
鼠标经过文字的时候，会出现烟雾的效果
{% raw %}
<div id="preview-container" class="smoke-container"> 
  <p class="smoke-text">
    午南卜卯印即去又及取受口召可史右各合吉名向君启吹告周咸品唐唯商

    喜嘉四因囿圉土在壬复夕夙多大天夫夷奚奠女好如妣妥妹妻妾姬娥子季
    
    宀宁它宅安宗官宜宣室宫
  </p>
</div>
<script>
    const text = document.getElementById('preview-container').querySelector('.smoke-text');
    text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>")

    const letters = text.querySelectorAll("span");
    for (let i = 0; i < letters.length; i++) {
        letters[i].addEventListener('mouseover', function () {
            letters[i].classList.add('active')
        })
    }
</script>
<style>
    .smoke-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 440px;
        /* height: 100vh; */
        background-color: #111;
        background-image: url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/images/hacker/hacker0.jfif');
        background-size: 100%;
        overflow: hidden;
    }

    .smoke-container .smoke-text {
        /* color: aliceblue; */
        color: #00cc33;
        user-select: none;
        font-family: '方正甲骨文';
        font-size: 20px;
        margin-left: 20%;
        margin-right: 20%;
    }

    .smoke-container .smoke-text span {
        position: relative;
        display: inline-block;
    }

    .smoke-container .smoke-text span.active {
        animation: smoke 4s linear forwards;
        transform-origin: bottom;
    }

    @keyframes smoke {
        0% {
            opacity: 1;
            filter: blur(0);
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);
        }

        30% {
            opacity: 0;
            filter: blur(20px);
            transform: translateX(300px) translateY(-300px) rotate(720deg) scale(4);
        }

        100% {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);

        }
    }
</style>

{% endraw %}
## gif预览
![文字烟雾效果](https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/images/烟雾.gif)
## 具体代码
{% codeblock lang:html %}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>烟雾效果测试</title>
</head>

<body>
    <div id="preview-container" class="smoke-container">
        <p class="smoke-text">
            午南卜卯印即去又及取受口召可史右各合吉名向君启吹告周咸品唐唯商

            喜嘉四因囿圉土在壬复夕夙多大天夫夷奚奠女好如妣妥妹妻妾姬娥子季

            宀宁它宅安宗官宜宣室宫
        </p>
    </div>
    <script>
        const text = document.getElementById('preview-container').querySelector('.smoke-text');
        text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>")

        const letters = text.querySelectorAll("span");

        for (let letter of letters) {
            letter.addEventListener('mouseover', function () {
                letter.classList.add('active');
            });
        }
    </script>
</body>
<style>
    .smoke-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 440px;
        /* height: 100vh; */
        /* background-color: #111; */
        background-image: url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/images/matrix/wallhaven-e72xro.jpg');
        background-size: 100%;
        overflow: hidden;
    }

    .smoke-container .smoke-text {
        color: aliceblue;
        user-select: none;
        font-family: '甲骨文';
        font-size: 20px;
        margin-left: 20%;
        margin-right: 20%;
    }

    .smoke-container .smoke-text span {
        position: relative;
        display: inline-block;
    }

    .smoke-container .smoke-text span.active {
        animation: smoke 4s linear forwards;
        transform-origin: bottom;
    }

    @keyframes smoke {
        0% {
            opacity: 1;
            filter: blur(0);
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);
        }

        30% {
            opacity: 0;
            filter: blur(20px);
            transform: translateX(300px) translateY(-300px) rotate(720deg) scale(4);
        }

        100% {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);

        }
    }

    /* 导入需要的字体 */
    @font-face {
        font-family: '甲骨文';
        font-display: swap;
        src: url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/fonts/FZJiaGW.TTF') format('truetype');
    }

    @font-face {
        font-family: '小篆';
        src: url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/fonts/FZXZTFW.TTF');
    }

    @font-face {
        font-family: '大篆';
        font-display: swap;
        src: url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/blog/resources/fonts/STFJinWDZFU.TTF');
    }
</style>


</html>
{% endcodeblock %}