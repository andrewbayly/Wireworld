

const channel = new BroadcastChannel('foo');

channel.onmessage = function(e) {
  const message = e.data;
  console.log('received: ' + message); 
      
  readQueue2.push(message-0);
};


/*
var grid = [[
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
  [ 0, 0, 1, 2, 3, 1, 0, 0, 0, 0 ], 
  [ 0, 1, 0, 0, 0, 0, 1, 0, 0, 0 ], 
  [ 0, 0, 1, 1, 1, 1, 0, 0, 0, 0 ], 
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] 
], [
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] 
] ]; 
*/

var grid = [[],[]]; 
var gridSpan = []; 

/**
  rules:
    1. empty cells stay empty
    2. electron heads(3) become electron tails(2)
    3. electron tails become wire segments
    4. wire segments become electron heads if they 
      border either one or two electron heads, 
      otherwise they remain wire segments.
**/
var firstSlice = true; 

function drawGrid(slice) {

  var oldSlice = (slice == 0) ? 1 : 0; 

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  
  const square = 2; 
  const colors = [ "#000000", "#FFFFFF", "#0000FF", "#FF0000"];   


  var mini = 0; 
  var maxi = grid[slice].length; 
  var minj = 0; 
  var maxj = grid[slice][0].length; 

/*
  var mini = 38; 
  var maxi = 150; 
  var minj = 641; 
  var maxj = 800; 
*/  

  for(var i = mini; i < maxi; i++){ 
 
    if(!firstSlice){ 
      minj = gridSpan[i].minj; 
      maxj = gridSpan[i].maxj; 
    }
    
    for(var j = minj; j <= maxj; j++){ 
      var x = j * square; 
      var y = i * square;
      if(grid[slice][i][j] != grid[oldSlice][i][j] || firstSlice){ 
        ctx.fillStyle = colors[grid[slice][i][j]];
        ctx.fillRect(x, y, square, square);
      }  
    }
  }
  firstSlice = false; 
}

gen = 0; 

function step(from, to){ 

gen++; 
//console.log('gen = ' + gen); 

  for(var i = 1; i < grid[from].length-1; i++){ 
    for(var j = gridSpan[i].minj; j <= gridSpan[i].maxj; j++){
//    for(var j = 1; j < grid[from][1].length-1; j++){ 
      var fromValue = grid[from][i][j];
      var toValue = 0; 
      if(fromValue == 0)
        toValue = 0; 
      else if(fromValue == 1){  
        var count = 0; 
        for(var ii = -1; ii <= 1; ii++){ 
          for(var jj = -1; jj <= 1; jj++){ 
            if(grid[from][i+ii][j+jj]==3)
              count++; 
          }
        }
        if(count == 1 || count == 2)
          toValue = 3; 
        else
          toValue = 1; 
      }
      else if(fromValue == 2)
        toValue = 1; 
      else if(fromValue == 3) 
        toValue = 2; 
      
      grid[to][i][j] = toValue;   
    }
  }

}

function expandGrid(rows, cols){ 
  expandGridSlice(0, rows, cols); 
  expandGridSlice(1, rows, cols); 
}

function expandGridSlice(slice, rows, cols){ 
  while(grid[slice].length < rows)
    grid[slice].push([]); 
  
  for(var i = 0; i < rows; i++){ 
    while(grid[slice][i].length < cols)
      grid[slice][i].push(0); 
  }
}

function contractGrid(rows, cols){ 
  contractGridSlice(0, rows, cols); 
  contractGridSlice(1, rows, cols); 
}

function contractGridSlice(slice, rows, cols){ 
  while(grid[slice].length > rows)
    grid[slice].pop(); 
  
  for(var i = 0; i < rows; i++){ 
    while(grid[slice][i].length > cols)
      grid[slice][i].pop(); 
  }
}


STARTED = false; 

PAUSED = false; 
PAUSED_STATE = 0; 

