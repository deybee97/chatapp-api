import jwt from 'jsonwebtoken'


import UserModel from '../models/User.js';

const SECRET_KEY = 'some-secret-key';


export const encode = async (req, res, next) => {

  
    try {
      // const { userId } = req.params;
      // const regex = /^\/([a-zA-Z0-9]+)/
      // const path = req.path.match(regex)[1];

      // const user =  path === 'login' ? await UserModel.getUserById(userId) : req.user;

      const user = req.user;
      
      const payload = {
        userId: user._id,
        userType: user.type,
      };
      
      const authToken = jwt.sign(payload, SECRET_KEY);
      console.log('Auth', authToken);
      req.authToken = authToken;
      next();
    } catch (error) {
      return res.status(400).json({ success: false, message: error.error });
    }
  }
  
  export const decode = (req, res, next) => {
    

    
  
    if (!req.headers['authorization']) {

      console.log('No access token provided')
     
      return res.status(400).json({ success: false, message: 'No access token provided' });
    }
    const accessToken = req.headers.authorization.split(' ')[1];
   
    try {
      const decoded = jwt.verify(accessToken, SECRET_KEY);
      req.userId = decoded.userId;
      req.userType = decoded.type;
      
      return next();
    } catch (error) {
      console.log(error)
      return res.status(401).json({ success: false, message: error.message });
    }
  }
