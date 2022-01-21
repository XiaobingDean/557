
var vertexShaderText = 
[ 
'precision mediump float;',
'',
'attribute vec2 vertPosition;', //declare matrix , change to vec3 for 3d 
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mProj;',
'uniform mat4 mView;',
'',
'void main()',
'{',
'fragColor = vertColor;',
'gl_Position = mProj * mView * mWorld * vec4(vertPosition, 0.0, 1.0);', //multiply by projection matrix
'gl_PointSize = 5.0;',
'}'
].join('\n');

var fragShaderText = 
[ 
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'gl_FragColor = vec4(fragColor,1.0);',
'}'
].join('\n');

var initJulia = function(val1,val2,bail,escaped) {

	val1 = parseFloat(val1);
	val2 = parseFloat(val2);
	var canvas = document.getElementById('Julia');
	var gl = canvas.getContext('webgl');
	gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var FragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertexShader,vertexShaderText);
	gl.shaderSource(FragmentShader,fragShaderText);
	
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertexShader',gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(FragmentShader);
	if(!gl.getShaderParameter(FragmentShader,gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragmentShader');
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,FragmentShader);
	gl.linkProgram(program);
	
	if(!gl.getProgramParameter(program,gl.LINK_STATUS)) {
		console.error("ERROR LINKING", gl.getProgramInfoLog(program));
	}
	/* use only in debusg
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)) {
		console.error("ERROR LINKING", gl.getPRogramInfoLog(program));
	}
	*/
	
	// create buffer
	
	
	
	var JuliaVert = createJulia(val1,val2,bail,escaped);

	
	var JuliaVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, JuliaVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(JuliaVert),gl.STATIC_DRAW);
	
	var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program,'vertColor');
	gl.vertexAttribPointer(
	positionAttribLocation, // attribute location
	2,  //number of elements per attribute
	gl.FLOAT, //type of element
	gl.FALSE, // is normalized?
	 5 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex 
	 0  // offset from beg of a single vertex to this attribute 
	);
	
	gl.vertexAttribPointer(
	colorAttribLocation, // attribute location
	3,  //number of elements per attribute
	gl.FLOAT, //type of element
	gl.FALSE, // is normalized?
	 5 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex 
	 2 * Float32Array.BYTES_PER_ELEMENT  // offset from beg of a single vertex to this attribute 
	);
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	
	//tell openGL which program is active
	gl.useProgram(program);
	
	var matWorldUniformLocation = gl.getUniformLocation(program,"mWorld");
	var matViewUniformLocation = gl.getUniformLocation(program,"mView");
	var matProjUnifromLocation = gl.getUniformLocation(program,"mProj");
	
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	
	glMatrix.mat4.identity(worldMatrix);
	glMatrix.mat4.lookAt(viewMatrix,[0,0,-4],[0,0,0],[0,1,0])
	glMatrix.mat4.perspective(projMatrix,glMatrix.glMatrix.toRadian(45),canvas.width/canvas.height,0.1,1000.0);
	
	
	
	gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation,gl.FALSE,viewMatrix);
	gl.uniformMatrix4fv(matProjUnifromLocation,gl.FALSE,projMatrix);
	//main render loop
	
	gl.drawArrays(gl.POINTS,0,JuliaVert.length);
}



/********************* JULIA SET CODE *********************/


function createJulia(var1,var2,bail,escaped) {
	
  var ESCAPE_RADIUS ; //  At what point will we say the orbit escaped and won't return 
 var BAILOUT ;  //  When we are choosing to stop running the checks 
 
//complexNumber c = new complexNumber(0, 0);
  LOWER_BOUND = -2;
  UPPER_BOUND = 2;
  INCREMENT = 0.004;
var PointsAndColors = [];
var val1 = var1;
var val2 = var2;
BAILOUT = parseInt(bail);
ESCAPE_RADIUS = parseInt(escaped);

console.log(val1,val2);

  for ( y = -2; y  < 2; y+= INCREMENT) {
  
     drawY = y ;
    for ( x = -2; x < 2; x+=INCREMENT) {
   
       drawX = x;
      //sets the complex number to the mapped x and y values
      var z = {real: drawX, imaginary:drawY,iter:0, 
			   escapes: function() {
				   	realSeed = this.real;
					imagSeed = this.imaginary;
				for( i = 0; i < BAILOUT;i++) {		
					if((realSeed * realSeed) + (imagSeed * imagSeed) > (ESCAPE_RADIUS*ESCAPE_RADIUS)) {
						
							return true;
					}
					z.iter++;
					realTemp = (realSeed * realSeed) - (imagSeed * imagSeed);
					imagSeed = (2 * realSeed* imagSeed) + val2;  
					realSeed = realTemp + val1; 
				}		
				return false;	  		   
			   }  
	  };
     //var color ;
      //if it escapes it sets the color based on number of iterations
      if (z.escapes() ) {
        //color c = lerpColor(color(86, 120, 212), color(89, 185, 134), .2 * iteration);
		
        PointsAndColors.push(z.real)
		PointsAndColors.push(z.imaginary)		// escape = red
		
		
		
		if(z.iter == 10) {
		PointsAndColors.push(0)
		PointsAndColors.push(0)
		PointsAndColors.push(1)
		}
		else if(z.iter == 9) {
		PointsAndColors.push(.1)
		PointsAndColors.push(0)
		PointsAndColors.push(.9)
		}
		else if(z.iter == 8) {
		PointsAndColors.push(.3)
		PointsAndColors.push(0)
		PointsAndColors.push(.8)
		}
		else if(z.iter == 7) {
		PointsAndColors.push(.3)
		PointsAndColors.push(0)
		PointsAndColors.push(0.7)
		}
		else if(z.iter == 6) {
		PointsAndColors.push(.5)
		PointsAndColors.push(0)
		PointsAndColors.push(0.8)
		}
		else if(z.iter == 5) {
		PointsAndColors.push(0.5)
		PointsAndColors.push(0)
		PointsAndColors.push(0.7)
		}
		else if(z.iter == 4) {
		PointsAndColors.push(0.7)
		PointsAndColors.push(0)
		PointsAndColors.push(0.7)
		}
		else if(z.iter == 3) {
		PointsAndColors.push(0.7)
		PointsAndColors.push(0)
		PointsAndColors.push(0.5)
		}
		else if(z.iter == 2) {
		PointsAndColors.push(1)
		PointsAndColors.push(0)
		PointsAndColors.push(0.5)
		}
		else if(z.iter == 1) {
		PointsAndColors.push(1)
		PointsAndColors.push(0)
		PointsAndColors.push(0.4)
		}
		else {
		PointsAndColors.push(1)
		PointsAndColors.push(0)
		PointsAndColors.push(0)
		}
      } 
     // if it doesnt escape color it black
      else {          // no escape = black
       PointsAndColors.push(z.real)
		PointsAndColors.push(z.imaginary)		
		PointsAndColors.push(0)
		PointsAndColors.push(0)
		PointsAndColors.push(0)
      }
     
   
    }
  }
	return PointsAndColors;
}
	
function Update(val1,val2,bail,escaped) {
initJulia(parseFloat(val1),parseFloat(val2),bail,escaped);
}






























