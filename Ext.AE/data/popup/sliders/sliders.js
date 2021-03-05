var sliders =  {
  "width": 30,
  "height": 150,
  "canvas": null,
  "context": null,
  "pixelratio": window.devicePixelRatio > 1 ? 2 : 1,
  "prepareSliders": function () {
    var head = document.head;
    var step = sliders.height / 12;
    var shorter = [1, 2, 3, 4, 5, 7, 8, 9,, 10, 11];
    var style = document.createElement("style");
    var longer = [0, (sliders.height / 2), (sliders.height - 1)];
    /*  */
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.pixelratio * sliders.width;
    this.canvas.height = this.pixelratio * sliders.height;
    this.context = this.canvas.getContext("2d");
    this.context.beginPath();
    this.context.strokeStyle = "gray";
    this.context.lineWidth = this.pixelratio * 1;
    /*  */
    for (var i = 0; i < longer.length; i++) {
      var to = this.pixelratio * longer[i] + this.context.lineWidth / 2;
      this.context.moveTo(this.pixelratio * 2, to);
      this.context.lineTo(this.pixelratio * 10, to);
      this.context.moveTo(this.pixelratio * 20, to);
      this.context.lineTo(this.pixelratio * 28, to);
    }
    /*  */
    for (var i = 0; i < shorter.length; i++) {
      var to = this.pixelratio * (shorter[i] * step) + this.context.lineWidth / 2;
      this.context.moveTo(this.pixelratio * 7, to);
      this.context.lineTo(this.pixelratio * 10, to);
      this.context.moveTo(this.pixelratio * 20, to);
      this.context.lineTo(this.pixelratio * 23, to);
    }
    /*  */
    this.context.stroke();
    this.context.closePath();
    var a = ".controls-sliders .slider";
    var b = "background-image: url(" + this.canvas.toDataURL("image/png") + ");";
    var c = "background-size: " + sliders.width + "px " + sliders.height + "px;";
    style.textContent = a + ' ' + '{' + b + ' ' + c + '}';
    head.appendChild(style);
  }
};
