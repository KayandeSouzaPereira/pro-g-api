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
    const body = req.body;
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
    const exercicio = body.exercicie;
    const descricao = body.descricao;
    const link = body.link;
    const treino = body.treino;

    if (  exercicio != undefined && descricao != undefined){
        if (!exerciseExist(treino)){
          insertExercise(exercicio, descricao, link, treino)
        }else{res.status(500).json({ resultado: "Exercício já cadastrado" });}

    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }

    function exerciseExist(name) {
        connection.query('SELECT * FROM `Exercicios` where nm_exercicios = "'+name+'"', function(err, results, fields) {
            if(results.length === 0){
                return true;
            }else{
                return false
            }});
    }

    function insertExercise(exercicio, descricao, link, treino) {
        connection.query('INSERT INTO `Exercicios` (nm_exercicios, ds_exercicio, link_execicio) VALUES ("'+exercicio+'", "' + descricao + '","' + link + '")', 
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