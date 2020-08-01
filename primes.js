//primes.js

var p = 2; 
console.log(p); 
p = 3; 
while(p < 30){ //while(true){ 
  //is p prime?
  //console.log('trying ' + p); 
  
  var q = p - 2; 
  while(q > 1){ 
    //var remainder = p % q; 
    var remainder = p
    while(remainder >= 0){ 
      remainder = remainder - q; 
    }
    
    if(remainder == 0)
      break; 
    q = q - 2;   
  }
  if(q == 1)
    console.log(p); 

p = p + 2 ; 
}

/**
What do I need that I don't have already?

1. nested while loops
2. break statement
3. if statement
4. boolean expressions
    > 
    >= 
    == - easy!
5. negative numbers, and (a - b)

**/
