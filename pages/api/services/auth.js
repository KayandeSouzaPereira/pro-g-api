const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);
const bcrypt = require('bcrypt');
const custo = 10;



exports.login = async (user, pass, token, res) => {

    function getId(user){
        connection.query('SELECT Id from User Where user = ?', [user], 
        function (err, results, field){
            if (results.length > 0){
                return results;
            }
        })
    }
   
    
    if(token == undefined){
        if(user==undefined && pass==undefined){
            return res.status(500).json({ mensagem: "Usuário vazio" })
        }else{
            connection.query(
                'SELECT pass FROM `Auth` WHERE user = "'+user+'"',
                async function(err, results, fields) {
                    if(results){
                        const encryptedPassword = results[0].pass;
                        const checkPass = await bcrypt.compare(pass, encryptedPassword);
                        if (checkPass === false){
                            return res.status(403).json({ mensagem: "Senha Invalida" })
                        } else if(checkPass === true){
                   
                            connection.query(
                                'SELECT * FROM `Auth` WHERE user = "'+user+'"',
                                function(err, results, fields) {
                                    if (results.length > 0){
                                        require('crypto').randomBytes(48, function(err, buffer) {
                                            var tk = buffer.toString('hex');
                                            var dt = new Date();
                                            var dt = dt.toISOString().slice(0, 19).replace('T', ' ');
                                            connection.query(
                                                'update `Auth` set token = "'+tk+'", data_token = "'+dt+'" where user = "'+user+'"',
                                                function(err, results, fields) {
                                                    let id = getId(user);
                                                    res.status(200).json({ retorno: "Login Realizado com sucesso",  token: tk, id: id})
                                                }
                                            );
                                            
                                        });
                                    }else if (results.length == 0){
                                        res.status(403).json({ retorno: "Usuário não cadastrado"})
                                    }
                                
                                }
                            );
                        }
                    }
                })
            }
    }else{
       connection.query(
            'SELECT * FROM `Auth` WHERE token = "'+token+'" AND user = "'+user+'" AND TIMEDIFF(now(), data_token) < "20:00:00"',
            function(err, results, fields) {
                if (results.length > 0){
                    res.status(200).json({ retorno: "Token Confirmado com sucesso"})
                } else {
                    res.status(403).json({ retorno: "Token Expirado"})
                }
            });
                
        }
}