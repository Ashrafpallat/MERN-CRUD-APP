import express from 'express'
import { adminLogin, deleteUser, loadUser } from '../controllers/adminController.js';
const router = express.Router()

router.post('/adminLogin', adminLogin)
router.get('/loadUser', loadUser)
router.delete("/deleteUser/:id", deleteUser);


export default router;

