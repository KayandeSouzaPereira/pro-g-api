// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mysql = require('mysql2');
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const host = process.env.DB_HOST

const connection = mysql.createPool({
    user: dbUsername,
    host: host,
    password: dbPassword,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    database: "pro_g",
});

export default function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body;
    const usuario = body.usuario;
    const exercicio = body.exercicio;
    const peso = body.peso;
    const repeticoes = body.repeticoes;
    var data = new Date();
    data = data.toISOString().slice(0, 19).replace('T', ' ');
    const obsevacao = body.obsevacao;
    if (  usuario != undefined && usuario != undefined){
      connection.query('SELECT * FROM `Registro_exercicio` where usuario = "'+usuario+'" AND exercicio= "'+exercicio+'" AND DATEDIFF(data, "'+data+'") = "0"', 
      function(err, results, fields) {
        if(results.length === 0){
          connection.query('INSERT INTO `Registro_exercicio` (usuario, exercicio, peso, data, repeticoes, observacao) VALUES ("'+usuario+'", "' + exercicio + '", "'+peso+'", "' +data+'", "'+repeticoes+'", "' +obsevacao+ '")', 
          function(err, results, fields) {
            if(err === null){
              res.status(200).json({ resultado: "OK" });
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
        }else{res.status(500).json({ resultado: "Já existe registro para este exercício e usuário nas ultimas 24 horas, remova o registro ou atualize ele no proxímo treino." });}
  });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }

  }
  if (req.method === 'DELETE') {
    const body = req.body;
    const usuario = body.usuario;
    if ( usuario != undefined){
      connection.query(
        'Delete FROM `Registro_exercicio` where usuario = "'+usuario+'"',
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
    const usuario = body.usuario;
    if (usuario != undefined){
      connection.query(
        'SELECT * FROM `Registro_exercicio` where usuario = "'+ usuario + '"',
        function(err, results, fields) {
          if (results != undefined ){
            res.status(200).json({ resultado: results })
          }else{
            res.status(500).json({ resultado: "registro não encontrado" })
          }
          });
    }else{
      connection.query(
        'SELECT * FROM `Registro_exercicio`',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })});
    }
  }


  


  
  
 
}
