const security = require('./services/security');
const service = require("./services/dashboard");

export default async function handler(req, res) {

  security.checkSec(req, res);
 

 
  if (req.method === 'GET') {
    const body = req.query;
    const tipo = body.tipo;
    const usuario = body.usuario
    
    let tokenAprov = security.checkTKSet(usuario, req);

    if(tokenAprov === false){
      return res.status(403).json({erro: "TOKEN INVALIDO"});
    }else{
      if(tipo === "forca"){
        const result = await security.resetAtaque(req);
        console.log(result);
        return service.forca(res, usuario);
      }
      else if(tipo === "presenca"){
        const result = await security.resetAtaque(req);
        return service.presenca(res, usuario);
      }
      else if(tipo === "testIP"){
        const result = await security.resetAtaque(req);
        return res.status(200).json({ resultado: result });
      }
    }
  }
}

