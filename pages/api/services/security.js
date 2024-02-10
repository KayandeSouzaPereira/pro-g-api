const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.checkTKSet = (user, req) => {
  function updateIpBrute(ip){
    connection.query(
        'SELECT tentativas FROM `brute_force` WHERE ip = "'+ip+'"',
        function(err, results, fields) {
            if (results != undefined){
                let nValue = results[0].tentativas + 1;
                connection.execute('Update `brute_force` set tentativas='+ nValue + ' where ip = "' +ip+ '"');
            } else {
                connection.execute('INSERT into `brute_force` (ip, tentativas) values ("'+ip+'", '+1+')')
            }
        });
}

  function resetIpBrute(ip){
    connection.execute('Update `brute_force` set tentativas='+ 0 + ' where ip = "' +ip+'"');
  }

  const TK = req.headers['authorization'];
  var ip = req.headers['x-forwarded-for'] ||req.socket.remoteAddress ||null;
    connection.query(
      'SELECT * FROM `Auth` WHERE token = "'+TK+'" AND user = "'+user+'" AND TIMEDIFF(now(), data_token) < "20:00:00"',
      function(err, results, fields) {
          if (results.length > 0){
              resetIpBrute(ip);
              return true
          } else {
            updateIpBrute(ip)
            return false
          }
      });
}

exports.resetAtaque = async () => {
  try {
    const sql = 'Update `brute_force` set tentativas= 0 where ip = "186.220.37.208"';
  
    const [result, fields] = await connection.execute(sql);
  
    console.log(result);
    console.log(fields);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

exports.checkSec = (req, res) => {

    const token = req.headers['authorization'];
    if (token == undefined ) {
      var ip = req.headers['x-forwarded-for'] ||req.socket.remoteAddress ||null;
      checkBrute(ip)
      updateIpBrute(ip);
    }else if(token != undefined){
        validaTk(token.substring(7), ip);
    }


    function validaTk(Tk, ip){
        connection.query(
            'SELECT * FROM `Auth` WHERE token = "'+Tk+'" AND TIMEDIFF(now(), data_token) < "20:00:00"',
            function(err, results, fields) {
                if (results != undefined){
                    resetIpBrute(ip)
                    return true;
                } else {
                  updateIpBrute(ip);
                  return res.status(403).json({ retorno: "Token Invalido"})
                }
            });
      }
      
      function checkBrute(ip){
        let query = 'SELECT tentativas FROM `brute_force` WHERE ip = ? ';
        connection.query(query, [ip],
        function(err, results, fields) {
            if(results != undefined){
                if(results[0].tentativas > 20){
                  return res.status(403).json({ Alerta: "IP BLOQUEADO" });
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
                      connection.execute('Update `brute_force` set tentativas='+ nValue + ' where ip = "' +ip + '"');
                  } else {
                      connection.execute('INSERT into `brute_force` (ip, tentativas) values ('+ip+', '+1+')')
                  }
              });
      }
      
      function resetIpBrute(ip){
        connection.execute('Update `brute_force` set tentativas='+ 0 + ' where ip = "' +ip+'"');
       }
    
     
}