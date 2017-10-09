function Pie(id, pourcent, color) {
	var _this = this;
    this.ctx =  document.getElementById(id).getContext('2d');
    this.pourcent = pourcent;
    this.angle = pourcent * 360 / 100;
    this.animDuration = 1;
    this.color = color;
	this.centerX = $('#'+id).width()/2;
	this.centerY = $('#'+id).height()/2;
	this.radius = $('#'+id).width()/2;
	this.depart = -90;
    this.fillPie = function(){
  		var frameNb = this.animDuration * 25;
		var t = 0;

		var projecteur = setInterval(function(){
			if (t/frameNb > 1) return clearInterval(projecteur);
			var angle = _this.easeOut(t/frameNb) * _this.angle;
			_this.drawPie(angle);
			t++;

		},25);
    };
    this.unFillPie = function(){
		var frameNb = _this.animDuration * 25;
		var t = frameNb;
		var projecteur2 = setInterval(function(){
			if (t == 0) {
				_this.ctx.clearRect(0,0,300,300);
				return clearInterval(projecteur2)
			}
			var angle = _this.easeOut(t/frameNb) * _this.angle;
			_this.drawPie(angle);
			t--;
		},25);
    };
    this.drawPie = function (angle) {
		angle -= 90; //Car le début du camembert c'est à midi!
		this.ctx.clearRect(0,0,300,300);
		this.ctx.beginPath();
		this.ctx.arc(this.centerX, this.centerY, this.radius, this.toRad(this.depart), this.toRad(angle));
		this.ctx.lineTo(this.centerX,this.centerY);
		this.ctx.lineTo(this.centerX,this.centerY-this.radius);
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
    };
    this.toRad = function (angle){
		return angle*Math.PI/180;
	};
    this.easeOut = function (t){
		return (--t)*t*t+1
	};
    this.easeIn = function (t){
		return t*t*t
	}
}