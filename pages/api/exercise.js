const security = require('./services/security');
const service = require("./services/exercise");

export default function handler(req, res) {

  security.checkSec(req, res);
 

  if (req.method === 'POST') {
    if (req.body.deleteIdExercicise){
      return service.exerciseExclude(req, res);
    }else {
     return service.exerciseRegister(req, res);
    }
  }
  if (req.method === 'GET') {
    const body = req.query;
    const idTraining = body.idTraining;
    const exercicio = body.exercise;
    if(idTraining != undefined){
      return service.exerciseListByIdTraining(req, res);
    }
    else if(exercicio != undefined){
      return service.exerciseListByNm(req, res);
    }
  }
}

