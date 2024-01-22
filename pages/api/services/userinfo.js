const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.userInfoListAll = (res) => {
    connection.query(
        'SELECT * FROM `Info_User`',
        function(err, results, fields) {
          res.status(200).json({ resultado: results })});
}
exports.userInfoDelete = (req, res) => {
    const body = req.body;
    const usuario = body.user;
    if ( training != undefined){
      connection.query(
        'Delete FROM `Info_User` where id_user = "'+usuario+'"',
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
exports.userInfoRegister = (req, res) => {
    const body = req.body;
    const usuario = body.usuario;
    const altura = body.altura;
    const peso = body.peso;
    const idade = body.idade;

   
    if (  usuario != undefined && altura != undefined && peso != undefined && idade != undefined){
      connection.query('SELECT * FROM `Info_User` where id_user = "'+usuario+'"', function(err, results, fields) {
        if(results.length === 0){
            registerInfoUser(usuario,altura,peso,idade)
        }else{
            updateInfoUserById(altura,peso,idade,usuario)
        }
  });
    } else {
      if (usuario != undefined) {
        getInfoUserById(usuario)
      }
      
    }

    function registerInfoUser(usuario,altura,peso,idade){
        connection.query('INSERT INTO `Info_User` (id_user, Altura, Peso, Idade) VALUES ("'+usuario+'", "'+altura+'", "'+peso+'", "'+idade+'")', 
          function(err, results, fields) {
            if(err === null){
              res.status(200).json({ resultado: "OK" });
            }
            else{
              res.status(500).json({ resultado: err });
            }
          
          });
    }

    function getInfoUserById(usuario){
        connection.query(
            'SELECT * FROM `Info_User` where id_user = "'+ usuario + '"',
            function(err, results, fields) {
              if (results.length > 0 ){
                res.status(200).json({ resultado: results })
              }else{
                res.status(500).json({ resultado: "informações não encontradadas" })
              }
              });
    }
    
    function updateInfoUserById(altura,peso,idade,usuario){
        connection.query('update `Info_User` set Altura = "'+altura+'", Peso = '+peso+', Idade = '+idade+' WHERE id_user = '+usuario+'', 
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