
var geefvraag;
var username;
var level;
var seconds;
var fouten;
var email;
var vraag = [];
var antw1 = []; 
var antw2 = [];
var b,c,d,e; <!--coefficienten-->
var vraagnr = 0;

<!--vul de array met vragen-->
function makeVraag2(level){
	var length;
	var res;
	for (var i=0;i<20;i++){
	  vraagnr = i;
	  if(level != 4){
 	     d = Math.floor(Math.random()*14-5);
	     e = Math.floor(Math.random()*14-5);
	     if (d==0 && e==0){
	         d = 10;
	         e = 10;
	     }
	     b = d+e;
	     c = d*e;
	     if (d!=e){
	            vraag[vraagnr] = "x<sup>2</sup>"+ S(b) + "x"+S(c);
	            antw1[vraagnr] = "(x"+S2(d)+")(x"+S2(e)+")";
	            antw2[vraagnr] = "(x"+S2(e)+")(x"+S2(d)+")";
	        }
	       
	        if (b==1 && c>0){
	            vraag[vraagnr] = "x<sup>2</sup>+x"+S(c);
	            antw1[vraagnr] = "(x"+S2(d)+")(x"+S2(e)+")";
	            antw2[vraagnr] = "(x"+S2(e)+")(x"+S2(d)+")";
	        }
	        if (b==-1 && c>0){
	            vraag[vraagnr] = "x<sup>2</sup>-x"+S(c);
	           antw1[vraagnr] = "(x"+S2(d)+")(x"+S2(e)+")";
	            antw2[vraagnr] = "(x"+S2(e)+")(x"+S2(d)+")";
	        }
 	     if (d == -e){
	         vraag[vraagnr] = "x<sup>2</sup>"+S2(c);
	         antw1[vraagnr] = "(x"+S2(d)+")(x"+S2(e)+")";
	         antw2[vraagnr] = "(x"+S2(e)+")(x"+S2(d)+")";
	     }  
	     if (d == 0){
	         var k;
	         k = d+e
	         vraag[vraagnr] = "x<sup>2</sup>"+S(e)+"x";
	         antw1[vraagnr] = "x(x"+S2(k)+")";
	         antw2[vraagnr] = "x("+k+"+x)";
	     }
	     if (e == 0){
	         var k;
	         k = d+e
	         vraag[vraagnr] = "x<sup>2</sup>"+S(d)+"x";
	         antw1[vraagnr] = "x(x"+S2(k)+")";
	         antw2[vraagnr] = "x("+k+"+x)";
	     }
	     if (d == e){
	         vraag[vraagnr] = "x<sup>2</sup>"+ S(b) + "x"+S2(c);
	         antw1[vraagnr] = "(x"+S2(d)+")^2";
	         antw2[vraagnr] = "(x"+S2(d)+")^2";
	     }
	     for (var j=0;j<20;j++){
	          if (vraag[j] == vraag[vraagnr] && j!=vraagnr){
	          i--;
	          }
	     }
	  }  <!-- if level-->
	}  <!--end for-->	
	return vraag;
}  <!--end makeVraag-->
<!--Schrijf een plus voor een positief getal-->
function S(G){
   if (G>0){
       G = "+"+G;
   }
   if (G==1){
       G ="+";
   }
   if (G==-1){
       G ="-";
   }
   return G;
}
function S2(G){
   if (G>0){
       G = "+"+G;
   }

   return G;
}
<!--Voer je naam in-->
function inputUsername2(event){
	if (event.keyCode == 13){
		username = $("#username").val();
		if(username && username.length>2){
			startSelectLevel2();
		}
		else{
			showMessage2("Vul een juiste naam in!");
		}
	}
}

<!--Kies het niveau-->
function startSelectLevel2(){
	showMessage2("Welkom " + username + ", kies het niveau!");
	$("#leveldiv").attr("class","row");
}

function selectLevel2(l){
	level = l;
	showMessage2(username +", je koos niveau "+ level + ". Klik 'Start' om te beginnen!");
	$("#startdiv").attr("class","row");
}

