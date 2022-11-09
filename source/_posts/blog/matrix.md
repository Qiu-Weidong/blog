---
title: 黑客帝国的代码雨实现
date: 2022-04-28 12:44:27
tags:
  - 前端
  - JavaScript
  - html
categories:
  - 前端
description: '这篇博客使用不同的语言和字符实现了一个类似于电影《黑客帝国》中的代码雨的特效。'
---
{% poem author:辛弃疾 source:丑奴儿·书博山道中壁 %}
少年不识愁滋味，爱上层楼。爱上层楼。为赋新词强说愁。
而今识尽愁滋味，欲说还休。欲说还休。却道天凉好个秋。
{% endpoem %}

## 效果预览
从上至下，依次是 {% label 阿拉伯语 %}、{% label 甲骨文 %}、{% label 日语 %}、{% label 彝语 %}、{% label 藏语 %}、{% label 希伯来语 %}、{% label 小篆 %}、{% label 印地语 %}、{% label 大篆 %}、{% label 西里尔字母 %}。

{% raw %}
<div id="preview-container"></div>
<script>

    const container = document.getElementById("preview-container");
    
    const base_path = 'https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/hacker/';
    // 字符集
    const Arab = 'ابتثجحخدذرزسشضصضطظعغفقكلمنهويء'; // 阿拉伯语
    const Hebrew = 'אבגדהוזחטיךכלםמןנסעףפץצקרשתבכפּתּוּואֽאֿשׁשׂוֹ'; // 希伯来语
    const Hindi = 'अआएईऍऎऐइओऑऒऊऔउबभचछडढफफ़गघग़हजझकखख़'
        +'लळऌऴॡमनङञणऩॐपक़रऋॠऱसशषटतठदथधड़ढ़वयय़ज़'; // 印地语
    const Japanese = 'あいうえおアイウエオかきくけこカキクケコさし'
        +'すせそサシスセソたちつてとタチツテトなにぬねのナニヌネノは'
        +'ひふへほハヒフヘホまみむめもマミムメモやゆよヤユヨらりるれ'
        +'ろラリルレロわゐゑをワヰヱヲんンがぎぐげごガギグゲゴざじず'
        +'ぜぞザジズゼゾだぢづでどダヂヅデドばびぶべぼバビブベボぱぴ'
        +'ぷぺぽパピプペポ'; // 日语
    const Cyrillic = 'ЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪ'
        +'ЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥ'
        +'ѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂҃҄҅҆҇҈҉ҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥ'
        +'ҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӏӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟӠ'
        +'ӡӢӣӤӥӦӧӨөӪӫӬӭӮӯӰӱӲӳӴӵӶӷӸӹӺӻӼӽӾӿ'; // 西里尔字母
    const Tibetan = 'ཀཁགངཅཆཇཉཏཐདནཔཕབམཙཚཛཝཞཟའཡརལཤསཧཨ'; // 藏语
    const Yi = 'ꀀꀖꀸꁖꁶꂑꂮꃍꃢꄀꄚꄶꅑꅨꅽꆗꆷꇚꇸꈔꉆꉮꊍꊮꋐꋭꌉꌪꏠꏼꐘꐱꑊꑝꑱꀁꀗꀹꁗꁷꂒꂯ'   
        + 'ꃎꃣꄁꄛꄷꅒꅩꅾꆘꆸꇛꇹꈕꉇꊎꊯꋑꋮꌊꌫꏡꏽꐙꐲꑋꑞꑲꀂꀘꀺꁘꁸꂓꂰꃏꃤꄂꄜꄸꅓꅪꅿꆙꆹꇜꇺ' 
        + 'ꈖꉈꊏꊰꋒꋯꌋꌬꏢꏾꐚꐳꑌꑟꑳꀃꀙꀻꁙꁹꂔꂱꃐꃥꄃꄝꄹꅔꅫꆀꆚꆺꇝꇻꉉꊐꊱꋓꋰꌌꌭꏣꏿꐛꐴꑍ' 
        + 'ꑠꑴꀄꀚꁚꃦꅬꆻꇞꉊꊲꋔꏤꐀꐜꐵꑎꑡꑵꀅꀛꀼꁛꁺꂕꂲꃧꄄꄞꄺꅕꅭꆁꆛꆼꇟꇼꈗꈰꉋꉝꉯꊑꊳꋕꋱ'
        + 'ꌍꌮꏥꐁꐝꐶꑏꑢꑶꀆꀜꀽꁜꁻꂖꂳꃨꄅꄟꄻꅖꅮꆂꆜꆽꇠꇽꈘꈱꉌꉞꉰꊒꊴꋖꋲꌎꌯꏦꐂꐞꐷꑐꑣꑷꀇ'
        + 'ꀝꀾꁝꁼꂗꂴꃩꄆꄠꄼꅯꆃꆝꆾꇡꇾꈙꉍꉟꊓꊵꋗꋳꌏꌰꏧꐃꐟꐸꑑꑤꑸꀈꀞꀿꁞꁽꂘꂵꃑꃪꄇꄡꄽꅗꅰ' 
        + 'ꆞꆿꇢꇿꈚꈲꉎꉠꉱꊀꊔꊶꋘꋴꌐꌱꍆꍡꎔꎫꏆꀉꀟꁀꁟꁾꂙꂶꃒꃫꄈꄢꄾꅘꅱꆄꆟꇀꇣꈀꈛꈳꉏꉡꉲꊁ' 
        + 'ꊕꊷꋙꋵꌑꌲꍇꍢꍼꎕꎬꏇꀊꀠꁁꁠꁿꂚꂷꃓꃬꄉꄣꄿꅙꅲꆅꆠꇁꇤꈁꈜꈴꉐꉢꉳꊂꊖꊸꋚꋶꌒꌳꍈꍣꍽ'
        + 'ꎖꎭꏈꀋꀡꁂꁡꂀꂛꂸꃔꃭꄊꄤꅀꅚꅳꆆꆡꇂꇥꈂꈝꈵꉑꉣꉴꊃꊗꊹꋛꋷꌓꌴꍉꍤꎗꎮꏉꂹꄥꇃꇦꈞꉒꉤ' 
        + 'ꉵꍥꏨꐄꑹꀌꀢꁃꁢꂜꂺꄋꄦꅁꅴꆇꆢꇄꇧꈃꈟꈶꉓꉥꉶꊄꊘꊺꋸꌔꍊꍦꍾꎯꏊꏩꐅꐠꐹꑒꑥꑺꀍꀣꁄꁣ'
        + 'ꂝꂻꄌꄧꅂꅵꆈꆣꇅꇨꈄꈠꈷꉔꉦꉷꊅꊙꊻꋹꌕꍋꍧꍿꎰꏋꏪꐆꐡꐺꑓꑦꑻꀎꀤꁅꁤꂞꂼꄨꅃꆉꆤꇆꇩꈅ' 
        + 'ꈡꈸꉕꉸꊆꊚꊼꌖꍌꍨꎱꏌꏫꐇꐢꑔꑼꀏꀥꁆꁥꂁꂟꂽꃮꄍꄩꅄꅛꅶꆊꇇꇪꈆꈢꈹꉖꉧꉹꊛꊽꌗꌵꍍꍩꎀ' 
        + 'ꎲꏍꏬꐈꐣꐻꑕꑧꑽꀐꀦꁇꁦꂂꂠꂾꃕꃯꄎꄪꅅꅜꅷꆋꆥꇈꇫꈇꈣꈺꉗꉨꉺꊇꊜꊾꋜꋺꌘꌶꍎꍪꎁꎘꎳꏎ' 
        + 'ꏭꐉꐤꐼꑖꑨꑾꀑꀧꁈꁧꂃꂡꂿꃖꃰꄏꄫꅆꅝꆌꆦꇉꇬꈈꈤꈻꉘꉩꉻꊈꊝꊿꋝꌙꌷꍏꍫꎂꎙꎴꏏꏮꐊꐥꐽ'
        + 'ꑗꑩꑿꀒꀨꁉꁨꂄꂢꃀꃗꃱꄐꄬꅇꅞꅸꆍꆧꇊꇭꈉꈥꈼꉙꉪꉼꊉꊞꋀꋞꋻꌚꌸꍐꍬꎃꎚꎵꏐꏯꐋꐦꐾꑘꑪ' 
        + 'ꒀꇮꈊꈦꍑꍭꎄꎛꎶꀓꀩꁩꃁꃲꄑꄭꅈꅟꅹꆎꆨꇋꇯꈋꈧꈽꉚꉫꉽꊊꊟꋁꋟꋼꌛꌹꍒꍮꎅꎜꎷꏑꀔꀪꁪꃂ'
        + 'ꄒꄮꅉꅠꅺꆏꆩꇌꇰꈌꈨꈾꉛꉬꉾꊋꊠꋂꋠꋽꌜꌺꍓꍯꎆꎝꎸꏒꀫꁫꃳꄓꄯꅊꅡꅻꆐꆪꇍꇱꈍꈩꈿꉜꉭꉿ' 
        + 'ꊌꊡꋃꋡꌝꌻꍔꍰꎇꎞꎹꏓꀬꁊꁬꂅꂣꃃꃘꃴꄔꄰꅋꅢꅼꆑꆫꇎꇲꈎꈪꉀꊢꋄꌞꌼꍕꎈꎟꎺꏔꏰꐌꐧꑙꒁ'
        + 'ꀭꁋꁭꂆꂤꃄꃙꃵꄕꄱꅌꅣꆒꆬꇏꇳꈏꈫꉁꊣꋅꋢꋾꌟꌽꍖꍱꎉꎠꎻꏕꏱꐍꐨꐿꑚꒂꀮꁌꁮꂇꂥꃅꃚꃶꄖ' 
        + 'ꄲꅍꅤꆓꆭꇐꇴꈐꈬꉂꊤꋆꋣꋿꌠꌾꍗꍲꎊꎡꎼꏖꏲꐎꐩꑀꑛꒃꀯꁍꁯꂈꂦꃆꃛꃷꄗꄳꅎꅥꆔꆮꇑꇵꈑꈭ' 
        + 'ꉃꊥꋇꋤꌀꌡꌿꍘꍳꎋꎢꎽꏗꏳꐏꐪꑁꑜꒄꀰꁎꁰꂉꂧꃇꃜꃸꄘꄴꅏꅦꆕꆯꇒꇶꈒꈮꉄꊦꋈꋥꌁꌢꍙꍴꎌ' 
        + 'ꎣꎾꏘꏴꐐꐫꑂꒅꀱꁏꁱꂊꂨꃈꃝꃹꄙꄵꅐꅧꆖꆰꇓꇷꈓꈯꉅꊧꋉꋦꌂꌣꍚꍵꎍꎤꎿꏙꏵꐑꐬꑃꒆꀲꁐꁲ' 
        + 'ꂋꃉꃞꃺꆱꇔꊨꋊꋧꌃꌤꍀꍛꍶꎎꎥꏀꏚꏶꐒꐭꑄꑫꒇꀳꁑꁳꂌꂩꃊꃟꃻꆲꇕꊩꋋꋨꌄꌥꍁꍜꍷꎏꎦꏁꏛ' 
        + 'ꏷꐓꐮꑅꑬꒈꀴꁒꁴꂍꂪꃋꃠꃼꆳꇖꊪꋌꋩꌅꌦꍂꍝꍸꎐꎧꏂꏜꏸꐔꐯꑆꑭꒉꀵꁓꁵꂎꂫꃌꃡꃽꆴꇗꊫꋍ'
        + 'ꋪꌆꌧꍃꍞꍹꎑꎨꏃꏝꏹꐕꐰꑇꑮꒊꀶꁔꂏꂬꃾꆵꇘꊬꋎꋫꌇꌨꍄꍟꍺꎒꎩꏄꏞꏺꐖꑈꑯꒋꀷꁕꂐꂭꃿꆶ'
        + 'ꇙꊭꋏꋬꌈꌩꍅꍠꍻꎓꎪꏅꏟꏻꐗꑉꑰꒌ'; // 彝语
    const Chinese = "一丁七万三上下不丑且丘丙中丰丹乃之乎乘乙九乳事二于"
        + "云五井亘亡亥亦京人今介从令以任企伊伏伐休何余俘保允元兄先光克兔"
        + "入八公六兮共其典兹册冬凡出刀分刖初利力勹匕化北十千午南卜卯印即" 
        + "去又及取受口召可史右各合吉名向君吹告周咸品唐唯商喜嘉四因囿圉"
        + "土在壬夕夙多大天夫夷奚奠女好如妣妥妹妻妾姬娥子季宀它宅安宗"
        + "官宜宣室宫小少尸尹山川州工巫己巳帚帝年并幽庚弓弗彘彝彭往征得御" 
        + "宰家寅寮射尊微心恒戈戊戍成我戒户才承折攴攸改敦文斗新方旁旅旋族" 
        + "日旦旨旬昃明昏易昔星暮曾月有朋服朕木未析枚柳桑楚止正步武死母每"
        + "毓比水永沈河泉洹涂涉涎火灾炎焚熊熹燮爵父爻爿牛牝牡牢牧犬率玉"
        + "王珏甘生用甫田甲申男畏疑癸登白百皿盂益目翌老耳聿肉肘育膏臣臧自" 
        + "相眉矢示祀祖祝祭禾秉秋穆立竹簋米羊羌美羞臬臭至舂舌舞般良若莽"
        + "萑蒿虎虹血行衣裘角言谷豆豕豚象豹赤身辛辟雪非食首高鬯鬼鹿麇麋麓" 
        + "追逐通遣邑郭酉酒采重阜降陟隹雀集雇雉雍雨雩黍鼎鼓龠";

    const fontSize = 20;
    const list = [{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker0.jfif',
            characterSet: Arab,
            font: 'Arial',
            fontSize: fontSize,
            drops: [],
            colunms: 0
        },{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker2.jpg',
            characterSet: Chinese,
            font: '方正甲骨文',
            fontSize: fontSize,
            drops: [],
            colunms: 0
        },{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker12.jpg',
            characterSet: Japanese,
            font: '宋体',
            fontSize: fontSize,
            drops: [],
            colunms: 0
        },{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker6.jpg',
            characterSet: Yi,
            font: 'Arial',
            fontSize: fontSize,
            drops: [],
            colunms: 0
        },{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker0.jfif',
            characterSet: Tibetan,
            font: 'Arial',
            fontSize: 26,
            drops: [],
            colunms: 0
        },{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker12.jpg',
            characterSet: Hebrew,
            font: 'Arial',
            fontSize: fontSize,
            drops: [],
            colunms: 0
        },{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker6.jpg',
            characterSet: Chinese,
            font: '小篆',
            fontSize: fontSize,
            drops: [],
            colunms: 0
        },{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker0.jfif',
            characterSet: Hindi,
            font: 'Arial',
            fontSize: fontSize,
            drops: [],
            colunms: 0
        },{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker2.jpg',
            characterSet: Chinese,
            font: '大篆',
            fontSize: fontSize,
            drops: [],
            colunms: 0
        },{
            img: undefined,
            canvas: undefined,
            img_filepath: 'hacker6.jpg',
            characterSet: Cyrillic,
            font: 'Arial',
            fontSize: fontSize,
            drops: [],
            colunms: 0
        },];

    const width = container.clientWidth;

    for (var i = 0; i < list.length; i++) {
        let obj = list[i];

        obj.img = document.createElement('img');

        obj.img.src = base_path + obj.img_filepath;
        obj.img.alt = '图碎了';

        // 创建canvas来绘制img
        const canvas = document.createElement("canvas");
        canvas.style.cssText = 'width:100%;';
        const context = canvas.getContext("2d");
        obj.canvas = canvas;

        obj.img.onload = function () {

            let scale = width / this.width;
            const height = this.height * scale;
            canvas.width = width;
            canvas.height = height;
            context.drawImage(this, 0, 0, this.width, this.height, 0, 0, width, height);
            obj.colunms = Math.floor(width / obj.fontSize);
            for (let j = 0; j < obj.colunms; j++) {
                obj.drops.push(Math.ceil(canvas.height / obj.fontSize) + 1)
            }
        }
        container.appendChild(canvas);
    }


    setInterval((function () {
        for (let i = 0; i < list.length; i++) {
            let obj = list[i];

            const context = obj.canvas.getContext("2d");
            context.globalAlpha = 0.13;

            context.drawImage(obj.img, 0, 0, obj.img.width, obj.img.height, 0, 0, obj.canvas.width, obj.canvas.height);
            context.font = `700 ${obj.fontSize}px ${obj.font}`;

            context.globalAlpha = 1;
            context.fillStyle = "#00cc33";
            for (let j = 0; j < obj.colunms; j++) {
                const index = Math.floor(Math.random() * obj.characterSet.length), x = j * obj.fontSize, y = obj.drops[j] * obj.fontSize;
                context.fillText(obj.characterSet[index], x, y);
                if (y >= obj.canvas.height && Math.random() > .99) { obj.drops[j] = 0 } obj.drops[j]++
            }
        }

    }), 120);


