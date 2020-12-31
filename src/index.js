console.clear();

var canvas = document.getElementById("can");

var ctx = canvas.getContext('2d');
const height= can.height;
const width= can.width;
//ctx.translate()
canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mousemove', mouseMove, false);

function reset_func(){
  document.getElementById("can").style.cursor = "url(../imgs/pencil.png) 0 25, default";
  prevX = 0;
  currX = 0;
  prevY = 0;
  currY = 0;
  mintol=0;
  maxtol=width-10;
  move=false;
  down=false;
  empty=true;
  complete=false;
  NewPoints=[];
  startAnim = false;
  //var pointsX= [];
  //var pointsY=[];
  startDrawing=false;
  discrete= false;
  points=[];
  ctx.clearRect(0,0,width,height)
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mousemove', mouseMove, false);
}


var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var mintol=0;
var maxtol=width-10;
var move=false;
var down=false;
var empty=true;
var complete=false;
var NewPoints=[];
var startAnim = false;
//var pointsX= [];
//var pointsY=[];
var startDrawing=false;
var discrete= false;
var points=[];
function KeepTrack(X,Y){
  if(complete){
    points.push([width, height/2]);
    Discretize();
    return;}
 points.push([X,Y]);
};

function mouseMove (e) {
  if(complete){return;}
            move=true;
            prevX = currX;
            prevY = currY;
            currX = e.layerX;
            currY = e.layerY;
   draw();
  if(startDrawing){
  KeepTrack(currX,currY);
        };
};
  
function mouseDown (e) {
    if(complete) return;
     startDrawing=true;
};

function draw() {
  if(move && startDrawing){         
    ctx.beginPath();
    if(empty){
    prevX=currX;
    prevY=currY;
    currX=mintol;
    currY=height/2;
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    empty=false;
    } 
    else if (prevX>maxtol)
    { 
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(width, height/2);
      complete=true;
      //console.log(points)     
    }
    else if(currX<prevX){
      currX=prevX;
      currY=prevY;
    }
    else {
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(currX, currY);
    }
    ctx.lineWidth=2;
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.stroke();
    ctx.closePath();
  }

}

function DrawPoints(NewPoints){
  ctx.clearRect(0,0,width,height)
  ctx.beginPath();
  var i;
  for(i=0; i<NewPoints.length; i++){
  ctx.fillRect(NewPoints[i][0], NewPoints[i][1], 1, 1);
  }  
  ctx.strokeStyle= "red";
  ctx.stroke();
  ctx.closePath();
};

function ChangeYcord(NewPoints){
    var i;
  for(i=0; i<NewPoints.length; i++){
    NewPoints[i][1]=(height/2)-NewPoints[i][1]
  }
};

function Discretize(){
  var interpolateLineRange = require( 'line-interpolate-points' );
  NewPoints = interpolateLineRange(points, 120)
  startAnim = true;
  DrawPoints(NewPoints);
  ChangeYcord(NewPoints);
  //console.log(NewPoints);
};

//Assigning value to the sliders------------------------------------------------------------
document.getElementById("T_value").innerHTML = document.getElementById("sl_T").value;
document.getElementById("sl_T").oninput = function(){
  document.getElementById("T_value").innerHTML = this.value;
}

document.getElementById("L_value").innerHTML = document.getElementById("sl_L").value;
document.getElementById("sl_L").oninput = function(){
  document.getElementById("L_value").innerHTML = this.value;
}

document.getElementById("m_value").innerHTML = document.getElementById("sl_m").value;
document.getElementById("sl_m").oninput = function(){
  document.getElementById("m_value").innerHTML = this.value;
}

document.getElementById("nu_value").innerHTML = document.getElementById("sl_nu").value;
document.getElementById("sl_nu").oninput = function(){
  document.getElementById("nu_value").innerHTML = this.value;
}

document.getElementById("max_dur_sound_value").innerHTML = document.getElementById("sl_max_dur_sound").value;
document.getElementById("sl_max_dur_sound").oninput = function(){
  document.getElementById("max_dur_sound_value").innerHTML = this.value;
}
//--------------------------------------------------------------------

