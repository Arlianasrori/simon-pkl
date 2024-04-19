import express from "express"
import guruPembimbingController from "../controller/guruPembimbingController.js"

export const guruPembimbingRouter = express.Router()

// guru pembimbing login 
guruPembimbingRouter.post("/login",guruPembimbingController.guruPembimbingLogin)

// middleware
guruPembimbingRouter.use(guruPembimbingRouter)

guruPembimbingRouter.get("/getGuruPembimbing", guruPembimbingController.getGuruPembimbing)
guruPembimbingRouter.get("/getSiswa/:id_siswa", guruPembimbingController.getSiswa)
guruPembimbingRouter.get("/getAllSiswaGuruPembimbing/:id", guruPembimbingController.getAllSiswaGuruPembimbing)

// laporan pkl siswa
guruPembimbingRouter.get("/findLaporanPklSiswaFilter", guruPembimbingController.findLaporanPklSiswaFilter)
guruPembimbingRouter.get("/findLaporanPklSiswa/:id", guruPembimbingController.findLaporanPklSiswaById)


// laporan pkl
guruPembimbingRouter.get("/findLaporanPklFilter", guruPembimbingController.findLaporanPklFilter)
guruPembimbingRouter.get("/findLaporanPkl/:id", guruPembimbingController.findLaporanPklById)

guruPembimbingRouter.get("/getLaporanPklSiswa/:id_guru_pembimbing", guruPembimbingController.getLaporanPklSiswa)