
//adder client
PROGRAM = { A : [
"var sum = 0;",
"var x = 0;",
"while(true){",
"  x = read(1);", 
"  write(2, sum);", 
"  write(2, x);", 
"  sum = read(2);",    
"  write(1, sum);",
"}"   
], 

//adder server
B : [
"var a = 0; ", 
"var b = 0; ", 
"var sum = 0; ", 
"while(true){",
"  a = read(2);",   
"  b = read(2);",
"  sum = a + b;",
"  write(2, sum);",    
"}"
] 
};

/**
//test client
PROGRAM = { A : [
"var a = 0;",
"a = read(2);",  
"write(1, a);" 
], 

//test server
B : [
"write(2, 1234);"   
] 
};
*/

/**
//test client  Works!!!
//problem - the code fails when the server tries to broadcast the
//sum back to the client - the client doesn't pick up the message.
PROGRAM = { A : [
"var a = 0; ", 
"var b = 0; ",
"var sum = 0; ",
"a = read(1);",
"b = read(1);",
"write(2, a);",  
"write(2, b);",
"sum = read(2);",
"write(1, sum);"  
], 

//test server
B : [
"var a = 0; ", 
"var b = 0; ", 
"var sum = 0; ", 
"a = read(2);",
"b = read(2);",
"sum = a + b;",
"write(2, sum);"   
] 
};
**/


/**
Works!!!
//test client
PROGRAM = { A : [
"write(2, 5);",  
"write(2, 4);" 
], 

//test server
B : [
"var a = 0; ", 
"var b = 0; ", 
"var sum = 0; ", 
"a = read(2);",
"b = read(2);",
"sum = a + b;",
"write(1, sum);"   
] 
};
**/

/**

//Works!!!
//test client
PROGRAM = { A : [
"write(2, 1234);" 
], 

//test server
B : [
"var a = 0; ", 
"a = read(2);",
"write(1, a);"   
] 
};

**/



/**
//fibonacci series
PROGRAM = [
"var a = 1;",    //initializer
"var b = 1;",
"var c = 0;", 
"write(1, a);",   //display
"write(1, b);", 
"", 
"while(true){",  //whileOpen
"  c = a + b ;", //add 
"  a = b;",      //assignment 
"  b = c;",      
"  write(1, b);", 
"}"              //whileClose
];
**/

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





