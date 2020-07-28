
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
    for(var j = minj; j < maxj; j++){ 
      var x = j * square; 
      var y = i * square;
      if(grid[slice][i][j] != grid[oldSlice][i][j] || firstSlice){ 
        ctx.fillStyle = colors[grid[slice][i][j]];
        ctx.fillRect(x - minj * square, y - mini * square, square, square);
      }  
    }
  }
  firstSlice = false; 
}

function step(from, to){ 

  for(var i = 1; i < grid[from].length-1; i++){ 
    for(var j = 1; j < grid[from][1].length-1; j++){ 
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

STARTED = false; 

async function start(){ 

  STARTED = true; 

  drawGrid(0); 
  
  var from = 0; 
  var to = 1; 
 
  //return; //temporary freeze the computer on the first frame
  
  while(STARTED){ 
    //console.log(k); 
    var start = new Date(); 
    step(from, to); 
    var elapsed = new Date() - start ; 
    console.log('grid elapsed = ' + elapsed); 
  
    start = new Date(); 
    drawGrid(to); 
    elapsed = new Date() - start ; 
    console.log('draw elapsed = ' + elapsed); 
  
    await sleep(10); 
          
    var temp = from; 
    from = to; 
    to = temp; 
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




function initialize(){ 
  expandGrid(600, 800);

  console.log('wireworld length = ' + WIREWORLD.length);

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
  
  //now load the program into the registers
  var program = assemble(PROGRAM) ; 

/**
  var program = [
    null, //register 0 is unused
    "3C0B", 
    "3D0C",
    "3D3D",
    "003D",
    "3F0D",
    "0000",
    "0000",
    "0000",
    "0000",
    "0000",
    "0001",
    "0001",
    "0003"
  ]; 
**/

  
  //pad out the program with zeros
  while(program.length < 43){ 
    program.push("0000"); 
  }

  //convert program into binary
  for(var i = 1; i < program.length; i++){ 
    program[i] = hexToBin(program[i]); 
  }

  console.log(program); 

  //shift enough bits given the register, so that the first bit is
  //going in the first place
  var shiftNum = 15; 
  
  for(var i = 1; i < program.length; i++){ 
    for(var j = 0; j < shiftNum; j++){ 
      program[i].push(program[i].shift());
    } 
    shiftNum = ( shiftNum + 1 ) % 16 ; 
  }
  
  //draw the bits onto the grid using the following formula: 
  //originXY + headXY + offsetXY
  
  var originX = 683; 
  var originY = 67;

  headX = [ 4,10,16,22,28,34,40,46, 43,37,31,25,19,13, 7, 1 ]; 
  headY = [ 3, 3, 3, 3, 3, 3, 3, 4,  0, 0, 0, 0, 0, 0, 0, 0 ]; 
  
  offsetX_red = [[0], [0], [0], [0], [0], [0], [0], [0, -4], [0], [0], [0], [0], [0], [0], [0], [0]];  
  offsetY_red = [[0], [0], [0], [0], [0], [0], [0], [0,  1], [0], [0], [0], [0], [0], [0], [0], [0]];  

  offsetX_blue = [[-1], [-1], [-1], [-1], [-1], [-1], [-1], [-1, -2, -3], [1], [1], [1], [1], [1], [1], [1], [1]];  
  offsetY_blue = [[0], [0], [0], [0], [0], [0], [0],        [1,  1, 1], [0], [0], [0], [0], [0], [0], [0], [0]];  

  for(var register = 1; register <= 42; register++){ 
    var bits = program[register]; 
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
    
    originX -= 6; 
    originY += 6; 
  }
  
  return; 

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

