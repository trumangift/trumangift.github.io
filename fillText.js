function drawText() {
    this.canvas;
    this.x;
    this.y;
    this.letterSpacing;
}
drawText.prototype = {
    init(canvas, x, y, letterSpacing) {
       this.canvas = canvas;
       this.x = x;
       this.y = y;
       this.letterSpacing = letterSpacing;
    },
    draw(text, x, y) {
        var ctx = this.canvas.getContext('2d');
        ctx.font="60px Georgia";
        ctx.fillStyle = "#fff";
        this.fillTextVertical(text, x || this.x, y || this.y);
    },
    fillTextVertical(text, x, y) {
        var context = this.canvas.getContext('2d'),
        letterSpacing = this.letterSpacing;
        var _this = this;
        var arrText = text.split('');
        var arrWidth = arrText.map(function (letter) {
            return context.measureText(letter).width;
        });
        // 开始逐字绘制
        arrText.forEach(function (letter, index) {
            var letterWidth = arrWidth[index];
            context.fillText(letter, x, y);
            var letterWidth = arrWidth[index];
            y = y + letterWidth + letterSpacing;
        });
    }
}