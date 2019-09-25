import neo4jDB from '../../DAL/neo4j'
export default class{
    notEmply(key:any){
        if(key === undefined || key === null)return false
        return true
    }
    async getUUID(versionName:string):Promise<any>{
        let neo = new neo4jDB()
        return await neo.Session_commit(`MATCH (n:version {versionName:'${versionName}'}) RETURN n`,{})
    }
    async getNode(uuid:string):Promise<any>{
        let neo = new neo4jDB()
        console.log("in")
        return await neo.Session_commit(`MATCH (n:version {uuid:'${uuid}'}) RETURN n`,{})
    }
}