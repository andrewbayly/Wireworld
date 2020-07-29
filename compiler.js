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



function compile(program){ 

  var grammar = [  
'start',
'  = display *',
'',
'display',
'  = _ "display(" _ arg:integer _ ")" _ ";" _ { return {statementType : "display", arg : arg}; }',
'',
'integer "integer"',
'  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }',  
'',
// optional whitespace
'_',
'  = [ \\t\\r\\n]*',
'',
// mandatory whitespace
'__',
' = [ \\t\\r\\n]+'
].join('\n');   

  var parser = peg.generate(grammar);
  console.log(parser); 

  var text = program.join("\n");
  
  var output = parser.parse(text); 
  console.log(output); 
  
  console.log(output[0].arg); 
  
  //first pass, work out how many MOV instructions we need 
  var movCount = 0; 
  for(var i = 0; i < output.length; i++){ 
    if(output[i].statementType == 'display')
      movCount++; 
  }
  
  //add two for stop 
  movCount += 2;  
  
  //var movCount = 3;
  //var valuesCount = 2; //not required
  
  var movCounter = 1; 
  var valuesCounter = movCount+1; 
  
  //second pass - build the instructions: 
  var movs = []; 
  var values = []; 
    
  //statements: 
  for(var i = 0; i < output.length; i++){ 
    if(output[i].statementType == 'display'){ 
      movs.push(MOV(0, valuesCounter));
      valuesCounter++;  
      values.push('' + output[i].arg)
      movCounter++; 
    }
  }  
  
  //stop:
  movs.push(MOV(63, valuesCounter)); 
  valuesCounter++; 
  values.push('' + movCounter)
  movCounter++; 
  movs.push(MOV(1, 1)); 
  movCounter++; 
  
  var result = movs.concat(values); 
  
  for(var i = 0; i < result.length; i++){ 
    result[i] = '' + (i + 1) + ' ' + result[i]; 
  }
  
  console.log(result); 

/*
  var result = [
    "1   MOV R0 R4   ; set display to 5555",  
    "2   MOV R63 R5  ; branch to 2",    
    "3   MOV R1 R1   ; no-op in delay slot",  
    "4   5555        ; constant to display (5555)",   
    "5   2           ; branch destination"  
  ];  
*/  
  
  return result;
  
  function MOV(Rd, Rs){ 
    return "MOV R" + Rd + " R" + Rs ; 
  }
   
}

