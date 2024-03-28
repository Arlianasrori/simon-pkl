import notificationService from "../service/notificationService.js";

const add = async (req,res,next) => {
    try {
        const data = req.body

        const result = await notificationService.addNotification(data)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const getNotification = async (req,res,next) => {
    try {
        const id_siswa = parseInt(req.params.id_siswa)
        const result = await notificationService.getNotification(id_siswa)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}

export default {
    add,
    getNotification
}