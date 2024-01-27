const security = require('./services/security');
const service = require("./services/dashboard");

export default function handler(req, res) {

  security.checkSec(req, res);
 

 
  if (req.method === 'GET') {
    const body = req.query;
    const tipo = body.tipo;
    const usuario = body.usuario
    if(tipo === "forca"){
      return service.forca(res, usuario);
    }
    else if(tipo === "presenca"){
      return service.presenca(res, usuario);
    }
  }
}

