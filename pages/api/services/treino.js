const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.listAllTrainings = (res) => {
  connection.query(
    'SELECT * FROM `Treinos`',
    function(err, results, fields) {
      res.status(200).json({ resultado: results })});
}
exports.listTrainingsByNm = (req, res) => {
  const body = req.body;
  const treino = body.treino;
  const usuario = body.usuario;

  if (treino != undefined && usuario == undefined){
    getTrainingByNm(treino)
  }else if (treino == undefined && usuario != undefined){
    getTrainingByUsuario(usuario)
  }else{
    res.status(500).json({ resultado: "treino não encontrado, por falta de dados." })
  }

  function getTrainingByNm(treino){
    connection.query(
      'SELECT * FROM `Treinos` where nm_treinos = "'+ treino + '"',
      function(err, results, fields) {
        if (results.length > 0 ){
          res.status(200).json({ resultado: results })
        }else{
          res.status(500).json({ resultado: "treino não encontrado" })
        }
  });
  }

  function getTrainingByUsuario(usuario){
    connection.query(
      'SELECT * FROM `Treinos` where id_user = "'+ usuario + '"',
      function(err, results, fields) {
        if (results.length > 0 ){
          res.status(200).json({ resultado: results })
        }else{
          res.status(500).json({ resultado: "treino não encontrado" })
        }
  });
  }
}
exports.trainingExclude = (req, res) => {
  const body = req.body;
  const treino = body.treino;
  if ( treino != undefined){
    connection.query(
      'Delete FROM `Treinos` where nm_treinos = "'+treino+'"',
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
exports.registerTraining = (req, res) => {
  const body = req.body;
  const treino = body.treino;
  const descricao = body.descricao;
  const idUser = body.usuario;

  

  if (idUser != undefined ){
    
    connection.query('SELECT * FROM `Treinos` where id_user = "'+idUser+'"', function(err, results, fields){
      if(results.length > 0){
        console.log(results);
        res.status(200).json({ resultado: results });
      }
    })
  }

  if (  treino != undefined && descricao != undefined && idUser == undefined){
    connection.query('SELECT * FROM `Treinos` where nm_treinos = "'+treino+'"', function(err, results, fields) {
      if(results.length === 0){
        connection.query('INSERT INTO `Treinos` (nm_treinos, ds_treinos) VALUES ("'+treino+'", "' + descricao + '")', 
        function(err, results, fields) {
          if(err === null){
            res.status(200).json({ resultado: "OK" });
          }
          else{
            res.status(500).json({ resultado: err });
          }
        
        });
      }else{
        res.status(500).json({ resultado: "Treino já cadastrado" });
      }
    });
  } 

} 