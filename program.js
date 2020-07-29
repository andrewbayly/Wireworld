/**
program which copies 5555 into the display and then stops

PROGRAM = [
"1   MOV R0 R5   ; set display to 5555",  
"2   MOV R63 R4  ; branch to 2",    
"3   MOV R1 R1   ; no-op in delay slot",  
"4   2           ; branch destination",   
"5   5555        ; constant to display (5555)"  
]; 
**/


PROGRAM = [
"display( 5555 );",
"display(1);" 
]; 

/*
//fibonacci series
PROGRAM = [
"var a = 1;", 
"var b = 1;",
"var c = 0;", 
"display(a);", 
"display(b);", 
"",
"while(true){", 
"  c = a + b ;", 
"  a = b;", 
"  b = c;", 
"  display(b);",
"}"
];
*/ 

/**
//counter:
PROGRAM = [
"var counter = 0;", 
"",
"while(true){",
"  display(counter);",  
"  counter = counter + 1;", 
"}"      
]; 
**/

/**
ast = [ 
 { statements: [  
    { type : 'displayStatement', 
      argument: { type : 'constant', value : 5555 }
      space : 1 //3 instructions  
    }, 
    { type : 'assignmentStatement', 
      lhs: { type : 'variable', name : 'counter' }, 
      rhs: { type : 'expression', 
             operator : '+', 
             operands : [ 
               { type : 'variable', name : 'counter' },
               { type : 'constant', value : 1 }
             ]
           } 
      space : 3     
    } 
  ]
 } 
]
**/

/**
//counter program (working version!)
PROGRAM = [
"1   MOV R0 R7   ; send R7 (counter) to the display", 
"2   MOV R60 R7  ; send counter to R60 (adder input 1)",     
"3   MOV R61 R8  ; send R8 (1) to adder input 2",     
"4   MOV R7 R61  ; send the addition result to counter",   
"5   MOV R63 R9  ; move R9 (R1 address) to jump back to the beginning",  
"6   MOV R0 R7   ; send counter to display again (branch delay)",     
"7   0           ; contains counter",              
"8   1           ; 1 for incrementing",             
"9   1           ; jump target: R1"              
]; 
**/

/**
//counter program (modified version!)
PROGRAM = [
"1   MOV R0 R7   ; while start: [display(counter)]"
"2   MOV R60 R7  ; send counter to R60 (adder input 1) [... = counter + ...]",     
"3   MOV R61 R8  ; send R8 (1) to (adder input 2) [... = ... + 1] ",     
"4   MOV R7 R61  ; send the addition result to counter [counter = ...]",   
"5   MOV R63 R9  ; jump to while start",  
"6   MOV R1 R1   ; no-op (branch delay)",     
"7   0           ; [counter = 0]",              
"8   1           ; constant 1",             
"9   1           ; jump target: R1"              
]; 

var counter = 0; 

while(true){ 
  display(counter);  
  counter = counter + 1;
}      

//stop by looping??    
**/  





