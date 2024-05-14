import bcrypt from "bcryptjs"
import { db } from "../config/prismaClient.js"
import jwt from "jsonwebtoken"

export const auth = async (req,res,next) => {
    try {
        const {textBody,password} = req.body

            const findSiswa = await db.siswa.findUnique({
                where : {
                    nis : textBody
                }
            })
        
            if(findSiswa) {
                const isPassowrd = await bcrypt.compare(password, findSiswa.password)
   
                if(isPassowrd) {
                    const payload = {
                        id : findSiswa.id,
                        nis : findSiswa.nis,
                        jenis_kelamin : findSiswa.jenis_kelamin,
                        id_sekolah : findSiswa.id_sekolah
                    }
    
                    const acces_token_siswa = jwt.sign(payload,process.env.TOKEN_SECRET_SISWA,{expiresIn : "2d"})
                    const refresh_token_siswa = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_SISWA,{expiresIn : "60d"})
                    return res.status(200).json({
                        msg : "succes",
                        acces_token_siswa : acces_token_siswa,
                        refresh_token_siswa : refresh_token_siswa,
                        auth : "siswa"
                    })
                }
            }
        
            const findGuruPembimbing = await db.guru_pembimbing.findUnique({
                where : {
                    nip : textBody
                }
            })
        
            if(findGuruPembimbing) {
                const isPassowrd = await bcrypt.compare(password, findGuruPembimbing.password)
          
                if(isPassowrd) {
                    const payload = {
                        id : findGuruPembimbing.id,
                        nip : findGuruPembimbing.nip,
                    }
                     
                    const acces_token_guru_pembimbing = jwt.sign(payload,process.env.TOKEN_SECRET_GURU_PEMBIMBING,{expiresIn : "2d"})
                    const refresh_token_guru_pembimbing = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_GURU_PEMBIMBING,{expiresIn : "60d"})
                    return res.status(200).json({
                        msg : "succes",
                        acces_token_guru_pembimbing : acces_token_guru_pembimbing,
                        refresh_token_guru_pembimbing : refresh_token_guru_pembimbing,
                        auth : "guru pembimbing"
                    })
                }
            }
    
            const findPembimbingDudi = await db.pembimbing_dudi.findFirst({
                where : {
                    username : textBody
                }
            })
            console.log(findPembimbingDudi);
        
            if(findPembimbingDudi) {
                console.log(password);
                const isPassowrd = await bcrypt.compare(password, findPembimbingDudi.password)
                console.log(isPassowrd);
            
                if(isPassowrd) {
                    const payload = {
                        id : findPembimbingDudi.id,
                        username : findPembimbingDudi.username
                    }
                     
                    const acces_token_pembimbing_dudi = jwt.sign(payload,process.env.TOKEN_SECRET_PEMBIMBING_DUDI,{expiresIn : "120d"})
                    const refresh_token_pembimbing_dudi = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_PEMBIMBING_DUDI,{expiresIn : "60d"})
                    return res.status(200).json({
                        msg : "succes",
                        acces_token_pembimbing_dudi : acces_token_pembimbing_dudi,
                        refresh_token_pembimbing_dudi : refresh_token_pembimbing_dudi,
                        auth : "pembimbing dudi"
                    })
                }
            }

        res.status(404).json({
            msg : "NIS/NIP/USERNAME atau PASSWORD salah"
        })
    } catch (error) {
        next(error)
    }
}
export const authAdminDeveloper = async (req,res,next) => {
    try {
        const {textBody,password} = req.body

            const findAdmin = await db.admin.findUnique({
                where : {
                    username : textBody
                }
            })
        
            if(findAdmin) {
                const isPassowrd = await bcrypt.compare(password, findAdmin.password)
   
                if(isPassowrd) {
                    const payload = {
                        username : body.username,
                    }
    
                    const acces_token = jwt.sign(payload,process.env.TOKEN_SECRET_ADMIN,{expiresIn : "2d"})
                    const refresh_token = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_ADMIN,{expiresIn : "60d"})
                    return res.status(201).cookie("acces_token",acces_token,{
                        maxAge : 24 * 60 * 60 * 60,
                        httpOnly: true,
                    }).cookie("refresh_token",refresh_token,{
                        maxAge : 24 * 60 * 60 * 60,
                        httpOnly: true,
                    }).json({
                        msg : "succes",
                        acces_token : acces_token,
                        refresh_token : refresh_token,
                        auth : "admin"
                    })
                }
            }
        
            const findDevaloper = await db.developer.findUnique({
                where : {
                    username : textBody
                }
            })
        
            if(findDevaloper) {
                const isPassowrd = await bcrypt.compare(password, findDevaloper.password)
                console.log(isPassowrd);
          
                if(password == findDevaloper.password) {
                    const payload = {
                        name : findDevaloper.username
                    }
                     
                    const acces_token = jwt.sign(payload,process.env.TOKEN_SECRET_DEVELOPER,{expiresIn : "2d"})
                    const refresh_token = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET_DEVELOPER,{expiresIn : "60d"})
                    return res.status(201).cookie("acces_token",acces_token,{
                        maxAge : 24 * 60 * 60 * 60,
                        httpOnly: true,
                    }).cookie("refresh_token",refresh_token,{
                        maxAge : 24 * 60 * 60 * 60,
                        httpOnly: true,
                    }).json({
                        msg : "succes",
                        acces_token : acces_token,
                        refresh_token : refresh_token,
                        auth : "developer"
                    })
                }
            }

        res.status(404).json({
            msg : "USERNAME atau PASSWORD salah"
        })
    } catch (error) {
        next(error)
    }
}