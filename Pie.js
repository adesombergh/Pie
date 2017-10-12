function Pie(id, hue, saturation) {
	var _this = this;

    this.ctx =  document.getElementById(id).getContext('2d');
    this.pourcent = $('#'+id).data( "known" );
    this.angle = this.pourcent * 360 / 100;
    this.animDuration = 1;
    this.color = 'hsl('+hue+','+saturation+'%,'+this.pourcent/2+'%)';
    this.decalage = $('#'+id).width()/25;
	this.centerX = ($('#'+id).width()-this.decalage)/2;
	this.centerY = ($('#'+id).height()-this.decalage)/2;
	this.radius = $('#'+id).width()/2.2-this.decalage;
	this.depart = -90;
	this.filled = false;

	$('#'+id).attr('title', 'Know: '+this.pourcent+'%');
	$('#'+id).tooltip({
	  	placement: 'bottom',
	})
    this.fillPie = function(){
		this.filled = true;
  		var frameNb = this.animDuration * 25;
		var t = 0;

		var projecteur = setInterval(function(){
			if (t/frameNb > 1) return clearInterval(projecteur);
			var angle = _this.easeOut(t/frameNb) * _this.angle;
			_this.drawPie(angle,_this.color);
			t++;

		},25);
    };
    this.unFillPie = function(){
		this.filled = false;
		var frameNb = 15;
		var t = frameNb;
		var projecteur2 = setInterval(function(){
			if (t == 0) {
				_this.ctx.clearRect(0,0,300,300);
				return clearInterval(projecteur2)
			}
			var angle = t/frameNb * _this.angle;
			_this.drawPie(angle,_this.color);
			t--;
		},25);
    };
    this.drawPie = function (angle,color) {
		angle -= 90; //Car le début du camembert c'est à midi!
		this.ctx.clearRect(0,0,300,300);

		this.ctx.beginPath();
		this.ctx.arc(this.centerX+this.decalage, this.centerY+this.decalage, this.radius, this.toRad(this.depart), this.toRad(angle));
		this.ctx.lineTo(this.centerX+this.decalage,this.centerY+this.decalage);
		this.ctx.lineTo(this.centerX+this.decalage,this.centerY+this.decalage-this.radius);
		this.ctx.strokeStyle = 'rgba(0,0,0,0)';
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(this.centerX, this.centerY, this.radius, this.toRad(this.depart), this.toRad(angle));
		this.ctx.lineTo(this.centerX,this.centerY);
		this.ctx.lineTo(this.centerX,this.centerY-this.radius);
		this.ctx.strokeStyle = 'rgba(0,0,0,0)';
		this.ctx.stroke();
		this.ctx.closePath();
		this.ctx.fillStyle = color;
		this.ctx.fill();
    };
    this.toRad = function (angle){
		return angle*Math.PI/180;
	};
    this.easeOut = function (t){
		return (--t)*t*t+1
	};
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
		if (_this.filled) {
			clearInterval(_this.projecteur3);
			clearInterval(_this.projecteur4);
			if(_this.growth > 0){
				_this.canShrink=false;
				_this.shrink();
			}
		}
	});
	this.growth = 0;
	this.grow = function () {
  		var frameNb = 10;
		_this.projecteur3 = setInterval(function(){
			_this.growth++;
			var angle = _this.angle;
			var w = $('#'+id).width();
			_this.radius = w/(2.2 - _this.easeOut(_this.growth/frameNb)*.2)-_this.decalage;
			var color = 'hsl('+hue+','+saturation+'%,'+(_this.pourcent/2+_this.growth)+'%)';
			_this.drawPie(angle,color);
			if (_this.growth == frameNb) {
				_this.canShrink=true;
				return clearInterval(_this.projecteur3);
			}
		 },25);
	}
	this.shrink = function () {
  		var frameNb = 10;
		_this.projecteur4 = setInterval(function(){
			_this.growth--;
			var angle = _this.angle;
			var w = $('#'+id).width();
			_this.radius = w/(2.2 - _this.easeOut(_this.growth/frameNb)*.2)-_this.decalage;
			var color = 'hsl('+hue+','+saturation+'%,'+(_this.pourcent/2+_this.growth)+'%)';
			_this.drawPie(angle,color);
			if (_this.growth == 0) {
				_this.canGrow=true;
				return clearInterval(_this.projecteur4);
			}
		 },25);
	}
}