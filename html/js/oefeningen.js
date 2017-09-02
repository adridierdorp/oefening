var game = {
    username: '',
    gameName: '',
    level: '',
    errors: 0,
    score: 0,
    questions: [],
    cursor: 0,
    seconds: 0,
    startedFlag: false,
    email: null,
    mathEditorQuestion: null,
    mathEditorAnswer: null
}

function inputUsername(event) {
    if (event.keyCode == 13) {
        game.username = $("#username").val();
        if (game.username && game.username.length > 2) {
            selectGameAndLevel();
        } else {
            showMessage("Vul een juiste naam in!");
        }
    }
}

function selectGameAndLevel() {
    showMessage("Welkom " + game.username + ", kies het niveau!");
    showDiv("startGameDiv", true);
    //
    createLevel("kr_");
}

function createLevel(gameName) {
    game.gameName = gameName;
    var functionName = game.gameName + "CreateLevel";
    var levels = window[functionName]();
    $("#testLevel").empty();
    $.each(levels, function(key, value) {
        $("#testLevel").append('<option value="' + value.value + '">' + value.name + '</option>');
    });
    $("#testLevel option:first").attr('selected', 'selected');
}

function startGame() {
    game.level = $("#testLevel").val();
    game.errors = 0;
    game.score = 0;
    game.cursor = 0;
    game.seconds = 0;
    game.startedFlag = true;
    game.MQ = MathQuill.getInterface(2);
  
    game.questions = window[game.gameName + "CreateQuestions"](game.level);

    showDiv("testDiv", true);
    showDiv("startGameDiv", false);
    showDiv("geefnaam", false);
    showDiv("vulinnaam", false);
    showDiv("titel", true)
    
    //set title
    window[game.gameName + "CreateTitleLable"]();

    showMessage("Vraag: 1<br /> Vul het antwoord in en sluit af met Enter.");

    prepareQuestion();
    startTimer();
}

function startTimer() {
    $("#timer").html("Seconden:" + game.seconds);
    game.seconds++;
    if (game.startedFlag) {
        setTimeout(startTimer, 1000);
    }
}

function prepareQuestion() {
	var vraagnr =game.cursor+1;
    if (game.cursor >= game.questions.length) {
        showReport();
    } else {
    	showMessage("Vraag: "+vraagnr+"<br /> Vul het antwoord in en sluit af met Enter.");
        showQuestion();
    }
}

function showReport() {
    game.startedFlag = false;
    showDiv("testDiv", false);
    showDiv("resultDiv", true);
    game.score = window[game.gameName + "calculate"](game);
    game.email = window[game.gameName + "CreateResultMessage"](game);
    $("#resultMessage").html(game.email);
    showMessage("Klaar! Bekijk rechts je score. Druk op Afronden om door te gaan.");
}

function showQuestion() {
    window[game.gameName + "CreateQuestion"](game.questions[game.cursor]);
}

function reportMe() {
    //
    var yourname = $("input[name='your-name'][aria-required]");
    yourname.val(game.username);
    //
    var gameName = window[game.gameName + "GetGameName"]();
    var youremail = $("input[name='your-email'][aria-required]");
    youremail.val(gameName + "@gmail.com");
    //
    var yoursubject = $("input[name='your-subject']");
    yoursubject.val(game.score);
    //
    var yourmessage = $("textarea[name='your-message']");
    yourmessage.val(game.email);
    //
    var yoursubmit = $("input[class='wpcf7-form-control wpcf7-submit']");
    yoursubmit.click();

    showDiv("startGameDiv", true);
    showDiv("resultDiv", false);
    showMessage("Kies een nieuwe oefening.");
}

function checkAnswer(e) {
    if (e.keyCode == 13) {
        var answer = $("#answer").val();
        var correct = window[game.gameName + "CheckAnswer"](answer, game.questions[game.cursor]);
        showNotice(answer);
        if (!correct) {
            game.errors++;
        } else {
            clearAnswer();
            game.cursor++;
            prepareQuestion();
        }
    }
}

function showNotice(answer) {
    $("#notice").html(window[game.gameName + "CreateNotice"](answer, game.questions[game.cursor]));
}

function clearAnswer() {
    $("#answer").val("");
}

function showDiv(divId, show) {
    var display = $("#" + divId).attr("class");
    if (!show) {
        if (display.indexOf("invisible") < 0) {
            display = display + " invisible";
            display = display.replace("  ", " ");
        }
    } else {
        if (display.indexOf("invisible") >= 0) {
            display = display.replace("invisible", "");
        }
    }
    $("#" + divId).attr("class", display);
}

function showInput(inputId, show){
	if(show){
		$("#" + inputId).show();
	}
	else{
		 $("#" + inputId).hide();
	}
}

function showMessage(message) {
    $("#message").html(message);
}

function createRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function replaceAll(source, old, replace) {
    return source.replace(new RegExp(old, 'g'), replace);
}

String.prototype.count = function(s1) {
    return (this.length - this.replace(new RegExp(s1, "g"), '').length) / s1.length;
}

function displayNumberInExpression(isFirst, a){
	if(a === 0){
		return "";
	}
	var unit;
	if(isFirst){
		unit = a+"";
	}
	else{
		if(isPlus(a)){
			unit = "+"+a;
		}
		else{
			unit = ""+a;
		}
	}
	if(a == 1 || a == -1){
		unit = replaceAll(unit, "1", "");
	}	
	return unit;
}

function isPlus(number){
	if(number<0){
		return false;
	}
	else{
		return true;
	}
}

function createQuestionLatex(divId){
	var htmlElement = document.getElementById(divId);
	var config = {
	  handlers: { edit: function(){} },
	  restrictMismatchedBrackets: true
	};
	var mathField = game.MQ.MathField(htmlElement, config);
	return mathField;
}

