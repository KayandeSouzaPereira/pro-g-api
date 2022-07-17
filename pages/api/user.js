const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

export default function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body;
    const user = body.usuario;
    if (  user != undefined ){
      connection.query('SELECT * FROM `User` where UserNm = "'+user+'"', function(err, results, fields) {
        if(results.length === 0){
          connection.query('INSERT INTO `User` (UserNm) VALUES ("'+user+'")', 
          function(err, results, fields) {
            if(err === null){
              res.status(200).json({ resultado: "OK" });
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
        }else{res.status(500).json({ resultado: "Usuário já cadastrado" });}
  });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }

  }
  if (req.method === 'DELETE') {
    const body = req.body;
    const user = body.usuario;
    if ( user !=  undefined){
      connection.query(
        'Delete FROM `User` where UserNm ="' + user + '"',
        function(err, results, fields) {
          if(err === undefined){
            res.status(200).json({ resultado: "OK" });
          }
          else{
            res.status(500).json({ resultado: "Erro" });
          }
        });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }
  }
  if (req.method === 'GET') {
    const body = req.body;
    const user = body.usuario;
    if (user != undefined){
      connection.query(
        'SELECT * FROM `User` where userNm = "'+ user + '"',
        function(err, results, fields) {
          if (results.length > 0 ){
            res.status(200).json({ resultado: results })
          }else{
            res.status(500).json({ resultado: "usuario não encontrado" })
          }
          });
    }else{
      connection.query(
        'SELECT * FROM `User`',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })});
    }
  }


  


  
  
 
}
