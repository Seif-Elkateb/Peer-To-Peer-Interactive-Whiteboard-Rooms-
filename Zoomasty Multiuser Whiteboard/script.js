

pubnub.subscribe({
  channel: channel,
  callback: drawFromStream,
  presence: function(m){
    if(m.occupancy > 0){
      document.getElementById('occupancy').textContent = m.occupancy;
    }
  }
});

/* Draw on canvas */

var canvas = document.getElementById('drawCanvas');
var ctx = canvas.getContext('2d');
	 
ctx.lineWidth = '10';
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
function lineWidthRange() {
    ctx.lineWidth = document.getElementById("myRange").value;
};

var color = 'black';
function changeColors(palette) {
	switch(palette.id) {
		case "red":
			color = "red";
			break;
		case "red1":
			color = "#F16161";
			break;
		case "red2":
			color = "#F69FA0";
			break;
		case "orange":
			color = "orange";
			break;
		case "orange1":
			color = "#F99F62";
			break;
		case "orange2":
			color = "#FBB57B";
			break;
		case "blue":
			color = "#09C2DB";
			break;
		case "blue1":
			color = "#8BD3DC";
			break;
		case "blue2":
			color = "#B9E3E8";
			break;
		case "indigo":
			color = "#0E38AD";
			break;
		case "indigo1":
			color = "#546AB2";
			break;
		case "indigo2":
			color = "#9C96C9";
			break;
		case "green":
			color = "green";
			break;
		case "green1":
			color = "#97CD7E";
			break;
		case "green2":
			color = "#C6E2BB";
			break;
		case "black":
			color = "black";
			break;
		case "black1":
			color = "#545454";
			break;
		case "black2":
			color = "#B2B2B2";
			break;
		case "yellow":
			color = "yellow";
			break;
		case "yellow1":
			color = "#F7F754";
			break;
		case "yellow2":
			color ="#F7F4B1";
			break;
		case "purple":
			color = "#B9509E";
			break;
		case "purple1":
			color = "#D178B1";
			break;
		case "purple2":
			color = "#E3ABCE";
			break;
		case "erase":
			color = "white";
			break;
	}
};


canvas.addEventListener('mousedown', startDraw, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', endDraw, false);

function drawOnCanvas(color, plots) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(plots[0].x, plots[0].y);

  for(var i=1; i<plots.length; i++) {
    ctx.lineTo(plots[i].x, plots[i].y);
  }
  ctx.stroke();
}

function drawFromStream(message) {
	
  ctx.lineWidth =message.lineWidth;
  if(!message || message.plots.length < 1) return;			
  drawOnCanvas(message.color, message.plots);
}

var isActive = false;
var plots = [];

function draw(e) {
  if(!isActive) return;

  var x = e.offsetX || e.layerX - canvas.offsetLeft;
  var y = e.offsetY || e.layerY - canvas.offsetTop;

  plots.push({x: x, y: y});
  drawOnCanvas(color, plots);
}
	
function startDraw(e) {
  isActive = true;
}
var button = document.getElementById('dwnld');
button.addEventListener('click', function (e) {
var dataURL = canvas.toDataURL('image/png');
button.href = dataURL;

});
function erase() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
};
	
function endDraw(e) {
  isActive = false;
  
  pubnub.publish({
    channel: channel,
    message: {
      color: color, 
      plots: plots,
	  lineWidth:ctx.lineWidth
	  
	  
    }
  });

  plots = [];
}