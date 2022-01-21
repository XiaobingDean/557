
 ESCAPE_RADIUS = 2; //  At what point will we say the orbit escaped and won't return 
 BAILOUT = 10;


 increase = true;
var points = []
function setup() {
createCanvas(750,750,WEBGL);
cam = createCamera();
 points = createJulia3D();
}
function draw() {

  background(0);
  stroke(255, 0, 0);
  lights();
  stroke(255, 0, 0);
	//rotateZ(frameCount *.2);
	//rotateY(frameCount *.2);
	//box(50);
  stroke(255);
  strokeWeight(10);


  strokeWeight(10);
  stroke(255, 255, 255);
console.log(points);
  for( i = 0; i < points.length; i +=3) {
	  point(points[i],points[i+1],points[i+2]);
  }
  
  //println(System.currentTimeMillis() - t);
} 


const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


function createJulia3D() {

var PointsAndColors = [];
  ESCAPE_RADIUS = 2; 
 BAILOUT = 10; 
  LOWER_BOUND = -2;
  UPPER_BOUND = 2;
  INCREMENT = 0.015;

	
/*
var val1 = document.getElementById("#CReal");
  var val2 =  document.getElementById("#CImaginary");
  var val3 = document.getElementById("#Z");
  var val4 = document.getElementById("#W");
	*/
	var val1 = -1.0;
	var val2 = 0.2;
	var val3 = 0.0;
	var val4 = 0.0;
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
		
        PointsAndColors.push(scale(z.real,-2,2,0,750));
		PointsAndColors.push(scale(z.imaginary,-2,2,0,750))	;	
		PointsAndColors.push(scale(z.depth,-2,2,0,1000));
		//PointsAndColors.push(z.WVal)
	
      }
     
     
    }
  }
  }
	return PointsAndColors;
}