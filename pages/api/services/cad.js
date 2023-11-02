const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.cadastro = (req, res) => {
    const body = req.body;
    const user = body.usuario;
    const pass = body.password;
    if(user==undefined && pass==undefined){
        res.status(500).json({ mensagem: "Usuário vazio" })
    }else{
        connection.query(
            'SELECT * FROM `Auth` WHERE user = "'+user+'" AND pass ="'+pass+'"',
            function(err, results, fields) {
                if (results.length > 0){
                    res.status(200).json({ retorno: "Usuário já cadastrado" })
                }else if (results.length == 0){
                    connection.query(
                        'insert into `Auth` (user, pass) values ("'+user+'", "'+pass+'")',
                        function(err, results, fields) {
                            connection.query(
                                'insert into `User` (UserNm) values ("'+user+'")',
                                function(err, results, fields) {
                                    res.status(200).json({ retorno: "ok" })
                                }
                            );
                                res.status(200).json({ retorno: "ok" })
                        }
                    );
                } 
            }
        ); 
    }
}