import guruPembimbingService from "../service/guruPembimbingService.js"

const guruPembimbingLogin = async (req,res,next) => {
    try {
        const body = req.body
        const result = await guruPembimbingService.guruPembimbingLogin(body)
        res.status(201).cookie("acces_token",result.acces_token_guru_pembimbing,{
            maxAge : 24 * 60 * 60 * 60,
            httpOnly: true,
        }).cookie("refresh_token",result.refresh_token_guru_pembimbing,{
            maxAge : 24 * 60 * 60 * 60,
            httpOnly: true,
        }).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
  }

const getGuruPembimbing = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getGuruPembimbing(parseInt(req.params.id))
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

const getSiswa = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getSiswa(parseInt(req.params.id_guru_pembimbing))
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

const getAllSiswaGuruPembimbing = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getAllSiswaGuruPembimbing(req.params.id)
        res.status(200).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

export default {
    guruPembimbingLogin,
    getGuruPembimbing,
    getSiswa,
    getAllSiswaGuruPembimbing
}
