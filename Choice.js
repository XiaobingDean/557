function chooser () {
var val1 = $("input[name='CReal']").val();
var val2 = $("input[name='CImaginary']").val();
var val3 = $("input[name='Z']").val();
var val4 = $("input[name='W']").val();
var bail = $("input[name='Bailout']").val();
var escaped = $("input[name='Escape']").val();
console.log(val1);
if(val1 == "") {
	val1 = 0.0;
}
if(val2 == "") {
	val2 = 0.0;
}
if(val3 == "") {
	val3 = 0.0;
}
if(val4 == "") {
	val4 = 0.0;
}
if(bail == "") {
	bail = 10;
}
if(escaped == "") {
	escaped = 2;
}


Update3D(val1,val2,val3,val4,bail,escaped);
Update(val1,val2,bail,escaped);


}


