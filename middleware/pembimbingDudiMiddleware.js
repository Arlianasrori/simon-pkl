import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const pembimbingDudiMiddleware = async (req,res,next) => {
    const tokenHeader = req.header["Authorization"]
    const token = tokenHeader && tokenHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const pembimbingDudi = await jwt.verify(token,process.env.SECRET_KEY,(err,pembimbingDudi) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        req.pembimbingDudi = pembimbingDudi
        return pembimbingDudi
    })

    const findPembimbingDudi = await db.pembimbing_dudi.findUnique({
        where : {
            id : pembimbingDudi.id
        }
    })

    if(!findPembimbingDudi) {
        return res.status(401).json({
            msg : "unauthorized"
        })
    }

    if(pembimbingDudi.status == 401){
        return res.status(pembimbingDudi.status).json({
            msg : pembimbingDudi.msg
        })
    }
    
     next()
}