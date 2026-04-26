import express from 'express';
import ClassController from '../controllers/ClassController.js';

const router = express.Router();

router.get('/getall', ClassController.listClasses);

export default router;
