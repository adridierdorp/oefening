

function wortel_optellen_kijkna(){
	//console.log("input",mathEditor.getValue());
    $("#score").html(mathEditor.getValue());
};

function wortel_optellen_Initialize(id){
	  mathEditor = new MathEditor(id);
	  mathEditor.removeButtons(['integral']);
	  mathEditor.removeButtons(['cube_root']);
	  mathEditor.removeButtons(['greater_than']);
	  mathEditor.removeButtons(['less_than']);
	  mathEditor.removeButtons(['division']);
	  //mathEditor.setTemplate('floating-toolbar');
	  return mathEditor;
}

function wortel_optellen_CreateLevel() {
    var levels = [{
            name: 'Makkelijk',
            value: 1
        },
        {
            name: 'Normaal',
            value: 2
        },
        {
            name: 'Lastig',
            value: 3
        }
    ];
    return levels;
}

function wortel_optellen_GetGameName() {
    return "Wortels Optellen";
}

function wortel_optellen_CreateTitleLable(){
	$("#titelLabel").html("<font color='green'><h2>Wortels Optellen</h2><br /></font>");
}

/*
 * level 1:
 * a,b,c,d: -6 - 6 (maximum two 0 between four numbers)
 * x1: 1-20
 * x1: 2-10
 */
function wortel_optellen_createQuestion(level){
	var question ={
			a: 0,
			b: 0,
			c: 0,
			d: 0,
			x1: 0,
			x2: 0
	}
	var rangeForNumber;
	var rangeX1;
	var rangeX2;
	
	if(level == 1){
		rangeForNumber = {min:-6,max: 6};
		rangeX1 = {min:1,max: 10};
		rangeX2 = {min:2,max: 10};
	}
	else if(level == 2){
		rangeForNumber = {min:-16,max:20};
		rangeX1 = {min:1,max: 15};
		rangeX2 = {min:2,max: 10};
	}
	else if(level == 3){
		rangeForNumber = {min:-16,max:40};
		rangeX1 = {min:1,max: 20};
		rangeX2 = {min:2,max: 15};
	}
	
	while(question.a === 0 && question.b ===0){
		question.a = createRandom(rangeForNumber.min, rangeForNumber.max);
		question.b = createRandom(rangeForNumber.min, rangeForNumber.max);
	}
	while(question.c === 0 && question.d ===0){
		question.c = createRandom(rangeForNumber.min, rangeForNumber.max);
		question.d = createRandom(rangeForNumber.min, rangeForNumber.max);
	}
	question.x1= createRandom(rangeX1.min, rangeX1.max);
	question.x2= createRandom(rangeX2.min, rangeX2.max);
	return question;
}

function wortel_optellen_CreateQuestion(question) {
	if(!game.mathEditorQuestion){
		$("#question").append("<br/>Herleid:<br/>");
		$("#question").append("<div id='mathEditorQuestion'></div><br/>");
		
		//display the question
		game.mathEditorQuestion = createQuestionLatex('mathEditorQuestion');	
		
		//add editor
		$("#answerDiv").append("<div id='mathEditorAnswer'></div><br/>");
		game.mathEditorAnswer = wortel_optellen_Initialize('mathEditorAnswer');
		//add button to check
		$("#answerDiv").append("<button class='checkAnswerButton'>Click me</button><br/>");
		$('#answerDiv').on('click','.checkAnswerButton', wortel_optellen_PreCheckAnswer);
	}
	game.mathEditorQuestion.latex(wortel_optellen_CreateLatex(question));
	//hide the input
	showInput("answer",false);
}

function wortel_optellen_PreCheckAnswer(){
	var answerText = game.mathEditorAnswer.getValue();
	//answerText = replaceAll(answerText, '\\', '\\\\');
	$("#answer").val(answerText);
	checkAnswer({keyCode:13});
}

