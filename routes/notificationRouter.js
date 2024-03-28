import express from "express"
import notificationController from "../controller/notificationController.js"

export const notificationRouter = express.Router()

notificationRouter.post("/addNotification",notificationController.add)
notificationRouter.get("/getNotification/:id_siswa",notificationController.getNotification)