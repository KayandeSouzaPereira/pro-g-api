const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.exerciseListAll = (res) => {
    connection.query(
        'SELECT * FROM `Exercicios`',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })});
}

exports.exerciseListByNm = (req, res) => {
    const body = req.query;
    const exercicio = body.exercise;
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
      res.status(500).json({ resultado: "exercício não encontrado" })
    }
}

exports.exerciseListByIdTraining = (req, res) => {
  const body = req.query;
  const idTraining = body.idTraining;
  if (idTraining != undefined){
      connection.query(
          'SELECT idExercicios, nm_exercicios, ds_exercicio, link_exercicio FROM Exercicios inner join Treino_exercicio on Treino_exercicio.exercicio = Exercicios.idExercicios where treino = "'+ idTraining + '"',
          function(err, results, fields) {
          if (results.length > 0 ){
              res.status(200).json({ resultado: results })
          }else{
              res.status(500).json({ resultado: "treinos não encontrado" })
          }
      });
  }
}

exports.exerciseExclude = (req, res) => {
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

exports.exerciseRegister = (req, res) => {
    const body = req.body;
    const exercicio = body.exercicio;
    const descricao = body.descricao;
    const link = body.link;
    const treino = body.treino;
    const id = parseInt(body.id_exercicio);

    if (exercicio != undefined && descricao != undefined && treino != undefined){
        console.log('SELECT * FROM `Exercicios` where idExercicios = '+id)
        const exist = exerciseExist(id);
        console.log("existe no banco : " + exist);
        if ( exist != false){
          insertExercise(exercicio, descricao, link, treino)
        }else if(exist === false){
          console.log("UPDATE")
          updateExercise(exercicio, descricao, link, id);
        }

    } else if (exercicio === undefined && descricao === undefined && treino === undefined) {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }

    function exerciseExist(id) {
        connection.query('SELECT * FROM `Exercicios` where idExercicios = '+id, function(err, results, fields) {
            if(results.length === 0){
                return true;
            }else{
                return false
            }});
    }

    function updateExercise(exercicio, descricao, link, id) {
      connection.query('update `Exercicios` set nm_exercicios = "'+exercicio+'", ds_exercicio = "'+descricao+'", link_exercicio = + "'+link+'" where idExercicios ='+id, 
        function(err, results, fields) {
          if(err === null){
            console.log("Ok")
              res.status(200).json({ resultado: "Exercício inserido com treino" });
          }
          else{
            res.status(500).json({ erro: "Ocorreu um erro no serviço" });
          }
        });
  }

    function insertExercise(exercicio, descricao, link, treino) {
        connection.query('INSERT INTO `Exercicios` (nm_exercicios, ds_exercicio, link_exercicio) VALUES ("'+exercicio+'", "' + descricao + '","' + link + '")', 
          function(err, results, fields) {
            if(err === null){
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
              res.status(500).json({ erro: "Ocorreu um erro no serviço" });
            }
          });
    }
}