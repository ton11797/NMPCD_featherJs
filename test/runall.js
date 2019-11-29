const axios = require('axios')
const readline = require('readline-sync');
const API = "http://127.0.0.1:3030"
const debug = false
const runall = false
const random = Math.floor((Math.random() * 1000) + 1);
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
let uuidV2 = ""
let uuidV3 = ""

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

let creatMetaLink = [
    ["SUB","VTM"],
    ["VTM","GP"],
    ["GP","GPU"],
    ["GP","TP"],
    ["TP","TPU"],
    ["TP","STD24"],
]

let createDataLink =[
    [0,2] ,
    [1,3] ,
    [4,6] ,
    [5,7] ,
    [8,10] ,
    [9,11] ,
    [4,12],
    [5,13],
    [0,4] ,
    [1,5],
    [10,0],
    [11,1]
]
axios.defaults.baseURL = API;
async function Run_register(){
    await axios.post('/users',register).then((data)=>{
        if(debug)console.log(data.data)
        console.log(">>>>Register Pass")
    }).catch((data)=>{
        console.log("XXXXXRegister Fail")
        console.log(data.response.data)
    });
}
async function Run_login(){
    await axios.post('/authentication',login).then((data)=>{
        AUTH_TOKEN = data.data.accessToken
        console.log(">>>>login Pass")
        console.log(">>>>accessToken ",AUTH_TOKEN)
    }).catch((data)=>{
        console.log("XXXXXlogin Fail")
        console.log(data.response.data)
    });
    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
}
async function Run_createVersion1(){
    await axios.post('/versionControl/new-version',createVersion1).then((data)=>{
        console.log(">>>>createVersion1 Pass")
        uuidV1  = data.data.uuid
        console.log(">>>>uuidV1 ",uuidV1)
    }).catch((data)=>{
        console.log("XXXXXcreateVersion1 Fail")
        console.log(data.response.data)
    });
}
async function Run_createSchema(){
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
}
async function Run_importTest(){
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
async function Run_creatMetaLink(){
    for(let i =0;i<creatMetaLink.length;i++){
        let request = {
            "node1":creatMetaLink[i][0],
            "node2":creatMetaLink[i][1],
            "version":uuidV1
        }
        await axios.post('/link/meta-link',request).then((data)=>{

        }).catch((data)=>{
            console.log("XXXXXmeta-link Fail")
            console.log(data.response.data)
        });
    }
}
async function Run_TestSearch(){
    if(uuidV1 === ''){
        uuidV1 = readline.question("uuidV1:");
    }
    for(let i =0;i<importTest.length;i++){
        let request = {
            "schemaName":importTest[i].schemaName,
            "versionUUID":uuidV1,
            "condition":importTest[i].value
        }
        await axios.post('/data/search-data',request).then((data)=>{
            if(data.data.rows.length === 0 )throw data
            importTest[i].uuid = data.data.rows[0]._uuid
        }).catch((data)=>{
            console.log("XXXXXsearch-data Fail")
            console.log(request)
        });  
    }
}
async function Run_linkData(){
    for(let i =0;i<createDataLink.length;i++){
        let request = {
            "node1":importTest[createDataLink[i][0]].schemaName,
            "node2":importTest[createDataLink[i][1]].schemaName,
            "uuid1":importTest[createDataLink[i][0]].uuid,
            "uuid2":importTest[createDataLink[i][1]].uuid,
            "version":uuidV1
        }
        await axios.post('/link/data-link',request).then((data)=>{
            
        }).catch((data)=>{
            console.log("XXXXXdata-link Fail")
            console.log(data.response.data)
            console.log(request)
        });  
    }
}
async function Run_reset(){
    await axios.post('/systemMange/reset',{}).then((data)=>{
        console.log(`>>>>reset Pass`)
    }).catch((data)=>{
        console.log("XXXXXreset Fail")
        console.log(data.response.data)
    });
}
async function Run_createVersionNew(){
    const createVersion2 = {
        "versionName":`V2_test${random}`
    }
    const createVersion3Ref = {
        "versionName":`V2_testRef${random}`,
        "refVersion":uuidV1
    }
    await axios.post('/versionControl/new-version',createVersion2).then((data)=>{
        console.log(">>>>createVersion2 Pass")
        uuidV2  = data.data.uuid
        console.log(">>>>uuidV2 ",uuidV2)
    }).catch((data)=>{
        console.log("XXXXXcreateVersion2 Fail")
        console.log(data.response.data)
    });
    await axios.post('/versionControl/new-version',createVersion3Ref).then((data)=>{
        console.log(">>>>createVersion3 Pass")
        uuidV3  = data.data.uuid
        console.log(">>>>uuidV3 ",uuidV3)
    }).catch((data)=>{
        console.log("XXXXXcreateVersion3 Fail")
        console.log(data.response.data)
    });
}
async function Run_insertConfirm(version){
    for(let i =0;i<importTest.length;i++){
        let request = importTest[i]
        request.versionUUID = version 
        await axios.post('/data/insert-confirm',request).then((data)=>{

        }).catch((data)=>{
            console.log("XXXXXinsertConfirm data Fail")
            console.log(data.response.data)
        });
    }
    console.log(`>>>>insertConfirm data  Pass`)
}
async function runTest(){
    await Run_register()
    await Run_login()
    await Run_createVersion1()
    await Run_createSchema()    
    if(!runall)name = readline.question("Continues?");
    await Run_importTest()
    await Run_creatMetaLink()
    await Run_TestSearch()
    await Run_linkData()
    if(!runall)name = readline.question("Continues?");
    await Run_createVersionNew()
    await Run_insertConfirm(uuidV1)
    await Run_insertConfirm(uuidV3)
/////////////////////////////////////////////////////////////////////////////
    if(readline.question("resetAll data(y/n)?") ==='y'){
        await Run_reset()
    }

    
}
runTest()
console.log("Run test complete")