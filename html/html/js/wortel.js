function wrt_GetGameName(){
	return "WORTELS oefenen";
}

function wrt_CreateLevel() {
    var levels = [{
            name: 'Eenvoudig',
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

function wrt_CreateQuestions(level){
	var length = gameLengths.wortel;
	var getals = [];
	<!--vul de array getallen in volgorde-->
	for(var i=0;i<length;i++){
		getals[i]=(i+1)*(i+1);
	}
	if(level == 3){
		getals[0]=625;
		getals[1]=1225;
		getals[2]=2025;
		getals[3]=3025;
		getals[4]=10000;
		getals[5]=2.25;
		getals[6]=6.25;
		getals[7]=12.25;
	}
	<!--shake-->
	for (var i=0;i<100;i++){
	     var Index1=createRandom(0,getals.length -1);
	     var Index2=createRandom(0,getals.length -1);
		 var gres=getals[Index1];
		 getals[Index1]=getals[Index2];
		 getals[Index2]=gres;
	}
	return getals;
}

function wrt_CreateQuestion(question){
	var questionHtml = "Geef de wortel van: <font color='red' size='2em'>"+ question + "</font>";
	$("#questionDiv").html(questionHtml);
	//
	var inputText ="<input type='text' id='answerCheck' autocomplete='off'/>";
	$('#answerDiv').append(inputText);
	$("#answerCheck").on('keyup', wrt_PreCheckAnswer);
	$("#answerCheck").focus();
}

function wrt_PreCheckAnswer(e){
	e.preventDefault();
	if(isEnterKey(e)){
		var answer = $('#answerCheck').val();
		var question = game.questions[game.cursor];
		var notice;
		if(checkAnswerAndMoveToNext(answer,question)){
			notice = "<font color='green'>Goed</font>, "+game.username+", "+  answer + " is goed!";
		}
		else{
			notice = "<font color='red'>Jammer</font>, niet goed! Probeer het nog eens.";
		}
		showMessage(notice);
	}
}

function wrt_CheckAnswer(answer, question){
	return answer * answer == question;
}

function wrt_calculate(game){
	var F=0;
	if(game.level == 1){
	  var snelst = 80;
	  F = Math.floor(-9 * game.seconds /(2 * snelst)+14.5);
	  if (F>10){
	      F = 10;
	  }
	  F = F - game.errors;
	  if (F<1){
	    F = 1;
	  }
	}
	else if(game.level == 2){
	  var snelst = 40;
	  F = Math.floor(-9 * game.seconds /(2 * snelst)+14.5);
	  if (F>10){
	      F = 10;
	  }
	  F = F - game.errors;
	  if (F<1){
	    F = 1;
	  }
	}
	else if(game.level == 3){
	  var snelst = 40;
	  F = Math.floor(-9 * game.seconds /(2 * snelst)+14.5);
	  if (F>10){
	      F = 10;
	  }
	  F = F - game.errors;
	  if (F<1){
	    F = 1;
	  }
	}
	return F;
}
