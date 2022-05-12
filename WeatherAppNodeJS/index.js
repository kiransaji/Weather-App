const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}", Math.round(orgVal.main.temp-273.15));
    temperature = temperature.replace("{%tempmin%}", Math.round(orgVal.main.temp_min-273.15));
    temperature = temperature.replace("{%tempmax%}", Math.round(orgVal.main.temp_max-273.15));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;   
}

const server = http.createServer((req,res) => {

    if(req.url == "/"){

        let city = "Kerala";
      
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=36ba284295984ad59f2668ad2a8e800f`)
        .on('data', (chunk) => {

            //let city= req.body.city;
            //let url=(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=36ba284295984ad59f2668ad2a8e800f`);
            const objData = JSON.parse(chunk);
            const arrData=[objData];   
            //console.log(arrData[0].main.temp);

            const realTimeData = arrData.map(val => replaceVal(homeFile, val))
            .join("");
            res.write(realTimeData);
            //console.log(realTimeData);
        })
        .on('end', (err) => {
          if (err) return console.log('connection closed due to errors', err);         
     res.end();
        });
    }
});

server.listen(8000, "127.0.0.1");