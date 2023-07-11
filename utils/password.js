import bcrypt from 'bcrypt'



const encodePassword = async (password) => {

    try {

        const salt =  await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    } catch (error) {
        throw new Error('error hashing')
    }

   

}

const verifyPassword = async (password, hashedPassword) => {
    try {
        const validation = await bcrypt.compare(password, hashedPassword) 
        return validation
    } catch (error) {
        throw error
    }
    

}


export default {
    encodePassword,
    verifyPassword
}