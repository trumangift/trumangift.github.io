window.onload = function() {
	let mycanvas = document.getElementById('mycanvas');
	mycanvas.width = document.documentElement.clientWidth;
	mycanvas.height = document.documentElement.clientHeight;
	if (mycanvas.getContext('2d')) {
		let ctx = mycanvas.getContext('2d');
		ctx.save();
		ctx.fillStyle = 'pink';
		ctx.beginPath();
		ctx.fillRect(150, 150, 100, 100);
		ctx.restore();
		
		let imageData = ctx.getImageData(0, 0, mycanvas.width, mycanvas.height);
		
		// 像素操作
		for(var i = 0; i < imageData.width; i++) {
			setPixelImageData(imageData, i, 30, [255,100,97, 255]);
		}
		// 像素操作
		for(var i = 0; i < imageData.height; i++) {
			setPixelImageData(imageData, 30, i, [255,100,97, 255]);
		}
		ctx.putImageData(imageData, 0, 0);
	}
	
	function getPixelImageData(data, x, y) {
		let w = data.width;
		let h = data.height;
		let d = data.data;
		let sx = y * w + x;
		return [
			d[sx * 4],
			d[sx * 4 + 1],
			d[sx * 4 + 2],
			d[sx * 4 + 3]
		]
	}
	
	function setPixelImageData(data, x, y, color) {
		let w = data.width;
		let h = data.height;
		let d = data.data;
		let sx = y * w + x;
		d[sx * 4] = color[0];
		d[sx * 4 + 1] = color[1];
		d[sx * 4 + 2] = color[2];
		d[sx * 4 + 3] = color[3];
		return data;
	}
}