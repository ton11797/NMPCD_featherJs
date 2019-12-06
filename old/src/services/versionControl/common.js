import neo4jDB from '../../DAL/neo4j'
export default class{
    notEmply(key){
        if(key === undefined || key === null)return false
        return true
    }
    async getUUID(versionName){
        let neo = await this.app.get('neo4jDB')
        return await neo.run(`MATCH (n:version {versionName:'${versionName}'}) RETURN n`)
    }
    async getNode(uuid){
        let neo = await this.app.get('neo4jDB')
        return await neo.run(`MATCH (n:version {uuid:'${uuid}'}) RETURN n`)
    }
}