function wortel_optellen_GetGameName() {
	return "WORTELS oefenen";
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

function wortel_optellen_CreateQuestion(question) {
	// question
	$("#questionDiv").append("<br/>Herleid:<br/>");
	$("#questionDiv").append("<div id='mathEditorQuestion'></div><br/>");
	$("#questionDiv").append("<button id='resetQuestionButton'>Reset de vraag</button><br/>");
	$('#resetQuestionButton').on('click',prepareQuestion);
	//display the question
	mathQuillEditor.mathEditorQuestion = createQuestionLatex('mathEditorQuestion');
	mathQuillEditor.mathEditorQuestion.latex(wortel_optellen_CreateLatex(question));
	// answer
	mathQuillEditor.mathEditorAnswer = initializeAnswerEditor('answerDiv',
			'mathEditorAnswer', wortel_optellen_PreCheckAnswer);
}

function wortel_optellen_PreCheckAnswer(){
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
    var length = gameLengths.wortels;
    var quiestions = [];
    for (var i = 0; i < length; i++) {
    	var question = wortel_optellen_createOneQuestion(level);
    	while (wortel_optellen_hasIt(quiestions, question)){
    		question = wortel_optellen_createOneQuestion(level);
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
function wortel_optellen_createOneQuestion(level){
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

/*
 * the answer should be: (a+b)*x1+(c+d)\\sqrt{x2}
 * so 2 situations:
 * 1, sqrt{x2} is a number, 
 * 2, sqrt{x2} is an expression
 */
function wortel_optellen_CheckAnswer(answer, question) {
	//calculate the right answer
	var correctAnswer = (question.a+question.b)*question.x1+(question.c+question.d) * math.sqrt(question.x2);
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
