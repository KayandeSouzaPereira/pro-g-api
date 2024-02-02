
const security = require('./services/security');
const service = require('./services/treino');


export default function handler(req, res) {

  security.checkSec(req, res);

  if (req.method === 'POST') {



    if (req.body.deleteIdTreino){
      return service.trainingExclude(req, res);
    }else {
      const body = req.body;
      const idUser = body.usuario;

      const check = security.checkTKSet(idUser, req)
      if(!check){
        return res.status(403).json({ retorno: "Token Invalido"});
      }else{
        return service.registerTraining(req, res);
      }
    }
  }
  
  if (req.method === 'GET' && req.query != undefined) {

      const body = req.query;
      const usuario = body.usuario;

      const check = security.checkTKSet(usuario, req);

      if(!check){
        return res.status(403).json({ retorno: "Token Invalido"});
      }else{
        return service.listTrainingsByNm(req, res);
      }
  }else if(req.method === 'GET' && req.query == undefined){
    return service.listAllTrainings(res);
  }
}


