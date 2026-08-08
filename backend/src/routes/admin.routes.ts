import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorizeAdmin } from '../middleware/admin.middleware';

const router = Router();

router.use(authenticate);
router.use(authorizeAdmin);

router.get('/users', adminController.getUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);

export default router;