</script>
{% endraw %}

## gif预览

{% gallery %}
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/阿拉伯语.gif)
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/西里尔字母.gif)
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/藏语.gif)
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/日语.gif)
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/希伯来语.gif)
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/彝文.gif)
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/甲骨文.gif)
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/印地语.gif)
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/小篆.gif)
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/黑客帝国代码雨效果图/大篆.gif)

{% endgallery %}

## 具体代码
{% codeblock lang:html mark:16-18,21 %}

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>黑客帝国代码雨效果实现</title>
</head>

<body>
    <script>
        const width = window.innerWidth;
        const height = window.innerHeight;
        const fontSize = 20; // 修改这里可以设置字号
        const fontName = 'arial'; // 修改这里可以设置字体，如'甲骨文'、'小篆'、'大篆'
        const characterSet = getArabCharacterSet(); // 修改这里可以设置字符集

        let img = document.createElement('img');
        img.src = 'https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/hacker/hacker6.jpg';
        img.alt = '您要的图碎了';
        const canvas = document.createElement("canvas");
        canvas.style.cssText = 'width:100%;';
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        img.onload = function () {
            let scale_x = width / this.width;
            let scale_y = height / this.height;

            if (scale_x < scale_y) {
                context.drawImage(this, (this.width * scale_y - width) / 2, 0, width / scale_y, this.height, 0, 0, width, height);
            }
            else {
                context.drawImage(this, 0, (this.height * scale_x - height) / 2, this.width, height / scale_x, 0, 0, width, height);
            }
        }
        document.body.appendChild(canvas);

        let colunms = Math.floor(width / fontSize);
        let drops = [];
        for (let i = 0; i < colunms; i++) {
            drops.push(Math.ceil(canvas.height / fontSize) + 1);
        }

        context.font = `700 ${fontSize}px ${fontName}`;
        setInterval((function () {
            let scale_x = width / img.width;
            let scale_y = height / img.height;
            context.globalAlpha = 0.13;
            if (scale_x < scale_y) {
                context.drawImage(img, (img.width * scale_y - width) / 2, 0, width / scale_y, img.height, 0, 0, width, height);
            }
            else {
                context.drawImage(img, 0, (img.height * scale_x - height) / 2, img.width, height / scale_x, 0, 0, width, height);
            }

            context.globalAlpha = 1;
            context.fillStyle = "#00cc33";
            // context.fillStyle = randColor();
            for (let j = 0; j < colunms; j++) {
                const index = Math.floor(Math.random() * characterSet.length), x = j * fontSize, y = drops[j] * fontSize;
                context.fillText(characterSet[index], x, y);
                if (y >= canvas.height && Math.random() > .99) { drops[j] = 0 } drops[j]++
            }
        }), 120);

        // 生成随机颜色
        function randColor() {
            return 'rgb(' + Math.floor(Math.random() * 256) + ',' +
                Math.floor(Math.random() * 256) + ',' +
                Math.floor(Math.random() * 256) + ')';
        }
        // 阿拉伯语 
        function getArabCharacterSet() {
            return 'ابتثجحخدذرزسشضصضطظعغفقكلمنهويء';
        }
        // 希伯来语
        function getHebrewCharacterSet() {
            return 'אבגדהוזחטיךכלםמןנסעףפץצקרשתבכפּתּוּואֽאֿשׁשׂוֹ';
        }
        // 印地语
        function getHindiCharacterSet() {
            return 'अआएईऍऎऐइओऑऒऊऔउबभचछडढफफ़गघग़हजझकखख़लळऌऴॡमनङञणऩॐपक़रऋॠऱसशषटतठदथधड़ढ़वयय़ज़';
        }
        // 日语
        function getJapaneseCharacterSet() {
            return 'あいうえおアイウエオかきくけこカキクケコさし'
            +'すせそサシスセソたちつてとタチツテトなにぬねのナニヌネノは'
            +'ひふへほハヒフヘホまみむめもマミムメモやゆよヤユヨらりるれ'
            +'ろラリルレロわゐゑをワヰヱヲんンがぎぐげごガギグゲゴざじず'
            +'ぜぞザジズゼゾだぢづでどダヂヅデドばびぶべぼバビブベボぱぴ'
            +'ぷぺぽパピプペポ';
        }
        // 西里尔
        function getCyrillicCharacterSet() {
            return 'ЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪ'
            +'ЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥ'
            +'ѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂҃҄҅҆҇҈҉ҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥ'
            +'ҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӏӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟӠ'
            +'ӡӢӣӤӥӦӧӨөӪӫӬӭӮӯӰӱӲӳӴӵӶӷӸӹӺӻӼӽӾӿ';
        }
        // 藏语
        function getTibetanCharacterSet() {
            return 'ཀཁགངཅཆཇཉཏཐདནཔཕབམཙཚཛཝཞཟའཡརལཤསཧཨ';
        }
        // 彝语
        function getYiCharacterSet() {
            return 'ꀀꀖꀸꁖꁶꂑꂮꃍꃢꄀꄚꄶꅑꅨꅽꆗꆷꇚꇸꈔꉆꉮꊍꊮꋐꋭꌉꌪꏠꏼꐘꐱꑊꑝꑱꀁꀗꀹꁗꁷꂒꂯ'   
            + 'ꃎꃣꄁꄛꄷꅒꅩꅾꆘꆸꇛꇹꈕꉇꊎꊯꋑꋮꌊꌫꏡꏽꐙꐲꑋꑞꑲꀂꀘꀺꁘꁸꂓꂰꃏꃤꄂꄜꄸꅓꅪꅿꆙꆹꇜꇺ' 
            + 'ꈖꉈꊏꊰꋒꋯꌋꌬꏢꏾꐚꐳꑌꑟꑳꀃꀙꀻꁙꁹꂔꂱꃐꃥꄃꄝꄹꅔꅫꆀꆚꆺꇝꇻꉉꊐꊱꋓꋰꌌꌭꏣꏿꐛꐴꑍ' 
            + 'ꑠꑴꀄꀚꁚꃦꅬꆻꇞꉊꊲꋔꏤꐀꐜꐵꑎꑡꑵꀅꀛꀼꁛꁺꂕꂲꃧꄄꄞꄺꅕꅭꆁꆛꆼꇟꇼꈗꈰꉋꉝꉯꊑꊳꋕꋱ'
            + 'ꌍꌮꏥꐁꐝꐶꑏꑢꑶꀆꀜꀽꁜꁻꂖꂳꃨꄅꄟꄻꅖꅮꆂꆜꆽꇠꇽꈘꈱꉌꉞꉰꊒꊴꋖꋲꌎꌯꏦꐂꐞꐷꑐꑣꑷꀇ'
            + 'ꀝꀾꁝꁼꂗꂴꃩꄆꄠꄼꅯꆃꆝꆾꇡꇾꈙꉍꉟꊓꊵꋗꋳꌏꌰꏧꐃꐟꐸꑑꑤꑸꀈꀞꀿꁞꁽꂘꂵꃑꃪꄇꄡꄽꅗꅰ' 
            + 'ꆞꆿꇢꇿꈚꈲꉎꉠꉱꊀꊔꊶꋘꋴꌐꌱꍆꍡꎔꎫꏆꀉꀟꁀꁟꁾꂙꂶꃒꃫꄈꄢꄾꅘꅱꆄꆟꇀꇣꈀꈛꈳꉏꉡꉲꊁ' 
            + 'ꊕꊷꋙꋵꌑꌲꍇꍢꍼꎕꎬꏇꀊꀠꁁꁠꁿꂚꂷꃓꃬꄉꄣꄿꅙꅲꆅꆠꇁꇤꈁꈜꈴꉐꉢꉳꊂꊖꊸꋚꋶꌒꌳꍈꍣꍽ'
            + 'ꎖꎭꏈꀋꀡꁂꁡꂀꂛꂸꃔꃭꄊꄤꅀꅚꅳꆆꆡꇂꇥꈂꈝꈵꉑꉣꉴꊃꊗꊹꋛꋷꌓꌴꍉꍤꎗꎮꏉꂹꄥꇃꇦꈞꉒꉤ' 
            + 'ꉵꍥꏨꐄꑹꀌꀢꁃꁢꂜꂺꄋꄦꅁꅴꆇꆢꇄꇧꈃꈟꈶꉓꉥꉶꊄꊘꊺꋸꌔꍊꍦꍾꎯꏊꏩꐅꐠꐹꑒꑥꑺꀍꀣꁄꁣ'
            + 'ꂝꂻꄌꄧꅂꅵꆈꆣꇅꇨꈄꈠꈷꉔꉦꉷꊅꊙꊻꋹꌕꍋꍧꍿꎰꏋꏪꐆꐡꐺꑓꑦꑻꀎꀤꁅꁤꂞꂼꄨꅃꆉꆤꇆꇩꈅ' 
            + 'ꈡꈸꉕꉸꊆꊚꊼꌖꍌꍨꎱꏌꏫꐇꐢꑔꑼꀏꀥꁆꁥꂁꂟꂽꃮꄍꄩꅄꅛꅶꆊꇇꇪꈆꈢꈹꉖꉧꉹꊛꊽꌗꌵꍍꍩꎀ' 
            + 'ꎲꏍꏬꐈꐣꐻꑕꑧꑽꀐꀦꁇꁦꂂꂠꂾꃕꃯꄎꄪꅅꅜꅷꆋꆥꇈꇫꈇꈣꈺꉗꉨꉺꊇꊜꊾꋜꋺꌘꌶꍎꍪꎁꎘꎳꏎ' 
            + 'ꏭꐉꐤꐼꑖꑨꑾꀑꀧꁈꁧꂃꂡꂿꃖꃰꄏꄫꅆꅝꆌꆦꇉꇬꈈꈤꈻꉘꉩꉻꊈꊝꊿꋝꌙꌷꍏꍫꎂꎙꎴꏏꏮꐊꐥꐽ'
            + 'ꑗꑩꑿꀒꀨꁉꁨꂄꂢꃀꃗꃱꄐꄬꅇꅞꅸꆍꆧꇊꇭꈉꈥꈼꉙꉪꉼꊉꊞꋀꋞꋻꌚꌸꍐꍬꎃꎚꎵꏐꏯꐋꐦꐾꑘꑪ' 
            + 'ꒀꇮꈊꈦꍑꍭꎄꎛꎶꀓꀩꁩꃁꃲꄑꄭꅈꅟꅹꆎꆨꇋꇯꈋꈧꈽꉚꉫꉽꊊꊟꋁꋟꋼꌛꌹꍒꍮꎅꎜꎷꏑꀔꀪꁪꃂ'
            + 'ꄒꄮꅉꅠꅺꆏꆩꇌꇰꈌꈨꈾꉛꉬꉾꊋꊠꋂꋠꋽꌜꌺꍓꍯꎆꎝꎸꏒꀫꁫꃳꄓꄯꅊꅡꅻꆐꆪꇍꇱꈍꈩꈿꉜꉭꉿ' 
            + 'ꊌꊡꋃꋡꌝꌻꍔꍰꎇꎞꎹꏓꀬꁊꁬꂅꂣꃃꃘꃴꄔꄰꅋꅢꅼꆑꆫꇎꇲꈎꈪꉀꊢꋄꌞꌼꍕꎈꎟꎺꏔꏰꐌꐧꑙꒁ'
            + 'ꀭꁋꁭꂆꂤꃄꃙꃵꄕꄱꅌꅣꆒꆬꇏꇳꈏꈫꉁꊣꋅꋢꋾꌟꌽꍖꍱꎉꎠꎻꏕꏱꐍꐨꐿꑚꒂꀮꁌꁮꂇꂥꃅꃚꃶꄖ' 
            + 'ꄲꅍꅤꆓꆭꇐꇴꈐꈬꉂꊤꋆꋣꋿꌠꌾꍗꍲꎊꎡꎼꏖꏲꐎꐩꑀꑛꒃꀯꁍꁯꂈꂦꃆꃛꃷꄗꄳꅎꅥꆔꆮꇑꇵꈑꈭ' 
            + 'ꉃꊥꋇꋤꌀꌡꌿꍘꍳꎋꎢꎽꏗꏳꐏꐪꑁꑜꒄꀰꁎꁰꂉꂧꃇꃜꃸꄘꄴꅏꅦꆕꆯꇒꇶꈒꈮꉄꊦꋈꋥꌁꌢꍙꍴꎌ' 
            + 'ꎣꎾꏘꏴꐐꐫꑂꒅꀱꁏꁱꂊꂨꃈꃝꃹꄙꄵꅐꅧꆖꆰꇓꇷꈓꈯꉅꊧꋉꋦꌂꌣꍚꍵꎍꎤꎿꏙꏵꐑꐬꑃꒆꀲꁐꁲ' 
            + 'ꂋꃉꃞꃺꆱꇔꊨꋊꋧꌃꌤꍀꍛꍶꎎꎥꏀꏚꏶꐒꐭꑄꑫꒇꀳꁑꁳꂌꂩꃊꃟꃻꆲꇕꊩꋋꋨꌄꌥꍁꍜꍷꎏꎦꏁꏛ' 
            + 'ꏷꐓꐮꑅꑬꒈꀴꁒꁴꂍꂪꃋꃠꃼꆳꇖꊪꋌꋩꌅꌦꍂꍝꍸꎐꎧꏂꏜꏸꐔꐯꑆꑭꒉꀵꁓꁵꂎꂫꃌꃡꃽꆴꇗꊫꋍ'
            + 'ꋪꌆꌧꍃꍞꍹꎑꎨꏃꏝꏹꐕꐰꑇꑮꒊꀶꁔꂏꂬꃾꆵꇘꊬꋎꋫꌇꌨꍄꍟꍺꎒꎩꏄꏞꏺꐖꑈꑯꒋꀷꁕꂐꂭꃿꆶ'
            + 'ꇙꊭꋏꋬꌈꌩꍅꍠꍻꎓꎪꏅꏟꏻꐗꑉꑰꒌ';
        }
        // 汉字
        function getChineseCharacterSet() {
            return "一丁七万三上下不丑且丘丙中丰丹乃之乎乘乙九乳事二于"
            + "云五井亘亡亥亦京人今介从令以任企伊伏伐休何余俘保允元兄先光克兔"
            + "入八公六兮共其典兹册冬凡出刀分刖初利力勹匕化北十千午南卜卯印即" 
            + "去又及取受口召可史右各合吉名向君吹告周咸品唐唯商喜嘉四因囿圉"
            + "土在壬夕夙多大天夫夷奚奠女好如妣妥妹妻妾姬娥子季宀它宅安宗"
            + "官宜宣室宫小少尸尹山川州工巫己巳帚帝年并幽庚弓弗彘彝彭往征得御" 
            + "宰家寅寮射尊微心恒戈戊戍成我戒户才承折攴攸改敦文斗新方旁旅旋族" 
            + "日旦旨旬昃明昏易昔星暮曾月有朋服朕木未析枚柳桑楚止正步武死母每"
            + "毓比水永沈河泉洹涂涉涎火灾炎焚熊熹燮爵父爻爿牛牝牡牢牧犬率玉"
            + "王珏甘生用甫田甲申男畏疑癸登白百皿盂益目翌老耳聿肉肘育膏臣臧自" 
            + "相眉矢示祀祖祝祭禾秉秋穆立竹簋米羊羌美羞臬臭至舂舌舞般良若莽"
            + "萑蒿虎虹血行衣裘角言谷豆豕豚象豹赤身辛辟雪非食首高鬯鬼鹿麇麋麓" 
            + "追逐通遣邑郭酉酒采重阜降陟隹雀集雇雉雍雨雩黍鼎鼓龠";
        }

    </script>
</body>
<style>
    @font-face {
        font-family: '甲骨文';
        font-display: swap;
        src: url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/fonts/FZJiaGW.TTF') format('truetype');
    }

    @font-face {
        font-family: '小篆';
        src: url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/fonts/FZXZTFW.TTF');
    }

    @font-face {
        font-family: '大篆';
        font-display: swap;
        src: url('https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/fonts/STFJinWDZFU.TTF');
    }
</style>

</html>
{% endcodeblock %}

修改代码中被标注的部分，可以实现不同的效果。比如，要实现甲骨文的效果，就需要将 {% label characterSet %} 设置为`getChineseCharacterSet`，然后将 {% label fontName %} 设置为`甲骨文`。而如果要更换背景图片，则修改第21行的`img.src`为背景图片的url。要设置字号，则修改第16行的`fontSize`变量即可。
如果想要彩色的效果，只需要将第62行注释掉，并将第63行取消注释即可。

