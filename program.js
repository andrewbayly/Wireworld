PROGRAM = [
   null,   //register 0 is unused
  "0004",  //1 MOV R0 R4  ;set display to 5555 
  "3F03",  //2 MOV R63 R3 ;branch to 1
  "0001",  //3 1          ;branch 1
  "15B3"   //4 5555       ;constant 5555
]; 