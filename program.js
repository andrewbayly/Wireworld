
/**
//product (attempt to reproduce minus zero problem)
//initialize two numbers a and b, and calculate the product
//fails - a goes to minus zero, and the first loop never ends
PROGRAM = { A : [
"var a = 2;",
"var b = 1;", //
"var product = 0;", 
"while(a != 0){", 
"  a = a + -1; ",
"  product = product + b;",
"}",
"display(product);",    
"stop();", 
], 

B : [
] 
};
**/


//prints factorials up to 7!
//doesn't work - how do I debug it???
//when I add 1 to -1 the result is -0 not +0
//does this happen in odd registers??? 
//seems to be affected by the position of the
//assignment statement - if I swap the lines: 
//"k = k + 1" and "product = product + f" then it fails

//update - now it's succeeding the first time into the inner loop
//but failing the second time ( gets trapped in the inner loop)

//1
//0
//-1
//-2
PROGRAM = { A : [
"  var k = 0;",
"  var n = 1;", 
"  var f = 1;", //
"  var product = 0;", 
"  while(true){", //   
"    product = 0;", 
"    k = n;",
"    while(k != 0){", 
"      k = k + -1; ",
"      product = product + f;",
"    }",
"    f = product;", //
"    write(1, f);", //   
"    n = n + 1;", // 
"  }" //
], 

B : [
] 
};


/**

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

**/


/**
//test client
PROGRAM = { A : [
"write(1, -2);" 
], 

//test server
B : [
"write(2, 1234);"   
] 
};
**/

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
//counter: - works!
PROGRAM = {A:[
"var counter = 0;", 
"",
"while(true){",
"  write(1, counter);",  
"  counter = counter + 1;", 
"}"      
], 
B : [
]
}; 
**/


