import responseError from "../error/responseError.js"
export const errorMiddleware = (err,req,res,next) => {
    if(err instanceof responseError){
        return res.status(err.status).json({
            msg : err.message,
            stack : err.stack
        })
    }
    return res.status(500).json({
        msg : err.message,
        stack : err.stack
    })
}