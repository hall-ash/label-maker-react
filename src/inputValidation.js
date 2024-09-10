const cleanSkipLabels = input => {
 	
  return input.replace(/[ \t\f\v\r]+/g, '')  // Remove all whitespace except newlines
  			.replace(/^\n+|\n+$/g, '') // Remove newlines from the start and end of the string
  			.replace(/\n+/g, '\n'); // Replace consecutive newlines with a single newline

};

const validateSkipLabels = cleanedInput => {
  // ensure input matches valid pattern
  const pattern = /^(\d+:(\w\d+(-\w\d+)?)(,\w\d+(-\w\d+)?)*)?(\n\d+:(\w\d+(-\w\d+)?)(,\w\d+(-\w\d+)?)*)*$/;
  return pattern.test(cleanedInput) ? '' : 'Check skip labels format';
}


export { cleanSkipLabels, validateSkipLabels };