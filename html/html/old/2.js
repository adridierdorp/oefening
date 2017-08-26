
var index;
var getals;
var username;
var level;
var seconds;
var fouten;
var email;


<!--actie voor de start button-->


<!--vul de array met getallen en schud ze door elkaar-->
function makeGetals(level){
	var length;
	if(level == 1){
		length=20;
	}
	else if(level == 2){
		length=20;
	}
	else if(level == 3){
		length=20;
	}
	var getals = [];
	<!--vul de array getallen in volgorde-->
	for(var i=0;i<length;i++){
		getals[i]=i+1;
	}
	if(level == 3){
		var i = getals.length;
		getals[1]=25;
		getals[2]=35;
		getals[3]=45;
		getals[4]=55;
		getals[5]=55;
		getals[6]=1.5;
		getals[7]=2.5;
		getals[8]=3.5;
	}
	<!--shake-->
	for (var i=0;i<100;i++){
	     var Index1=Math.floor(Math.random() * getals.length);
	     var Index2=Math.floor(Math.random() * getals.length); 
		 var gres=getals[Index1];
		 getals[Index1]=getals[Index2];
		 getals[Index2]=gres;
	} 
	return getals;
}

function inputUsername(event){
	if (event.keyCode == 13){
		username = $("#username").val();
		if(username && username.length>2){
			startSelectLevel();
		}
		else{
			showMessage("Vul een juiste naam in!");
		}
	}
}


function startSelectLevel(){
	showMessage("Welkom " + username + ", kies het niveau!");
	$("#leveldiv").attr("class","row");
}

function selectLevel(l){
	level = l;
	showMessage(username +", je koos niveau "+ level + ". Klik 'Start' om te beginnen!");
	$("#startdiv").attr("class","row");
}

function start(){
	seconds = 0;
	index=0;
	fouten=0;
	getals = makeGetals(level);
	$("#testdiv").attr("class","row");
	console.log(getals);
	startTimer();
	startTest();
	showMessage("Vul het antwoord in en sluit af met Enter.");
	$("#usernamediv").attr("class","row invisible");
	$("#startdiv").attr("class","row invisible");
}

function startTimer(){
	$("#timer").html("Seconden:" + seconds);
	seconds++;
	if(!isDone()){
		setTimeout(startTimer, 1000);
	}
}

function startTest(){
	$("#question").html(getals[index]);
	$("#testdiv").attr("class","row");
	$("#questiondiv").attr("class","row");
	$("#answerdiv").attr("class","row");
	$("#result").html("");
	$("#reportMe").attr("class","btn btn-success hide");  
}

function showMessage(message){
	$("#message").html(message);
}

function isDone(){
	return index>=getals.length;
}
function checkAnswer(e){
	if (e.keyCode == 13) {
        var answer = $("#antwoord").val();
        if(answer == getals[index] * getals[index]){
        	showMessage("<font color='green'>Goed </font>"+username+", het kwadraat van "+getals[index] + " is "+answer);
        	index++;
         	if(index<getals.length){         		
         		$("#antwoord").val("");
         		console.log($("#antwoord").val());
         		$("#question").html(getals[index]);
         	}
         	else{
         		$("#antwoord").val("");
         		showMessage("Klaar! Bekijk rechts je score. Druk op Afronden om door te gaan.");
         		$("#startdiv").attr("class","row invisible");
         		showResult();
         		$("#testdiv").attr("class","row invisible");
         		$("#answerdiv").attr("class","row invisible");
         	}
        }
        else{
        	fouten++;
         	showMessage("<font color='red'>Jammer </font>"+username+", niet goed!");
         	$("#antwoord").val("");
        }
    }
}
function showResult(){
	var text = "Resultaten voor "+username+".<br />";
	text = text + "Niveau <font color='green'>" + level +"</font>.<br />";
	text = text + "Aantal fouten: <font color='red'>" + fouten + "</font>.<br />";
	text = text + "Score: <font color='green'>" + calculate() +"</font><br />";
	text = text + "Der Score is afhankelijk van het aantal fouten en de tijd!</font><br />";
	email = text;
	$("#result").html(text);
	$("#reportMe").attr("class","btn btn-success");
	$("#question").html("");
} 

function calculate(){
	var F=0;
	if(level == 1){
	  var snelst = 80;
	  F = Math.floor(-9 * seconds /(2 * snelst)+14.5);
	  if (F>10){
	      F = 10;
	  }
	  F = F - fouten;
	  if (F<1){
	    F = 1;
	  }
	}
	else if(level == 2){
	  var snelst = 40;
	  F = Math.floor(-9 * seconds /(2 * snelst)+14.5);
	  if (F>10){
	      F = 10;
	  }
	  F = F - fouten;
	  if (F<1){
	    F = 1;
	  }
	}
	else if(level == 3){
	  var snelst = 40;
	  F = Math.floor(-9 * seconds /(2 * snelst)+14.5);
	  if (F>10){
	      F = 10;
	  }
	  F = F - fouten;
	  if (F<1){
	    F = 1;
	  }
	}
	return F;
}
function report(){
	console.log("use google gmail js library!");
	$("#startdiv").attr("class","row");
	showMessage("Kies ander niveau of klik op Start om weer te beginnen!");

	$("#fscf_name1").val("Kwadraten oefenen - " + username);
	$("#fscf_email1").val("email_from_oefening_page@adridierdorp.nl");
	$("#fscf_field1_2").val("Result from user " + username);
	$("#fscf_field1_3").val(email);
	$("#fscf_submit1").click();
}
