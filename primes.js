function calculatePrimes(){ 
  var p = 2; 
  var q = 0; 
  var test = 0;
  var remainder = 0; 
  var testc = 0;
  var testd = 0;                               
  console.log(p); 
  p = 3; 
  while(p < 100){ //while(true){ 
    q = -3; 
    test = q + p;   
    while(test != 0){                         //!
      remainder = p; 
      //testc = 0;
      testd = 0;                              
      while(testd == 0){                       //!
        remainder = remainder + q; 
        testc = remainder + -1; 
        testd = sign(testc);         
      }
      if(remainder == 0){                      //! 
        break;
      }
      q = q + -2;
      test = q + p;   
    }
    if(test == 0){                            //!
      console.log(p); 
    }  
    p = p + 2 ; 
  }
}

function calculatePrimesA(){ 
  var p = 2; 
  var test = 0;
  console.log(p); 
  p = 3; 
  while(p < 100){ //while(true){ 
    //write(2, p); 
    //test = read(2); 
    test = isPrime(p);  
    if(test == 0){                            //!
      console.log(p); 
    }  
    p = p + 2 ; 
  }
}

function isPrime(p){ 
  var test = 0; 
  var q = 0; 
  var remainder = 0; 
  //while(true)
  //p = read(2);
  q = -3; 
  test = q + p;   
  while(test != 0){
    //write(2, p); 
    //write(2, q);
    //remainder = read(2); 
    remainder = getRemainder(p, q);      //!
    if(remainder == 0){                      //! 
      break;
    }
    q = q + -2;
    test = q + p;   
  }
  return test; 
  //write(3, test); 
  //}
}

function getRemainder(p, q) { 
  var testc = 0;
  var testd = 0; 
  var remainder = 0; 
  //while(true)
  //p = read(2);
  //q = read(2); 
  remainder = p; 
  testc = 0;
  testd = 0;                              
  while(testd == 0){                       //!
    remainder = remainder + q; 
    testc = remainder + -1; 
    testd = sign(testc);         
  }
  return remainder ;
  //write(3, remainder);
  //} 
}


calculatePrimesA(); 

//returns 0 if value is positive or zero
//and non-zero if value is negative
function sign(value){ 
  return (value < 0 ? -32767 : 0);
}

/**
What do I need that I don't have already?

1. nested while loops
2. break statement
3. if statement
4. sign function
5. boolean expressions for if and while
   variable != 0
   variable == 0
6. negative numbers, and (a - b) - DONE!
7. write(2/3); ... and addressing writes

**/




