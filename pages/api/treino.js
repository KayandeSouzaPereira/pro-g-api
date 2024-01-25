
const security = require('./services/security');
const service = require('./services/treino');


export default function handler(req, res) {

  security.checkSec(req, res);

  if (req.method === 'POST') {
    if (req.body.deleteIdTreino){
      return service.trainingExclude(req, res);
    }else {
      return service.registerTraining(req, res);
    }
  }
  
  if (req.method === 'GET' && req.body != undefined) {
      return service.listTrainingsByNm(req, res);
  }else if(req.method === 'GET' && req.body == undefined){
    return service.listAllTrainings(res);
  }
}


