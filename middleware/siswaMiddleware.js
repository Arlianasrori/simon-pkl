import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const siswaMiddleware = async (req,res,next) => {
    const tokenHeader = req.get("Authorization")
    console.log(tokenHeader);
    const token = tokenHeader && tokenHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const siswa = await jwt.verify(token,process.env.TOKEN_SECRET_SISWA,(err,siswa) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        req.siswa = siswa
        return siswa
    })

    const findSiswa = await db.siswa.findFirst({
        where : {
            id : siswa.id
        }
    })

    if(!findSiswa) {
        return res.status(401).json({
            msg : "unauthorized"
        })
    }

    if(siswa.status == 401){
        return res.status(siswa.status).json({
            msg : siswa.msg
        })
    }
    
     next()
}