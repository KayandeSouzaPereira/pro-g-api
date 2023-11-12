
const security = require('./services/security');
const service = require('./services/treino');


export default function handler(req, res) {

  security.checkSec(req, res);

  if (req.method === 'POST') {
    return service.registerTraining(req, res);
  }
  if (req.method === 'DELETE') {
    return service.trainingExclude(req, res);
  }
  if (req.method === 'GET') {
    return service.listTrainingsByNm(req, res);
  }else if(req.method === 'GET' && req.body == undefined){
    return service.listAllTrainings(res);
  }
}


