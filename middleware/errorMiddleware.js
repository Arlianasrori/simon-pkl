import responseError from "../error/responseError.js"
import { Prisma } from '@prisma/client'
export const errorMiddleware = (err,req,res,next) => {
    if(err instanceof responseError){
        return res.status(err.status).json({
            msg : err.message,
            stack : err.stack
        })
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(err.code);
        if (err.code === 'P2003') {
            return res.status(400).json({
                msg : "data yang ingin dihapus masih terkait dengan data lain",
                stack : err.stack
            })
        }else if (err.code === 'P2002') {
            return res.status(400).json({
                msg : "data yang ingin dimasukkan telah digunakan/duplicate value",
                stack : err.stack
            })
        }
      }
    return res.status(500).json({
        msg : err.message,
        stack : err.stack
    })
}