import express from 'express';
// controllers
import user from '../controllers/user.js';

const router = express.Router();

router
  .get('/', user.onGetAllUsers)//done
  .post('/', user.onCreateUser) //done
  .get('/:id', user.onGetUserById)
  .delete('/:id', user.onDeleteUserById)

export default router;