import express from 'express';
// controllers
import users from '../controllers/user.js';
// middlewares
import { encode } from '../middlewares/jwt.js';

const router = express.Router();

router
  .post('/login', users.onSignInWithUsernameAndPassword, encode, (req, res, next) => { 
     
    return res.status(200).json({
      success: true,
      authorization: req.authToken
    })
  })
  .post('/signup', users.onCreateUser, encode, (req,res) => {

    return res.status(200).json({
      success: true,
      authorization: req.authToken
    })
  })
  .post('/validateUsername', users.onValidateUsername)

export default router;
