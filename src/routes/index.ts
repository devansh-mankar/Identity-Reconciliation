import { Router } from 'express';
import contactRoutes from './contact.routes';

const router = Router();

router.use('/contacts', contactRoutes);

export const apiRoutes = router;