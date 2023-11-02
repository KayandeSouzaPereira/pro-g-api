
const security = require('./services/security');
const service = require('./services/treino');


export default function handler(req, res) {

  security.checkSec(req, res);

  if (req.method === 'POST') {
    service.registerTraining(req, res);
  }
  if (req.method === 'DELETE') {
    service.trainingExclude(req, res);
  }
  if (req.method === 'GET') {
    service.listTrainingsByNm(req, res);
  }else if(req.method === 'GET' && req.body == undefined){
      service.listAllTrainings(res);
  }else{
    res.status(200).json({ resultado: "Vazio" });
  }
}


