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
const getNotificationbyId = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const result = await notificationService.getNotificationById(id)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const readNotification = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const id_siswa = req.body.id_siswa
        const result = await notificationService.readNotification(id,id_siswa)
        res.status(201).json({
            msg : "succes",
            data : result
        })
    } catch (error) {
        next(error)
    }
}
const getCountNotificationNotRead = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        const id_siswa = req.body.id_siswa
        const result = await notificationService.getCountNotificationNotRead(id,id_siswa)
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
    getNotification,
    getNotificationbyId,
    readNotification
}