function wortel_optellen_CreateLatex(question){
	var questionLatex = wortel_optellen_CreateUnit(true,question.a,Math.pow(question.x1, 2));
    questionLatex = questionLatex + wortel_optellen_CreateUnit(false,question.b,Math.pow(question.x1, 2));
    questionLatex = questionLatex + wortel_optellen_CreateUnit(false,question.c,question.x2);
    questionLatex = questionLatex + wortel_optellen_CreateUnit(false,question.d,question.x2);
    if(questionLatex.startsWith('+')){
    	questionLatex = questionLatex.substring(1,questionLatex.length);
    }
    return questionLatex;
}

function wortel_optellen_CreateUnit(isFirst, a, x){
	if(a === 0 || x === 0){
		return "";
	}
	var unit = displayNumberInExpression(isFirst, a)+"\\sqrt{"+x+"}";
	return unit;
}

function wortel_optellen_CreateQuestions(level) {
    var length = 10;
    var quiestions = [];
    for (var i = 0; i < length; i++) {
    	var question = wortel_optellen_createQuestion(level);
    	while (wortel_optellen_hasIt(quiestions, question)){
    		question = wortel_optellen_createQuestion(level);
    	}
    	quiestions[i] = question;
    }
    return quiestions;
}

function wortel_optellen_hasIt(quiestions, test) {
	//console.log(quiestions,test);
    $.each(quiestions, function(key, value) {
        if (value.a == test.a && value.b == test.b && value.c == test.c
        		&& value.d == test.d && value.x1 == test.x1 && value.x2 == test.x2) {
            return true;
        }
    });
    return false;
}

function wortel_optellen_CreateNotice(answer, question) {
    var notice;
    if (wortel_optellen_CheckAnswer(answer, question)) {
        notice = "<font color='green'>Goed </font>"+", "+game.username;
        game.mathEditorAnswer.setLatex('');
    } else {
        notice = "<font color='red'>Jammer </font>, niet goed! Probeer het nog eens.";
    }
    return notice;
}
/*
 * the answer should be: (a+b)*x1+(c+d)\\sqrt{x2}
 * so 2 situations:
 * 1, sqrt{x2} is a number, 
 * 2, sqrt{x2} is an expression
 */
function wortel_optellen_CheckAnswer(answer, question) {
	//caculate the right answer
	var correctAnswer;
	var isNumber = Number.isInteger(Math.sqrt(question.x2)) || (question.c+question.d) == 0;
	if(isNumber){
		correctAnswer = (question.a+question.b)*question.x1+(question.c+question.d)*Math.sqrt(question.x2);
		console.log('is number', answer,correctAnswer);
		return Number(answer) ==  correctAnswer;
	}
	else{
		correctAnswer = displayNumberInExpression(true, (question.a+question.b)*question.x1);
		correctAnswer = correctAnswer 
			+ displayNumberInExpression(false, (question.c+question.d))
			+ '\\sqrt{'+ question.x2 + '}';
		console.log('is expression', answer,correctAnswer);
		return answer ===  correctAnswer;
	}
}

function wortel_optellen_CreateResultMessage(game) {
    var text = "Resultaten voor " + game.username + ".<br />";
    text = text + "Niveau <font color='green'>" + game.level + "</font>.<br />";
    text = text + "Aantal seconden: <font color='red'>" + game.seconds + "</font>.<br />";
    text = text + "Aantal fouten: <font color='red'>" + game.errors + "</font>.<br />";
    text = text + "Score: <font color='green'>" + wortel_optellen_calculate(game) + "</font><br />";
    return text;
}

function wortel_optellen_calculate(game) {
    var F = 0;
    if (game.level == 1) {
        var snelst = 400;
    } else if (game.level == 2) {
        var snelst = 220;
    } else if (game.level == 3) {
        var snelst = 180;
    }
    F = Math.floor(-9 * game.seconds / (2 * snelst) + 14.5);
    if (F > 10) {
        F = 10;
    }
    F = F - game.errors;
    if (F < 1) {
        F = 1;
    }
    return F;
}

