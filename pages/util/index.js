const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

class Util {
    validaTk(Tk, ip){
        connection.query(
            'SELECT * FROM `Auth` WHERE token = "'+token+'" AND user = "'+user+'" AND TIMEDIFF(now(), data_token) < "20:00:00"',
            function(err, results, fields) {
                console.log(err);
                if (results.length > 0){
                    res.status(200).json({ retorno: "Token Confirmado com sucesso"})
                } else {
                    
                }
            });
    }

    checkBrute(ip){
        connection.query('SELECT * FROM `brute_force` WHERE ip = "'+ip+'" and tentativas > '+20+'',
        function(err, results, fields) {
            if(results > 0){
                return true;
            }else{
                return false;
            }
        }
        )
    }

    updateIpBrute(ip){
        connection.query(
            'SELECT tentativas FROM `brute_force` WHERE ip = "'+ip+'"',
            function(err, results, fields) {
                console.log(results);
                if (results.length > 0){
                    let nValue = result + 1;
                    connection.query('Update `brute_force` set tentativas='+ nValue + ' where ip = "' +ip+'"');
                } else {
                    connection.query('INSERT into `brute_force` (ip, tentativas) values ("'+ip+'", '+1+')')
                }
            });
    }
}

module.exports = Util;