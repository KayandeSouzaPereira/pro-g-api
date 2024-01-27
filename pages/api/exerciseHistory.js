const service = require('./services/exerciseHistory');
const security = require('./services/security');

export default function handler(req, res) {
  security.checkSec(req, res);

  if (req.method === 'POST') {
    const body = req.body;
    if(body.idRegistroExercicio){
      service.exerciseExclude(req, res);
    }else{
      service.registerExercise(req, res);
    }
    
  }
  if (req.method === 'GET') {
    service.listByNmExercise(req, res);
  }
}

