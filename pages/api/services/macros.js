const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.getById = (req, res, idUser) => {
    connection.query(
        'SELECT * FROM `macros` where id_user = ' + idUser,
        function(err, results, fields) {
          return res.status(200).json({ resultado: results })});
}

exports.macroRegister = (req, res) => {
    checkExistById();

    function checkExistById() {
        const body = req.body;
        const idUser = body.idUser;
        const proteinas = body.proteinas;
        const gorduras = body.gorduras;
        const carboidratos = body.carboidratos;


        connection.query(
            'SELECT * FROM `macros` where id_user = ' + idUser,
            function(err, results, fields) {
            if (results == undefined || results.length == 0) {
                cadastro(idUser, proteinas, gorduras, carboidratos);
            }else {
                update(idUser, proteinas, gorduras, carboidratos);
            }});}

    function cadastro(idUser, proteinas, gorduras, carboidratos) {
        connection.query('INSERT INTO `macros` (proteinas, gorduras, carboidratos, id_user) VALUES ('+proteinas+','+gorduras+','+carboidratos+','+idUser+')',
          function(err, results, fields) {
            if(err === null){
                return res.status(200).json({ resultado: "Macros inseridos." });
            }
            else{
              return res.status(500).json({ erro: "Ocorreu um erro no serviço" });
            }
          });
    }

    function update(idUser, proteinas, gorduras, carboidratos) {
        connection.query('update `macros` set proteinas = "'+proteinas+'", gorduras = "'+gorduras+'", carboidratos = + "'+carboidratos+'" where id_user ='+idUser, 
          function(err, results, fields) {
            if(err === null){
                return res.status(200).json({ resultado: "Macros atualizados." });
            }
            else{
              return res.status(500).json({ erro: "Ocorreu um erro no serviço" });
            }
          });
    }


    
}

exports.macroExclude = (req, res, idUser) => {
    connection.query(
        'DELETE FROM `macros` where id_user = ' + idUser,
        function(err, results, fields) {
          return res.status(200).json({ resultado: results })});
}