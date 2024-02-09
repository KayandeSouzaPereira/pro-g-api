const security = require('./services/security');
const service = require("./services/dashboard");

export default function handler(req, res) {

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
        return service.forca(res, usuario);
      }
      else if(tipo === "presenca"){
        return service.presenca(res, usuario);
      }
      else if(tipo === "testIP"){
        var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
        const relatorio = [];
        relatorio.push("ZERANDO TENTATIVAS IP :")
        relatorio.push(ip)
        relatorio.push('Update `brute_force` set tentativas= 0 where ip = "186.220.37.208"')
        security.resetAtaque()


        return res.status(200).json({ resultado: relatorio });
      }
    }
  }
}

