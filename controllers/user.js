// utils
import makeValidation from '@withvoid/make-validation';
// models
import UserModel, { USER_TYPES } from '../models/User.js';




const onCreateUser = async (req, res) => {
  console.log(req.body)
  try {
    const validation = makeValidation(types => ({
      payload: req.body,
      checks: {
        firstName: { type: types.string },
        lastName: { type: types.string },
        type: { type: types.enum, options: { enum: USER_TYPES } },
      }
    }));
    if (!validation.success) return res.status(400).json(validation);

    const { firstName, lastName, type } = req.body;
    const user = await UserModel.createUser(firstName, lastName, type);
    return res.status(200).json({ success: true, user });
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



export default {
    onGetAllUsers,
    onGetUserById,
    onCreateUser,
    onDeleteUserById,
  }