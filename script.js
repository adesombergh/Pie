$(document).ready(function(){

	$("#btn").click( function(){ 
		fillPie(2,270);
	});
	$("#btn2").click( function(){ 
		unFillPie(2,270);
	});

	function unFillPie(duree,angleDebut){
		var frameNb = duree * 25;
		var t = frameNb;

		var projecteur2 = setInterval(function(){
			if (t < 0) return clearInterval(projecteur2);
			frame(easeIn(t/frameNb),angleDebut);
			t--;
		},25);
	}

	function fillPie(duree,angleFinal){
		var frameNb = duree * 25;
		var t = 0;

		var projecteur = setInterval(function(){
			if (t/frameNb > 1) return clearInterval(projecteur);
			frame(easeOut(t/frameNb),angleFinal);
			t++;
		},25);
	}

	function frame(avancement,angleFinal){
		var angle = avancement*angleFinal;
		drawPie(angle);
	}


	var ctx = document.getElementById('myCanvas').getContext('2d');
	var centerX = $('#myCanvas').width()/2;
	var centerY = $('#myCanvas').height()/2;
	var radius = $('#myCanvas').width()/2;
	var depart = -90;


	function toRad(angle){
		return angle*Math.PI/180;
	}

	function drawPie(endAngle){
		endAngle -= 90;
		ctx.clearRect(0,0,300,300);
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, toRad(depart), toRad(endAngle));
		ctx.lineTo(centerX,centerY);
		ctx.lineTo(centerX,centerY-radius);
		ctx.stroke();
		ctx.closePath()
		ctx.fill();

	}

	function easeOut(t) { 
		return (--t)*t*t+1
	}
	function easeIn(t) { 
		return (--t)*t*t+1
	}

});