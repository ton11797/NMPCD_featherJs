import app from '../app';
export default class{
    async schemaList(versionUUID:string){
        return await app.get('mongoClient').collection("Schema").findOne({versionUUID})
    }
}