import { Application } from '../declarations';
// const logger = require('./logger');
class debug {
    level:number
    constructor(app: Application){
        this.level = app.get('debugLevel')
        console.log("\x1b[32mDebugging_level \x1b[0m",this.level )
    }
    logging(level:number,tag:String,msg:string){
        let mainTag = ""
        //0-3 4-7 8-11 12-15
        if(level<4){
            mainTag = "[\x1b[34mINFO\x1b[0m]"
        }else if(level <8){
            mainTag = "[\x1b[33mWARNING\x1b[0m]"
        }else if(level <11){
            mainTag = "[\x1b[31mDEBUGGING\x1b[0m]"
        }else{
            mainTag = `[\x1b[31mDEBUGGING_${level}\x1b[0m]`
        }
        if(level<this.level){
            console.log(`${mainTag}[${tag}]${new Date().toLocaleString()}:${msg}`)
        }
    }
}
export default function (app: Application) {
    const ob = new debug(app)
    app.set('debug', ob);
}
