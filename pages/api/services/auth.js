const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.login = (user, pass, token, res) => {
    
    if(token == undefined){
        if(user==undefined && pass==undefined){
            res.status(500).json({ mensagem: "Usuário vazio" })
        }else{
            connection.query(
                'SELECT * FROM `Auth` WHERE user = "'+user+'" AND pass ="'+pass+'"',
                function(err, results, fields) {
                    console.log(err);
                    if (results.length > 0){
                        require('crypto').randomBytes(48, function(err, buffer) {
                            var tk = buffer.toString('hex');
                            var dt = new Date();
                            var dt = dt.toISOString().slice(0, 19).replace('T', ' ');
                            connection.query(
                                'update `Auth` set token = "'+tk+'", data_token = "'+dt+'" where user = "'+user+'"',
                                function(err, results, fields) {
                                    console.log("OK 200");
                                    res.status(200).json({ retorno: "Login Realizado com sucesso",  token: tk})
                                }
                              );
                            
                        });
                    }else if (results.length == 0){
                        res.status(403).json({ retorno: "Usuário não cadastrdo"})
                    }
                   
                }
              );
            
            
        }
    }else{
       connection.query(
            'SELECT * FROM `Auth` WHERE token = "'+token+'" AND user = "'+user+'" AND TIMEDIFF(now(), data_token) < "20:00:00"',
            function(err, results, fields) {
                console.log(err);
                if (results.length > 0){
                    res.status(200).json({ retorno: "Token Confirmado com sucesso"})
                } else {
                    res.status(403).json({ retorno: "Token Expirado"})
                }
            });
                
        }
}