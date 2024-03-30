import express from "express"
import notificationController from "../controller/notificationController.js"

export const notificationRouter = express.Router()

notificationRouter.post("/addNotification",notificationController.add)
notificationRouter.post("/readNotification/:id",notificationController.readNotification)
notificationRouter.get("/getNotification/:id_siswa",notificationController.getNotification)
notificationRouter.get("/getNotificationById/:id",notificationController.getNotificationbyId)