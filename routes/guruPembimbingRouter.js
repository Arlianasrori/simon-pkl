import express from "express"
import guruPembimbingController from "../controller/guruPembimbingController.js"
import { guruPembimbingMiddleware } from "../middleware/guruPembimbingMiddleware.js"
import { refreshGuruPembimbingMiddleware } from "../middleware/refreshGuruPembimbingMiddleware.js"

export const guruPembimbingRouter = express.Router()
// token
guruPembimbingRouter.get("/refreshToken",refreshGuruPembimbingMiddleware,guruPembimbingController.refreshToken)
// middleware
guruPembimbingRouter.use(guruPembimbingMiddleware)

guruPembimbingRouter.put("/updatePassword", guruPembimbingController.updatePassword)


guruPembimbingRouter.get("/getGuruPembimbing", guruPembimbingController.getGuruPembimbing)
guruPembimbingRouter.get("/getSiswa/:id_siswa", guruPembimbingController.getSiswa)
guruPembimbingRouter.get("/getAllSiswaGuruPembimbing", guruPembimbingController.getAllSiswaGuruPembimbing)

// laporan pkl siswa
guruPembimbingRouter.get("/findLaporanPklSiswaFilter", guruPembimbingController.findLaporanPklSiswaFilter)
guruPembimbingRouter.get("/findLaporanPklSiswa/:id", guruPembimbingController.findLaporanPklSiswaById)


// laporan pkl
guruPembimbingRouter.get("/findLaporanPklFilter", guruPembimbingController.findLaporanPklFilter)
guruPembimbingRouter.get("/findLaporanPkl/:id", guruPembimbingController.findLaporanPklById)

// get laporan pkl siswa
guruPembimbingRouter.get("/getLaporanPklSiswa/:id_guru_pembimbing", guruPembimbingController.getLaporanPklSiswa)
guruPembimbingRouter.get("/getAllLaporanPklSiswa/:id_guru_pembimbing", guruPembimbingController.getAllLaporanPklSiswa)

// absen
guruPembimbingRouter.get("/cetakAbsen",guruPembimbingController.cetakAbsen)
guruPembimbingRouter.get("/cetakAnalisAbsen",guruPembimbingController.cetakAnalisAbsen)

