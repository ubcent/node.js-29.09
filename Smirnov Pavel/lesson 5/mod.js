const mysql = require("mysql");

class DB {
    constructor(){
        this.pool = mysql.createPool({
            connectionLimit : 10,
            host     : 'localhost',
            user     : 'root',
            password : 'gfif1991',
            database : 'todolist'
        });
    }
    getUser(obj){
        return new Promise((resolve, reject)=>{
            this.pool.getConnection((err, connection)=>{
                if(err) throw err;
                connection.query('Select * from todolistauth where username = ? and password = ?', [obj.username, obj.password], (error, results, fields)=>{
                    connection.release();
                    if(error) throw error;
                    resolve(results);
                })
            })
        })
    }
    get(){
        return new Promise((resolve, reject)=>{
            this.pool.getConnection((err, connection)=>{
                if(err) throw err;
                connection.query('Select * from todolist', (error, results, fields)=>{
                    connection.release();
                    if(error) throw error;
                    resolve(results);
                })
            })
        })
    }
    insert(data){
        return new Promise((resolve, reject)=>{
            this.pool.getConnection((err, connection)=>{
                if(err) throw err;
                connection.query('INSERT INTO `todolist` (`post`) VALUES(?)', data, (error, results, fields)=>{
                    connection.release();
                    if(error) throw error;
                    resolve(results);
                })
            })
        })
    }
    update(data){
        return new Promise((resolve, reject)=>{
            this.pool.getConnection((err, connection)=>{
                if(err) throw err;
                connection.query('UPDATE `todolist` SET `post`=? WHERE id=?', [data.text, data.idPost], (error, results, fields)=>{
                    connection.release();
                    if(error) throw error;
                    resolve(results);
                })
            })
        })
    }
    delete(data){
        return new Promise((resolve, reject)=>{
            this.pool.getConnection((err, connection)=>{
                if(err) throw err;
                connection.query('DELETE FROM `todolist` WHERE id=?', data, (error, results, fields)=>{
                    connection.release();
                    if(error) throw error;
                    resolve(results);
                })
            })
        })
    }
}
module.exports = new DB;