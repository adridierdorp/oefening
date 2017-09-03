function isPrimeNumber(number) {
	for (var i = 2; i < number; i++) {
		if (number % i === 0) {
			return false;
		}
	}
	return number !== 1;
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

