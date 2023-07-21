import UserModel from "../models/User.js"

const onValidateUsername = async (username) => {

    try {
  
      const user = await UserModel.getUserByUserName(username)

      if(user){
        return false
      }
      return true
    } catch (error) {
      throw new error("error getting user by username")
    }
   }
   

   export default onValidateUsername