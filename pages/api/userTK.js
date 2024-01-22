const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);
const security = require('./services/security');

export default function handler(req, res) {

  security.checkSec(req, res);

  if (req.method === 'GET') {
    const Tk = req.headers['authorization'].substring(7);
    connection.query(
      'SELECT idAuth, user FROM `Auth` WHERE token = "'+Tk+'" AND TIMEDIFF(now(), data_token) < "20:00:00"',
      function(err, results, fields) {
          if (results.length > 0){
             res.status(200).json({retorno: results[0]})
          } else {
            updateIpBrute(ip);
            res.status(403).json({ retorno: "Token Invalido"})
          }
      });
  }


  


  
  
 
}
