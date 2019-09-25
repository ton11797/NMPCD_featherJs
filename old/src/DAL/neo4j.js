import neo4j from 'neo4j-driver';
export default class {
    constructor(){
        this.tx = null
        try {
            const db_config = app.get('neo4j');
            console.log(db_config)
            this.DB = neo4j.driver(db_config.neo4j.connection, neo4j.auth.basic(db_config.neo4j.username, db_config.neo4j.password),{maxTransactionRetryTime: 30000});
            this.session = this.DB.session();
            this.connected = true
        } catch (error) {
            console.error(error)
        }
    }
    setMaxTransactionRetryTime(maxTime){
        this.DB = neo4j.driver(db_config.neo4j.connection, neo4j.auth.basic(db_config.neo4j.username, db_config.neo4j.password),{maxTransactionRetryTime: maxTime});
    }
    //Auto-commit Transactions Cypher statements
    Session_commit(statement,parameter){
        return new Promise((resolve, reject) => {
            this.session
            .run(statement,parameter)
            .then( (result) =>{
                this.session.close();
                resolve(result)
            })
            .catch( (error) =>{
                console.log(error);
                reject(error)
            });
        })
    }
    //Auto-commit read Transactions 
    readTx(statement){
        return new Promise((resolve, reject) => {
            let readTxResultPromise = this.session.readTransaction( (transaction) =>{
            var result = transaction.run(statement);
                return result;
            }).then( (result)=> {
                this.session.close();
                resolve(result)
            }).catch( (error) =>{
                console.log(error);
                reject(error)
            });
        })
    }
    writeTx(statement){
        return new Promise((resolve, reject) => {
            var writeTxResultPromise = this.session.writeTransaction( (transaction) =>{
                var result = transaction.run(statement);
                return result
            }).then( (result) =>{
                this.session.close();
                resolve(result)
            }).catch( (error) =>{
                console.log(error);
                reject(error)
            });
        })
    }
    Close () {
        return new Promise((resolve, reject) => {
            this.DB.close((err)=>{
                if (err) reject(err)
                this.connected = false
                resolve(result)
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
    runTransaction(statement,parameter){
        return new Promise((resolve, reject) => {
            this.tx.run(statement,parameter).subscribe({
                onNext:  (record) =>{
                    resolve(record);
                  },
                  onCompleted:  () =>{
                    console.log(statement + ' completed');
                  },
                  onError:  (error) =>{
                    reject(error);
                  }
            });
        })
    }
    commit(){
        return new Promise((resolve, reject) => {
            this.tx.commit().subscribe({
                onCompleted:  () =>{
                  this.session.close();
                  resolve(true);
                },
                onError:  (error) =>{
                    reject(error);
                }
              });
        })
    }
    rollback(){
        return new Promise((resolve, reject) => {
            this.tx.rollback((err)=>{
                if (err) reject(err)
                resolve(true)
            })
        })
    }
}