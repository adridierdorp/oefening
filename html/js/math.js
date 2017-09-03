function isPrimeNumber(number) {
	for (var i = 2; i < number; i++) {
		if (number % i === 0) {
			return false;
		}
	}
	return number !== 1;
}

function hasNoSqrtRoot(number){
	if(isNaN(number)){
		return false;
	}
	var array = getPrimeArray(number);
	for(var i =0;i<array.length;i++){
		if(array[i].times>1){
			return false;
		}
	}
	return true;
}

function getPrimeArray(number){
	var array =[];
	if(number <= 3){
		array.push({prime: number, times: 1});
		return array;
	}
	var hasPrime = true;	
	while(hasPrime){
		var isLoop = true;
		for(var i = 2 ; i <= number && isLoop; i++){
			if(isPrimeNumber(i)){
				if((number % i) === 0){
					array = putNumberToArray(array,i);
					number = number/i;
					isLoop = false;
				}
			}
		}
		hasPrime = (number != 1);
	}
    return array;
}

function putNumberToArray(array, number){
	var hasIt = false;
	for(var i = 0; i< array.length ;i++){
		if(array[i].prime == number){
			array[i].times++;
	    	hasIt = true;
	    	break;
		}
	}
	if(!hasIt){
		array.push({prime: number, times: 1});
	}
	return array;
}

function subStringBetweenLetters(str, begin, end, index){        
    var indexBegin = str.indexOf(begin);
    var indexEnd = str.indexOf(end);
    var matches = [];
    while(indexBegin>=0 && indexEnd >=0){
    	matches.push(str.substring(indexBegin+begin.length,indexEnd));
    	str = str.substring(0,indexBegin - 1) + str.substring(indexEnd + 1,str.length);
    	indexBegin = str.indexOf(begin);
    	indexEnd = str.indexOf(end);
    }
    if(index < matches.length){
    	return matches[index];
    }
    return null;
}


function createRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function replaceAllNonNumberAndLetter(source,replace){
	return source.replace(/[^a-zA-Z0-9-+*]/g,replace);
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
