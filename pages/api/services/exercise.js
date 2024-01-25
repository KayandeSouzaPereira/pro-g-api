const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.exerciseListAll = (res) => {
    connection.query(
        'SELECT * FROM `Exercicios`',
        function(err, results, fields) {
          return res.status(200).json({ resultado: results })});
}

exports.exerciseListByNm = (req, res) => {
    const body = req.query;
    const exercicio = body.exercise;
    if (exercicio != undefined){
        connection.query(
            'SELECT * FROM `Exercicios` where nm_exercicios = "'+ exercicio + '"',
            function(err, results, fields) {
            if (results.length > 0 ){
              return res.status(200).json({ resultado: results })
            }else{
              return res.status(500).json({ resultado: "exercício não encontrado" })
            }
        });
    }else{
      return res.status(500).json({ resultado: "exercício não encontrado" })
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
            return res.status(200).json({ resultado: results })
          }else{
            return res.status(500).json({ resultado: "treinos não encontrado" })
          }
      });
  }
}

exports.exerciseExclude = (req, res) => {
    const body = req.body;
    const exercicio = body.deleteIdExercicise;
    if ( training != undefined){
      connection.query(
        'Delete FROM `Exercicios` where idExercicise = "'+exercicio+'"',
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

exports.exerciseRegister = async (req, res) => {
    const body = req.body;
    const exercicio = body.exercicio;
    const descricao = body.descricao;
    const link = body.link;
    const treino = body.treino;
    const id = parseInt(body.id_exercicio);

    if (exercicio != undefined && descricao != undefined && treino != undefined){
      if(body.id_exercicio != undefined) {
        console.log("ID: " + body.id_exercicio != undefined)
        exerciseExist(id, exercicio, descricao, link, treino);
      } else{
        exerciseExistbyNm(exercicio, descricao, link, treino)
      }
      

    } else if (exercicio === undefined && descricao === undefined && treino === undefined) {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }

    async function exerciseExist(id, exercicio, descricao, link, treino) {
        connection.query('SELECT * FROM `Exercicios` where idExercicios = '+id, function(err, results, fields) {
            if(results.length == 0){
              insertExercise(exercicio, descricao, link, treino)
            }else{
              updateExercise(exercicio, descricao, link, id);
            }});
           
    }

    async function exerciseExistbyNm(exercicio, descricao, link, treino) {
      connection.query('SELECT * FROM `Exercicios` where nm_exercicios = '+exercicio, function(err, results, fields) {
          if(results === undefined){
            insertExercise(exercicio, descricao, link, treino)
          }else{
            return res.status(403).json({mensagem: "Nome duplicado"});
          }});
         
  }

    function updateExercise(exercicio, descricao, link, id) {
      connection.query('update `Exercicios` set nm_exercicios = "'+exercicio+'", ds_exercicio = "'+descricao+'", link_exercicio = + "'+link+'" where idExercicios ='+id, 
        function(err, results, fields) {
          if(err === null){
              return res.status(200).json({ resultado: "Exercício inserido." });
          }
          else{
            return res.status(500).json({ erro: "Ocorreu um erro no serviço" });
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
                  return res.status(200).json({ resultado: "Exercício inserido com treino" });
                });
              }else{
                return res.status(200).json({ resultado: "Exercício inserido sem treino" });
              }
            }
            else{
              return res.status(500).json({ erro: "Ocorreu um erro no serviço" });
            }
          });
    }
}