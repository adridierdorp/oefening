function kr_CreateLevel() {
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

function kr_GetGameName(){
	return "Kwadraat";
}

function kr_CreateTitleLable(){
	$("#titelLabel").html("<font color='green'><h2>KWADRATEN oefenen</h2></font>");
}


function kr_CreateQuestions(level){
	var length = 20;
	var getals = [];
	<!--vul de array getallen in volgorde-->
	for(var i=0;i<length;i++){
		getals[i]=i+1;
	}
	if(level == 3){
		getals[0]=25;
		getals[1]=35;
		getals[2]=45;
		getals[3]=55;
		getals[4]=55;
		getals[5]=1.5;
		getals[6]=2.5;
		getals[7]=3.5;
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


function kr_CreateQuestion(question){
	var questionHtml = "Geef het kwadraat van: <font color='red' size='2em'>"+ question + "</font>";
	$("#question").html(questionHtml);
}

function kr_CreateNotice(answer,queston){
	var notice;
	if(kr_CheckAnswer(answer,queston)){
		notice = "<font color='green'>Goed </font>, "+game.username+ " het klopt dat, "+queston + "<sup>2</sup>= "+answer;
	}
	else{
		notice = "<font color='red'>Jammer </font>, niet goed! Probeer het nog eens.";
	}
	return notice;
}

function kr_CheckAnswer(answer, question){
	return answer == question*question;
}

function kr_CreateResultMessage(game){
	var text = "Resultaten voor "+game.username+".<br />";
	text = text + "Niveau <font color='green'>" + game.level +"</font>.<br />";
	text = text + "Aantal seconden: <font color='red'>" + game.seconds + "</font>.<br />";
	text = text + "Aantal fouten: <font color='red'>" + game.errors + "</font>.<br />";
	text = text + "Score: <font color='green'>" + kr_calculate(game) +"</font><br />";
	return text;
}

function kr_calculate(game){
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
