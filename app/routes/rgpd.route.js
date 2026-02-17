import { Router } from 'express';
import rgpdController from '../controllers/rgpd-controller.js';

const rgpdRouter = Router();

rgpdRouter.get('/', rgpdController.rgpd);

export default rgpdRouter;