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
          }}
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

  const token = req.headers['authorization'].substring(7);
  console.log(token);
  if (token == undefined ) {
    var ip = req.headers['x-forwarded-for'] ||req.socket.remoteAddress ||null;
    checkBrute(ip)
    updateIpBrute(ip);
  }else{
    checkBrute(ip)
    validaTk(token);
  } 





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
