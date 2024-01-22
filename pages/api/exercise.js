const security = require('./services/security');
const service = require("./services/exercise");

export default function handler(req, res) {

  security.checkSec(req, res);
 

  if (req.method === 'POST') {
    service.exerciseRegister(req, res);
  }
  if (req.method === 'DELETE') {
    service.exerciseExclude(req, res);
  }
  if (req.method === 'GET') {
    const body = req.query;
    const idTraining = body.idTraining;
    const exercicio = body.exercise;
    if(idTraining != undefined){
      service.exerciseListByIdTraining(req, res);
    }
    else if(exercicio != undefined){
      service.exerciseListByNm(req, res);
    }
  }
}