async function start(){ 

  STARTED = true; 

  drawGrid(0); 
  
  var from = 0; 
  var to = 1; 
 
  //return; //temporary freeze the computer on the first frame
  
  while(STARTED){
  
    if(!PAUSED){  
      var start = new Date(); 
    
      //console.log(k); 
      step(from, to); 
  
      drawGrid(to); //don't draw anything 
          
      var temp = from; 
      from = to; 
      to = temp; 

      if(gen % 96 == 0){ 
        checkIO(); 
      }
    
      var elapsed = new Date() - start ; 
      //console.log('elapsed = ' + elapsed); 

    }
    
    //paused means we are waiting for data to read
    if(PAUSED){ 
      if(PAUSED_STATE == 1){ 
        if(readQueue1.length > 0){ 
          var value = readQueue1.shift();
        
          //store value
          copyValueToRegister(decToBin(value), 52 );   

          //clear the flag
          copyValueToRegister(decToBin(0), 51 );     
      
          PAUSED = false; 
        }
      }
      else
      { 
        if(readQueue2.length > 0){ 
          var value = readQueue2.shift();
        
          //store value
          copyValueToRegister(decToBin(value), 52 );   

          //clear the flag
          copyValueToRegister(decToBin(0), 51 );     
      
          PAUSED = false; 
        }
      }
    }
    
    await sleep(1); 

  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var readQueue1 = []; 

var readQueue2 = []; 

function checkIO(){ 
  //once we are here, we can assume that we are operating on grid 0
  
  var flag = binToDec(readValueFromRegister(51)); 
  
  /**
   note that there may be some noise when the flag is being written
   - based on experience, we can filter this out.
  **/
  if(flag == 0 || flag > 4)
    return; 
  
  if(flag == 1){ 
    PAUSED = true; 
    PAUSED_STATE = 1; 
    alert('Please enter a value and click Enter button.')
  }
  else if(flag == 2){ 
    var value = binToDec(readValueFromRegister(52));
    //console.log('write (console): ' + value);
    document.getElementById('write').value += (value + '\n'); 
       
    //clear the flag
    copyValueToRegister(decToBin(0), 51 );   
    
  }
  else if(flag == 3){ 
    PAUSED = true; 
    PAUSED_STATE = 2; 
  }
  else if(flag == 4){ 
    var value = binToDec(readValueFromRegister(52));
 
    channel.postMessage(value);
    //channel.broadcast('demo_trigger', value);
    console.log('broadcast value: ' + value);  
       
    //clear the flag
    copyValueToRegister(decToBin(0), 51 );   
  }

  //set firstSlice to true so that the grid will 
  //be drawn from scratch again ( this prevents "floating" electrons )
  firstSlice = true; 
  
}

var headX = [ 4,10,16,22,28,34,40,46, 43,37,31,25,19,13, 7, 1 ]; 
var headY = [ 3, 3, 3, 3, 3, 3, 3, 4,  0, 0, 0, 0, 0, 0, 0, 0 ]; 
  
var offsetX_red = [[0], [0], [0], [0], [0], [0], [0], [0, -4], [0], [0], [0], [0], [0], [0], [0], [0]];  
var offsetY_red = [[0], [0], [0], [0], [0], [0], [0], [0,  1], [0], [0], [0], [0], [0], [0], [0], [0]];  

var offsetX_blue = [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1, -2, -3], [1], [1], [1], [1], [1], [1], [1], [1]];  
var offsetY_blue = [[0], [0], [0], [0], [0], [0], [0],        [1,  1, 1], [0], [0], [0], [0], [0], [0], [0], [0]];  


function decToBin(value){ 

  if(value < 0)
    value = value + 65535 ; 
  
  var bits = []; 
  
  for(var i = 0; i < 16; i++){ 
    var bit = value % 2 ;
    value = Math.floor(value / 2);
    bits.unshift(bit);   
  }
  
  return bits; 
}

function binToDec(bits){ 
  var result = 0; 
  var bit = 1; 
  for(var i = 15; i >= 0; i--){ 
    result += bit * bits[i]; 
    bit *= 2; 
  }
  
  if(result > 32767)
    result = result - 65535
  
  return result; 
}

function readValueFromRegister(register){ 

  var bits = []; 
  
  //var originX = 689 - 6 * register; 
  var originX = 499 - 6 * register; 
  var originY = 61 + 6 * register;

  for(var bitPos = 0; bitPos < 16; bitPos++){ 
    //var bit = bits[bitPos]; 
    var color = (bit == 1) ? 3 : 1; 
    var x = originX + headX[bitPos]; 
    var y = originY + headY[bitPos]; 
    var color = grid[0][y][x] ;
    var bit = color == 3 ? 1 : 0; 
    bits.push(bit);  
  }

  var shiftNum = ( 14 + register ) % 16 ; 
  for(var j = 0; j < shiftNum; j++){ 
    bits.unshift(bits.pop());
  } 
  
  return bits; 
}

function copyValueToRegister(value, register){ 
  
  //shift enough bits given the register, so that the first bit is
  //going in the first place
  var shiftNum = ( 14 + register ) % 16 ; 
  for(var j = 0; j < shiftNum; j++){ 
    value.push(value.shift());
  } 

  //draw the bits onto the grid using the following formula: 
  //originXY + headXY + offsetXY
  var originX = 499 - 6 * register; 
  var originY = 61 + 6 * register;

  var bits = value; 
  for(var bitPos = 0; bitPos < 16; bitPos++){ 
    var bit = bits[bitPos]; 
    for(var i = 0; i < offsetX_red[bitPos].length; i++){ 
      var color = (bit == 1) ? 3 : 1; 
      var x = originX + headX[bitPos] + offsetX_red[bitPos][i]; 
      var y = originY + headY[bitPos] + offsetY_red[bitPos][i]; 
      grid[0][y][x] = color ; 
    }    
    for(var i = 0; i < offsetX_blue[bitPos].length; i++){ 
      var color = (bit == 1) ? 2 : 1; 
      var x = originX + headX[bitPos] + offsetX_blue[bitPos][i]; 
      var y = originY + headY[bitPos] + offsetY_blue[bitPos][i]; 
      grid[0][y][x] = color ; 
    }    
  }
  
}


function initializeGrid(){ 

  expandGrid(600, 800);

  //console.log('wireworld length = ' + WIREWORLD.length);

  //load the computer from the JSON file
  var map = { " " : 0, "#" : 1, "~" : 2, "@" : 3 };  
  for(var i = 0; i < 600; i++){ 
    var row = WIREWORLD[i]; 
    row = row.split('');
    for(var j = 0; j < 800; j++){ 
      var cell = row[j]; 
      grid[0][i][j] = map[cell]; 
    }
  }
  
  //break the top wire: 
  //grid[0][38][641] = 0; 
  
  //hide the display
  var maxj = 683;
  for(var i = 0; i < 433; i++){ 
    for(var j = 0; j < maxj; j++){ 
      grid[0][i][j] = 0; 
    }
    maxj--;
  }
  
  //shift the computer to the left
  var offset = 190; 
  for(var i = 0; i < 600; i++){ 
    for(var j = offset; j < 800; j++){ 
      grid[0][i][j-offset] = grid[0][i][j]; 
    }
  }
  for(var i = 0; i < 600; i++){ 
    for(var j = 800 - offset; j < 800; j++){ 
      grid[0][i][j] = 0; 
    }
  }
  
  contractGrid(600, 600); 
 
  //calculate gridSpan 
  for(var i = 0; i < grid[0].length; i++){ 
    var obj = { minj:0, maxj:0}; 
    var j = 0; 
    while(j < grid[0][0].length - 1 && grid[0][i][j] == 0)
      j++; 
    obj.minj = j; 
    
    j = grid[0][0].length -1; 
    while(j > 0 && grid[0][i][j] == 0)
      j--; 
    obj.maxj = j; 
    
    gridSpan.push(obj); 
  }
  
  console.log(gridSpan); 
  
}



function initialize(){ 
  initializeGrid(); 
  
  //now load the program into the registers
  var assembly = compile(PROGRAM[getProgram()]); 
  var program = assemble(assembly) ; 
  
  //pad out the program with zeros
  while(program.length < 43){ 
    program.push("0000"); 
  }

  //convert program into binary
  for(var i = 1; i < program.length; i++){ 
    program[i] = hexToBin(program[i]); 
  }

  console.log('binary:'); 
  console.log(JSON.stringify(program)); 

  for(var i = 1; i < program.length; i++){ 
    copyValueToRegister(program[i], i); 
  }
  

  function hexToBin(hex){ 
    var table = {  
      "0" : [0, 0, 0, 0], 
      "1" : [0, 0, 0, 1], 
      "2" : [0, 0, 1, 0], 
      "3" : [0, 0, 1, 1], 
      "4" : [0, 1, 0, 0], 
      "5" : [0, 1, 0, 1], 
      "6" : [0, 1, 1, 0], 
      "7" : [0, 1, 1, 1], 
      "8" : [1, 0, 0, 0], 
      "9" : [1, 0, 0, 1], 
      "A" : [1, 0, 1, 0], 
      "B" : [1, 0, 1, 1], 
      "C" : [1, 1, 0, 0], 
      "D" : [1, 1, 0, 1], 
      "E" : [1, 1, 1, 0], 
      "F" : [1, 1, 1, 1] 
    }
   
    hex = hex.split(''); 
    var bin = []; 
    for(var i = 0; i < hex.length; i++){ 
      var hexDigit = hex[i]; 
      bin = bin.concat(table[hexDigit]); 
    }
    
    return bin; 
  }
  
}

initialize(); 

start(); 

function clickEnter(){ 
  var value = document.getElementById("read").value;
  value = value - 0; 
  readQueue1.push(value);  
}

function getProgram(){ 
  var program = window.location.href.split('?').pop().split('=').pop(); 
  return program; 
}



