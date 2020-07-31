# Wireworld

[LIVE DEMO](https://andrewbayly.github.io/Wireworld/index.html "Live Demo")

The folks at https://www.quinapalus.com/wi-index.html describe a Wireworld computer
that calculates primes. I took the design of the computer, and ran it on my own 
implementation of Wireworld (running in the browser), then developed tooling to 
program the computer. First off, a loader which loads byte code into the register bank.
Then an assembler, which transforms assembly language instructions into byte code.
Finally, a high-level language ( which I call Wire ), and a compiler which translates
Wire code into assembler - put it all together and we have a functioning programming
environment for the Wireworld computer. 

To run click the live demo button - the program, stored in program.js will automatically
compile, assemble, load and start running. 

## program
 
Currently the Wireworld computer is configured to run headless - there is no display,
this can be toggled on and off in the code. The program is an adder - here is the code: 

    var sum = 0;
    var x = 0;
    while(true){
      x = read(1); 
      sum = sum + x;    
      write(1, sum);
    }    

read(1) means to read a value from the console - when read is encountered, the program
halts and waits for the user to enter a value ( you have to click Enter ). Write writes 
a value to the "console", a text window that appears directly below the computer. 

## Wire

Wire is a subset of JavaScript. 

