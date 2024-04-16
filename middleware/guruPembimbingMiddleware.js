import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const guruPembimbingMiddleware = async (req,res,next) => {
    const tokenHeader = req.header["Authorization"]
    const token = tokenHeader && tokenHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const guruPembimbing = await jwt.verify(token,process.env.SECRET_KEY,(err,guruPembimbing) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        req.guruPembimbing = guruPembimbing
        return guruPembimbing
    })

    const findGuruPembimbing = await db.guru_pembimbing.findUnique({
        where : {
            id : guruPembimbing.id
        }
    })

    if(!findGuruPembimbing) {
        return res.status(401).json({
            msg : "unauthorized"
        })
    }

    if(guruPembimbing.status == 401){
        return res.status(guruPembimbing.status).json({
            msg : guruPembimbing.msg
        })
    }
    
     next()
}