const service = require('./services/exerciseHistory');
const security = require('./services/security');

export default function handler(req, res) {
  security.checkSec(req, res);

  if (req.method === 'POST') {
    const body = req.body;
    if(body.idRegistroExercicio){
      service.exerciseExclude(req, res);
    }else{
      const usuario = body.usuario;
      let tokenAprov = security.checkTKSet(usuario, req);
      service.registerExercise(req, res);
    }
    
  }
  if (req.method === 'GET') {

    const body = req.query;
    const usuario = body.usuario;

    if(usuario != null){
      if(!security.checkTKSet(usuario, req)){
        return res.status(403).json({ retorno: "Token Invalido"})
      }else{
        service.byUserExercise(res, user);
      }
    }

  }
}

