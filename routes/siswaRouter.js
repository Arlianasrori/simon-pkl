import express from "express"
import siswaController from "../controller/siswaController.js"
import { siswaMiddleware } from "../middleware/siswaMiddleware.js"
import { refreshSiswaMiddleware } from "../middleware/refreshSiswaMiddleware.js"

export const siswaRouter = express.Router()

// token
siswaRouter.get("/refreshToken",refreshSiswaMiddleware,siswaController.refreshToken)

// middleware
siswaRouter.use(siswaMiddleware)

// updatePasswordSiswa
siswaRouter.put("/updatePassword/:id",siswaController.updatePassword)

siswaRouter.get('/getSiswa', siswaController.getSiswaById)
siswaRouter.get('/getProfile', siswaController.getProfile)

// dudi
siswaRouter.get('/getDudi', siswaController.getDudi)
siswaRouter.get('/getDudi/:id', siswaController.getDudiById)
siswaRouter.get('/getDudiByName', siswaController.getDudiByName)
siswaRouter.get('/getDudiByAlamat', siswaController.getDudiByAlamat)
siswaRouter.get('/getDudiFilter', siswaController.getDudiFilter)

// pengajuan pkl
siswaRouter.post('/pengajuanPkl', siswaController.addPengajuanPkl)
siswaRouter.get('/findAllPengajuanPkl', siswaController.findAllPengajuanPkl)
siswaRouter.get('/findPengajuanPklByStatus', siswaController.findPengajuanPklByStatus)
siswaRouter.get('/findPengajuanPkl/:id', siswaController.findPengajuanPklbyId)
siswaRouter.post('/cancelPengajuanPkl', siswaController.cancelPengajuanPkl)


// cancel pkl siswa
siswaRouter.post('/addCancelPkl', siswaController.addCancelPkl)
siswaRouter.put('/cancelPkl/cancel', siswaController.cancelPengajuanCancelPkl)
siswaRouter.get('/getCancelPkl', siswaController.getCancelPklBySiswa)
siswaRouter.get('/getCancelPklById/:id', siswaController.getCancelPklById)

// Laporan Pkl Siswa 
siswaRouter.post("/AddLaporanSiswaPkl",siswaController.AddLaporanSiswaPkl)
siswaRouter.put("/updateLaporanSiswaPkl/:id",siswaController.updateLaporanSiswaPkl)
siswaRouter.delete("/deleteLaporanSiswaPkl/:id",siswaController.deleteLaporanSiswaPkl)
siswaRouter.get("/findAllLaporanSiswaPkl",siswaController.findAllLaporanSiswaPkl)
siswaRouter.get("/findLaporanSiswaPklById/:id",siswaController.findLaporanSiswaPklById)
siswaRouter.get("/findLaporanSiswaPklFilter",siswaController.findLaporanSiswaPklFilter)


// notification
siswaRouter.get("/getAllNotification",siswaController.getAllNotification)
siswaRouter.get("/getNotificationById/:id",siswaController.getNotificationByID)
siswaRouter.get("/readNotification/:id",siswaController.notificationRead)
siswaRouter.get("/countNotificationNotRead",siswaController.getCountNotificationNotRead)


// absen
siswaRouter.post("/cekRadiuskoordinat",siswaController.cekRadiusKoordinat)
siswaRouter.get("/cekAbsen",siswaController.cekAbsen)
siswaRouter.post("/addAbsenMasuk",siswaController.addAbsenMasuk)
siswaRouter.post("/addAbsenPulang",siswaController.addAbsenPulang)
siswaRouter.post("/absenIzinTelat",siswaController.absenIzintelat)
siswaRouter.post("/absenDiluarRadius",siswaController.absenDiluarRadius)
siswaRouter.get("/findAllKoordinatAbsen",siswaController.findAllKordinatAbsen)
siswaRouter.get("/riwayatAbsen",siswaController.findAbsen)
siswaRouter.get("/findAbsenById/:id",siswaController.findAbsenById)
siswaRouter.get("/findAllJadwalAbsen",siswaController.findAllJadwalAbsen)
siswaRouter.get("/findJadwalAbsenById/:id_jadwal",siswaController.findJadwalAbsenById)

siswaRouter.get("/statusTokenFCM",siswaController.statustokenFCM)
siswaRouter.post("/addTokenFCM",siswaController.addTokenFCM)