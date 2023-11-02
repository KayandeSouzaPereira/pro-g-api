const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);


exports.checkSec = (req, res) => {
    function validaTk(Tk){
        connection.query(
            'SELECT * FROM `Auth` WHERE token = "'+Tk+'" AND TIMEDIFF(now(), data_token) < "20:00:00"',
            function(err, results, fields) {
                console.log(err);
                if (results != undefined){
                    return true;
                } else {
                  updateIpBrute(ip);
                  res.status(403).json({ retorno: "Token Invalido"})
                }
            });
      }
      function checkBrute(ip){
        let query = 'SELECT tentativas FROM `brute_force` WHERE ip = "'+ip+'"';
        connection.query(query,
        function(err, results, fields) {
            if(results != undefined){
                if(results[0].tentativas > 20){
                  res.status(403).json({ Alerta: "IP BLOQUEADO" });
              }else{
                  return false;
              }
            }
          }
        )
      }
      function updateIpBrute(ip){
          connection.query(
              'SELECT tentativas FROM `brute_force` WHERE ip = "'+ip+'"',
              function(err, results, fields) {
                  if (results != undefined){
                      let nValue = results[0].tentativas + 1;
                      connection.query('Update `brute_force` set tentativas='+ nValue + ' where ip = "' +ip+'"');
                  } else {
                      connection.query('INSERT into `brute_force` (ip, tentativas) values ("'+ip+'", '+1+')')
                  }
              });
      }
    
      const token = req.headers['authorization'];
      if (token == undefined ) {
        var ip = req.headers['x-forwarded-for'] ||req.socket.remoteAddress ||null;
        checkBrute(ip)
        updateIpBrute(ip);
      }else{
        checkBrute(ip)
        validaTk(token.substring(7));
      } 
}