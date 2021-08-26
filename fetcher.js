const request = require('request');
var fs = require("fs"); 
const readline = require('readline');
const { rawListeners } = require('process');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const url = process.argv[2];
const filePath = process.argv[3];
request(url, (error, response, body) => {
  if(error !== null   ) {
    console.log('error:', error);  
    process.exit();
  }
  if(response.statusCode === 404) {
    console.log("url not found");
    process.exit();
  }
  console.log('statusCode:', response && response.statusCode);  
  console.log('body:', body);  

  fs.stat(`${filePath}`, (err, stats) => {
    if (err) {
      console.error(err)
      process.exit();
    }
    if(stats.isFile()) {
      rl.question("File already exists! Enter Y to overwrite.", (answer) => {
        if(answer === 'Y') {
          fs.writeFile(`${filePath}`, body.toString(), error => {
            if (error) {
              console.error(error)
              return;
            }
            console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
            process.exit();
          });
        } else {
          process.exit();
        }
      })
    }else{
      fs.writeFile(`${filePath}`, body.toString(), error => {
        if (error) {
          console.error(error)
          return;
        }
        console.log(`Downloaded and saved ${stats.size} bytes to ${filePath}`);
        process.exit();
      });
    }


})
});



