---
title: 星星追随鼠标效果
date: 2022-04-30 14:00:56
tags:
  - 前端
  - JavaScript
  - html
categories:
  - 前端
description: 当鼠标滑过图片的时候，会有星星追随它。
---
## 效果预览
鼠标滑过下图的时候，会有星星追随。
{% raw %}
<div id="preview-container" style="background-image:url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/images/%E5%A3%81%E7%BA%B8/wallhaven-6o1g8x.jpg'); background-size:100%; height:400px;">
</div>
<script>
    const container = document.getElementById('preview-container');
    container.width = window.innerWidth;
    container.height = window.innerHeight;

    // 三种可能的颜色
    var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
    // var width = window.innerWidth;
    // var height = window.innerHeight;
    var width = container.clientWidth;
    var height = container.clientHeight;
    var cursor = { x: width / 2, y: width / 2 };
    var particles = []; // 粒子

    function init() {
        bindEvents();
        loop();
    }

    // Bind events that are needed
    function bindEvents() {
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('touchmove', onTouchMove);
        container.addEventListener('touchstart', onTouchMove);

        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize(e) {
        // width = window.innerWidth;
        // height = window.innerHeight;
        width = container.clientWidth;
        height = container.clientHeight;
    }

    function onTouchMove(e) {
        if (e.touches.length > 0) {
            for (var i = 0; i < e.touches.length; i++) {
                addParticle(e.touches[i].clientX, e.touches[i].clientY, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
            }
        }
    }

    function onMouseMove(e) {
        cursor.x = e.clientX;
        cursor.y = e.clientY;

        addParticle(cursor.x, cursor.y, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
    }

    function addParticle(x, y, color) {
        var particle = new Particle();
        particle.init(x, y, color);
        particles.push(particle);
    }

    function updateParticles() {

        // Updated
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        // Remove dead particles
        for (var i = particles.length - 1; i >= 0; i--) {
            if (particles[i].lifeSpan < 0) {
                particles[i].die();
                particles.splice(i, 1);
            }
        }

    }

    function loop() {
        requestAnimationFrame(loop);
        updateParticles();
    }

    /**
        * Particles
        */

    function Particle() {

        this.character = "*";
        this.lifeSpan = 120; //ms
        this.initialStyles = {
            "position": "fixed",
            "top": "0", //必须加
            "display": "block",
            "pointerEvents": "none",
            "z-index": "10000000",
            "fontSize": "20px",
            "will-change": "transform"
        };

        // Init, and set properties
        this.init = function (x, y, color) {

            this.velocity = {
                x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
                y: 1
            };

            this.position = { x: x - 10, y: y - 20 };
            this.initialStyles.color = color;

            this.element = document.createElement('span');
            this.element.innerHTML = this.character;
            applyProperties(this.element, this.initialStyles);
            this.update();

            document.body.appendChild(this.element);
        };

        this.update = function () {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.lifeSpan--;

            this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + (this.lifeSpan / 120) + ")";
        }

        this.die = function () {
            this.element.parentNode.removeChild(this.element);
        }

    }

    /**
        * Utils
        */

    // Applies css `properties` to an element.
    function applyProperties(target, properties) {
        for (var key in properties) {
            target.style[key] = properties[key];
        }
    }

    init();
</script>
{% endraw %}

## gif效果
## 具体代码
{% codeblock lang:html %}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>星星测试</title>
</head>

<body>
    <div id="preview-container" class="container">
        <!-- <img src="https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/images/matrix/wallhaven-e72xro.jpg" alt="您要的图碎了"> -->
    </div>
    <script>
        const container = document.getElementById('preview-container');
        container.width = window.innerWidth;
        container.height = window.innerHeight;

        // 三种可能的颜色
        var possibleColors = ["#D61C59", "#E7D84B", "#1B8798"]
        // var width = window.innerWidth;
        // var height = window.innerHeight;
        var width = container.clientWidth;
        var height = container.clientHeight;
        var cursor = { x: width / 2, y: width / 2 };
        var particles = []; // 粒子

        function init() {
            bindEvents();
            loop();
        }

        // Bind events that are needed
        function bindEvents() {
            container.addEventListener('mousemove', onMouseMove);
            container.addEventListener('touchmove', onTouchMove);
            container.addEventListener('touchstart', onTouchMove);

            window.addEventListener('resize', onWindowResize);
        }

        function onWindowResize(e) {
            // width = window.innerWidth;
            // height = window.innerHeight;
            width = container.clientWidth;
            height = container.clientHeight;
        }

        function onTouchMove(e) {
            if (e.touches.length > 0) {
                for (var i = 0; i < e.touches.length; i++) {
                    addParticle(e.touches[i].clientX, e.touches[i].clientY, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
                }
            }
        }

        function onMouseMove(e) {
            cursor.x = e.clientX;
            cursor.y = e.clientY;

            addParticle(cursor.x, cursor.y, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
        }

        function addParticle(x, y, color) {
            var particle = new Particle();
            particle.init(x, y, color);
            particles.push(particle);
        }

        function updateParticles() {

            // Updated
            for (var i = 0; i < particles.length; i++) {
                particles[i].update();
            }

            // Remove dead particles
            for (var i = particles.length - 1; i >= 0; i--) {
                if (particles[i].lifeSpan < 0) {
                    particles[i].die();
                    particles.splice(i, 1);
                }
            }

        }

        function loop() {
            requestAnimationFrame(loop);
            updateParticles();
        }

        /**
         * Particles
         */

        function Particle() {

            this.character = "*";
            this.lifeSpan = 120; //ms
            this.initialStyles = {
                "position": "fixed",
                "top": "0", //必须加
                "display": "block",
                "pointerEvents": "none",
                "z-index": "10000000",
                "fontSize": "20px",
                "will-change": "transform"
            };

            // Init, and set properties
            this.init = function (x, y, color) {

                this.velocity = {
                    x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
                    y: 1
                };

                this.position = { x: x - 10, y: y - 20 };
                this.initialStyles.color = color;

                this.element = document.createElement('span');
                this.element.innerHTML = this.character;
                applyProperties(this.element, this.initialStyles);
                this.update();

                document.body.appendChild(this.element);
            };

            this.update = function () {
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                this.lifeSpan--;

                this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + (this.lifeSpan / 120) + ")";
            }

            this.die = function () {
                this.element.parentNode.removeChild(this.element);
            }

        }

        /**
         * Utils
         */

        // Applies css `properties` to an element.
        function applyProperties(target, properties) {
            for (var key in properties) {
                target.style[key] = properties[key];
            }
        }

        init();
    </script>
</body>
<style>
    .container {
        background-image: url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/rain/resources/images/%E5%A3%81%E7%BA%B8/wallhaven-6o1g8x.jpg');
        background-size: 100%;
        height: 640px;
        background-color: black;
    }
</style>
</html>
{% endcodeblock %}