const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

export default function handler(req, res) {

  const token = req.headers['authorization'];


  if (token == undefined ) {
    console.log("TESTE");
    var ip = req.headers['x-forwarded-for'] ||req.socket.remoteAddress ||null;
    Util.checkBrute(ip);
    res.status(403).json({ Alerta: "Acesso Invalido" });
   

  }else{
    console.log("TESTE");
  }

  
  if (req.method === 'POST') {
    const body = req.body;
    const usuario = body.user;
    const altura = body.altura;
    const peso = body.peso;
    const idade = body.idade;

    if (  usuario != undefined && altura != undefined && peso != undefined && idade != undefined){
      connection.query('SELECT * FROM `Info_User` where user = "'+usuario+'"', function(err, results, fields) {
        if(results.length === 0){
          connection.query('INSERT INTO `Info_User` (user, Altura, Peso, Idade) VALUES ("'+usuario+'", "'+altura+'", "'+peso+'", "'+idade+'")', 
          function(err, results, fields) {
            if(err === null){
              res.status(200).json({ resultado: "OK" });
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
        }else{res.status(500).json({ resultado: "Informações já cadastradadas" });}
  });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }

  }
  if (req.method === 'DELETE') {
    const body = req.body;
    const usuario = body.user;
    if ( training != undefined){
      connection.query(
        'Delete FROM `Info_User` where user = "'+usuario+'"',
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
    const usuario = body.user;
    if (usuario != undefined){
      connection.query(
        'SELECT * FROM `Info_User` where user = "'+ usuario + '"',
        function(err, results, fields) {
          if (results.length > 0 ){
            res.status(200).json({ resultado: results })
          }else{
            res.status(500).json({ resultado: "informações não encontradadas" })
          }
          });
    }else{
      connection.query(
        'SELECT * FROM `Info_User`',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })});
    }
  }


  


  
  
 
}