//  ------------ANIMATION CODE--------------- 
function Animation(){

  const n_points = NewPoints.length;
  //console.clear();
  //console.log(NewPoints);

  var Xcord = getCol(NewPoints,0);
  var changedModel = math.zeros(n_points,2)._data;
  //console.log(changedModel);
  var i;
  for(i=0;i<n_points;i++){
    changedModel[i][0] = Xcord[i];
  }

  //MODEL
  var model = Array(n_points).fill(0);

  //VIEW
  function render(){
    var i;
    for(i=0;i<model.length;i++){
      changedModel[i][1] = 75 - model[i];
    }
  
    DrawPoints(changedModel);
  }




  const n_modes = n_points - 2;
  var omega = Array(n_modes).fill(0);
  var Phi = math.zeros(n_points,n_modes)._data;

  //compute natural frequencies
    var i;
  for(i=0;i<n_modes;i++){
    omega[i] = (i+1)*Math.PI*Math.sqrt(T/m) / L;
  }
  //compute mode shapes
    var i,j;
  for(j=0;j<n_points;j++){
    for(i=0;i<n_modes;i++){
      Phi = math.subset(Phi, math.index(j,i), Math.sin((i+1)*Math.PI* ((j)*L/(n_points-1)) / L));
    }
  }

  var w = getCol(NewPoints,1);
  //var pick_point = n_points/3;
  /*
  for(i=0;i<n_points;i++){
    if (i<pick_point){
        w[i] = i;
    } else {
        w[i] = pick_point * (i)/ (pick_point - n_points) - pick_point*n_points / (pick_point - n_points);
    }
  }
  */
  Phi.pop(); Phi.shift();

  w.pop(); w.shift(); math.flatten(w);

  //compute alpha and beta parameters

  var b_n = math.flatten(math.multiply(math.inv(Phi),math.transpose(w)));
  var a_n = Array(n_modes).fill(0);





  var cos = Array(n_modes).fill(0);

  var time=0;
  setInterval(goOn,inte);

  //functions definition
  function goOn() {
    time = time + inte/100*Math.pow(10,-3);
    var i;
    for(i=0;i<n_modes;i++){
    cos[i] = a_n[i]*Math.sin(omega[i]*time) + b_n[i]*Math.cos(omega[i]*time);
    }
    var i;
    for(i=0;i<n_points;i++){
      if(i!=0 && i!=n_points-1){
        model[i] = math.dot(      math.flatten(math.subset(Phi,math.index(i-1,math.range(0,n_modes))))
        ,
        cos
        );
      }
    }
    render(); 
  }
  
}

