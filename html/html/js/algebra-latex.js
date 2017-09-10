function latexToAlgebra(latex){
	var structure = parseLatex(latex);
	var formattedString = mathFormatter(structure);
	formattedString = formattedString.substring(1, formattedString.length - 1);
	return formattedString;
}

/**
 * Parse a latex math string, to an object
 * @param  {string} latex A latex string like "\frac{1}{2}"
 * @return {array} An array containing the content of the input,
 *                     formatted with objects with a type and a value field
 */
function parseLatex(latex){
  let findingToken = false;
  let findingNumber = false;
  let findingVariable = false;
  let currentToken = '';
  let currentNumber = '';
  let currentVariable = '';
  let structure = [];

  for (let i = 0; i < latex.length; i++) {
    const char = latex.charAt(i);

    if (findingToken) {
      if (char.match(/[a-zA-Z]/g)) {
        currentToken += char;
        continue;
      } else {
        findingToken = false;
        parseToken(currentToken, structure);
        currentToken = '';
      }
    }

    if (findingNumber) {
      // Check for number
      if (char.match(/[\d.,]/g)) {
        currentNumber += char;
        continue;
      } else {
        structure.push({
          type: 'number',
          value: currentNumber
        });

        currentNumber = '';
        findingNumber = false;
      }
    } else {
      if (char.match(/[\d.,]/g)) {
        currentNumber += char;
        findingNumber = true;
        continue;
      }
    }

    if (findingVariable && !char.match(/[a-zA-Z]/g)) {
      structure.push({
        type: 'variable',
        value: currentVariable
      });
      findingVariable = false;
    }

    // Check for group '{ ... }'
    if (char === '\\') {
      findingToken = true;
      continue;
    } else {
      if (char === '{') {
        const length = matchingBracketLength(latex.substr(i), 'curly');

        if (length instanceof Error) return length;

        const newLatex = latex.substr(i + 1, length - 1);
        //logger.debug('New Latex' + newLatex);

        structure.push({
          type: 'group',
          value: parseLatex(newLatex)
        });

        i += length;
        continue;
      }

      // Check for operator
      if (char.match(/[+\-*/()=^_]/g)) {
        //logger.debug('Found operator ' + char);
        structure.push({
          type: 'operator',
          value: char
        });
        continue;
      }

      // Check for variable
      if (char.match(/[a-zA-Z]/g)) {
        if (findingVariable) {
          currentVariable += char;
          //logger.debug('- Finding variable ' + currentVariable);
        } else {
          currentVariable = char;
          findingVariable = true;
          //logger.debug('Finding new variable ' + currentVariable);
        }
      }
    }
  } // Loop end

  if (findingNumber) {
    //logger.debug('Wrapping up number');
    structure.push({
      type: 'number',
      value: currentNumber
    });
  }

  if (findingToken) {
    //logger.debug('Wrapping up token');
    structure.push({
      type: 'token',
      value: currentToken
    });
  }

  if (findingVariable) {
    //logger.debug('Wrapping up variable');
    structure.push({
      type: 'variable',
      value: currentVariable
    });
  }

  return structure;
}

const parseToken = (token, structure) => {
  switch (token) {
    case 'cdot':
      structure.push({
        type: 'operator',
        value: '*'
      })
      break;
    default:
      structure.push({
        type: 'token',
        value: token
      })
  }
}

/**
 * Will find the length to the matching bracket, in provided string
 * @param  {string} latex       A string of latex, starting from where the search should begin
 * @param  {string} bracketType The type of bracket to search for.
 *                                  Can be one of the following ['normal', 'curly', 'square']
 * @return {number}             The length from start of provided string,
 *                                  to the location of the matching bracket
 */
function matchingBracketLength(latex, bracketType){
  //logger.debug('Finding matching bracket for text:', latex);

  let startBracket = '';
  let endBracket = '';

  switch (bracketType) {
    case 'normal':
      startBracket = '(';
      endBracket = ')';
      break;
    case 'curly':
      startBracket = '{';
      endBracket = '}';
      break;
    case 'square':
      startBracket = '[';
      endBracket = ']';
      break;
  }

  let bracketDepth = 0;

  for (let i = 0; i < latex.length; i++) {
    const char = latex.charAt(i);
    //logger.debug('-- Char:' + char);

    if (char === startBracket) {
      bracketDepth++;
      //logger.debug('-- Found starting bracket, depth ' + bracketDepth);
    } else if (char === endBracket) {
      if (bracketDepth === 1) {
        //logger.debug('-- Found original closing bracket at position ' + i);
        return i;
      }

      bracketDepth--;
      //logger.debug('-- Found closing bracket, depth ' + bracketDepth);
    }
  }

  return new Error('Brackets do not match up');
}


/**
 * Will format a parsed latex object, to a calculatable string
 * @param  {object} parsedLatex An object parsed by "./parser.js"
 * @return {string} A calculatable string, eg. "(1+3)/4*sqrt(2)"
 */
function mathFormatter(parsedLatex){
  let formattedString = '';
  formattedString += '(';
  for (var i = 0; i < parsedLatex.length; i++) {
    const item = parsedLatex[i];

    if (item.type === 'number') {
      if (i > 0) {
        if (parsedLatex[i - 1].type !== 'number' && parsedLatex[i - 1].type !== 'operator') {
          //logger.debug('Adding * before number: ' + item.value + ', previous item: ' + parsedLatex[i - 1].type);
          formattedString += '*';
        }
      }
      formattedString += item.value;
    }

    if (item.type === 'operator') {
      if (i === 0 && (item.value === '+' || item.value === '*')) {
        //logger.debug('Structure starting with * or +, ignoring');
      } else {
    	  formattedString += item.value;
      }
    }

    if (item.type === 'variable') {
      if (i > 0) {
        if (parsedLatex[i - 1].type !== 'operator') {
          //logger.debug('Adding * before variable: ' + item.value + ', previous item: ' + parsedLatex[i - 1].type);
          formattedString += '*';
        }
      }
      formattedString += item.value;
    }

    if (item.type === 'group') {
      formattedString += formatter(item.value);
    }

    if (item.type === 'token') {
      //logger.debug('Handling token: ' + item.value);

      if (item.value === 'frac') {
        if (parsedLatex[i + 1].type === 'group' && parsedLatex[i + 2].type === 'group') {
          //logger.debug('Found fraction');
          formattedString += formatter(parsedLatex[i + 1].value) + '/' + formatter(parsedLatex[i + 2].value);
          i += 2;
        } else {
          return new Error('Fraction must have 2 following parameters');
        }
      }

      if (item.value === 'sqrt') {
        if (parsedLatex[i + 1].type === 'group') {
          //logger.debug('Found square root');
          formattedString += 'sqrt' + formatter(parsedLatex[i + 1].value);
          i++;
        } else {
          //logger.debug('Square root did not have any following parameters, ignoring');
        }
      }

      if (item.value === 'cdot' || item.value === 'times' || item.value === 'ast') {
        formattedString += '*';
      }

      if (item.value === 'div') {
        formattedString += '/';
      }
    }
  }

  formattedString += ')';

  return formattedString;
}

