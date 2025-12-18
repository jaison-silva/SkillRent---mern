import jwt from 'jsonwebtoken'

const generateToken = (id: String)=>{
    return jwt.sign({id},process.env.JWT_SECRET!,{
        expiresIn:"1d"
    })
}

const refreshToken = (id: String)=>{
    return jwt.sign({id},process.env.JWT_REFRESH_SECRET!,{
        expiresIn:"7d"
    })
}

export default {
    generateToken,
    refreshToken
}