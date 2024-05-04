import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const guruPembimbingMiddleware = async (req,res,next) => {
    const tokenHeader = req.get("Authorization")
    const token = tokenHeader && tokenHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const guruPembimbing = await jwt.verify(token,process.env.TOKEN_SECRET_GURU_PEMBIMBING,(err,guruPembimbing) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        return guruPembimbing
    })

    const findGuruPembimbing = await db.guru_pembimbing.findFirst({
        where : {
            id : guruPembimbing.id
        },
        select : {
            id : true,
            id_sekolah : true,
            jenis_kelamin : true,
            nip : true,
            nama : true
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
    req.guruPembimbing = guruPembimbing
     next()
}