//---------ANIMATION DAMPED CODE--------------------
function Animation_damped(){

  var bool1 = false;
  document.getElementById("can").style.cursor = "default";

  //constant definitions----------------------------------------------------------
  var T = document.getElementById("sl_T").value; //
  const L = document.getElementById("sl_L").value; //0.65;
  const m = document.getElementById("sl_m").value; //2.33 * Math.pow(10,-3);
  const inte = 50;
  const nu = document.getElementById("sl_nu").value; //(2 * m * 0.5)*5;
  //const nu = (2*Math.PI*Math.sqrt(T*m)) / L +0.1
  //const nu = 0;
  const i_bar = nu*L/(2*Math.PI*Math.sqrt(T*m));
  const alpha = nu/(2*m);
  const dur = document.getElementById("sl_max_dur_sound").value;
  //--------------------------------------------------------------------------------

  const n_points = NewPoints.length;
  //console.clear();
  //console.log(NewPoints);

  var Xcord = getCol(NewPoints,0);
  var changedModel = math.zeros(n_points,2)._data;
  //console.log(changedModel);
  var i;
  for(i=0;i<n_points;i++){
    changedModel[i][0] = Xcord[i];
  }

  //MODEL
  var model = Array(n_points).fill(0);

  //VIEW
  function render(){
    var i;
    for(i=0;i<model.length;i++){
      changedModel[i][1] = 75 - model[i];
    }
  
    DrawPoints(changedModel);
  }




  const n_modes = n_points - 2;
  var omega = Array(n_modes).fill(0);
  var Phi = math.zeros(n_points,n_modes)._data;

  //compute natural frequencies
  console.log("computing natural frequencies");
  var i;
  for(i=0;i<n_modes;i++){
    omega[i] = Math.sqrt(Math.abs(math.pow(nu,2) - 4*m*T*math.pow((i+1)*Math.PI / L,2))) / (2 * m)
  }
  //compute mode shapes
  console.log("computing modeshapes");
  var i,j;
  for(j=0;j<n_points;j++){
    for(i=0;i<n_modes;i++){
      Phi = math.subset(Phi, math.index(j,i), Math.sin((i+1)*Math.PI* ((j)*L/(n_points-1)) / L));
    }
  }

  var w = getCol(NewPoints,1);
  //var pick_point = n_points/3;
  /*
  for(i=0;i<n_points;i++){
    if (i<pick_point){
        w[i] = i;
    } else {
        w[i] = pick_point * (i)/ (pick_point - n_points) - pick_point*n_points / (pick_point - n_points);
    }
  }
  */
  Phi.pop(); Phi.shift();

  w.pop(); w.shift(); math.flatten(w);

  //compute a_n and b_n parameters

  var b_n = Array(n_modes).fill(0);
  var a_n = Array(n_modes).fill(0);

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  console.log("computing a_n and b_n");
  b_n = math.flatten(math.multiply(math.inv(Phi),math.transpose(w)));

  var i;
  for(i=0;i<n_modes;i++){
    a_n[i] =  b_n[i]*alpha/omega[i]
  }


  var cos = Array(n_modes).fill(0);
  var cosh = Array(n_modes).fill(0);

  console.log("starting animation...");
  var time=0;
  setInterval(function(){
    if (bool1){
        return
    }else{
      goOn();
    }
  },inte);

  // --------------SOUND-------------------
  let audioContext = new AudioContext();
  var myBuffer=[];

  var gainNode=[];
  var temp;
  var pickup = document.getElementById("sl_max_dur_sound").value;
  var gains=[];
  var sr = 22050;

  //riempi il buffer
  var i;
  for(i=0; i<n_modes; i++){
    myBuffer[i] = audioContext.createBuffer(1, sr*dur, sr);
    //let myBuffer=audioContext.createBuffer(1,441000,44100);
    //let Arraudio=myBuffer.getChannelData(0);
    let Arraudio = myBuffer[i].getChannelData(0); 
    gainNode[i]= audioContext.createGain();
    //var exp= [];
    //
    for (let sampleNumber = 0 ; sampleNumber < sr*dur ; sampleNumber++) {
      temp=1/sr;
      Arraudio[sampleNumber] = Phi[pickup][i]*Math.exp(-alpha*temp*sampleNumber)*(a_n[i]*Math.sin(omega[i]*temp*sampleNumber) + b_n[i]*Math.cos(omega[i]*temp*sampleNumber));
    }
  }
  //start audio          
  for(i=0; i<n_modes; i++){
    let src = audioContext.createBufferSource();
    src.buffer = myBuffer[i];
    //src.connect(gainNode[i]);
    src.connect(audioContext.destination);
    src.start();
  }


  //functions definition
  function goOn() {
    console.log("increasing time");
    time = time + inte*Math.pow(10,-3);
    console.log("computing cos and cosh arrays");
    var i;
    for(i=0;i<n_modes;i++){
      cos[i] = a_n[i]*Math.sin(omega[i]*time) + b_n[i]*Math.cos(omega[i]*time);
    }
    for(i=0;i<n_modes;i++){
      cosh[i] = a_n[i]*Math.sinh(omega[i]*time) + b_n[i]*Math.cosh(omega[i]*time);
    }
    console.log("updating the model");
    var i;
    for(i=0;i<n_points;i++){
      if(i!=0 && i!=n_points-1){
        if(Math.floor(i_bar) != 0){
          console.log("I'm here :)")
          model[i] = Math.exp(-alpha*time) * math.dot(math.flatten([math.subset(Phi,math.index(i-1,math.range(0,Math.floor(i_bar))))])
          ,
          cosh.slice(0,Math.floor(i_bar))
          )
          +
          Math.exp(-alpha*time) * math.dot(math.flatten(math.subset(Phi,math.index(i-1,math.range(Math.floor(i_bar),n_modes))))
          ,
          cos.slice(Math.floor(i_bar),n_modes)
          );
        }else{
          model[i] = Math.exp(-alpha*time) * math.dot(math.flatten(math.subset(Phi,math.index(i-1,math.range(0,n_modes))))
          ,
          cos
          );
        }
        
      }
    }
    render(); 
    reset.onclick = function(){
      bool1 = true;
      model = Array(n_points).fill(0);
      reset_func();
    }
  }
    
}

animate.onclick = function() {if(startAnim){
  Animation_damped();
  }
};

//lazy functions
function getCol(matrix, col){
  var column = [];
  var i;
  for(var i=0; i<matrix.length; i++){
    column.push(matrix[i][col]);
  }
  return column;
}