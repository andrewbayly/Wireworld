# Wireworld

The folks at https://www.quinapalus.com/wi-index.html describe a Wireworld computer
that calculates primes. I took the design of the computer, and ran it on my own 
implementation of Wireworld (running in the browser), then developed tooling to 
program the computer. First off, a loader which loads byte code into the register bank.
Then an assembler, which transforms assembly language instructions into byte code.
Finally, a high-level language ( which I call Wire ), and a compiler which translates
Wire code into assembler - put it all together and we have a functioning programming
environment for the Wireworld computer. 

## Live Demo

The demonstration program calculates factorials: 

[LIVE DEMO](https://andrewbayly.github.io/Wireworld/index.html?program=A "Live Demo")

The programs will automatically start when you load the pages. Open the JavaScript
console to see the different versions of the program: source code, assembler, byte code
and binary. 

# Wire

Wire is intended to look a lot like JavaScript - it's a subset of JavaScript.

 

