import neo4j from 'neo4j-driver';
import app from '../app';

export default class {
    DB:any
    session:any
    connected:any
    tx:any
    debug:boolean
    constructor(){
        this.tx = null
        this.debug =false
        try {
            const db_config = {neo4j:app.get('neo4j')};
            this.DB = neo4j.driver(db_config.neo4j.connection, neo4j.auth.basic(db_config.neo4j.username, db_config.neo4j.password),{maxTransactionRetryTime: 30000});
            this.session = this.DB.session();
            this.connected = true
        } catch (error) {
            console.error(error)
        }
    }
    setMaxTransactionRetryTime(maxTime:number){
        const db_config = {neo4j:app.get('neo4j')};
        this.DB = neo4j.driver(db_config.neo4j.connection, neo4j.auth.basic(db_config.neo4j.username, db_config.neo4j.password),{maxTransactionRetryTime: maxTime});
    }
    //Auto-commit Transactions Cypher statements
    Session_commit(statement:string,parameter?:object){
        console.log(statement)
        return new Promise((resolve, reject) => {
            if(this.debug)console.log(statement)
            this.session
            .run(statement,parameter)
            .then( (result:object) =>{
                this.session.close();
                if(this.debug)console.log(result)
                resolve(result)
            })
            .catch( (error:string) =>{
                console.log(error);
                reject(error)
            });
        })
    }
    //Auto-commit read Transactions 
    readTx(statement:string){
        return new Promise((resolve, reject) => {
            let readTxResultPromise = this.session.readTransaction( (transaction:any) =>{
            var result = transaction.run(statement);
                return result;
            }).then( (result:object)=> {
                this.session.close();
                resolve(result)
            }).catch( (error:any) =>{
                console.log(error);
                reject(error)
            });
        })
    }
    writeTx(statement:string){
        return new Promise((resolve, reject) => {
            var writeTxResultPromise = this.session.writeTransaction( (transaction:any) =>{
                var result = transaction.run(statement);
                return result
            }).then( (result:any) =>{
                this.session.close();
                resolve(result)
            }).catch( (error:any) =>{
                console.log(error);
                reject(error)
            });
        })
    }
    Close () {
        return new Promise((resolve, reject) => {
            this.DB.close((err:any)=>{
                if (err) reject(err)
                this.connected = false
                resolve(true)
            })
        })
    }
    beginTransaction(){
        if(this.tx === null){
            this.tx = this.session.beginTransaction();
            return true
        }else{
            return false
        }
        
    }
    runTransaction(statement:string,parameter:object){
        return new Promise((resolve, reject) => {
            this.tx.run(statement,parameter).subscribe({
                onNext:  (record:object) =>{
                    resolve(record);
                  },
                  onCompleted:  () =>{
                    // console.log(statement + ' completed');
                  },
                  onError:  (error:string) =>{
                    reject(error);
                  }
            });
        })
    }
    commit(){
        // console.log("commit")
        return new Promise((resolve, reject) => {
            this.tx.commit().subscribe({
                onCompleted:  () =>{
                    // console.log("onCompleted")
                  this.session.close();
                  resolve(true);
                },
                onError:  (error:string) =>{
                    console.log("onError")
                    reject(error);
                }
              });
        })
    }
    rollback(){
        return new Promise((resolve, reject) => {
            this.tx.rollback((err:string)=>{
                if (err) reject(err)
                resolve(true)
            })
        })
    }
}