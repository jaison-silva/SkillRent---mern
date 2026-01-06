import jwt from 'jsonwebtoken'

const accessToken = (id: string,role:string)=>{
    return jwt.sign({id,role},process.env.JWT_ACCESS_SECRET!,{
        expiresIn:"5m"
    })
}

const refreshToken = (id: string)=>{
    return jwt.sign({id},process.env.JWT_REFRESH_SECRET!,{
        expiresIn:"7d"
    })
}

export default {
    accessToken,
    refreshToken
}