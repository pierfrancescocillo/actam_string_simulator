console.clear();
test_bool = 0;

var canvas = document.getElementById("can");
var canvas_s = document.getElementById("spec_can");

var ctx = canvas.getContext('2d');
const height= can.height;
const width= can.width;
var bounds=canvas.getBoundingClientRect();
//  let left   = bounds.left   + window.scrollX;
 // let topp    = bounds.top    + window.scrollY;
 // let right  = bounds.right  + window.scrollX;
 // let bottom = bounds.bottom + window.scrollY;
//var bounds_y=canvas.getBoundingClientRect().top;//-window.scrollY;      
ctx.beginPath();
ctx.moveTo(0, height/2);
ctx.lineTo(width, height/2);          
ctx.lineWidth=0.3;
ctx.strokeStyle= "white"
ctx.stroke();
ctx.closePath();

N_points = 120;

var ctx_s = canvas_s.getContext('2d');
const spec_h= spec_can.height;
const spec_w= spec_can.width;

//ctx.translate()
canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mousemove', mouseMove, false);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mouseout', mouseOut);

function reset_func(){
  document.getElementById("can").style.cursor = "url(imgs/cursor.cur) 0 0, default";

  ctx.clearRect(0,0,width,height);
  ctx_s.clearRect(0,0,spec_w,spec_h);
  ctx.beginPath();
  ctx.moveTo(0, height/2);
  ctx.lineTo(width, height/2);          
  ctx.lineWidth=0.3;
  ctx.strokeStyle= "white"
  ctx.stroke();
  ctx.closePath();

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

  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('mouseout', mouseOut);

  var audioContext = new AudioContext();
  var myBuffer=[];
  var srcs = [];
  var gainNode=[];
  var temp;
  var gains=[];
  var sr = 22050;
}

//time slider useful variables
var bool_speed = 1;
var speeds = [0.001,0.01,0.1,1];

notes = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];

//Canvas variables
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

//Sound Variables
var audioContext = new AudioContext();
var myBuffer=[];
var srcs = [];
var gainNode=[];
var temp;
var gains=[];
var sr = 22050;


function mouseUp(e){
  startDrawing=false;
};

function mouseOut(e){
  startDrawing=false;
}

function mouseMove (e) {
  if(complete){
    canvas.removeEventListener('mousemove', mouseMove);
  };
  //{return;}
  
            move=true;
            prevX = currX;
            prevY = currY;
            currX=((e.pageX-bounds.left)/(bounds.right-bounds.left)*width);
            currY=((e.pageY-bounds.top)/(bounds.bottom-bounds.top)*height);
 
  draw();
  if(startDrawing){
  KeepTrack(currX,currY);
        };
};
  
function mouseDown (e) {
    if(complete){
      canvas.removeEventListener('mousedown', mouseDown);
    }; //return;
       startDrawing=true;
      if(!empty){
       currX=points[points.length-1][0];
       currY=points[points.length-1][1];
}   
     //draw=true;
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
    ctx.lineWidth=1;
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.strokeStyle='rgba(255,255,255,0.5)';
    ctx.stroke();
    ctx.closePath();
  }

}

function DrawPoints(NewPoints){
  ctx.clearRect(0,0,width,height);
  ctx.beginPath();
  ctx.moveTo(0, height/2);
  ctx.lineTo(width, height/2);
  ctx.lineWidth=0.3;
  ctx.strokeStyle="white";
  ctx.stroke();
  ctx.closePath();
  var i;
  ctx.beginPath();
  ctx.fillStyle= 'rgba(255,255,255,0.5)';
  for(i=0; i<NewPoints.length; i++){
  ctx.fillRect(NewPoints[i][0], NewPoints[i][1], 1, 1);
  };
  
  ctx.closePath();
};


/*function DrawPoints(NewPoints){
  ctx.clearRect(0,0,width,height);
  ctx.beginPath();
  ctx.moveTo(0, height/2);
  ctx.lineTo(width, height/2);
  ctx.lineWidth=0.3;
  ctx.strokeStyle="white";
  ctx.stroke();
  ctx.closePath();
  var i;
  ctx.beginPath();
  //ctx.fillStyle= 'rgba(255,255,255,0.5)';
  ctx.strokeStyle= 'rgba(255,255,255,0.5)';
  for(i=1; i<NewPoints.length; i++){
    ctx.moveTo(NewPoints[i-1][0], NewPoints[i-1][1]);
    ctx.lineTo(NewPoints[i][0], NewPoints[i][1]);
    if(i<NewPoints.length/2){ 
      ctx.lineWidth=0.01;
    }else{
      ctx.lineWidth=0.02;
    }
    
    ctx.stroke();
  };
  
  ctx.closePath();
};*/

