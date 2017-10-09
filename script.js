$(document).ready(function(){

  $("#btn").click(function(){
    window.requestAnimationFrame(draw);
  })


 var end = 1;
 var acceleration = 1;

function draw() {
  if (end > 360) return false;
  if (end > 180) {
    acceleration--;
  } else {
    acceleration++;
  }
  console.log(end);
  var ctx = document.getElementById('myCanvas').getContext('2d');
  var pi = Math.PI;
  var centerX = 150;
  var centerY = 150;
  var radius = 140;
  var startAngle = -90;
  var endAngle = startAngle + end;
  ctx.clearRect(0,0,300,300);
  ctx.beginPath();

  ctx.arc(centerX, centerY, radius, toRad(startAngle), toRad(endAngle));

  ctx.lineTo(centerX,centerY);
  ctx.lineTo(centerX,centerY-radius);

  ctx.stroke();
  ctx.closePath()
  ctx.fill();
  end += acceleration;
  window.requestAnimationFrame(draw);
}

function toRad(angle){
  return angle*Math.PI/180;
}


});