import express from 'express';
import { migrateDatabase } from '../service/init.service';

const init = express.Router();

init.post('/migrate-db', [
    // add auth-key
], (req, res, next) => {
    return migrateDatabase().then(result => {
      res.status(200).json(result);
    }).catch(next);
  });

export function initController(app) {
  app.use('/api/init', init );
}