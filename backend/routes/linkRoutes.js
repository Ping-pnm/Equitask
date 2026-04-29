import express from 'express';
import LinkController from '../controllers/LinkController.js';

const router = express.Router();

router.post('/add', LinkController.addLink);
router.delete('/:linkId', LinkController.deleteLink);

export default router;
