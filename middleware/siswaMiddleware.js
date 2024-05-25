import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const siswaMiddleware = async (req,res,next) => {
    const tokenHeader = req.get("Authorization")
    
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
            jenis_kelamin : true,
            id_dudi : true,
            id_tahun : true,
            id_pembimbing_dudi : true
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