function wortel_verm_GetGameName() {
	return "WORTELS oefenen";
}

function wortel_verm_CreateLevel() {
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

function wortel_verm_CreateQuestion(question) {
	// question
	$("#questionDiv").append("<br/>Herleid:<br/>");
	$("#questionDiv").append("<span id='mathEditorQuestion'></span>");
	$("#questionDiv").append("<button id='resetQuestionButton'>Reset de vraag</button>");
	$('#resetQuestionButton').on('click',prepareQuestion);
	//display the question
	mathQuillEditor.mathEditorQuestion = createQuestionLatex('mathEditorQuestion');
	mathQuillEditor.mathEditorQuestion.latex(wortel_verm_CreateLatex(question));
	
//	$("#answerDiv").append("<span>Antwoord:</span>");
//	$("#answerDiv").append("<button id='checkAnswerButton'>Kijk jouw antwoord na!</button><br/><br/>");
//	$("#answerDiv").append("<span id='aaddds'>step one</span>");
	// answer
	mathQuillEditor.mathEditorAnswer = initializeAnswerEditor('answerDiv',
			'mathEditorAnswer', wortel_verm_PreCheckAnswer);
	
}

function wortel_verm_PreCheckAnswer(){
	var latexAnswer = mathQuillEditor.mathEditorAnswer.getValue();
	var question = game.questions[game.cursor];
	var notice;
	if (checkAnswerAndMoveToNext(latexAnswer, question)) {
		notice = "<font color='green'>Goed</font>, " + game.username;				
	} else {
		notice = "<font color='red'>Jammer</font>, niet goed! Probeer het nog eens.";
	}
	showMessage(notice);
}

function wortel_verm_CreateLatex(question){
	var questionLatex = question.a * question.b >= 0 ? "" :"-";
	questionLatex = questionLatex + wortel_verm_CreateUnit(true,Math.abs(question.a),question.x1)+"*";	
    questionLatex = questionLatex + wortel_verm_CreateUnit(true,Math.abs(question.b),question.x2);
    if(question.c * question.d == 0){
    	return questionLatex;
    }
    questionLatex = questionLatex + (question.c * question.d > 0 ? "+" :"-");
    questionLatex = questionLatex + wortel_verm_CreateUnit(true,Math.abs(question.c),question.x3)+"*";
    questionLatex = questionLatex + wortel_verm_CreateUnit(true,Math.abs(question.d),question.x4);
    return questionLatex;
}

function wortel_verm_CreateUnit(isFirst, a, x){
	if(a === 0 || x === 0){
		return "";
	}
	var unit = displayNumberInExpression(isFirst, a)+"\\sqrt{"+x+"}";
	return unit;
}

function wortel_verm_CreateQuestions(level) {
    var length = gameLengths.wortels;
    var quiestions = [];
    for (var i = 0; i < length; i++) {
    	var question = wortel_verm_createOneQuestion(level);
    	while (wortel_verm_hasIt(quiestions, question)){
    		question = wortel_vermn_createOneQuestion(level);
    	}
    	quiestions[i] = question;
    }
    return quiestions;
}

/*
 * level 1:
 * a,b,c,d: -6 - 6 (maximum two 0 between four numbers)
 * x1: 1-20
 * x1: 2-10
 */
function wortel_verm_createOneQuestion(level){
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
	var rangeX3;
	var rangeX4;	
	
	if(level == 1){
		rangeForNumber = {min:-6,max: 6};
		rangeX1 = {min:2,max: 5};
		rangeX2 = {min:2,max: 10};
		rangeX3 = {min:2,max: 5};
		rangeX4 = {min:2,max: 10};
	}
	else if(level == 2){
		rangeForNumber = {min:-10,max:10};
		rangeX1 = {min:2,max: 5};
		rangeX2 = {min:2,max: 10};
		rangeX3 = {min:2,max: 10};
		rangeX4 = {min:2,max: 10};		
	}
	else if(level == 3){
		rangeForNumber = {min:-10,max:20};
		rangeX1 = {min:2,max: 10};
		rangeX2 = {min:2,max: 15};
		rangeX3 = {min:2,max: 15};
		rangeX4 = {min:2,max: 15};
	}
	
	while(question.a === 0 || question.b ===0){
		question.a = createRandom(rangeForNumber.min, rangeForNumber.max);
		question.b = createRandom(rangeForNumber.min, rangeForNumber.max);
	}
	while(question.c === 0 || question.d ===0){
		question.c = createRandom(rangeForNumber.min, rangeForNumber.max);
		question.d = createRandom(rangeForNumber.min, rangeForNumber.max);
	}
	question.x1= createRandom(rangeX1.min, rangeX1.max);
//	question.x2= createRandom(rangeX2.min, rangeX2.max);
	question.x2 =question.x1; // ipv bovenstaande regel Nu slechts een wortel
	question.x3= createRandom(rangeX3.min, rangeX3.max);
	question.x4= createRandom(rangeX4.min, rangeX4.max);
	return question;
}

function wortel_verm_hasIt(quiestions, test) {
	//console.log(quiestions,test);
    $.each(quiestions, function(key, value) {
        if (value.a == test.a && value.b == test.b && value.c == test.c
        		&& value.d == test.d && value.x1 == test.x1 && value.x2 == test.x2) {
            return true;
        }
    });
    return false;
}

/*
 * the answer should be: (a*b*)*x1+(c*d)\\sqrt{x1*x2}
 * so 2 situations:
 * 1, sqrt{x2} is a number, 
 * 2, sqrt{x2} is an expression
 */
function wortel_verm_CheckAnswer(answer, question) {
	//calculate the right answer
	var correctAnswer = (question.a*question.b)*math.sqrt(question.x1*question.x2)+(question.c*question.d)*math.sqrt(question.x3*question.x4);
	//calculate the input answer
	var inputAnswer;
	var sqrtIndex = answer.indexOf('sqrt');
	if(sqrtIndex == -1){
		if(isNaN(answer)){
			return false;
		}
		inputAnswer = answer;
	}
	else{
		var sqrtNumber = subStringBetweenLetters(answer,'{','}',0);
		if(!hasNoSqrtRoot(sqrtNumber)){
			return false;
		}
		var sqrt = math.sqrt(sqrtNumber);
		//replace the math expressions
		answer = replaceAllNonNumberAndLetter(answer,'');
		answer = replaceAll(answer,'{','');
		answer = replaceAll(answer,'}','');	
		if(sqrtIndex == 0){			
			answer = replaceAll(answer,'sqrt',sqrt);
		}
		else{
			sqrtIndex = answer.indexOf('sqrt');
			var letterBeforeSqrt = answer.substring(sqrtIndex - 1, sqrtIndex);
			if(isNaN(letterBeforeSqrt)){
				answer = replaceAll(answer,'sqrt',sqrt);
			}
			else{
				answer = replaceAll(answer,'sqrt','*'+sqrt);
			}
		}
		inputAnswer = math.eval(answer);
	}
	
	return Math.round(inputAnswer*10000) ==  Math.round(correctAnswer*10000);
}

function wortel_verm_calculate(game) {
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
