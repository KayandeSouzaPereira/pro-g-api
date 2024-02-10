const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.listAllExercise = (res) => {
    connection.query(
        'SELECT * FROM `Registro_exercicio` where 1=1',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })
        });
}

exports.byUserExercise = (res, user) => {
  connection.query(
    'SELECT idRegistro_exercicio, exercicio, Exercicios.nm_exercicios, peso, data, repeticoes, observacao FROM `Registro_exercicio` Inner join Exercicios on Exercicios.idExercicios = Registro_exercicio.exercicio where usuario = "'+ user + '" order by idRegistro_exercicio desc limit 10 ',
      function(err, results, fields) {
        res.status(200).json({ resultado: results })
      });
}

exports.listByNmExercise = (req,res) => {
    
    const body = req.query;
    const usuario = body.usuario;
    if (usuario != undefined){
      connection.query(
        'SELECT idRegistro_exercicio, exercicio, Exercicios.nm_exercicios, peso, data, repeticoes, observacao FROM `Registro_exercicio` Inner join Exercicios on Exercicios.idExercicios = Registro_exercicio.exercicio where usuario = "'+ usuario + '" order by idRegistro_exercicio desc limit 10 ',
        function(err, results, fields) {
          if (results != undefined ){
            return res.status(200).json({ resultado: results })
          }else{
            return res.status(500).json({ resultado: "registro não encontrado" })
          }
        });
    }else{
      return res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }
}
exports.exerciseExclude = (req,res) => {
    const body = req.body;
    const idRegistroExercicio = body.idRegistroExercicio;
    if ( idRegistroExercicio != undefined){
      connection.query(
        'Delete FROM `Registro_exercicio` where idRegistro_exercicio = '+idRegistroExercicio,
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
exports.registerExercise = (req,res) => {
    const body = req.body;
    const usuario = body.usuario;
    const exercicio = body.exercicio;
    const peso = body.peso;
    const repeticoes = body.repeticoes;
    const observacao = body.observacao;

    var data = new Date();
    data = data.toISOString().slice(0, 19).replace('T', ' ');

    
    if (  usuario != undefined && exercicio != undefined){
      
      connection.query('SELECT * FROM `Registro_exercicio` where usuario = "'+usuario+'" AND exercicio= "'+exercicio+'" AND DATEDIFF(data, "'+data+'") = "0"', 
      function(err, results, fields) {
        if(results.length === 0){
            insertRegister(usuario, exercicio, peso, data, repeticoes, observacao, res);
        }else{
            res.status(200).json({ resultado: "Já existe registro para este exercício e usuário nas ultimas 24 horas, remova o registro ou atualize ele no proxímo treino." });
        }
    });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }

    function insertRegister(usuario, exercicio, peso, data, repeticoes, observacao, res){
        connection.query('INSERT INTO `Registro_exercicio` (usuario, exercicio, peso, data, repeticoes, observacao) VALUES ("'+usuario+'", "' + exercicio + '", "'+peso+'", "' +data+'", "'+repeticoes+'", "' +observacao+ '")', 
          function(err, results, fields) {
            if(err === null){
              res.status(200).json({ resultado: "OK" });
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
    }
}