var Main = function () {

    var dotsArr = [],
        dotsNum = 0,
        maxDotsNum = 0,
        overNum = 0, // 超出最大数量的点的数量
        dotsDistance = 250, // 点之间产生连线的最大距离
        texts = '般若波罗蜜多心经',
        texts_main = '观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。舍利子，色不异空，空不异色，色即是空，空即是色，受想行识，亦复如是。舍利子，是诸法空相，不生不灭，不垢不净，不增不减。是故空中无色，无受想行识，无眼耳鼻舌身意，无色声香味触法，无眼界，乃至无意识界，无无明，亦无无明尽，乃至无老死，亦无老死尽。无苦集灭道，无智亦无得。以无所得故。菩提萨埵，依般若波罗蜜多故，心无挂碍。无挂碍故，无有恐怖，远离颠倒梦想，究竟涅盘。三世诸佛，依般若波罗蜜多故，得阿耨多罗三藐三菩提。故知般若波罗蜜多，是大神咒，是大明咒，是无上咒，是无等等咒，能除一切苦，真实不虚。故说般若波罗蜜多咒，即说咒曰：揭谛揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃';
        text = '',  
        text_main_array = [],
        bg = document.getElementById('bg'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),


        width = parseInt(document.documentElement.clientWidth),
        height = parseInt(document.documentElement.clientHeight),
        area = width * height, // canvas区域面积
        cssText = 'width: '+width+'px; height: '+height+'px;',
        letterSpacing = 10,
        textMargin = 200;
        ctx.font="60px Georgia";
    // 设置背景和canvas的宽高
    bg.setAttribute('style', cssText);
    canvas.setAttribute('style', cssText);
    canvas.width = (width * 2).toString();
    canvas.height = (height * 2).toString();

    // 更具canvas面积动态确定初始化点的数量和最大数量
    dotsNum = parseInt(area / 6000);
    maxDotsNum = dotsNum * 2;

    //生成点
    for (var i = 0; i < dotsNum; i ++) {
        var dot = new Dots();
        dotsArr.push(dot);
        dot.init(canvas);
    }
    // 生成文字
    const drawTEXT = new drawText();
    const charWidth =  ctx.measureText(texts).width;
    drawTEXT.init(canvas, width * 2  - 100, (height * 2 - charWidth * texts.length - letterSpacing * texts.length) / 2, letterSpacing);


    /**
     * 文本控制
     */
    var textIndex = 0;
    const titleInterval = setInterval(function() {
       if (textIndex <= texts.length - 1) {
            text += texts[textIndex];
            textIndex++;
       } else {
            clearInterval(titleInterval)
       }
    }, 400);

    const OneCharWidth = ctx.measureText(texts_main[0]).width + letterSpacing;
    const length = Math.floor((height - textMargin * 2) / OneCharWidth);
    const targetTxtMainArray = [];
    const targetTxtMainArrayLength = Math.ceil(texts_main.length / length);
    for( var i =0; i < targetTxtMainArrayLength ; i ++) {
        targetTxtMainArray.push(
            texts_main.substr(i * length, length)
        );
    }
    console.log(targetTxtMainArray);
    for( var i = 0; i <targetTxtMainArray.length; i++) {
        // 几个独立的异步任务
        (function(j) {
            const waitTime = texts.length * 400 +j * targetTxtMainArray[j - 1 < 0 ? 0 : j - 1].length* 400;
            var textIndex_main = 0, text_main = '';
            setTimeout(function() {
                var mainInterval = '';
                clearInterval(mainInterval);
                mainInterval = setInterval(function() {
                    if (textIndex_main <= targetTxtMainArray[j].length - 1) {
                        text_main += targetTxtMainArray[j][textIndex_main];
                        text_main_array[j] = text_main;
                        textIndex_main++;
                    }
                 }, 400);
                 console.log(text_main_array);
            }, waitTime)
        })(i)
    }


    //鼠标事件
    if (document.addEventListener) {
        document.addEventListener('click', createDot);
    }
    if (document.attachEvent) {
        document.attachEvent('click', createDot);
    }
    function createDot(e) {
        e = e || event;
        var tx = e.pageX,
            ty = e.pageY;
        if ((tx > 0 && tx < width) && (ty > 0 && ty < height)) {

            for (var i = 0; i < 1; i ++) {
                var dot = new Dots();
                dot.init(canvas, tx, ty);
                dotsArr.push(dot);
                dotsNum += 1;
            }
        }
    };

    //动画与连线
    var requestAnimFrame = requestAnimationFrame || webkitRequestAnimationFrame || oRequestAnimationFrame || msRequestAnimationFrame;
    requestAnimFrame(animateUpdate); // 兼容不同浏览器的requestAnimationFrame

    function animateUpdate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空canvas中原有的内容

        // 更新点的位置 数量超出最大值时舍弃旧的点
        if (dotsArr.length > maxDotsNum) {
            overNum = dotsArr.length - maxDotsNum;
        }
        for (var i = overNum; i < dotsArr.length; i ++) {
            const willDelete = dotsArr[i].update();
            if (willDelete) {
                dotsArr.splice(i, 1);
            }
        }

        // 绘制连线
        for (var i = overNum; i < dotsArr.length; i ++) {
            for (var j = i + 1; j < dotsArr.length; j ++) {
                var tx = dotsArr[i].x - dotsArr[j].x,
                    ty = dotsArr[i].y - dotsArr[j].y,
                    s = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
                if (s < dotsDistance) {
                    ctx.beginPath();
                    ctx.moveTo(dotsArr[i].x, dotsArr[i].y);
                    ctx.lineTo(dotsArr[j].x, dotsArr[j].y);
                    ctx.strokeStyle = 'rgba(255,255,255,'+(dotsDistance-s)/dotsDistance+')';
                    ctx.strokeWidth = 1;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
        drawTEXT.draw(text);
        for (var i = 0; i < text_main_array.length; i++) {
            drawTEXT.draw(text_main_array[i], width * 2  - (i * 100 + 200), textMargin, letterSpacing);
        }
        requestAnimFrame(animateUpdate);
    }
}();