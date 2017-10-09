$(document).ready(function(){

	function Pie(ctx, value, animDuration, color) {
	    this.ctx = ctx;
	    this.value = value;
	    this.animDuration = animDuration;
	    this.color = color;
	}

	$("#btn").click( function(){ 
		fillPie(2,270);
	});
	$("#btn2").click( function(){ 
		unFillPie(2,270);
	});

	var ctx = document.getElementById('myCanvas').getContext('2d');
	var centerX = $('#myCanvas').width()/2;
	var centerY = $('#myCanvas').height()/2;
	var radius = $('#myCanvas').width()/2;
	var depart = -90;

	/**
	 *
	 * Animation qui referme le camembert
	 *
	 * @param    duree integer La durée de l'animation en secondes
	 * @param    angleDebut  L'angle que le camembert affiche au début
	 *
	 */
 	function unFillPie(duree,angleDebut){
		var frameNb = duree * 25;
		var t = frameNb;

		var projecteur2 = setInterval(function(){
			if (t < 0) {
				ctx.clearRect(0,0,300,300);
				return clearInterval(projecteur2)
			}
			var angle = easeIn(t/frameNb) * angleDebut;
			drawPie(angle);
			t--;
		},25);
	}

	/**
	 *
	 * Animation qui ouvre le camembert
	 *
	 * @param    duree integer La durée de l'animation en secondes
	 * @param    angleFinal  L'angle que le camembert affiche à la fin
	 *
	 */
	function fillPie(duree,angleFinal){
		var frameNb = duree * 25;
		var t = 0;

		var projecteur = setInterval(function(){
			if (t/frameNb > 1) return clearInterval(projecteur);
			var angle = easeOut(t/frameNb) * angleFinal;
			drawPie(angle);
			t++;
		},25);
	}






	/**
	 *
	 * Converti des degrés en radial
	 *
	 * @param    angles integer	angles en degrés
	 * return    float
	 *
	 */
	function toRad(angle){
		return angle*Math.PI/180;
	}


	/**
	 *
	 * Dessine un camembert
	 *
	 * @param    angle integer	angles en degrés du camembert
	 *
	 */
	function drawPie(angle){
		angle -= 90; //Car le début du camembert c'est à midi!
		ctx.clearRect(0,0,300,300);
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, toRad(depart), toRad(angle));
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
		return t*t*t
	}

});