import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const refreshSiswaMiddleware = async (req,res,next) => {
    const token = req.get("Authorization")

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const siswa = await jwt.verify(token,process.env.REFRESH_TOKEN_SECRET_SISWA,(err,siswa) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        return siswa
    })

    const findSiswa = await db.siswa.findFirst({
        where : {
            id : siswa.id
        },
        select : {
            id : true,
            nama : true,
            nis : true,
            id_sekolah : true,
            jenis_kelamin : true
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

    req.siswa = findSiswa
    
     next()
}