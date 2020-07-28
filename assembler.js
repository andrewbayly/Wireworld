/**
Assember - takes instructions written in assembly language
and converts them into hex representation ready to be loaded
into the computer. Note that the assembler construct must include
lines sequentially from 1 to the max line used. If any registers
are not used, then write them in with a constant 0.
**/

/* 
takes a program and returns an array of hex values
for example: 

INPUT: 

PROGRAM = [
"1   MOV R0 R5   ; set display to 5555",  
"2   MOV R63 R4  ; branch to 2",    
"3   MOV R20 R20 ; no-op in delay slot",  
"4   2           ; branch destination",   
"5   5555        ; constant to display (5555)"  
]; 

OUTPUT: 

PROGRAM = [
   null,   //register 0 is unused
  "0005",  //1: set display to 5555
  "3F04",  //2: branch to 2 
  "1414",  //3: no-op in delay slot
  "0002",  //4: branch destination
  "15B3"   //5: 5555 decimal
];
 
*/

function assemble(program){ 

  var result = [null]; 
  
  for(var i = 0; i < program.length; i++){ 
    result.push( convert( program[i] )); 
  }
  
  console.log(result); 
  
  return result; 

  //converts a single assembly instruction into a hex code
  function convert(assembly){ 
    
    //remove comments
    var str = assembly.split(';').shift();
    
    //gather tokens that are non-blank
    str = str.split(' '); 
    var tokens = []; 
    for(var i = 0; i < str.length; i++){ 
      if(str[i].length > 0){ 
        tokens.push(str[i]); 
      }
    }
    
    //remove line number
    tokens.shift(); 
    
    var hexcode = null; 
    if(tokens.length == 3 && tokens[0] == 'MOV'){ 
      
      tokens.shift(); //remove MOV
      
      var Rd = tokens.shift().substr(1) - 0; 
      var Rs = tokens.shift().substr(1) - 0; 
      
      hRd = decToHex(Rd, 2); 
      hRs = decToHex(Rs, 2);

      hexcode = hRd + hRs;  
    }
    else{ //assume constant 
      var constant = tokens.shift() - 0; 
      
      hexcode = decToHex(constant, 4); 
    }
    
    return hexcode; 

    function decToHex(value, digits){ 
       var map = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']; 
    
       var result = ''; 
       
       for(var i = 0; i < digits; i++){ 
         var h = map[ value % 16 ]
         value = Math.floor(value / 16); 
         result = h + result; 
       }  
       
       return result; 
    }    
  
  }
  
  

}