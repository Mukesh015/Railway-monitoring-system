import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.get('/', (req, res, next) => {
  res.status(200).json({
    msg: 'success',
  });
});

export default router;