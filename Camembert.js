(function ( $ ) {
	$.fn.Camembert = function( options ) {

        // Establish our default settings
        var settings = $.extend({
            'color-animation-type'  : 'proportionnel',// 'fixed' / 'proportionnel' / 'final'
            'known'           		: 75,
            'decalage'        		: 25,
            'color'        		    : '#385c73',
            'title-font'			: {
            	font-family:Courier New;
            	width:90px;
            	background-color:rgba(255,255,255,.5);
            	padding:7px 10px;
            	border-radius:4px;
            	position:absolute;
            	border:1px solid rgba(0,0,0,.3);
            	transform:translateX(-50%);
            },
        }, options, $(this).data() );

        var titleStyle =
        "font-family:Courier New;width:90px;background-color:rgba(255,255,255,.5);padding:7px 10px;border-radius:4px;position:absolute;border:1px solid rgba(0,0,0,.3);transform:translateX(-50%);";

		var ctx = $(this)[0].getContext('2d');
		this.attr('title', 'Know: '+settings.known+'%');
		this.wrap( "<div class='emballage' style='display:inline-block;position:relative'></div>" );
		this.after("<span style='"+titleStyle+"'>Know: "+settings.known+"%</span>");
		
		$(this).closest('.emballage').find('span').hide();
		

		var w = this.width();
		var angle_final = settings.known * 360 / 100; // (100% = 360°etc...)
		var animDuration = 1; //en secondes
		var decalage = w/settings.decalage; //nécessaire pour l'ombre portée
		var centerX = (w-decalage)/2;
		var centerY = (this.height()-decalage)/2;
		var rayon_initial = w/2.2-decalage; // Divisé par 2.2 pour laisser l'espace au hover
		var rayon = w/2.2-decalage; // Divisé par 2.2 pour laisser l'espace au hover
		var depart = -90; //Car le début du camembert c'est à midi!
		var filled = false; //Variable pour controler l'état du dessin
		var color = function (angle){
			if (settings['color-animation-type'] == "proportionnel") {
				hsl = hexToHSL(settings.color);
				ecart = hsl.l/4;
				lum = hsl.l + ((angle-90)/180) * ecart
				return 'hsl('+hsl.h+','+hsl.s+'%,'+lum+'%)';
			} else if (settings['color-animation-type'] == "final"){
				hsl = hexToHSL(settings.color);
				return 'hsl('+hsl.h+','+hsl.s+'%,'+(rayon/rayon_initial)*hsl.l*(angle+90)/angle_final+'%)';
			} else {
				return settings.color;
			}
		}
	    this.fillCamembert = function(){
			filled = true;
	  		var frameNb = animDuration * 25;
			var t = 0;
			var angle = 0;

			var projecteur = setInterval(function(){
				if (t/frameNb > 1) return clearInterval(projecteur);
				angle = easeOut(t/frameNb) * angle_final;
				drawCamembert(angle);
				t++;
			},25);
	    };

	    this.unFillCamembert = function(){
			filled = false;
			var frameNb = 15;
			var t = frameNb;
			var projecteur2 = setInterval(function(){
				if (t == 0) {
					ctx.clearRect(0,0,300,300);
					return clearInterval(projecteur2)
				}
				var angle = t/frameNb * angle_final;
				drawCamembert(angle,color);
				t--;
			},25);
	    };

	    var easeOut = function (t){
			return (--t)*t*t+1
		};


	    var toRad = function (angle){
			return angle*Math.PI/180;
		}

		var canGrow = true;
		var canShrink = false;

		var size = 0;
		var growProj, shrinkProj;
		var grow = function () {
	  		var frameNb = 10;
			growProj = setInterval(function(){
				size++;
				var angle = angle_final;
				rayon = w/(2.2 - easeOut( size/frameNb )*.2)-decalage;
				drawCamembert(angle);
				if (size == frameNb) {
					canShrink=true;
					clearInterval(growProj);
				}
			 },25);
		}
		var shrink = function () {
	  		var frameNb = 10;
			shrinkProj = setInterval(function(){
				size--;
				var angle = angle_final;
				rayon = w/(2.2 - easeOut(size/frameNb)*.2)-decalage;
				drawCamembert(angle);
				if (size == 0) {
					canGrow=true;
					clearInterval(shrinkProj);
				}
			 },25);
		}

		this.mousemove(function(e){
			x = e.pageX - $(this).offset().left;
			y = e.pageY - $(this).offset().top;
			if ( ctx.isPointInPath(x,y)) {
				showTxt($(this),x,y);
				if (filled && canGrow) {
					canGrow=false;
					grow();
				}
			}
			if (!ctx.isPointInPath(x,y)) {
				hideTxt($(this));
				if (filled&&canShrink) {
					canShrink=false;
					shrink();
				}
			}
		});
		function showTxt(who,x,y){
			who.closest('.emballage').find('span').css({'left':x+'px','top':(y+20)+'px'});
			who.closest('.emballage').find('span').show();
		}
		function hideTxt(who){
			who.closest('.emballage').find('span').hide();
		}
		this.mouseleave(function(e){
			hideTxt($(this));
			if (filled) {
				clearInterval(growProj);
				clearInterval(shrinkProj);
				if(size > 0){
					canShrink=false;
					shrink();
				}
			}
		});
	    var drawCamembert = function (angle) {
			angle -= 90; //Car le début du camembert c'est à midi!
			ctx.clearRect(0,0,300,300);

			ctx.beginPath(); //OMBRE
			ctx.arc(centerX+decalage, centerY+decalage, rayon, toRad(depart), toRad(angle));
			ctx.lineTo(centerX+decalage,centerY+decalage);
			ctx.lineTo(centerX+decalage,centerY+decalage-rayon);
			ctx.strokeStyle = 'rgba(0,0,0,0)';
			ctx.stroke();
			ctx.closePath();
			ctx.fillStyle = 'rgba(0,0,0,0.2)';
			ctx.fill();

			ctx.beginPath(); //CAMEMBERT
			ctx.arc(centerX, centerY, rayon, toRad(depart), toRad(angle));
			ctx.lineTo(centerX,centerY);
			ctx.lineTo(centerX,centerY-rayon);
			ctx.strokeStyle = 'rgba(0,0,0,0)';
			ctx.stroke();
			ctx.closePath();
			ctx.fillStyle = color(angle);
			ctx.fill();
	    };


		function hexToHSL(hex) {
		  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    r = parseInt(result[1], 16);
		    g = parseInt(result[2], 16);
		    b = parseInt(result[3], 16);
		    r /= 255, g /= 255, b /= 255;
		    var max = Math.max(r, g, b), min = Math.min(r, g, b);
		    var h, s, l = (max + min) / 2;
		    if(max == min){
		      h = s = 0; // achromatic
		    }else{
		      var d = max - min;
		      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		      switch(max){
		        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		        case g: h = (b - r) / d + 2; break;
		        case b: h = (r - g) / d + 4; break;
		      }
		      h /= 6;
		    }
		  var HSL = new Object();
		  HSL['h']=Math.round(h*360);
		  HSL['s']=Math.round(s*100);
		  HSL['l']=Math.round(l*100);
		  return HSL;
		}
		return this;
	}
}( jQuery ));