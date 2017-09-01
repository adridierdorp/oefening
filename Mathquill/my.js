var mathEditor;

function kijkna(){
	//console.log("input",mathEditor.getValue());
    $("#score").html(mathEditor.getValue());
};

function initialize(){
	  mathEditor = new MathEditor('answer');
	  //mathEditor.removeButtons(['integral']);
	  mathEditor.removeButtons(['cube_root']);
	  mathEditor.removeButtons(['greater_than']);
	  mathEditor.removeButtons(['less_than']);
	  mathEditor.removeButtons(['division']);
	  //mathEditor.setTemplate('floating-toolbar');
}