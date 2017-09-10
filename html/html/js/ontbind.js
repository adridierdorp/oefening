function wwp_GetGameName() {
	return "ONTBINDEN oefenen";
}

function wwp_CreateLevel() {
	var levels = [ {
		name : 'Langzaam',
		value : 1
	}, {
		name : 'Normaal',
		value : 2
	}, {
		name : 'Snel',
		value : 3
	} ];
	return levels;
}

function wwp_CreateQuestions(level) {
	var length = 20;
	var getals = [];

	for (var i = 0; i < length; i++) {
		var first = createRandom(-5, 9);
		var seconde = createRandom(-5, 9);
		var variables = {
			a : Math.min(first, seconde),
			b : Math.max(first, seconde)
		}

		while (wwp_hasIt(getals, variables)) {
			first = createRandom(-5, 9);
			seconde = createRandom(-5, 9);
			variables = {
				a : Math.min(first, seconde),
				b : Math.max(first, seconde)
			}
		}
		getals[getals.length] = variables;
	}
	return getals;
}

function wwp_hasIt(getals, variables) {
	$.each(getals, function(key, value) {
		if (value.a == variables.a && value.b == variables.b) {
			return true;
		}
	});
	return false;
}

function wwp_CreateQuestion(question) {
	// question
	var n1 = algebra.parse("x" + plusOrMinus(question.a) + question.a);
	var n2 = algebra.parse("x" + plusOrMinus(question.b) + question.b);
	var expr = n1.multiply(n2);
	createLatexQuestion("questionDiv", expr);
	// answer
	mathQuillEditor.mathEditorAnswer = initializeAnswerEditor('answerDiv',
			'mathEditorAnswer', wwp_PreCheckAnswer);
}

function wwp_PreCheckAnswer() {
	var latexAnswer = mathQuillEditor.mathEditorAnswer.getValue();
	var question = game.questions[game.cursor];
	var notice;
	if (checkAnswerAndMoveToNext(latexAnswer, question)) {
		notice = "<font color='green'>Goed </font>, " + game.username
				+ " het klopt dat.";
	} else {
		notice = "<font color='red'>Jammer </font>, niet goed! Probeer het nog eens.";
	}
	showMessage(notice);
}

function wwp_CheckAnswer(latexAnswer, question) {
	var n1 = algebra.parse("x" + plusOrMinus(question.a) + question.a);
	var n2 = algebra.parse("x" + plusOrMinus(question.b) + question.b);
	var expr = n1.multiply(n2);
	var questionExpr = n1.multiply(n2).simplify();

	var exprStr = latexToAlgebra(latexAnswer);
	var answerExpr = new algebra.parse(exprStr);

	var checkExpr = questionExpr.subtract(answerExpr.simplify()).simplify();
	return checkExpr.toString() === "0";
}

function wwp_CreateResultMessage(game) {
	var text = "Resultaten voor " + game.username + ".<br />";
	text = text + "Niveau <font color='green'>" + game.level + "</font>.<br />";
	text = text + "Aantal seconden: <font color='red'>" + game.seconds
			+ "</font>.<br />";
	text = text + "Aantal fouten: <font color='red'>" + game.errors
			+ "</font>.<br />";
	text = text + "Score: <font color='green'>" + wwp_calculate(game)
			+ "</font><br />";
	return text;
}

function wwp_calculate(game) {
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