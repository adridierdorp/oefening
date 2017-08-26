function init(){
    var MQ = MathQuill.getInterface(2); // for backcompat
    var mathField = MQ.MathField(document.getElementById('math-field'), {
        spaceBehavesLikeTab: true, // configurable
        handlers: {
            edit: function() { // useful event handlers
            	document.getElementById('latex').textContent = mathField.latex(); // simple API
            }
        }
    });
    return mathField;
}

function vulin() {
	init();
}

function fWortel() {
	 init().focus(document.getElementById('latex'));
    init().latex(document.getElementById('latex').textContent + '\\sqrt{}');
    //init().latex();
}

function fMacht() {
    init().latex(document.getElementById('latex').textContent + '\\^{}');
    //init().latex();
}