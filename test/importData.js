const parse = require('csv-parse');
const fs = require('fs');
const axios = require('axios')
const readline = require('readline-sync');
const API = "http://127.0.0.1:3030"

const uuid = "664994c0-1432-11ea-9bff-6f5100eb9293"
const random = Math.floor((Math.random() * 1000) + 1);
const register = {
    "email": `test${random}@feathersjs.com`,
    "password": "supersecret",
    "fullName":"pongsatorn",
    "role":"1"
}
const login = {
    "strategy": "local",
    "email": `test${random}@feathersjs.com`,
    "password": "supersecret"
}
let AUTH_TOKEN =""
axios.defaults.baseURL = API;
async function Run_register(){
    await axios.post('/users',register).then((data)=>{
        if(debug)console.log(data.data)
        console.log(">>>>Register Pass")
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXRegister Fail")
        console.log(data.response)
    });
}
async function Run_login(){
    await axios.post('/authentication',login).then((data)=>{
        AUTH_TOKEN = data.data.accessToken
        console.log(">>>>login Pass")
        console.log(">>>>accessToken ",AUTH_TOKEN)
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXlogin Fail")
        console.log(data.response)
    });
    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
}
function loadfile(file){
    return new Promise((resolve, reject) => {
        fs.readFile(".\\test\\data\\"+file, (err, fileData) => {
          parse(fileData, {delimiter:"|"}, function(err, rows) {
            resolve(rows) ;
          });
        })
    })
}

async function Run_import(data){
    return await axios.post('/data/insert',data).then((data)=>{
        return data.data
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXimportTest data Fail")
    });
}

async function RUN(){
    let fileArray =["GP","GPU","TP","TPU","SUB","VTM","STD24"]
    await Run_register()
    await Run_login()
    for(let f =0;f<fileArray.length;f++){
        let dataCSV = await loadfile(fileArray[f]+'.csv')
        let dataCSVT = []
        for(let i=1;i<dataCSV.length;i++){
            let req = {versionUUID:uuid,schemaName:fileArray[f]}
            let row = {}
            for(let j=0;j<dataCSV[0].length;j++){
                row[dataCSV[0][j]] = dataCSV[i][j]
            }
            req.value = row
            dataCSVT.push(req)
        }
        let respond = await Run_import(dataCSVT)
    }
    
}
RUN()