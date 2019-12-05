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
let importTest3 = [
    {"schemaName":"SUB","value":{"FSN":"SUB0","SUBID":"1_test1"}},
    {"schemaName":"SUB","value":{"FSN":"SUB1","SUBID":"1_test2"}},
    {"schemaName":"SUB","value":{"FSN":"SUB2","SUBID":"1_test3"}},
    {"schemaName":"SUB","value":{"FSN":"SUB3","SUBID":"1_test4"}},
    {"schemaName":"SUB","value":{"FSN":"SUB4","SUBID":"1_test5"}},
    {"schemaName":"VTM","value":{"FSN":"VTM1","VTMID":"1_test6"}},
    {"schemaName":"VTM","value":{"FSN":"VTM2","VTMID":"2_test7"}},
    {"schemaName":"GP","value":{"FSN":"GP1","GPID":"1_test8"}},
    {"schemaName":"GPU","value":{"FSN":"GPU1","GPUID":"1_test9"}},
    {"schemaName":"GPU","value":{"FSN":"GPU2","GPUID":"2_test10"}},
    {"schemaName":"GP","value":{"FSN":"GP2","GPID":"2_test11"}},
    {"schemaName":"GPU","value":{"FSN":"GPU1","GPUID":"1_test12"}},
    {"schemaName":"GPU","value":{"FSN":"GPU2","GPUID":"2_test13"}},
    {"schemaName":"TP","value":{"FSN":"TP1","TPID":"1","MANUFACTURER":"1_test14"}},
    {"schemaName":"TPU","value":{"FSN":"TPU1","TPUID":"1","MANUFACTURER":"1_test15"}},
    {"schemaName":"TPU","value":{"FSN":"TPU2","TPUID":"2","MANUFACTURER":"2_test16"}},
    {"schemaName":"TP","value":{"FSN":"TP2","TPID":"2","MANUFACTURER":"2_test17"}},
    {"schemaName":"TPU","value":{"FSN":"TPU1","TPUID":"1","MANUFACTURER":"1_test18"}},
    {"schemaName":"TPU","value":{"FSN":"TPU2","TPUID":"2","MANUFACTURER":"2_test19"}},
    {"schemaName":"STD24","value":{"STD_CODE":"1", "Version":"1", "RegNo":"1", "T_Code":"1", "TradeName":"1", "Item":"1", "Company":"1_test20"}},
    {"schemaName":"STD24","value":{"STD_CODE":"2", "Version":"2", "RegNo":"2", "T_Code":"2", "TradeName":"2", "Item":"2", "Company":"2_test21"}},
    {"schemaName":"STD24","value":{"STD_CODE":"1", "Version":"1", "RegNo":"1", "T_Code":"1", "TradeName":"1", "Item":"1", "Company":"1_test22"}},
    {"schemaName":"STD24","value":{"STD_CODE":"2", "Version":"2", "RegNo":"2", "T_Code":"2", "TradeName":"2", "Item":"2", "Company":"2_test23"}},
]
let createDataLink3 =[
    [1,5],
    [2,5],
    [2,6],
    [3,6],
    [4,6],
    [5,7],
    [6,10],
    [7,8],
    [7,9],
    [10,11],
    [10,12],
    [7,13],
    [10,16],
    [13,14],
    [13,15],
    [16,17],
    [16,18],
    [13,19],
    [13,20],
    [16,21],
    [16,22]
]
axios.defaults.baseURL = API;
async function Run_register(){
    await axios.post('/users',register).then((data)=>{
        if(debug)console.log(data.data)
        console.log(">>>>Register Pass")
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXRegister Fail")
        console.log(data.response.data)
    });
}
async function Run_login(){
    await axios.post('/authentication',login).then((data)=>{
        AUTH_TOKEN = data.data.accessToken
        console.log(">>>>login Pass")
        console.log(">>>>accessToken ",AUTH_TOKEN)
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXlogin Fail")
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
        console.log("\x1b[31mXXXXXcreateVersion1 Fail")
        console.log(data.response.data)
    });

    await Validate_version({versionName:createVersion1.versionName ,uuid:uuidV1})
}
async function Validate_version(object){
    let {versionName,uuid,relation} = object
    await axios.get('/versionControl/get-version').then((data)=>{
        let respond  = data.data.result
        if(versionName !== undefined || uuid !== undefined){
            let findVersionNode = {}
            if(versionName !==undefined && uuid !== undefined){
                findVersionNode = respond.version.find(el=>{
                    return el.versionName === versionName && el.uuid === uuid
                })
            }else if(uuid === undefined){
                findVersionNode = respond.version.find(el=>{
                    return el.versionName === versionName
                })
            }else{
                findVersionNode = respond.version.find(el=>{
                    return el.uuid === uuid
                })
            }
            if(findVersionNode === undefined){
                console.log("\x1b[31mXXXXXValidate_version Fail")
            }else{
                console.log("\x1b[32mValidate_version Pass\x1b[0m")
            }
        }
        
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXget-version Fail")
        console.log(data.response.data)
    });
}
async function Run_createSchema(){
    for(let i =0;i<createSchema.length;i++){
        let field = []
        for(let j=0;j<createSchema[i].fieldName.length;j++){
            let request = {
                "versionUUID":uuidV1,
                "schemaName":createSchema[i].schemaName,
                "action":"create",
                "fieldName":createSchema[i].fieldName[j],
                "type":"varchar(1000)"
            }
            field.push({"fieldName":createSchema[i].fieldName[j],"type":"varchar(250)"})
            await axios.post('/schema/',request).then((data)=>{

            }).catch((data)=>{
                console.log("\x1b[31mXXXXXcreateschema Fail")
                console.log(data.response.data)
            });
        }
        console.log(`>>>>createschema ${createSchema[i].schemaName} Pass`)
        await Validate_Schema({versionUUID:uuidV1,schema:createSchema[i].schemaName,field})
    }
    console.log(`>>>>createschemaAll Pass`)
}
async function Validate_Schema(object){
    let {versionUUID,schemaName,field} = object
    await axios.get('/schema').then((data)=>{
        let respond  = data.data.result
        let findVersionNode = {}
        findVersionNode = respond.find(el=>{
            return el.versionUUID === versionUUID
        })
        if(findVersionNode === undefined){
            console.log("\x1b[31mXXXXXValidate_Schema Fail")
            console.log("no found")
        }else{
            if(field !== undefined && schemaName!== undefined){
                if (findVersionNode.schema[schemaName] === field){
                    console.log("\x1b[32mValidate_Schema Pass\x1b[0m")
                }else{
                    console.log("\x1b[31mXXXXXValidate_Schema Fail")
                    console.log(findVersionNode.schemaName)
                    console.log(field)
                    console.log("schema not match")
                }
            }else{
                console.log("\x1b[32mValidate_Schema Pass\x1b[0m")
            }
        } 
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXget-version Fail")
        console.log(data)
    });
}
async function Run_importTest(){
    for(let i =0;i<importTest.length;i++){
        let request = importTest[i]
        request.versionUUID = uuidV1
        await axios.post('/data/insert',request).then((data)=>{

        }).catch((data)=>{
            console.log("\x1b[31mXXXXXimportTest data Fail")
            console.log(data.response.data)
        });
    }
    console.log(`>>>>importTest data  Pass`)
}
async function Run_importTest3(){
    for(let i =0;i<importTest3.length;i++){
        let request = importTest3[i]
        request.versionUUID = uuidV3
        await axios.post('/data/insert',request).then((data)=>{

        }).catch((data)=>{
            console.log("\x1b[31mXXXXXimportTest3 data Fail")
            console.log(data.response.data)
        });
    }
    console.log(`>>>>importTest data  Pass`)
}
async function Run_TestSearch3(){
    if(uuidV3 === ''){
        uuidV3 = readline.question("uuidV3:");
    }
    for(let i =0;i<importTest3.length;i++){
        let request = {
            "schemaName":importTest3[i].schemaName,
            "versionUUID":uuidV3,
            "condition":importTest3[i].value
        }
        await axios.post('/data/search-data',request).then((data)=>{
            if(data.data.rows.length === 0 )throw data
            importTest3[i].uuid = data.data.rows[0]._uuid
        }).catch((data)=>{
            console.log("\x1b[31mXXXXXsearch-data Fail")
            console.log(request)
        });  
    }
    console.log(`>>>>TestSearch Pass`)

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
            console.log("\x1b[31mXXXXXmeta-link Fail")
            console.log(data.response.data)
        });
    }
    console.log(`>>>>create meta-link Pass`)

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
            console.log("\x1b[31mXXXXXsearch-data Fail")
            console.log(request)
        });  
    }
    console.log(`>>>>TestSearch Pass`)

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
            console.log("\x1b[31mXXXXXdata-link Fail")
            console.log(data.response.data)
            console.log(request)
        });  
    }
    console.log(`>>>>data-link Pass`)

}
async function Run_linkData3(){
    for(let i =0;i<createDataLink3.length;i++){
        let request = {
            "node1":importTest3[createDataLink3[i][0]].schemaName,
            "node2":importTest3[createDataLink3[i][1]].schemaName,
            "uuid1":importTest3[createDataLink3[i][0]].uuid,
            "uuid2":importTest3[createDataLink3[i][1]].uuid,
            "version":uuidV3
        }
        await axios.post('/link/data-link',request).then((data)=>{
            
        }).catch((data)=>{
            console.log("\x1b[31mXXXXXdata-link Fail")
            console.log(data.response.data)
            console.log(request)
        });  
    }
    console.log(`>>>>data-link Pass`)

}
async function Run_reset(){
    await axios.post('/systemMange/reset',{}).then((data)=>{
        console.log(`>>>>reset Pass`)
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXreset Fail")
        console.log(data.response.data)
    });
}
async function Run_createVersionNew(){
    const createVersion2 = {
        "versionName":`V0_test${random}`
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
        console.log("\x1b[31mXXXXXcreateVersion2 Fail")
        console.log(data.response.data)
    });
    await axios.post('/versionControl/new-version',createVersion3Ref).then((data)=>{
        console.log(">>>>createVersion3 Pass")
        uuidV3  = data.data.uuid
        console.log(">>>>uuidV3 ",uuidV3)
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXcreateVersion3 Fail")
        console.log(data.response.data)
    });
}
async function Run_insertConfirm(version){
    for(let i =0;i<importTest.length;i++){
        let request = importTest[i]
        request.versionUUID = version 
        await axios.post('/data/insert-confirm',request).then((data)=>{

        }).catch((data)=>{
            console.log("\x1b[31mXXXXXinsertConfirm data Fail")
            console.log(data.response.data)
        });
    }
    console.log(`>>>>insertConfirm data  Pass`)
}
async function Run_editData(){
    let request = {
        "versionUUID":uuidV3,
        "schemaName":"GP",
        "uuid":importTest[0].uuid,
        "data":{
            "FSN":"testEdit",
            "GPID":"testEdit"
        }
    }
    await axios.post('/data/edit-data',request).then((data)=>{

    }).catch((data)=>{
        console.log("\x1b[31mXXXXXedit-data Fail")
        console.log(data.response.data)
    });
    let requestSearch = {
        "schemaName":importTest[0].schemaName,
        "versionUUID":uuidV3,
        "condition":{
            _uuid:importTest[0].uuid
        }
    }
    await axios.post('/data/search-data',requestSearch).then((data)=>{
        if(data.data.rows[0].gpid === 'testEdit' && data.data.rows[0].fsn === 'testEdit'){
            console.log(">>>>edit-data pass")
        }else{
            console.log("\x1b[31mXXXXXedit-data Fail")
        }
        
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXsearch-data Fail")
        console.log(request)
    }); 

}
async function Run_deleteData(){
    let request ={
        "versionUUID":uuidV3,
        "schemaName":importTest[1].schemaName,
        "uuid":importTest[1].uuid
    }
    await axios.post('/data/delete-data',request).then((data)=>{

    }).catch((data)=>{
        console.log("\x1b[31mXXXXXdelete-data Fail")
        console.log(data.response.data)
    });
    let requestSearch = {
        "schemaName":importTest[1].schemaName,
        "versionUUID":uuidV3,
        "condition":{
            _uuid:importTest[1].uuid
        }
    }
    await axios.post('/data/search-data',requestSearch).then((data)=>{
        if(data.data.rows.length === 0){
            console.log(">>>>delete-data pass")
        }else{
            console.log("\x1b[31mXXXXXdelete-data Fail")
        }
    }).catch((data)=>{
        console.log("\x1b[31mXXXXXsearch-data Fail")
        console.log(request)
    }); 
}
async function runTest(){
    await Run_register()
    if(!runall)name = readline.question("Continues?");
    await Run_login()
    if(!runall)name = readline.question("Continues?");
    await Run_createVersion1()
    if(!runall)name = readline.question("Continues?");
    await Run_createSchema()    
    if(!runall)name = readline.question("Continues?");
    await Run_importTest(importTest,uuidV1)
    if(!runall)name = readline.question("Continues?");
    await Run_creatMetaLink()
    if(!runall)name = readline.question("Continues?");
    await Run_TestSearch()
    if(!runall)name = readline.question("Continues?");
    await Run_linkData()
    if(!runall)name = readline.question("Continues?");
    await Run_createVersionNew()
    if(!runall)name = readline.question("Continues?");
    await Run_insertConfirm(uuidV1)
    if(!runall)name = readline.question("Continues?");
    await Run_insertConfirm(uuidV3)
    if(!runall)name = readline.question("Continues?");
    await Run_editData()
    if(!runall)name = readline.question("Continues?");
    await Run_deleteData()
    if(!runall)name = readline.question("Continues?");
    await Run_importTest3()
    await Run_TestSearch3()
    await Run_linkData3()
/////////////////////////////////////////////////////////////////////////////
    if(readline.question("resetAll data(y/n)?") ==='y'){
        await Run_reset()
    }

    
}
runTest()
console.log("Run test complete")