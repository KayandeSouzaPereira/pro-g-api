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
  const body = req.query;
  const treino = body.treino;
  const usuario = body.usuario;

  if (treino != undefined && usuario == undefined){
    return getTrainingByNm(treino)
  }else if (treino == undefined && usuario != undefined){
    return getTrainingByUsuario(usuario)
  }else{
    return res.status(500).json({ resultado: "treino não encontrado, por falta de dados." })
  }

  function getTrainingByNm(treino){
    connection.query(
      'SELECT * FROM `Treinos` where nm_treinos = "'+ treino + '"',
      function(err, results, fields) {
        if (results.length > 0 ){
          return res.status(200).json({ resultado: results })
        }else{
          return res.status(500).json({ resultado: "treino não encontrado" })
        }
  });
  }

  function getTrainingByUsuario(usuario){
    connection.query(
      'SELECT * FROM `Treinos` where id_user = "'+ usuario + '"',
      function(err, results, fields) {
        if (results.length > 0 ){
          return res.status(200).json({ resultado: results })
        }else{
          return res.status(500).json({ resultado: "treino não encontrado" })
        }
  });
  }
}
exports.trainingExclude = (req, res) => {
  const body = req.body;
  const treino = body.deleteIdTreino;
  if ( treino != undefined){
    
    connection.query(
      'Delete FROM `Treinos` where idTreinos = "'+treino+'"',
      function(err, results, fields) {
        if(err === null){
          return res.status(200).json({ resultado: "OK" });
        }
        else{
          return res.status(500).json({ resultado: err });
        }
      });
  } else {
    return res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
  }
}
exports.registerTraining = (req, res) => {
  const body = req.body;
  const treino = body.treino;
  const descricao = body.descricao;
  const idUser = body.usuario;
  const idTreino = body.idTreino;



  if (idTreino != undefined){
    return updateTreino(req, res);
  }

  if (idUser != undefined && treino == undefined){
    return listaTreinosUsuario(idUser);
  }

  if (treino != undefined && descricao != undefined && idUser != undefined){
    connection.query('SELECT * FROM `Treinos` where nm_treinos = "'+treino+'" and id_user ="'+idUser+'"', function(err, results, fields) {
      if(results == undefined || results.length == 0){
        connection.query('INSERT INTO `Treinos` (nm_treinos, ds_treinos, id_user) VALUES ("'+treino+'", "' + descricao + '", ' + idUser + ')', 
        function(err, results, fields) {
          if(err == undefined){
            return res.status(200).json({ resultado: "OK" });
          }
          else{
            return res.status(500).json({ resultado: err });
          }
        
        });
      }else if(results != undefined || results.length != 0){
        return res.status(500).json({ resultado: "Treino já cadastrado" });
      }
    });
  } 

  function updateTreino(req, res){

    const body = req.body;
    const treino = body.treino;
    const descricao = body.descricao;
    const idTreino = body.idTreino;

    connection.query('UPDATE `Treinos` set nm_treinos = "'+ treino + '", ds_treinos = "' + descricao + '" WHERE idTreinos = ' + idTreino, function(err, results, fields) { 
      return res.status(200).json({ resultado: "OK" });
    });



  }

  function listaTreinosUsuario(idUser){
    connection.query('SELECT * FROM `Treinos` where id_user = "'+idUser+'"', function(err, results, fields){
        return res.status(200).json({ resultado: results });
    })
  }

} 