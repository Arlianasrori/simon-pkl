import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const refreshDeveloperMiddleware = async (req,res,next) => {
    const token = req.cookies.refresh_token

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const developer = await jwt.verify(token,process.env.REFRESH_TOKEN_SECRET_DEVELOPER,(err,developer) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        return developer
    })

    const findDeveloper = await db.developer.findFirst({
        where : {
            username : developer.username
        }
    })

    if(!findDeveloper) {
        return res.status(401).json({
            msg : "unauthorized"
        })
    }

    if(developer.status == 401){
        return res.status(developer.status).json({
            msg : developer.msg
        })
    }

    req.developer = findDeveloper
    
     next()
}