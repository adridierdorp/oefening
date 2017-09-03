function wwp_CreateLevel() {
    var levels = [{
            name: 'Langzaam',
            value: 1
        },
        {
            name: 'Normaal',
            value: 2
        },
        {
            name: 'Snel',
            value: 3
        }
    ];
    return levels;
}

function wwp_GetGameName() {
    return "ontbind";
}

function wwp_CreateTitleLable(){
	$("#titelLabel").html("<font color='green'><h2>ONTBINDEN</h2><br /></font>Gebruik ^2 voor een kwadraat! bv.: (x+2)^2");
}

function wwp_CreateQuestions(level) {
    var length = 20;
    var getals = [];

    for (var i = 0; i < length; i++) {
        var first = createRandom(-5, 9);
        var seconde = createRandom(-5, 9);
        var variables = {
            a: Math.min(first, seconde),
            b: Math.max(first, seconde)
        }

        while (wwp_hasIt(getals, variables)) {
            first = createRandom(-5, 9);
            seconde = createRandom(-5, 9);
            variables = {
                a: Math.min(first, seconde),
                b: Math.max(first, seconde)
            }
        }  
        getals[getals.length] = variables;
    }
    console.log(getals);
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
    var a_b = question.a + question.b;
    var questionHtml = "Ontbind x<sup>2</sup>";
    if (a_b > 0) {
        if (a_b == 1) {
            questionHtml = questionHtml + "+x";
        } else {
            questionHtml = questionHtml + "+" + a_b + "x";
        }
    } else if (a_b < 0) {
        if (a_b == -1) {
            questionHtml = questionHtml + "-x";
        } else {
            questionHtml = questionHtml + a_b + "x";
        }
    }

    var ab = question.a * question.b;
    if (ab > 0) {
        questionHtml = questionHtml + "+" + ab;
    } else if (ab < 0) {
        questionHtml = questionHtml + ab;
    }
    $("#question").html(questionHtml);
}


function wwp_CreateNotice(answer, queston) {
    var notice;
    if (wwp_CheckAnswer(answer, queston)) {
        notice = "<font color='green'>Goed </font>"+", "+game.username;
    } else {
        notice = "<font color='red'>Jammer </font>, niet goed! Probeer het nog eens.";
    }
    return notice;
}

function wwp_CheckAnswer(answer, queston) {
    var reg = new RegExp('^[0-9-+x()^]+$');
    if (!reg.test(answer)) {
        return false;
    }
    if (answer.count("^") > 1) {
        return false;
    } 
    //if the answer likes (x+a)(x+a) return false
    if(queston.a == queston.b ){
       if(!answer.endsWith("^2") ){
    	  return false;   
       }	
    }
    
    if (answer.count("^") == 1) {
        if (answer.endsWith("^2")) {
            var index = answer.indexOf("^2");
            answer = answer.substring(0, index) + answer.substring(0, index);
        } else {
            return false;
        }
    }
    console.log(answer);
    for (var x = -100; x < 100; x++) {
        var rightAnswer = (x + queston.a) * (x + queston.b);
        var newExpression = replaceAll(answer.toLowerCase(), "x", x);
        var givenAnswer = math.eval(newExpression);
        if (rightAnswer != givenAnswer) {
            return false;
        }
    }
    return true;
}

function wwp_CreateResultMessage(game) {
    var text = "Resultaten voor " + game.username + ".<br />";
    text = text + "Niveau <font color='green'>" + game.level + "</font>.<br />";
    text = text + "Aantal seconden: <font color='red'>" + game.seconds + "</font>.<br />";
    text = text + "Aantal fouten: <font color='red'>" + game.errors + "</font>.<br />";
    text = text + "Score: <font color='green'>" + wwp_calculate(game) + "</font><br />";
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

function wwp_stop() {
}