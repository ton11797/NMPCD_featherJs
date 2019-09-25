import neo4jDB from '../../DAL/neo4j'
export default class{
    notEmply(key){
        if(key === undefined || key === null)return false
        return true
    }
    async getUUID(versionName){
        let neo = new neo4jDB()
        return await neo.Session_commit(`MATCH (n:version {versionName:'${versionName}'}) RETURN n`)
    }
    async getNode(uuid){
        let neo = new neo4jDB()
        return await neo.Session_commit(`MATCH (n:version {uuid:'${uuid}'}) RETURN n`)
    }
}