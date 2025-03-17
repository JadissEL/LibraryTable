import { Router } from 'express';
const router = Router();
import TableController from '../controllers/tableController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

router.get('/', TableController.getAllTables);
router.get('/available', TableController.getAvailableTables);
router.get('/search', TableController.searchTables);
router.get('/:id', TableController.getTableById);

router.post('/', auth, admin, TableController.createTable);
router.put('/:id', auth, admin, TableController.updateTable);
router.delete('/:id', auth, admin, TableController.deleteTable);

export default router;