function start2(){
	seconds = 0;
	fouten=0;
	vraag = makeVraag2(level);
	vraagnr=0;
	<!--$("#testdiv").attr("class","row");-->
	startTimer();
	startTest2();
	showMessage2("Vul het antwoord in en sluit af met Enter. <br /> (Gebruik ^2 voor een kwadraat, bv (x+3)<sup>2</sup> =(x+3)^2.");
	$("#usernamediv").attr("class","row invisible");
	$("#startdiv").attr("class","row invisible");
    $("#leveldiv").attr("class","row invisible");
        $("#kwknop").attr("class","row ");
}

function startTimer(){
	$("#timer").html("Seconden:" + seconds);
	seconds++;
	if(!isDone2()){
		setTimeout(startTimer, 1000);
	}
}
function kw2(){
     var tekst;
     tekst = $("#antwoord").val();
     $("#antwoord").val(tekst+"alt+253") ;
}

function startTest2(){
    var j;
    j = 20 - vraagnr;
    console.log(antw1);
    console.log(antw2);
	$("#question").html(vraag[vraagnr]+"=");
	$("#nummer").html("Vraag "+j+":<br /;><br /;>");
	$("#testdiv").attr("class","row");
	$("#questiondiv").attr("class","row");
	$("#answerdiv").attr("class","row");
	$("#result").html("");
	$("#reportMe").attr("class","btn btn-success hide");  
}

function showMessage2(message){
	$("#message").html(message);
}

function isDone2(){
	return vraagnr>=vraag.length;
}

function checkAnswer2(e){
var j;
	if (e.keyCode == 13) {
        var answer = $("#antwoord").val();
        if(answer == antw1[vraagnr] ||answer == antw2[vraagnr] ){
        	showMessage2("<font color='green'>Goed </font>"+username+", het kwadraat van "+vraag[vraagnr] + " is "+answer);
        	vraagnr++;
         	if(vraagnr<vraag.length){         		
         		$("#antwoord").val("");
         		console.log($("#antwoord").val());
         		$("#question").html(vraag[vraagnr]);
                j = 20 - vraagnr;
         	    $("#nummer").html("Vraag "+j+":<br /;><br /;>");
         	}
         	else{
         		$("#antwoord").val("");
         		showMessage2("Klaar! Bekijk rechts je score. Druk op Afronden om door te gaan.");
         		$("#startdiv").attr("class","row invisible");
         		showResult2();
         		$("#testdiv").attr("class","row invisible");
         		$("#answerdiv").attr("class","row invisible");
         		$("#leveldiv").attr("class","row");
        	}
        }
        else{
        	fouten++;
         	showMessage2("<font color='red'>Jammer </font>"+username+", niet goed!");
 <!--        	$("#antwoord").val("");-->
         	startTest2();
        }
    }
}
function showResult2(){
	var text = "Resultaten voor "+username+".<br />";
	text = text + "Niveau <font color='green'>" + level +"</font>.<br />";
	text = text + "Aantal fouten: <font color='red'>" + fouten + "</font>.<br />";
	text = text + "Score: <font color='green'>" + calculate2() +"</font><br />";
	email = text;
	text = text + "Der Score is afhankelijk van het aantal fouten en de tijd!</font><br />";
	$("#result").html(text);
	$("#reportMe").attr("class","btn btn-success");
	$("#question").html("");
} 

function calculate2(){
	var F=0;
	if(level == 1){
	  var snelst = 400;
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
	  var snelst = 220;
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
	  var snelst = 180;
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
function report2(){
	console.log("use google gmail js library!");
	$("#startdiv").attr("class","row");
	showMessage2("Kies ander niveau of klik op Start om weer te beginnen!");

	$("#fscf_name1").val("Ontbinden oefenen - " + username);
	$("#fscf_email1").val("email_from_oefening_page@adridierdorp.nl");
	$("#fscf_field1_2").val("Result from user " + username);
	$("#fscf_field1_3").val(email);
	$("#fscf_submit1").click();
}
