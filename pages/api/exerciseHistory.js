const service = require('./services/exerciseHistory');
const security = require('./services/security');

export default function handler(req, res) {
  security.checkSec(req, res);

  if (req.method === 'POST') {
    service.registerExercise(req, res);
  }
  if (req.method === 'DELETE') {
    service.exerciseExclude(req, res);
  }
  if (req.method === 'GET') {
    service.listByNmExercise(req, res);
    }else{
      service.listAllExercise(res);
    }
}

