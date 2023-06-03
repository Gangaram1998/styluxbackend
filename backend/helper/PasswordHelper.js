const bcrypt=require("bcrypt")

const hashPassword=async(password)=>{
    try{
        const hashedPassword= await bcrypt.hash(password,5)
        return hashedPassword
    }catch(err){
        console.log(err)
    }
}

const comparePassword=async(password,hashedPassword)=>{
    try{
        return bcrypt.compare(password,hashedPassword)
    }catch(err){
        console.log(err)
    }
}


module.exports={
    hashPassword,
    comparePassword
}