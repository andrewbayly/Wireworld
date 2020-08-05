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
'{',  
'  var line = 0;',  
'}', 
'start',
'  = statement *',
'',
'statement',
'  = display / initializer / whileOpen / whileClose / assignment / add / write / read / stop',
'',
'display',
'  = _ "display(" _ arg:value _ ")" _ ";" _ { return {line : line++, statementType : "display", arg : arg}; }',
'',
'stop',
'  = _ "stop(" _ ")" _ ";" _ { return {line : line++, statementType : "stop" }; }',
'',
'write',
'  = _ "write(" _ port:integer _ "," _ val:value _ ")" _ ";" _ {  return {line : line++, statementType : "write", port : port, val : val}; }',
'',
'read',
'  = _ to:variable _ "=" _ "read(" _ port:integer _ ")" _ ";" _ { return {line : line++, statementType : "read", port : port, to: to }; }',
'',
'initializer',
'  = _ "var" _ VAR:variable _ "=" _ value:integer _ ";" _ {  return {line : line++, statementType : "initializer", VAR : VAR, value:value}; }', 
'',
'whileOpen',
'  = _ "while(" _ boolean:boolean _ ")" _ "{" _ { return {line : line++, statementType : "whileOpen", boolean:boolean}; }',
'',
'boolean',
'  = TRUE / boolean_expression',
'',
'TRUE',
'  = "true" { return "true" }',
'',
'boolean_expression',
'  = VAR:variable _ eq:eq _ "0" { return {VAR:VAR, eq:eq} }',
'',
'eq',
'  = "!=" / "=="',
'',
'whileClose',
'  = _ "}" _ { return {line : line++, statementType : "whileClose"}; }',
'',
'assignment',
'  = _ to:variable _ "=" _ from:value _ ";" _ {  return {line : line++, statementType : "assignment", to:to, from:from}; }',
'',
'add',
'  = _ to:variable _ "=" _ from1:value _ "+" _ from2:value _ ";" _ {  return {line : line++, statementType : "add", to:to, from1:from1, from2:from2}; }',
'',
'value', 
' = integer / variable', 
'',
'integer "integer"',
'  = negative:"-"? digits:[0-9]+ { return parseInt( ( negative == "-" ? "-" : "" ) + digits.join(""), 10); }',  
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
  
  MAX_REGISTER = 50; 
  
  var movCounter = 1; //note that movCounter is movs index + 1
  var valuesCounter = MAX_REGISTER ; 
  
  //only one pass! - build the instructions: 
  var movs = []; 
  var values = []; 
  
  //maps variables to their locations
  var variableMap = {}; 
  
  //maps constants to their locations
  var constantMap = {}; 
  
  //location of the last while loop found:
  whileOpen = []; 
    
  //statements: 
  for(var i = 0; i < statements.length; i++){ 
    var statement = statements[i]; 
  
    if(statement.statementType == 'display'){
      var register = getRegister(statement.arg);
      movs.push(MOV(0, register, program[statement.line]));
      movCounter++; 
    }
    else if(statement.statementType == 'stop'){
       
      movs.push(MOV(63, valuesCounter, program[statement.line])); 
      values.unshift('' + movCounter)
      valuesCounter--; 
      movCounter++; 
  
      movs.push(MOV(1, 1)); 
      movCounter++; 
  
    }
    else if(statement.statementType == 'write'){
      var register = getRegister(statement.val);
      movs.push(MOV(52, register, program[statement.line]));
      movCounter++; 
      
      movs.push(MOV(51, getRegister(statement.port*2)));
      movCounter++; 
    }
    else if(statement.statementType == 'read'){
      var to = getRegister(statement.to);
      
      movs.push(MOV(51, getRegister(statement.port*2-1), program[statement.line])); //will block on read
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
      console.log('while: '); 
      console.log(statement);
      
      if(statement.boolean == 'true'){  
        whileOpen.push({ boolean:'true', a: movCounter});
      }
      else
      {
        var w = {boolean: statement.boolean.eq};
        var eq = statement.boolean.eq; 
        
        w.a = movCounter; 
        
        var VAR = getRegister(statement.boolean.VAR); 
        
        //MOVE b ( or c) to R55
        movs.push(null);
        w.R55 = movCounter - 1; 
        w.R55_Rs = eq == '==' ? 'c' : 'b';
        movCounter++; 
        
        //MOVE c ( or b) to R57
        movs.push(null);
        w.R57 = movCounter - 1; 
        w.R57_Rs = eq == '==' ? 'b' : 'c';
        movCounter++; 
        
        //MOVE VAR to R56
        movs.push(MOV(56, VAR)); 
        movCounter++; 
        
        //MOVE R56 to R63 ( branch )
        movs.push(MOV(63, 56)); 
        movCounter++; 
        
        //MOVE 01 to 01 (no-op)
        movs.push(MOV(1, 1)); 
        movCounter++; 
        
        w.b = movCounter;  
        
        w.comment = program[statement.line] ; 
        
        whileOpen.push(w); 
      }     
    }
    else if(statement.statementType == 'whileClose'){
      var w = whileOpen.pop();
      
      console.log('w:'); 
      console.log(w);  
      
      //get previous instruction...
      var prevMove = movs.pop(); 
      
      //branch to a:
      movs.push(MOV(63, getRegister(w.a), program[statement.line])); 
      movCounter++; 

      //...and put it in the delay slot
      movs.push(prevMove); 
    
      //no-op in delay slot:
      //movs.push(MOV(1, 1)); 
      //movCounter++; 
      
      if(w.boolean != 'true'){
        //set the values specified in the w object()
        w.c = movCounter;
        //console.log('c = '); 
        //console.log(w.c); 
        
        movs[w.R55] = MOV(55, getRegister(w[w.R55_Rs]), w.comment); 
        movs[w.R57] = MOV(57, getRegister(w[w.R57_Rs])); 
        
      }
    }
    else if(statement.statementType == 'assignment'){ 
      var from = getRegister(statement.from); 
      var to = getRegister(statement.to); 
      movs.push(MOV(to, from, program[statement.line])); 
      movCounter++; 
      console.log('movCounter:'); 
      console.log(movCounter); 
      
    }
    else if(statement.statementType == 'add'){ 
      var to = getRegister(statement.to); 
      var from1 = getRegister(statement.from1); 
      var from2 = getRegister(statement.from2); 
      movs.push(MOV(60, from1, program[statement.line])); 
      movCounter++; 
      movs.push(MOV(61, from2)); 
      movCounter++; 
      movs.push(MOV(to, 61)); 
      movCounter++; 
    }
  }  
  
 
  
  var result = movs; 
  while(result.length + values.length < MAX_REGISTER)
    result.push(0); 
  result = result.concat(values); 
  
  if(result.length > MAX_REGISTER){ 
    alert('Maximum Size of program exceeded. Program Size= ' + result.length + ", available size= " + MAX_REGISTER); 
  }
  
  for(var i = 0; i < result.length; i++){ 
    result[i] = '' + format((i + 1), 2) + ' ' + result[i]; 
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
  
  function MOV(Rd, Rs, comment){ 
    var result = format( "MOV R" + Rd + " R" + Rs, 12) ;
    result = result + ';' ; 
    if(typeof comment != 'undefined')
      result = result + ' ' + comment ; 
    return result;  
  }

  function getRegister(value){ 
    var result = null; 
    if(typeof value == 'number'){ 
      if(value in constantMap){
        result = constantMap[value]; 
      }
      else { 
        values.unshift('' + value)
        result = valuesCounter;
        valuesCounter--;
        
        constantMap[value] = result; 
      }  
    }  
    else
    {
      result = variableMap[value]; 
    }
    return result; 
  }
  
  function format(str, width){
    str = '' + str ; 
    while(str.length < width){ 
      str = str + ' ' ;
    }  
    console.log('[' + str + ']'); 
    return str;    
  }
   
}

