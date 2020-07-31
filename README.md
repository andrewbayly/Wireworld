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

The demonstration program is an adder. It runs in two browser windows - one is the 
client and the other is the server. The client accepts input - a list of numbers that 
you want to add together - and displays the results. The server does the additions.

To run: open one browser window and click Client, then open another and click Server.

[CLIENT](https://andrewbayly.github.io/Wireworld/index.html?program=A "Client")
[SERVER](https://andrewbayly.github.io/Wireworld/index.html?program=B "Server")

The programs will automatically start when you load the pages. You'll notice that 
they sometimes they stop running. That means they are waiting - either for user input
or for their partner to complete some work and communicate. When the client needs input
it will pop up and alert box to remind you.

# Wire

Wire is intended to look a lot like JavaScript - it's a subset of JavaScript. 