function DrawLines(NewPoints){
  ctx_s.clearRect(0,0,spec_h,spec_w)
  ctx_s.beginPath();
  ctx_s.fillStyle= "#2772bf";
  for(i=0; i<NewPoints.length; i++){
  ctx_s.fillRect(NewPoints[i][0]+1, NewPoints[i][1], 3, spec_h - NewPoints[i][1]);
  };
  ctx_s.stroke();
  ctx_s.closePath();
};


function ChangeYcord(NewPoints){
    var i;
  for(i=0; i<NewPoints.length; i++){
    NewPoints[i][1]=(height/2)-NewPoints[i][1]
  }
};

function Discretize(){
  var interpolateLineRange = require( 'line-interpolate-points' );
  NewPoints = interpolateLineRange(points, N_points)
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
  document.getElementById("pick_up_value").innerHTML = Math.round((document.getElementById("pick_up").value * this.value / (N_points-1) * 100) * 100)/100;
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

document.getElementById("anim_speed_value").innerHTML = speeds[document.getElementById("sl_anim_speed").value];
document.getElementById("sl_anim_speed").oninput = function(){
  document.getElementById("anim_speed_value").innerHTML = speeds[this.value];
}

document.getElementById("pick_up").max = N_points-1;  
document.getElementById("pick_up").value = Math.round((N_points-1)/2); 
document.getElementById("pick_up_value").innerHTML = Math.round((document.getElementById("pick_up").value * document.getElementById("sl_L").value / (N_points-1) * 100) * 100)/100;
document.getElementById("pick_up").oninput = function(){
  document.getElementById("pick_up_value").innerHTML = Math.round((this.value * document.getElementById("sl_L").value / (N_points-1) * 100) * 100)/100;
}
//--------------------------------------------------------------------

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
  console.log("i_bar: " + String(i_bar))
  const alpha = nu/(2*m);
  const dur = document.getElementById("sl_max_dur_sound").value;
  var pickup = document.getElementById("pick_up").value;
  var speed_i = document.getElementById("sl_anim_speed").value;
  //--------------------------------------------------------------------------------

  const n_points = NewPoints.length;
  const n_modes = n_points - 2;
  var omega = Array(n_modes).fill(0);
  var Phi = math.zeros(n_points,n_modes)._data;

  var Xcord = getCol(NewPoints,0);
  var changedModel = math.zeros(n_points,2)._data;
  var Adapted = math.zeros(n_modes,2)._data;
  //console.log(changedModel);
  var i;
  for(i=0;i<n_points;i++){
    changedModel[i][0] = Xcord[i];
  }
  for(i=0;i<n_modes;i++){
    Adapted[i][0] = Xcord[i] * 2;
  }

  //MODEL
  var model = Array(n_points).fill(0);
  var model_spec = Array(n_modes).fill(0);

  //VIEW
  function render(){
    var i;
    for(i=0;i<model.length;i++){
      changedModel[i][1] = height/2 - model[i];
    }
  
    DrawPoints(changedModel);
  }

  function render_spec(){
    for(i=0;i<n_modes;i++){
      Adapted[i][1] = spec_h - model_spec[i];
    }
    DrawLines(Adapted);
  }

  //compute natural frequencies
  console.log("computing natural frequencies");
  var i;
  for(i=0;i<n_modes;i++){
    omega[i] = Math.sqrt(Math.abs(math.pow(nu,2) - 4*m*T*math.pow((i+1)*Math.PI / L,2))) / (2 * m)
  }

  var N = Math.round(12 * Math.log(omega[0]/(2*Math.PI)/440) / Math.log(2));
  while(N<0 || N>11){
    if(N<0){
      N=N+12;
    }else{
      N=N-12;
    }
  }
  document.getElementById("show_note").innerHTML = notes[N];


  //compute mode shapes
  console.log("computing modeshapes");
  var i,j;
  for(j=0;j<n_points;j++){
    for(i=0;i<n_modes;i++){
      Phi[j][i] = Math.sin((i+1)*Math.PI* ((j)*L/(n_points-1)) / L);
    }
  }

  

  var w = getCol(NewPoints,1);
 
  Phi.pop(); Phi.shift();

  w.pop(); w.shift(); math.flatten(w);

  //compute a_n and b_n parameters

  var b_n = Array(n_modes).fill(0);
  var a_n = Array(n_modes).fill(0);

  console.log("computing a_n and b_n");
  b_n = math.flatten(math.multiply(math.inv(Phi),math.transpose(w)));

  var i;
  for(i=0;i<n_modes;i++){
    a_n[i] =  b_n[i]*alpha/omega[i]
  }


  var cos = Array(n_modes).fill(0);
  var cosh = Array(n_modes).fill(0);
  var A_n = Array(n_modes).fill(0);
  var A_nh = Array(n_modes).fill(0);


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
  
  //riempi il buffer
  temp=1/sr;
  var i;
  for(i=0; i<n_modes; i++){
    myBuffer[i] = audioContext.createBuffer(1, sr*dur, sr);
    //let myBuffer=audioContext.createBuffer(1,441000,44100);
    //let Arraudio=myBuffer.getChannelData(0);
    let Arraudio = myBuffer[i].getChannelData(0); 
    //var exp= [];
    //
    
    if(pickup!=0 && pickup!=n_points-1){
      for (let sampleNumber = 0 ; sampleNumber < sr*dur ; sampleNumber++) {     
        Arraudio[sampleNumber] = Phi[pickup-1][i]*Math.exp(-alpha*temp*sampleNumber)*(a_n[i]*Math.sin(omega[i]*temp*sampleNumber) + b_n[i]*Math.cos(omega[i]*temp*sampleNumber));
      }
    }else{
      for (let sampleNumber = 0 ; sampleNumber < sr*dur ; sampleNumber++) {     
        Arraudio[sampleNumber] = 0;
      }
    }
 
  }
  //start audio          
  for(i=0; i<n_modes; i++){
    srcs[i] = audioContext.createBufferSource();
    srcs[i].buffer = myBuffer[i];
    gainNode[i]= audioContext.createGain();
    if(sound_button.classList == "sound_on"){
      gainNode[i].gain.value = 1;
    }else{
      gainNode[i].gain.value = 0;
    }
    gainNode[i].connect(audioContext.destination);
    srcs[i].connect(gainNode[i]);
    srcs[i].start();
  }
  
  
  sound_button.onclick = function(){
    if (sound_button.classList == "sound_on"){
      sound_button.innerHTML = "Sound: OFF";
    }else{
      sound_button.innerHTML = "Sound: ON";
    }
    sound_button.classList.toggle("sound_off");

    for(i=0;i<n_modes;i++){
      if(sound_button.classList == "sound_on"){
        gainNode[i].gain.value = 1;
      }else{
        gainNode[i].gain.value = 0;
      }
    }
  }
  //-----------------------------------------

  
  //functions definition
  function goOn() {
    console.log("increasing time");
    time = time + inte*Math.pow(10,-3) * speeds[speed_i];
    console.log("computing cos and cosh arrays");
    var i;
    for(i=0;i<n_modes;i++){
      cos[i] = a_n[i]*Math.sin(omega[i]*time) + b_n[i]*Math.cos(omega[i]*time);
      cosh[i] = a_n[i]*Math.sinh(omega[i]*time) + b_n[i]*Math.cosh(omega[i]*time);
    }
    //computing norm. constant
    if(pickup!=0 && pickup!=n_points-1){
      var test = []
      for(i=0;i<n_modes;i++){
          if(i<i_bar){
            test[i] = Math.abs(b_n[i] * Phi[pickup-1][i] / Math.cosh(Math.atanh(-a_n[i]/b_n[i])));
          }else{
            test[i] = Math.abs(b_n[i] * Phi[pickup-1][i] / Math.cos(Math.atan(-a_n[i]/b_n[i])));
          }
      }
      var norm = Math.max.apply(Math, test);

      for(i=0;i<n_modes;i++){
        A_n[i] = Math.abs(b_n[i] * Phi[pickup-1][i] * Math.exp(-alpha*time) / Math.cos(Math.atan(-a_n[i]/b_n[i])) * (spec_h-10)/norm);
        A_nh[i] = Math.abs(b_n[i] * Phi[pickup-1][i] * Math.exp(-alpha*time) / Math.cosh(Math.atanh(a_n[i]/b_n[i])) * (spec_h-10)/norm);
      }
    }else{
      for(i=0;i<n_modes;i++){
        A_n[i] = 0;
        A_nh[i] = 0;
      }
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
          if(i<i_bar){
            model_spec[i-1] = A_nh[i-1];
          }else{
            model_spec[i-1] = A_n[i-1];
          }
        }else{
          model[i] = Math.exp(-alpha*time) * math.dot(math.flatten(math.subset(Phi,math.index(i-1,math.range(0,n_modes))))
          ,
          cos
          );
          model_spec[i-1] = A_n[i-1];
        }
        
      }
    }

    render(); 
    render_spec();
    reset.onclick = function(){
      bool1 = true;
      model = Array(n_points).fill(0);
      document.getElementById("show_note").innerHTML = "";
      for(i=0; i<n_modes; i++){
        srcs[i].stop();
      };
      reset_func();
    }
  }
    
}

animate.onclick = function() {if(startAnim){
  Animation_damped();
  }
};

sound_button.onclick = function(){
  if (sound_button.classList == "sound_on"){
    sound_button.innerHTML = "Sound: OFF";
  }else{
    sound_button.innerHTML = "Sound: ON";
  }
  sound_button.classList.toggle("sound_off");

}

sl_anim_speed.onclick = function(){
  if(bool_speed){
    alert("Be careful! \nIf you slow down the speed of the animation the audio reproduction will not be affected. \nThe animation and the sound will not be simultaneous");
    bool_speed = 0;
  }
}

//lazy functions
function getCol(matrix, col){
  var column = [];
  var i;
  for(var i=0; i<matrix.length; i++){
    column.push(matrix[i][col]);
  }
  return column;
}
