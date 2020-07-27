/**
 node js program that transforms a .wi file into a JSON file
**/

var fs = require('fs');
 
var contents = fs.readFileSync('ww800x600.wi', 'utf8');

var arr = contents.split('\n'); 

write("WIREWORLD = [\n"); 
for(var i = 1; i < arr.length - 1; i++){ 
  write('"' + arr[i] + '"' + ( i < arr.length - 2 ? "," : "" ) + '\n' )
}
write("];\n"); 

function write(str){ 
fs.writeFileSync("wireworld.js", 
    str, 
    { 
      encoding: "utf8", 
      flag: "a+", 
      mode: 0o666 
    }); 
}