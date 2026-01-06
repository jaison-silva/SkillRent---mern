import { Request,Response, NextFunction } from "express";
import { API_RESPONSES } from "../constants/statusMessages";
import { JwtPayload } from "jsonwebtoken";

interface myJwtDecoded extends JwtPayload {
            id: string,
        role:string
}

interface AuthRequest extends Request { // good to export for controllers
    jwtTokenVerified?: myJwtDecoded
}

export default function (req : AuthRequest,res: Response,next:NextFunction){
    if(req.jwtTokenVerified?.role == "provider"){
        next()
    }else{
        const {status,message} = API_RESPONSES.FORBIDDEN
        res.status(status).json({message})
    }
}