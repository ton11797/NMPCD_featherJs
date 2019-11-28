const axios = require('axios')
const readline = require('readline-sync');
const API = "http://127.0.0.1:3030"
const debug = false
const runall = false
const random = Math.floor((Math.random() * 100) + 1);
console.log(random)
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

const createVersion1 = {
	"versionName":`V1_test${random}`
}
let uuidV1 = ""

const createSchema = [
    {
        schemaName:"TPU",fieldName:["TPUID","FSN","MANUFACTURER"]
    },
    {
        schemaName:"TP",fieldName:["TPID","FSN","MANUFACTURER"]
    },
    {
        schemaName:"GPU",fieldName:["GPUID","FSN"]
    },
    {
        schemaName:"GP",fieldName:["GPID","FSN"]
    },
    {
        schemaName:"SUB",fieldName:["SUBID","FSN"]
    },
    {
        schemaName:"VTM",fieldName:["VTMID","FSN"]
    },
    {
        schemaName:"STD24",fieldName:["STD_CODE", "Version", "RegNo", "T_Code", "TradeName", "Item", "Company"]
    }
]

let importTest = [
    {"schemaName":"GP","value":{"FSN":"GP1","GPID":"1"}},
    {"schemaName":"GP","value":{"FSN":"GP2","GPID":"2"}},
    {"schemaName":"GPU","value":{"FSN":"GPU1","GPUID":"1"}},
    {"schemaName":"GPU","value":{"FSN":"GPU2","GPUID":"2"}},
    {"schemaName":"TP","value":{"FSN":"TP1","TPID":"1","MANUFACTURER":"1"}},
    {"schemaName":"TP","value":{"FSN":"TP2","TPID":"2","MANUFACTURER":"2"}},
    {"schemaName":"TPU","value":{"FSN":"TPU1","TPUID":"1","MANUFACTURER":"1"}},
    {"schemaName":"TPU","value":{"FSN":"TPU2","TPUID":"2","MANUFACTURER":"2"}},
    {"schemaName":"SUB","value":{"FSN":"SUB1","SUBID":"1"}},
    {"schemaName":"SUB","value":{"FSN":"SUB2","SUBID":"2"}},
    {"schemaName":"VTM","value":{"FSN":"VTM1","VTMID":"1"}},
    {"schemaName":"VTM","value":{"FSN":"VTM2","VTMID":"2"}},
    {"schemaName":"STD24","value":{"STD_CODE":"1", "Version":"1", "RegNo":"1", "T_Code":"1", "TradeName":"1", "Item":"1", "Company":"1"}},
    {"schemaName":"STD24","value":{"STD_CODE":"2", "Version":"2", "RegNo":"2", "T_Code":"2", "TradeName":"2", "Item":"2", "Company":"2"}},
]
axios.defaults.baseURL = API;
async function runTest(){
    await axios.post('/users',register).then((data)=>{
            if(debug)console.log(data.data)
            console.log(">>>>Register Pass")
        }).catch((data)=>{
            console.log("XXXXXRegister Fail")
            console.log(data.response.data)
        });
    await axios.post('/authentication',login).then((data)=>{
            AUTH_TOKEN = data.data.accessToken
            console.log(">>>>login Pass")
            console.log(">>>>accessToken ",AUTH_TOKEN)
        }).catch((data)=>{
            console.log("XXXXXlogin Fail")
            console.log(data.response.data)
        });

    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    await axios.post('/versionControl/new-version',createVersion1).then((data)=>{
            console.log(">>>>createVersion1 Pass")
            uuidV1  = data.data.uuid
            console.log(">>>>uuidV1 ",uuidV1)
        }).catch((data)=>{
            console.log("XXXXXcreateVersion1 Fail")
            console.log(data.response.data)
        });
    for(let i =0;i<createSchema.length;i++){
        for(let j=0;j<createSchema[i].fieldName.length;j++){
            let request = {
                "versionUUID":uuidV1,
                "schemaName":createSchema[i].schemaName,
                "action":"create",
                "fieldName":createSchema[i].fieldName[j],
                "type":"varchar(250)"
            }
            await axios.post('/schema/',request).then((data)=>{

            }).catch((data)=>{
                console.log("XXXXXcreateschema Fail")
                console.log(data.response.data)
            });
        }
        console.log(`>>>>createschema ${createSchema[i].schemaName} Pass`)
    }
    console.log(`>>>>createschemaAll Pass`)
    if(!runall)name = readline.question("Continues?");
    let realData = "n"
    if(!runall)realData = readline.question("import real data(y/n)?");
    if(realData === 'y'){

    }else{
        for(let i =0;i<importTest.length;i++){
            let request = importTest[i]
            request.versionUUID = uuidV1
            await axios.post('/data/insert',request).then((data)=>{

            }).catch((data)=>{
                console.log("XXXXXimportTest data Fail")
                console.log(data.response.data)
            });
        }
        console.log(`>>>>importTest data  Pass`)
    }
    let resetAll = readline.question("resetAll data(y/n)?");
    if(resetAll ==='y'){
        await axios.post('/systemMange/reset',{}).then((data)=>{
            console.log(`>>>>reset Pass`)
        }).catch((data)=>{
            console.log("XXXXXreset Fail")
            console.log(data.response.data)
        });
    }
}
runTest()
console.log("Run test complete")