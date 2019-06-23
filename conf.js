//configuration des paramètres de connection à la base de données

const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : ' ',
    database : 'travels'
});
module.exports = connection;