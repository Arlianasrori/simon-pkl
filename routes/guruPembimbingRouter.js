import express from "express"
import guruPembimbingController from "../controller/guruPembimbingController.js"

export const guruPembimbingRouter = express.Router()

// middleware
guruPembimbingRouter.use(guruPembimbingRouter)

// guru pembimbing login 
guruPembimbingRouter.post("/guruPembimbingLogin",guruPembimbingController.guruPembimbingLogin)

guruPembimbingRouter.get("/getGuruPembimbing/:id", guruPembimbingController.getGuruPembimbing)
guruPembimbingRouter.get("/getSiswa/:id_guru_pembimbing", guruPembimbingController.getSiswa)
guruPembimbingRouter.get("/getAllSiswaGuruPembimbing/:id", guruPembimbingController.getAllSiswaGuruPembimbing)