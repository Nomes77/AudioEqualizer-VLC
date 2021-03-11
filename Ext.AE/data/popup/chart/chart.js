var chart = {
	"canvas": null,
	"context": null,
	"pixelratio": window.devicePixelRatio > 1 ? 2 : 1,
	"prepareChart": function (eq) {
		this.canvas = document.getElementById("chart");
		this.canvas.width = this.pixelratio * 400;
		this.canvas.height = this.pixelratio * 64;
		this.context = this.canvas.getContext('2d');
		this.context.translate(40, 12);
		this.context.beginPath();
		this.context.moveTo(this.pixelratio * 12, this.pixelratio * 20);
		this.context.lineTo(this.pixelratio * 300, this.pixelratio * 20);
		this.context.lineWidth = this.pixelratio * 1;
		this.context.strokeStyle = "white";
		this.context.stroke();
		this.context.beginPath();
		/*  */
		for (var i = 0; i < eq.length - 1; i++) {
			this.context.moveTo(this.pixelratio * ((i * 32) + 12), this.pixelratio * 0);
			this.context.lineTo(this.pixelratio * ((i * 32) + 12), this.pixelratio * 40);
		}
		/*  */
		this.context.stroke();
		this.context.beginPath();
		this.context.stroke();
		this.context.fillStyle = "white";
		this.context.strokeStyle = "#fff";
		this.context.lineWidth = this.pixelratio * 1;
		this.context.font = this.pixelratio * 10 + "px monospace";
		/*  */
		this.context.textAlign = "right";
		this.context.fillText("+12 db", this.pixelratio * 40 - 40, this.pixelratio * (6 + 3) - 10);
		this.context.fillText("-12 db", this.pixelratio * 40 - 40, this.pixelratio * (40 - 3) + 10);
		/*  */
		this.context.textAlign = "left";
		this.context.fillText("+12 db", this.pixelratio * 40 + 270, this.pixelratio * (6 + 3) - 10);
		this.context.fillText("-12 db", this.pixelratio * 40 + 270, this.pixelratio * (40 - 3) + 10);
		/*  */
		this.context.closePath();
		this.refreshChart(eq);
	},
	"refreshChart": function (eq) {
		var points = [];
		for (var i = 1; i < eq.length; i++) {
			points.push({
				"xy": 0,
				"xc": 0,
				"x": ((i - 1) * 32) + 12,
				"y": 20 - (20 / 12) * eq[i].gain
			});
		}
		/*  */
		this.context.beginPath();
		this.context.moveTo(this.pixelratio * points[0].x, this.pixelratio * points[0].y);
		/*  */
		for (var i = 1; i < points.length - 2; i++) {
			var xc = (points[i].x + points[i + 1].x) / 2;
			var yc = (points[i].y + points[i + 1].y) / 2;
			this.context.quadraticCurveTo(this.pixelratio * points[i].x, this.pixelratio * points[i].y, this.pixelratio * xc, this.pixelratio * yc);
		}
		/*  */
		var i = points.length - 2;
		this.context.quadraticCurveTo(this.pixelratio * points[i].x, this.pixelratio * points[i].y, this.pixelratio * points[i + 1].x, this.pixelratio * points[i + 1].y);
		this.context.lineWidth = this.pixelratio * 1;
		this.context.strokeStyle = "red";
		this.context.stroke();
		/*  */
		var gradiend = this.context.createLinearGradient(this.pixelratio * 0, this.pixelratio * 0, this.pixelratio * 0, this.pixelratio * 40);
		gradiend.addColorStop(0.0, "orange");
		gradiend.addColorStop(0.5, "orange");
		gradiend.addColorStop(1.0, "orange");
		/*  */
		points = [];
		for (var i = 1; i < eq.length; i++) {
			points.push({
				"xc": 0,
				"xy": 0,
				"x": ((i - 1) * 32) + 12,
				"y": 20 - (20 / 12) * eq[i].gain
			});
		}
		/*  */
		this.context.beginPath();
		this.context.moveTo(this.pixelratio * 12, this.pixelratio * 20);
		this.context.lineTo(this.pixelratio * points[0].x, this.pixelratio * points[0].y);
		/*  */
		for (var i = 1; i < points.length - 2; i++) {
			var xc = (points[i].x + points[i + 1].x) / 2;
			var yc = (points[i].y + points[i + 1].y) / 2;
			this.context.quadraticCurveTo(this.pixelratio * points[i].x, this.pixelratio * points[i].y, this.pixelratio * xc, this.pixelratio * yc);
		}
		/*  */
		this.context.quadraticCurveTo(this.pixelratio * points[i].x, this.pixelratio * points[i].y, this.pixelratio * points[i + 1].x, this.pixelratio * points[i + 1].y);
		this.context.lineTo(this.pixelratio * 300, this.pixelratio * 20);
		this.context.closePath();
		this.context.fillStyle = gradiend;
		this.context.fill();
	}
};
