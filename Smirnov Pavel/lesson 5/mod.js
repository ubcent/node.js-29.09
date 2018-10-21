const mysql = require("mysql");

class DB {
    constructor(){
        this.connectionStatus = false;
        this.connection = "";
    }
    start(){
        if(!this.connectionStatus){
            this.connection = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : 'gfif1991',
                database : 'todolist'
            });
            this.connectionStatus = true;
        }
        this.connection.connect();
    }
    get(){
        return new Promise((resolve, reject)=>{
            this.connection.query('SELECT * FROM todolist', (err, result, fuilds) =>{
                resolve(result);
            })
        })
    }
    insert(data){
        return new Promise((resolve, reject)=>{
            this.connection.query('INSERT INTO `todolist` (`post`) VALUES(?)', data, (err, result, fuilds)=>{
                console.log(err);
                console.log(result);
                resolve(result);
            })
        })
    }
    end(){
        if(this.connectionStatus){
            this.connectionStatus = false;
            this.connection.end();
        }
    }
}
module.exports = new DB;