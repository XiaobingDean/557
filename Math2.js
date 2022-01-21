



var vertexShaderText = 
[ 
'precision mediump float;',
'',
'attribute vec3 vertPosition;', 
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mProj;',
'uniform mat4 mView;',
'',
'void main()',
'{',
'fragColor = vertColor;',
'gl_Position = mProj * mView * mWorld * vec4(vertPosition,1.0);', 
'gl_PointSize = 1.0;',
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

var initJulia3D = function(var1, var2,var3,var4,bail,escaped) {
	var1 = parseFloat(var1);
	var2 = parseFloat(var2);
	var3 = parseFloat(var3);
	var4 = parseFloat(var4);
	

	var canvas = document.getElementById('Julia3D');
	var gl = canvas.getContext('webgl');
	gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);
	
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
	/* use only in debug */
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)) {
		console.error("ERROR LINKING", gl.getPRogramInfoLog(program));
	}
	
	
	// create buffer

	var JuliaVert = createJulia3D(var1,var2,var3,var4,bail,escaped);
	var JuliaVertexBufferObject = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, JuliaVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(JuliaVert),gl.STATIC_DRAW);

	
	var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program,'vertColor');
	gl.vertexAttribPointer(
	positionAttribLocation, // attribute location
	4,  //number of elements per attribute
	gl.FLOAT, //type of element
	gl.FALSE, // is normalized?
	 7 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex 
	 0  // offset from beg of a single vertex to this attribute 
	);
	gl.vertexAttribPointer(
	colorAttribLocation, // attribute location
	3,  //number of elements per attribute
	gl.FLOAT, //type of element
	gl.FALSE, // is normalized?
	 7 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex 
	 4 * Float32Array.BYTES_PER_ELEMENT  // offset from beg of a single vertex to this attribute 
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
	glMatrix.mat4.lookAt(viewMatrix,[0,0,-5],[0,0,0],[0,1,0])
	glMatrix.mat4.perspective(projMatrix,glMatrix.glMatrix.toRadian(45),canvas.width/canvas.height,0.1,1000.0);
	
	
	
	gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
	
	gl.uniformMatrix4fv(matViewUniformLocation,gl.FALSE,viewMatrix);
	gl.uniformMatrix4fv(matProjUnifromLocation,gl.FALSE,projMatrix);

	//main render loop
var zRot = 0;
var xRot = 0;
var yRot = 0;
	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	var angle = 0;
	
	var loop = function() {
		
		 angle = performance.now()/1000 /6 *2 * Math.PI;
		 if( $('input[name="RotateY"]:checked').length > 0) {
			yRot = 1;
		 } else {
			 yRot = 0;
		 }
		 if( $('input[name="RotateX"]:checked').length > 0) {
			xRot = 1;
		 } else {
			 xRot = 0;
		 }
		 if( $('input[name="RotateZ"]:checked').length > 0) {
			zRot = 1;
		 } else {
			 zRot = 0;
		 }
		glMatrix.mat4.rotate(worldMatrix,identityMatrix,angle,[xRot,yRot,zRot]);
		 gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
		 gl.clearColor(0,0,0,1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.POINTS,0,JuliaVert.length);
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);



}



/********************* JULIA SET CODE *********************/

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}




function createJulia3D(var1,var2,var3,var4,bail,escaped) {

var PointsAndColors = [];
 var ESCAPE_RADIUS; 
var BAILOUT; 
  LOWER_BOUND = -2;
  UPPER_BOUND = 2;
  INCREMENT = 0.015;

	
	
	var val1 = parseFloat(var1);
	var val2 = parseFloat(var2);
	var val3 = parseFloat(var3);
	var val4 = parseFloat(var4);
	BAILOUT = parseInt(bail);
	ESCAPE_RADIUS = parseInt(escaped);
  for ( depthComp = -2; depthComp < 2; depthComp+= INCREMENT ) {
    //maps z to 0, 200 so it appears on screen
     drawZ = depthComp;//scale(depthComp,-2,2,0,1000);  // map(z, -2, 2, 0, 1000);

  for ( y = -2; y  < 2; y+= INCREMENT) {
    //maps value of y to valid range
     drawY = y;//scale(y,-2,2,0,750);

    for ( x = -2; x < 2; x+=INCREMENT) {
      //maps value of x to valid range
       drawX = x;//scale(depthComp,-2,2,0,750);

      //sets the complex number to the mapped x and y values, z and w
      var z = {real: drawX, imaginary:drawY, depth:drawZ, WVal:0.0, 
			   escapes: function() {
				   	realSeed = this.real;
					imagSeed = this.imaginary;
					depthSeed = this.depth;
					WSeed = this.WVal;
				
				for( i = 0; i < BAILOUT;i++) {	
					
					var addedVal = (realSeed * realSeed) + (imagSeed * imagSeed) + (depthSeed * depthSeed) + (WSeed *WSeed);
					if(addedVal > (ESCAPE_RADIUS*ESCAPE_RADIUS*ESCAPE_RADIUS*ESCAPE_RADIUS)) {
						
							return true;
					}

					realTemp = (realSeed + realSeed);
					realSeed = (realSeed*realSeed)-(imagSeed*imagSeed)-(depthSeed*depthSeed)-(WSeed * WSeed) + val1;  
					imagSeed = realTemp*imagSeed + val2; 
					depthSeed = realTemp*depthSeed + val3;
					WSeed = realTemp *WSeed + val4;
					
				}		
				return false;	  		   
			   }  
	  };
    
      if (z.escapes() ) {
      } 
     // if it doesnt escape color it white
      else {          // no escape = white
		
   
       PointsAndColors.push(z.real)
		PointsAndColors.push(z.imaginary)		
		PointsAndColors.push(z.depth)
		PointsAndColors.push(z.WVal)
		PointsAndColors.push(1)
		PointsAndColors.push(1)
		PointsAndColors.push(1)
		
	
      }
     
     
    }
  }
  }
	return PointsAndColors;
}

/********************************/	
function Update3D(val1,val2,val3,val4,bail,escaped) {

initJulia3D(parseFloat(val1),parseFloat(val2),parseFloat(val3),parseFloat(val4),bail,escaped  );


}

