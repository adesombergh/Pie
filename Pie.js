function Pie(id, pourcent, color) {
	var _this = this;
	this.father = $('#'+id).closest('.father');
    this.ctx =  document.getElementById(id).getContext('2d');
    this.pourcent = pourcent;
    this.angle = pourcent * 360 / 100;
    this.animDuration = 1;
    this.color = color;
	this.centerX = $('#'+id).width()/2;
	this.centerY = $('#'+id).height()/2;
	this.radius = $('#'+id).width()/2.2;
	this.depart = -90;
	this.filled = false;
    this.fillPie = function(){
		this.filled = true;
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
		this.filled = false;
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
	this.inside = function (){
		var top = _this.father.offset().top;
		var bottom = top + _this.father.height();
		var scrollTop = $(window).scrollTop()
		var scrollBot = scrollTop + $(window).height()
		return (scrollBot>bottom+20&&scrollTop<top-20)
	}
	$(window).scroll(function(){
		if ( !_this.filled && _this.inside() ) {
			_this.fillPie();
		}
		if ( _this.filled && !_this.inside() ) {
			_this.unFillPie();
		}
	});
	this.canGrow = true;
	this.canShrink = false;
	$("#"+id).mousemove(function(e){
		x = e.pageX - $("#"+id).offset().left;
		y = e.pageY - $("#"+id).offset().top;
		if (_this.ctx.isPointInPath(x,y)&&_this.filled&&_this.canGrow) {
			_this.canGrow=false;
			_this.grow();
		}
		if (!_this.ctx.isPointInPath(x,y)&&_this.filled&&_this.canShrink) {
			_this.canShrink=false;
			_this.shrink();
		}
	});
	$("#"+id).mouseleave(function(e){
		if (_this.filled&&_this.canShrink) {
			_this.canShrink=false;
			_this.shrink();
		}
	});
	this.grow = function () {
  		var frameNb = 10;
		var t = 0;
		var projecteur3 = setInterval(function(){
			if (t > frameNb) {
				_this.canShrink=true;
				return clearInterval(projecteur3);
			}
			var angle = _this.angle;
			var w = $('#'+id).width();
			_this.radius = w/(2.2 - _this.easeOut(t/frameNb)*.2);
			_this.drawPie(angle);
			t++;

		 },25);
	}
	this.shrink = function () {
  		var frameNb = 10;
		var t = 0;

		var projecteur4 = setInterval(function(){
			if (t > frameNb) {
				_this.canGrow=true;
				return clearInterval(projecteur4);
			}
			var angle = _this.angle;
			var w = $('#'+id).width();
			_this.radius = w/(2 + _this.easeOut(t/frameNb)*.2);
			_this.drawPie(angle);
			t++;

		 },25);
	}
}