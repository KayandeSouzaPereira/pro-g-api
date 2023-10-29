// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DB_CONNECTION)


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
    const exercicio = body.exercicie;
    const descricao = body.descricao;
    const link = body.link;
    const treino = body.treino;

   

    if (  exercicio != undefined && descricao != undefined){
      connection.query('SELECT * FROM `Exercicios` where nm_exercicios = "'+exercicio+'"', function(err, results, fields) {
        if(results.length === 0){
          connection.query('INSERT INTO `Exercicios` (nm_exercicios, ds_exercicio, link_execicio) VALUES ("'+exercicio+'", "' + descricao + '","' + link + '")', 
          function(err, results, fields) {
            console.log(results)
            if(err === null){
              console.log(treino);
              if(treino != undefined){
                connection.query('INSERT INTO `Treino_exercicio` (treino, exercicio) values ("'+treino+'", "'+results.insertId+'")',
                function (err, results, fields){
                  res.status(200).json({ resultado: "Exercício inserido com treino" });
                });
              }else{
                res.status(200).json({ resultado: "Exercício inserido sem treino" });
              }
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
        }else{res.status(500).json({ resultado: "Exercício já cadastrado" });}
  });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }

  }
  if (req.method === 'DELETE') {
    const body = req.body;
    const exercicio = body.exercicie;
    if ( training != undefined){
      connection.query(
        'Delete FROM `Exercicios` where nm_exercicios = "'+exercicio+'"',
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
    const exercicio = body.exercicie;
    if (exercicio != undefined){
      connection.query(
        'SELECT * FROM `Exercicios` where nm_exercicios = "'+ exercicio + '"',
        function(err, results, fields) {
          if (results.length > 0 ){
            res.status(200).json({ resultado: results })
          }else{
            res.status(500).json({ resultado: "exercício não encontrado" })
          }
          });
    }else{
      connection.query(
        'SELECT * FROM `Exercicios`',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })});
    }
  }


  


  
  
 
}
