import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const refreshPembimbingDudiMiddleware = async (req,res,next) => {
    const token = req.get("Authorization")

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const pembimbingDudi = await jwt.verify(token,process.env.REFRESH_TOKEN_SECRET_SISWA,(err,pembimbingDudi) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        return pembimbingDudi
    })

    const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
        where : {
            id : pembimbingDudi.id
        },
        select : {
            id : true,
            id_dudi : true,
            add_by : true,
            nama : true
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

    req.siswa = findPembimbingDudi
    
     next()
}