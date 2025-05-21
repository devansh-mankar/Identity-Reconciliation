import { Router } from 'express';
import { identifyContact } from '../controllers/contact.controller';
import { validateIdentifyRequest } from '../middleware/validators';

const router = Router();

// POST /api/contacts/identify
router.post('/identify', validateIdentifyRequest, identifyContact);

export default router;