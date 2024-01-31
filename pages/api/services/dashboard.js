const mysql = require('mysql2');
const connect = process.env.DB_CONNECTION;
const connection = mysql.createConnection(connect);

exports.presenca = (res, usuario) => {
    connection.query(
        'SELECT data as "Mes", Count(*) as "treinos" FROM pro_g.Registro_exercicio where data >= now()-interval 3 month and usuario = '+usuario+' group by data limit 3',
        function(err, results, fields) {
            if(results){
                return res.status(200).json({ resultado: results })
            }else if(err){
                return res.status(500).json({erro: err})
            }
          
        });
}

exports.forca = (res, usuario) => {
    connection.query(
        'Select peso from Registro_exercicio where exercicio =( SELECT exercicio FROM( SELECT count(*) as c,exercicio FROM Registro_exercicio where usuario = '+usuario+' GROUP BY exercicio) T ORDER BY c desc limit 1) group by idRegistro_exercicio limit 3',
        function(err, results, fields) {
          return res.status(200).json({ resultado: results })});
}

