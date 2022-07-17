// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DB_CONNECTION)

export default function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body;
    const training = body.treino;
    const descricao = body.descricao;
    if (  training != undefined && descricao != undefined){
      connection.query('SELECT * FROM `Treinos` where nm_treinos = "'+training+'"', function(err, results, fields) {
        if(results.length === 0){
          connection.query('INSERT INTO `Treinos` (nm_treinos, ds_treinos) VALUES ("'+training+'", "' + descricao + '")', 
          function(err, results, fields) {
            if(err === null){
              res.status(200).json({ resultado: "OK" });
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
        }else{res.status(500).json({ resultado: "Treino já cadastrado" });}
  });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }

  }
  if (req.method === 'DELETE') {
    const body = req.body;
    const training = body.treino;
    if ( training != undefined){
      connection.query(
        'Delete FROM `Treinos` where nm_treinos = "'+training+'"',
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
    const training = body.treino;
    if (training != undefined){
      connection.query(
        'SELECT * FROM `Treinos` where nm_treinos = "'+ training + '"',
        function(err, results, fields) {
          if (results.length > 0 ){
            res.status(200).json({ resultado: results })
          }else{
            res.status(500).json({ resultado: "treino não encontrado" })
          }
          });
    }else{
      connection.query(
        'SELECT * FROM `Treinos`',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })});
    }
  }


  


  
  
 
}
