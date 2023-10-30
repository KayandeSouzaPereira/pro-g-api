const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

export default function handler(req, res) {

  function validaTk(Tk){
    connection.query(
        'SELECT * FROM `Auth` WHERE token = "'+Tk+'" AND TIMEDIFF(now(), data_token) < "20:00:00"',
        function(err, results, fields) {
            console.log(err);
            if (results.length > 0){
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
        if(results[0]){
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
              if (results.length > 0){
                  let nValue = results[0].tentativas + 1;
                  connection.query('Update `brute_force` set tentativas='+ nValue + ' where ip = "' +ip+'"');
              } else {
                  connection.query('INSERT into `brute_force` (ip, tentativas) values ("'+ip+'", '+1+')')
              }
          });
  }

  const token = req.headers['authorization'];
  console.log(token);
  if (token == undefined ) {
    var ip = req.headers['x-forwarded-for'] ||req.socket.remoteAddress ||null;
    checkBrute(ip)
    updateIpBrute(ip);
  }else{
    checkBrute(ip)
    validaTk(token.substring(7));
  } 


 
  
  if (req.method === 'POST') {
    const body = req.body;
    const usuario = body.usuario;
    const altura = body.altura;
    const peso = body.peso;
    const idade = body.idade;

   
    if (  usuario != undefined && altura != undefined && peso != undefined && idade != undefined){
      
      connection.query('SELECT * FROM `Info_User` where id_user = "'+usuario+'"', function(err, results, fields) {
        console.log(results);
        if(results.length === 0){
          
          connection.query('INSERT INTO `Info_User` (id_user, Altura, Peso, Idade) VALUES ("'+usuario+'", "'+altura+'", "'+peso+'", "'+idade+'")', 
          function(err, results, fields) {
            if(err === null){
              res.status(200).json({ resultado: "OK" });
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
        }else{
          connection.query('update `Info_User` set Altura = "'+altura+'", Peso = '+peso+', Idade = '+idade+' WHERE id_user = '+usuario+'', 
          function(err, results, fields) {
            if(err === null){
              res.status(200).json({ resultado: "OK" });
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
        }
  });
    } else {
      if (usuario != undefined) {
        console.log("check")
        connection.query(
          'SELECT * FROM `Info_User` where id_user = "'+ usuario + '"',
          function(err, results, fields) {
            if (results.length > 0 ){
              res.status(200).json({ resultado: results })
            }else{
              res.status(500).json({ resultado: "informações não encontradadas" })
            }
            });
      }
      
    }

  }
  if (req.method === 'DELETE') {
    const body = req.body;
    const usuario = body.user;
    if ( training != undefined){
      connection.query(
        'Delete FROM `Info_User` where id_user = "'+usuario+'"',
        function(err, results, fields) {
          if(err === null){
            res.status(200).json({ resultado: "OK" });
          }
          else{
            res.status(500).json({ resultado: err });
          }
        });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }
  }
  if (req.method === 'GET') {
    const body = req.body;
    
      connection.query(
        'SELECT * FROM `Info_User`',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })});
    
  }


  


  
  
 
}
