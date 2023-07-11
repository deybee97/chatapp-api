// utils
import makeValidation from '@withvoid/make-validation';
// models
import UserModel, { USER_TYPES } from '../models/User.js';

import passwordUtil from '../utils/password.js'
import User from '../models/User.js';



const onCreateUser = async (req, res, next) => {

  try {
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        firstName: { type: types.string },
        lastName: { type: types.string },
        userName: { type: types.string },
        password: {type: types.string },
        type: { type: types.enum, options: { enum: USER_TYPES } },
      }
    }));
    if (!validation.success) return res.status(400).json(validation);

    const { firstName, lastName, userName, password, type } = req.body;

    const hashedPassword = await passwordUtil.encodePassword(password)
    

    await onValidateUsername(req,res)

    const user = await UserModel.createUser(firstName, lastName, userName, hashedPassword, type);
    // return res.status(200).json({ success: true, user });
    req.user = user 

    next()
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message })
  }

 }

 const onValidateUsername = async (req,res) => {

  try {

    const user = UserModel.getUserByUserName(req.body.userName)
    if(user){
      return res.status(409).json({success:false, error: "user already exists"})
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
 }
 
 const onGetUserById = async (req, res) => { 
    
  try {
    const user = await UserModel.getUserById(req.params.id);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }

 }

 const onGetAllUsers = async (req, res) => {

    try{

      const users = await UserModel.getAllUsers();
      return res.status(200).json({success: true, users})

    }catch(error){
      return res.send(500).json({success: false, error})
    }

  }


  const onDeleteUserById = async(req,res) => {
     try{
        const userId = req.params.id
       const user = await UserModel.deleteUserById(userId)
        return res.status(200).json({success: true, message: `Deleted a count of ${user.deletedCount} user.` })
     }catch(error){
      return res.send(500).json({success: false, error})
     }
  }

  const onSignInWithUsernameAndPassword = async(req,res, next) => {
    
    try {

      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          userName: { type: types.string },
          password: {type: types.string },
        }
      }));
      if (!validation.success) return res.status(400).json(validation);

      const {userName, password} = req.body

      // const hashedPassword = await passwordUtil.encodePassword(password)

      const user = await UserModel.getUserByUserName(userName)

      if(!user){
        return res.status(401).json({success: false, error: "username or password incorrect"})
      
      }

      const validatePassword = await passwordUtil.verifyPassword(password, user.password)

      if(!validatePassword){
         return res.status(401).json({success: false, error: "username or password incorrect"})
      }

      req.user = user 

      next()
      
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, error: error.message })
    }
  }



export default {
    onGetAllUsers,
    onGetUserById,
    onCreateUser,
    onDeleteUserById,
    onValidateUsername,
    onSignInWithUsernameAndPassword
  }