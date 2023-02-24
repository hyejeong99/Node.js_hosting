var mysql = require('mysql');
// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'tkfkdgo09013',
//     database: 'login_dataset'
// });
var db = mysql.createConnection({
    host: 'uws7-wpm-028.cafe24.com',
    user: 'withtaylors',
    password: 'Sytechnology',
    database: 'withtaylors'
});
db.connect();

module.exports = db;