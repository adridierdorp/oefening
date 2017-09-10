var game = {
	username : '',
	gamePrefix : '',
	gameName : '',
	level : '',
	errors : 0,
	score : 0,
	questions : [],
	cursor : 0,
	seconds : 0,
	startedFlag : false,
	resultMessage : null
}

var gameLengths = {
	wortels : 10,// default 10
	wortel : 20,// default 20
	ontbind : 20,// default 20
	kwadraat : 20
// default 20
}

// mathQuill
var mathQuillEditor = {
	MQ : MathQuill.getInterface(2),
	mathEditorQuestion : null,
	mathEditorAnswer : null
}

// Start the game
$(document).ready(function() {
	startGame();
});

function startGame() {
	if (game.username === '') {
		showUserNameDiv();
	} else {
		selectGameAndStart();
	}
}

function showUserNameDiv() {
	activeDiv('inputUsernameDiv');
}

function showSelectGameAndStartDiv() {
	activeDiv('selectGameAndStartDiv');
	var games = [ {
		value : 'kr_',
		name : 'Kwadraat'
	}, {
		value : 'wrt_',
		name : 'Wortel'
	}, {
		value : 'wwp_',
		name : 'Ontbind'
	}, {
		value : 'wortel_optellen_',
		name : 'Wortels Optellen'
	} ];
	$("#testGame").empty();
	$.each(games, function(key, value) {
		$("#testGame").append(
				'<option value="' + value.value + '">' + value.name
						+ '</option>');
	});
	$("#testGame option:first").attr('selected', 'selected');

	createLevel($("#testGame").val());
}

function activeDiv(divId) {
	// move other div to hidden area
	$("#activeDiv").children().appendTo($("#inactiveDiv"));
	// move target to active area
	$("#" + divId).appendTo($("#activeDiv"));
}

function getAllDivs() {
	var divs = [ 'inputUsernameDiv', 'selectGameAndStartDiv', 'showResultDiv',
			'reportDiv' ];
	return divs;
}

function inputUsername(event) {
	if (isEnterKey(event)) {
		game.username = $("#username").val();
		if (game.username && game.username.length > 2) {
			showMessage("Welkom " + game.username
					+ ", kies de oefening en het niveau!");
			showSelectGameAndStartDiv();
		} else {
			showMessage("Vul een juiste naam in!");
		}
	}
}

function createLevel(gameValue) {
	game.gamePrefix = gameValue;
	var functionName = game.gamePrefix + "CreateLevel";
	var levels = window[functionName]();
	$("#testLevel").empty();
	$.each(levels, function(key, value) {
		$("#testLevel").append(
				'<option value="' + value.value + '">' + value.name
						+ '</option>');
	});
	$("#testLevel option:first").attr('selected', 'selected');
}

function startTest() {
	game.gameName = window[game.gamePrefix + "GetGameName"]();
	game.level = $("#testLevel").val();
	game.errors = 0;
	game.score = 0;
	game.cursor = 0;
	game.seconds = 0;
	game.startedFlag = true;
	game.resultMessage = "";
	game.questions = window[game.gamePrefix + "CreateQuestions"](game.level);
	$("#titelLabel").html(window[game.gamePrefix + "GetGameName"]());

	startTimer();
	activeDiv('questionAndAnswerDiv');

	showMessage("Let's go!");

	prepareQuestion();
}

function startTimer() {
	var content = "[Nr:" + (game.cursor + 1) + "/" + game.questions.length
			+ "]";
	content = content + " Seconden: " + game.seconds;
	$("#timerLabel").html(content);
	game.seconds++;
	if (game.startedFlag) {
		setTimeout(startTimer, 1000);
	}
}

function prepareQuestion() {
	if (game.cursor >= game.questions.length) {
		showReport();
	} else {
		$("#questionDiv").empty();
		$("#answerDiv").empty();
		window[game.gamePrefix + "CreateQuestion"](game.questions[game.cursor]);
	}
}

function showReport() {
	game.startedFlag = false;
	game.score = window[game.gamePrefix + "calculate"](game);
	game.resultMessage = window[game.gamePrefix + "CreateResultMessage"](game);
	$("#resultMessage").html(game.resultMessage);
	showMessage("Klaar! Druk op Afronden om door te gaan.");

	activeDiv('showResultDiv');
}

function reportMe() {
	//
	var yourname = $("input[name='your-name'][aria-required]");
	yourname.val(game.username);
	//
	var gameName = window[game.gamePrefix + "GetGameName"]();
	var youremail = $("input[name='your-email'][aria-required]");
	youremail.val(replaceAll(gameName, " ", "") + "@gmail.com");
	//
	var yoursubject = $("input[name='your-subject']");
	yoursubject.val(game.score);
	//
	var yourmessage = $("textarea[name='your-message']");
	yourmessage.val(game.email);
	//
	var yoursubmit = $("input[class='wpcf7-form-control wpcf7-submit']");
	yoursubmit.click();

	showMessage("Kies een nieuwe oefening.");
	//
	showSelectGameAndStartDiv();
}

function checkAnswerAndMoveToNext(answer, question) {
	var correct = window[game.gamePrefix + "CheckAnswer"](answer, question);
	if (correct) {
		game.cursor++;
		prepareQuestion();
	} else {
		game.errors++;
	}
	return correct;
}
