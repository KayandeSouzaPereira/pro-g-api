const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.userListAll = (res) => {
    connection.query(
        'SELECT * FROM `User`',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })});
}

exports.userListByNm = (req, res) => {
    const body = req.query;
    const usuario = body.usuario;
    if (usuario != undefined){
      connection.query(
        'SELECT * FROM `User` where userNm = "'+ usuario + '"',
        function(err, results, fields) {
          if (results.length > 0 ){
            res.status(200).json({ resultado: results })
          }else{
            res.status(500).json({ resultado: "usuario não encontrado" })
          }
        });
    }
}

exports.userDelete = (req, res) => {
    const body = req.body;
    const usuario = body.usuario;
    if ( usuario !=  undefined){
      connection.query(
        'Delete FROM `User` where UserNm ="' + usuario + '"',
        function(err, results, fields) {
          if(err === undefined){
            res.status(200).json({ resultado: "OK" });
          }
          else{
            res.status(500).json({ resultado: "Erro" });
          }
        });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }
}

exports.userRegister = (req, res) => {
    const body = req.body;
    const usuario = body.usuario;
    if (  usuario != undefined ){
      connection.query('SELECT * FROM `User` where UserNm = "'+usuario+'"', function(err, results, fields) {
        if(results.length === 0){
          connection.query('INSERT INTO `User` (UserNm) VALUES ("'+usuario+'")', 
          function(err, results, fields) {
            if(err === null){
              res.status(200).json({ resultado: "OK" });
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
        }else{connection.query(
          'SELECT * FROM `User` where userNm = "'+ usuario + '"',
          function(err, results, fields) {
            if (results.length > 0 ){
              res.status(200).json({ resultado: results })
            }else{
              res.status(500).json({ resultado: "usuario não encontrado" })
            }
            });}
      });
    } else {
      res.status(403).json({mensagem: "E necessário mais informações para esta requisição"});
    }
}