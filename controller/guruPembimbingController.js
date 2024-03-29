import guruPembimbingService from "../service/guruPembimbingService.js"

const getGuruPembimbing = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getGuruPembimbing(parseInt(req.body.id))
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getSiswa = async (req, res, next) => {
    try {
        const result = await guruPembimbingService.getSiswa(parseInt(req.body.id_guru_pembimbing))
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export default {
    getGuruPembimbing,
    getSiswa
}