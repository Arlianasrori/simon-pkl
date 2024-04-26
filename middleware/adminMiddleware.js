import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const adminMiddleware = async (req,res,next) => {
    const token = req.cookies.acces_token

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const admin = await jwt.verify(token,process.env.TOKEN_SECRET_ADMIN,(err,admin) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        req.admin = admin
        return admin
    })

    const findAdmin = await db.admin.findFirst({
        where : {
            username : admin.username
        }
    })

    if(!findAdmin) {
        return res.status(401).json({
            msg : "unauthorized"
        })
    }

    if(admin.status == 401){
        return res.status(admin.status).json({
            msg : admin.msg
        })
    }
    
     next()
}