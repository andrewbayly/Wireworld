/*
PROGRAM = [
   null,   //register 0 is unused
  "0005",  //1: set display to 5555
  "3F04",  //2: branch to 2 
  "1414",  //3: no-op in delay slot
  "0002",  //4: branch destination
  "15B3"   //5: 5555 decimal
];
*/ 

PROGRAM = [
"1   MOV R0 R5   ; set display to 5555",  
"2   MOV R63 R4  ; branch to 2",    
"3   MOV R20 R20 ; no-op in delay slot",  
"4   2           ; branch destination",   
"5   5555        ; constant to display (5555)"  
]; 

/*
PROGRAM = [
   null,   //register 0 is unused
  "3F28",  //1 MOV R63 R40 ;branch to 1
  "0014",  //2 MOV R0 R20  ;set display to 5555 
  "0000",  //3             ; unused
  "0000",  //4             ; unused
  "0000",  //5             ; unused
  "0000",  //6             ; unused
  "0000",  //7             ; unused
  "0000",  //8             ; unused
  "0000",  //9             ; unused
  "0000",  //10            ; unused
  "0000",  //11            ; unused
  "0000",  //12            ; unused
  "0000",  //13            ; unused
  "0000",  //14            ; unused
  "0000",  //15            ; unused
  "0000",  //16            ; unused
  "0000",  //17            ; unused
  "0000",  //18            ; unused
  "0000",  //19            ; unused
  
  "15B3",  //20 5555       ;constant 5555

  "0000",  //21            ; unused
  "0000",  //22            ; unused
  "0000",  //23            ; unused
  "0000",  //24            ; unused
  "0000",  //25            ; unused
  "0000",  //26            ; unused
  "0000",  //27            ; unused
  "0000",  //28            ; unused
  "0000",  //29            ; unused
  "0000",  //30            ; unused
  "0000",  //31            ; unused
  "0000",  //32            ; unused
  "0000",  //33            ; unused
  "0000",  //34            ; unused
  "0000",  //35            ; unused
  "0000",  //36            ; unused
  "0000",  //37            ; unused
  "0000",  //38            ; unused
  "0000",  //39            ; unused
  
  "0001",  //40 1          ;branch 1
  
]; 
*/


/**
PROGRAM = [
  'MOV R63 R4',  //1. branch to 1
  'MOV R0 R3',   //2. display 5555
  '5555',        //3. constant 5555
  '1',           //4. branch target 1  
]; 
**/

/**
PROGRAM = [
"MOV R0 R7",     //1. send R7 (counter) to the display
"MOV R60 R7",    //2. send counter to R60 (adder input 1)
"MOV R61 R8",    //3. send R8 (1) to adder input 2
"MOV R7 R61",    //4. send the addition result to counter
"MOV R63 R9",    //5. move R9 (R1 address) to jump back to the beginning
"MOV R0 R7",     //6. send counter to display again (branch delay)
"0",             //7. contains counter
"1",             //8. 1 for incrementing
"1"              //9. jump target: R1
]; 
**/
