import express from "express"
import guruPembimbingController from "../controller/guruPembimbingController.js"
import { guruPembimbingMiddleware } from "../middleware/guruPembimbingMiddleware.js"

export const guruPembimbingRouter = express.Router()

// middleware
guruPembimbingRouter.use(guruPembimbingMiddleware)

// guru pembimbing login 
guruPembimbingRouter.post("/guruPembimbingLogin",guruPembimbingController.guruPembimbingLogin)

guruPembimbingRouter.get("/getGuruPembimbing", guruPembimbingController.getGuruPembimbing)
guruPembimbingRouter.get("/getSiswa/:id_siswa", guruPembimbingController.getSiswa)
guruPembimbingRouter.get("/getAllSiswaGuruPembimbing/:id", guruPembimbingController.getAllSiswaGuruPembimbing)

// laporan pkl siswa
guruPembimbingRouter.get("/findLaporanPklSiswaFilter", guruPembimbingController.findLaporanPklSiswaFilter)
guruPembimbingRouter.get("/findLaporanPklSiswa/:id", guruPembimbingController.findLaporanPklSiswaById)


// laporan pkl
guruPembimbingRouter.get("/findLaporanPklFilter", guruPembimbingController.findLaporanPklFilter)
guruPembimbingRouter.get("/findLaporanPkl/:id", guruPembimbingController.findLaporanPklById)