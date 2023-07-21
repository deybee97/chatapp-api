import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


export const USER_TYPES = {
  CONSUMER: "consumer",
  SUPPORT: "support",
};

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    firstName: String,
    lastName: String,
    userName: {
      type: String,
      unique: [true, 'username already exists'],
    },
    password: String,
    
    type: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.statics.createUser = async function (firstName, lastName, userName, password, type) {

    try {
        const user = await this.create({ firstName, lastName, userName, password, type });
        return user
      } catch (error) {
        throw error;
      }
    
}


userSchema.statics.getUserById = async function (id){

    try{
       
      const user = await this.findOne({ _id: id})
      if(!user){
        throw ({ error: 'No user with this id found' });
      }
      return user
    }catch(error){
      throw error
    }

}

userSchema.statics.getUserByUserName = async function (userName){
  try {

    const user =  await this.findOne({ userName})
    
    if(!user){
      // throw ({ error: 'No user with this username found' });
      return false
    }
    return user
    
  } catch (error) {
     throw error
  }
}

// userSchema.statics.confirmUsernameAndPassword = async function (userName, password){
//  console.log(userName, password)
// try {
   
//   const user = await this.findOne({
//     userName,
//     password
//   })
//   console.log(user)

//   if(!user){
//     throw ({error: 'username doesnt exist or password not found'})
//   }

//   return user
  
// } catch (error) {
//   throw error
// }

// }

userSchema.statics.getAllUsers = async function (){

   try {
    const users = await this.find().select({_id:1, firstName:1, lastName:1})
    return users
   } catch (error) {
     throw error
   }

}

userSchema.statics.deleteUserById = async function (id){

  try {
    const result = await this.deleteOne({ _id: id });
    return result;
     
  } catch (error) {
    throw error
  }

}

userSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    throw error;
  }
}

export default mongoose.model("User", userSchema);