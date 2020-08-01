/**
compiler. the compiler will for example transform this input into the output:

INPUT: 

PROGRAM = [
"display(5555);"
]; 

OUTPUT:

PROGRAM = [
"1   MOV R0 R5   ; set display to 5555",  
"2   MOV R63 R4  ; branch to 2",    
"3   MOV R1 R1   ; no-op in delay slot",  
"4   2           ; branch destination",   
"5   5555        ; constant to display (5555)"  
]; 

**/


GRAMMAR = [  
'start',
'  = statement *',
'',
'statement',
'  = display / initializer / whileOpen / whileClose / assignment / add / write / read',
'',
'display',
'  = _ "display(" _ arg:value _ ")" _ ";" _ { return {statementType : "display", arg : arg}; }',
'',
'write',
'  = _ "write(" _ port:integer _ "," _ val:value _ ")" _ ";" _ { return {statementType : "write", port : port, val : val}; }',
'',
'read',
'  = _ to:variable _ "=" _ "read(" _ port:integer _ ")" _ ";" _ { return {statementType : "read", port : port, to: to }; }',
'',
'initializer',
'  = _ "var" _ VAR:variable _ "=" _ value:integer _ ";" _ { return {statementType : "initializer", VAR : VAR, value:value}; }', 
'',
'whileOpen',
'  = _ "while(" _ "true" _ ")" _ "{" _ { return {statementType : "whileOpen"}; }',
'',
'whileClose',
'  = _ "}" _ { return {statementType : "whileClose"}; }',
'',
'assignment',
'  = _ to:variable _ "=" _ from:value _ ";" _ { return {statementType : "assignment", to:to, from:from}; }',
'',
'add',
'  = _ to:variable _ "=" _ from1:value _ "+" _ from2:value _ ";" _ { return {statementType : "add", to:to, from1:from1, from2:from2}; }',
'',
'value', 
' = integer / variable', 
'',
'integer "integer"',
'  = negative:"-"? digits:[0-9]+ { console.log(digits, negative); return parseInt( ( negative == "-" ? "-" : "" ) + digits.join(""), 10); }',  
'',
'variable',
'  = letters:[a-z]+ { return letters.join(""); }',  
'',
// optional whitespace
'_',
'  = [ \\t\\r\\n]*',
'',
// mandatory whitespace
'__',
' = [ \\t\\r\\n]+'
]; 

function parse(program){ 
  var grammar = GRAMMAR.join('\n');   

  var parser = peg.generate(grammar);
  //console.log(parser); 

  var text = program.join("\n");
  
  console.log('program:'); 
  console.log(text); 
  
  var output = parser.parse(text); 
  console.log('parser output: '); 
  console.log(output); 

  return output; 
}

function compile(program){ 

  var statements = parse(program);  
  
  const MAX_REGISTER = 50; 
  
  var movCounter = 1; 
  var valuesCounter = MAX_REGISTER ; 
  
  //only one pass! - build the instructions: 
  var movs = []; 
  var values = []; 
  
  //maps variables to their locations
  var variableMap = {}; 
  
  //location of the last while loop found:
  whileOpen = null; 
    
  //statements: 
  for(var i = 0; i < statements.length; i++){ 
    var statement = statements[i]; 
  
    if(statement.statementType == 'display'){
      var register = getRegister(statement.arg);
      movs.push(MOV(0, register));
      movCounter++; 
    }
    else if(statement.statementType == 'write'){
      var register = getRegister(statement.val);
      movs.push(MOV(52, register));
      movCounter++; 
      
      movs.push(MOV(51, getRegister(statement.port*2)));
      movCounter++; 
    }
    else if(statement.statementType == 'read'){
      var to = getRegister(statement.to);
      
      movs.push(MOV(51, getRegister(statement.port*2-1))); //will block on read
      movCounter++; 

      movs.push(MOV(to, 52));
      movCounter++; 
    }
    else if(statement.statementType == 'initializer'){ 
      values.unshift('' + statement.value + ' ; ' + statement.VAR)
      variableMap[statement.VAR] = valuesCounter;
      valuesCounter--;  
    }
    else if(statement.statementType == 'whileOpen'){ 
      whileOpen = movCounter;     
    }
    else if(statement.statementType == 'whileClose'){ 
      values.unshift('' + whileOpen); 
      movs.push(MOV(63, valuesCounter)); 
      valuesCounter--
      movCounter++; 
    
      movs.push(MOV(1, 1)); 
      movCounter++; 
    }
    else if(statement.statementType == 'assignment'){ 
      var from = getRegister(statement.from); 
      var to = getRegister(statement.to); 
      movs.push(MOV(to, from)); 
      movCounter++; 
    }
    else if(statement.statementType == 'add'){ 
      var to = getRegister(statement.to); 
      var from1 = getRegister(statement.from1); 
      var from2 = getRegister(statement.from2); 
      movs.push(MOV(60, from1)); 
      movCounter++; 
      movs.push(MOV(61, from2)); 
      movCounter++; 
      movs.push(MOV(to, 61)); 
      movCounter++; 
    }
  }  
  
  //stop:
  movs.push(MOV(63, valuesCounter)); 
  values.unshift('' + movCounter)
  valuesCounter--; 
  movCounter++; 
  
  movs.push(MOV(1, 1)); 
  movCounter++; 
  
  var result = movs; 
  while(result.length + values.length < MAX_REGISTER)
    result.push(0); 
  result = result.concat(values); 
  
  for(var i = 0; i < result.length; i++){ 
    result[i] = '' + (i + 1) + ' ' + result[i]; 
  }
  
  //console.log(result); 

/*
  var result = [
    "1   MOV R0 R4   ; set display to 5555",  
    "2   MOV R63 R5  ; branch to 2",    
    "3   MOV R1 R1   ; no-op in delay slot",  
    "4   5555        ; constant to display (5555)",   
    "5   2           ; branch destination"  
  ];  
*/  
  
  console.log('assembler:')
  console.log(result.join('\n')); 
  
  return result;
  
  function MOV(Rd, Rs){ 
    return "MOV R" + Rd + " R" + Rs ; 
  }

  function getRegister(value){ 
    var result = null; 
    if(typeof value == 'number'){ 
      values.unshift('' + value)
      result = valuesCounter;
      valuesCounter--;  
    }  
    else
    {
      result = variableMap[value]; 
    }
    return result; 
  }
   
}

